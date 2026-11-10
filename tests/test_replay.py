from contextlib import closing
from datetime import date
from pathlib import Path
import tempfile
import unittest

from portfolio.events import connect
from portfolio.pipelines import Partner
from portfolio.replay import click_id_updates, receive_event, run_demo
from portfolio.review import prepare_review


class ReplayTests(unittest.TestCase):
    def test_rejected_signature_creates_no_event(self):
        with closing(connect(":memory:")) as db:
            with self.assertRaisesRegex(ValueError, "invalid signature"):
                receive_event(db, b'{"event_id":"evt-1"}', "invalid", b"demo", {})
            self.assertEqual(db.execute("SELECT count(*) FROM events").fetchone()[0], 0)

    def test_demo_reconciles_and_exports_unique_registration_dates(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "registrations.csv"
            report = run_demo(path)
            self.assertEqual(path.read_text().splitlines(), [
                "refcode,registration_date",
                "demo-alpha,2030-01-02",
                "demo-other,2030-01-02",
                "demo-beta,2030-01-03",
            ])
        self.assertEqual(report["registrations"]["2030-01-02"],
                         {"total": 2, "matched": 1, "unattributed": 1})
        self.assertEqual(report["event_statuses"], ["queued", "duplicate", "unattributed"])
        self.assertEqual(report["review"]["review_status"], "pending_human_review")

    def test_crm_plan_skips_ambiguous_and_existing_click_ids(self):
        incoming = [
            Partner("r-1", "east", "", "new-1"),
            Partner("r-2", "east", "", "new-2"),
            Partner("r-3", "east", "", "new-3"),
        ]
        directory = [
            Partner("r-1", "east", "contact-1"),
            Partner("r-2", "east", "contact-2", "keep-2"),
            Partner("r-3", "east", "contact-3"),
            Partner("r-3", "east", "contact-4"),
        ]
        self.assertEqual(click_id_updates(incoming, directory), [
            {"region": "east", "external_id": "contact-1", "click_id": "new-1"},
        ])

    def test_model_is_not_called_when_activity_is_missing(self):
        def unexpected_call(messages):
            self.fail("incomplete activity should not invoke the model")

        report = prepare_review(
            {date(2030, 1, 1): 2, date(2030, 1, 3): 0},
            date(2030, 1, 3), "chat-1", unexpected_call, unexpected_call,
        )
        self.assertIsNone(report)

    def test_model_cannot_invent_an_evidence_reference(self):
        def model(messages):
            self.assertEqual(messages, (("m-1", "Need help"),))
            return {
                "summary": "Support question", "root_cause": "Unknown", "trigger": "Unknown",
                "facts": [{"text": "Support asked", "evidence_ids": ["m-2"]}],
                "hypotheses": [], "actions": [],
            }

        with self.assertRaisesRegex(ValueError, "unverified evidence"):
            prepare_review(
                {date(2030, 1, 1): 2, date(2030, 1, 2): 0, date(2030, 1, 3): 0},
                date(2030, 1, 3), "chat-1",
                lambda chat, cursor: ([{"conversation": chat, "message_id": "m-1",
                                        "text": "Need help"}], None),
                model,
            )
