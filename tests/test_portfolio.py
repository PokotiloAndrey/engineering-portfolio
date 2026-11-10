from datetime import date, timedelta
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from portfolio.events import claim, connect, finish, ingest
from portfolio.history import export_conversation, validate_churn_report, validate_export_counts
from portfolio.pipelines import Partner, match_partners, metric_freshness, read_rows, registration_audit
from portfolio.workflows import Presence, attendance_seconds, booking_window, churn_brief


class EventTests(unittest.TestCase):
    def test_duplicate_and_uncertain_delivery(self):
        db = connect(":memory:")
        self.addCleanup(db.close)
        event = {"event_id": "demo-1", "type": "registered", "refcode": "demo-ref"}
        directory = {"demo-ref": "contact-1"}
        self.assertEqual(ingest(db, "test", event, directory), "queued")
        self.assertEqual(ingest(db, "test", event, directory), "duplicate")
        self.assertEqual(claim(db, "test", "demo-1"), "contact-1")
        finish(db, "test", "demo-1", accepted=False)
        self.assertIsNone(claim(db, "test", "demo-1"))
        with self.assertRaises(ValueError):
            ingest(db, "test", {**event, "type": "live_trade"}, directory)

    def test_unattributed_event_is_stored_without_delivery(self):
        db = connect(":memory:")
        self.addCleanup(db.close)
        self.assertEqual(
            ingest(db, "test", {"event_id": "demo", "type": "live_trade"}, {}),
            "unattributed",
        )
        self.assertEqual(db.execute("SELECT count(*) FROM events").fetchone()[0], 1)
        self.assertIsNone(claim(db, "test", "demo"))


class ReconciliationTests(unittest.TestCase):
    def test_wrong_region_and_shared_identity_are_quarantined(self):
        source = [Partner("demo-a", "north", ""), Partner("demo-b", "west", "")]
        directory = [Partner("demo-a", "north", "same"), Partner("demo-x", "north", "same"),
                     Partner("demo-b", "east", "other")]
        matched, rejected = match_partners(source, directory)
        self.assertEqual(matched, {})
        self.assertEqual(rejected, {"demo-a": "conflict", "demo-b": "conflict"})

    def test_moved_columns_work_and_duplicate_headers_fail(self):
        with TemporaryDirectory() as temp:
            path = Path(temp) / "sample.csv"
            path.write_text("region, refcode\nnorth,demo\n", encoding="utf-8")
            self.assertEqual(read_rows(path, {"refcode"})[0]["refcode"], "demo")
            path.write_text("region,Region\nnorth,south\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "duplicate"):
                read_rows(path, {"region"})

    def test_attribution_reconciles_after_duplicate_input(self):
        day = date(2030, 1, 3)
        output = registration_audit([("a", day), ("a", day), ("b", day)], {"a"})
        self.assertEqual(output["2030-01-03"], {"total": 2, "matched": 1, "unattributed": 1})

    def test_source_and_mart_delays_are_distinguished(self):
        day = date(2030, 1, 3)
        yesterday = day - timedelta(days=1)
        states = metric_freshness(
            day, {"missing": None, "source": yesterday, "mart": day},
            {"missing": None, "source": yesterday, "mart": yesterday},
        )
        self.assertEqual([states[key]["state"] for key in ("missing", "source", "mart")],
                         ["source_missing", "source_delayed", "mart_delayed"])


class WorkflowTests(unittest.TestCase):
    def test_ambiguous_dst_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "ambiguous"):
            booking_window("2026-11-01T01:30:00", "America/New_York")

    def test_attendance_merges_duplicates_and_excludes_unverified_join(self):
        start, end = booking_window("2030-01-03T10:00:00", "UTC")
        sessions = [
            Presence("demo-1", start, start + timedelta(minutes=20)),
            Presence("demo-1", start + timedelta(minutes=10), end),
            Presence("stranger", start, end),
        ]
        self.assertEqual(attendance_seconds(sessions, {"demo-1"}, (start, end)),
                         {"demo-1": 2700})

    def test_missing_observation_does_not_count_as_zero_activity(self):
        day = date(2030, 1, 3)
        self.assertEqual(churn_brief({day-timedelta(days=2): 5, day: 0}, day)["status"],
                         "incomplete_window")


class HistoryTests(unittest.TestCase):
    def test_cursor_loop_is_not_a_complete_export(self):
        with self.assertRaisesRegex(ValueError, "cursor"):
            export_conversation("demo", lambda conversation, cursor: ([], "loop"))

    def test_mixed_chat_rows_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "identity"):
            export_conversation("demo", lambda conversation, cursor:
                                ([{"conversation": "other", "message_id": "1"}], None))

    def test_export_count_mismatch_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "source count"):
            validate_export_counts(2, [{"external_id": "demo-1"}])

    def test_unverifiable_model_evidence_is_rejected(self):
        report = {"summary": "Review", "root_cause": "Unknown", "trigger": "Unknown",
                  "facts": [{"text": "Activity declined", "evidence_ids": ["metric-1"]}],
                  "hypotheses": [], "actions": ["Review timeline"]}
        self.assertEqual(validate_churn_report(report, {"metric-1"})["review_status"],
                         "pending_human_review")
        with self.assertRaisesRegex(ValueError, "evidence"):
            validate_churn_report(report, {"metric-2"})
