"""Run the examples with fictional inputs, no network or credentials."""

from datetime import date
import json
from pathlib import Path

from .events import claim, connect, finish, ingest
from .pipelines import Partner, match_partners, metric_freshness, read_rows, registration_audit
from .workflows import booking_window, churn_brief


def main() -> None:
    folder = Path(__file__).resolve().parents[1] / "examples"
    directory = [
        Partner(**row) for row in read_rows(
            folder / "partners.csv", {"refcode", "region", "external_id", "click_id", "status"}
        )
    ]
    source = [Partner("demo-alpha", "north", ""), Partner("demo-unknown", "", "")]
    matched, rejected = match_partners(source, directory)
    db = connect(":memory:")
    try:
        payload = {"event_id": "example-1", "type": "registered", "refcode": "demo-alpha"}
        identities = {ref: entry.external_id for ref, entry in matched.items()}
        first = ingest(db, "example", payload, identities)
        repeated = ingest(db, "example", payload, identities)
        target = claim(db, "example", payload["event_id"])
        if target:
            finish(db, "example", payload["event_id"], accepted=True)
    finally:
        db.close()

    today = date(2030, 1, 3)
    result = {
        "webhook": {"first": first, "repeated": repeated, "target": target},
        "crm_matching": {"matched": len(matched), "rejected": rejected},
        "attribution": registration_audit(
            [("demo-alpha", today), ("demo-unknown", today)], set(identities),
        ),
        "freshness": metric_freshness(
            today, {"registrations": today}, {"registrations": date(2030, 1, 1)},
        ),
        "booking_utc": [time.isoformat() for time in booking_window(
            "2030-01-03T10:00:00", "Asia/Tokyo",
        )],
        "churn": churn_brief(
            {date(2030, 1, 1): 2, date(2030, 1, 2): 0, today: 0}, today,
        ),
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
