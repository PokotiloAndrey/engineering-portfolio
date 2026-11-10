"""Replay a fictional partner-to-CRM workflow with local test doubles."""

import argparse
from collections.abc import Iterable
from contextlib import closing
import csv
from datetime import date
import hashlib
import hmac
import json
from pathlib import Path
import re
import secrets
import sqlite3

from .events import authenticate, connect, ingest
from .pipelines import Partner, match_partners, registration_audit
from .review import prepare_review


def receive_event(
    db: sqlite3.Connection,
    body: bytes,
    signature: str,
    signing_key: bytes,
    identities: dict[str, str],
) -> str:
    """Verify the raw event bytes before decoding or writing to the ledger."""
    if not re.fullmatch(r"[0-9a-f]{64}", signature) or not authenticate(
        body, signature, signing_key
    ):
        raise ValueError("invalid signature")
    payload = json.loads(body)
    if not isinstance(payload, dict):
        raise ValueError("expected a JSON object")
    return ingest(db, "demo-replay", payload, identities)


def click_id_updates(
    source: Iterable[Partner], directory: Iterable[Partner],
) -> list[dict[str, str]]:
    """Plan changes for verified contacts whose click ID is still blank."""
    source_rows = list(source)
    matched, _ = match_partners(source_rows, directory)
    updates = []
    for row in source_rows:
        target = matched.get(row.refcode)
        if target and row.click_id and not target.click_id:
            updates.append({
                "region": target.region,
                "external_id": target.external_id,
                "click_id": row.click_id,
            })
    return updates


def run_demo(registration_csv: Path | None = None) -> dict:
    first, second, third = (date(2030, 1, day) for day in (1, 2, 3))
    directory = [
        Partner("demo-alpha", "east", "contact-1"),
        Partner("demo-beta", "west", "contact-2"),
    ]
    registrations = [
        ("demo-beta", third), ("demo-alpha", second),
        ("demo-other", second), ("demo-alpha", second),
    ]
    matched, _ = match_partners(
        [Partner(refcode, "", "") for refcode, _ in set(registrations)], directory,
    )
    identities = {refcode: contact.external_id for refcode, contact in matched.items()}
    audit = registration_audit(registrations, set(identities))
    updates = click_id_updates([
        Partner("demo-alpha", "east", "", "sample-click-1"),
        Partner("demo-other", "east", "", "sample-click-2"),
    ], directory)

    # The fixture key is generated for this replay and is never stored.
    key = secrets.token_bytes(32)
    statuses = []
    with closing(connect(":memory:")) as db:
        for event_id, refcode in (
            ("event-1", "demo-alpha"), ("event-1", "demo-alpha"), ("event-2", "demo-other"),
        ):
            payload = {"event_id": event_id, "type": "registered", "refcode": refcode}
            body = json.dumps(payload).encode()
            signature = hmac.new(key, body, hashlib.sha256).hexdigest()
            statuses.append(receive_event(db, body, signature, key, identities))

    def sample_page(conversation: str, cursor: str | None) -> tuple[list[dict], None]:
        return [{
            "conversation": conversation, "message_id": "message-1",
            "text": "I cannot find the onboarding checklist.",
        }], None

    def sample_analysis(evidence: tuple[tuple[str, str], ...]) -> dict:
        message_id, _ = evidence[0]
        return {
            "summary": "A participant asked where to find the checklist.",
            "root_cause": "Undetermined",
            "trigger": "Undetermined",
            "facts": [{"text": "The participant asked about the checklist.",
                       "evidence_ids": [message_id]}],
            "hypotheses": [],
            "actions": ["Review the conversation and verify whether help was offered."],
        }

    review = prepare_review(
        {first: 2, second: 0, third: 0}, third, "demo-chat", sample_page, sample_analysis,
    )
    if registration_csv is not None:
        with registration_csv.open("x", encoding="utf-8", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["refcode", "registration_date"])
            writer.writerows(sorted(set(registrations), key=lambda row: (row[1], row[0])))
    return {
        "registrations": audit,
        "event_statuses": statuses,
        "crm_update_plan": updates,
        "review": review,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, help="Write referral codes and dates to a new file")
    arguments = parser.parse_args()
    try:
        report = run_demo(arguments.csv)
    except OSError as error:
        parser.exit(1, f"{error}\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
