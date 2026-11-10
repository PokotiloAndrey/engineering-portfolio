"""Prepare an evidence packet and validate the model's response for human review."""

from collections.abc import Callable, Mapping
from datetime import date
from typing import Any

from .history import export_conversation, validate_churn_report
from .workflows import churn_brief


def prepare_review(
    daily_activity: dict[date, int],
    as_of: date,
    conversation: str,
    fetch_page: Callable[[str, str | None], tuple[list[dict[str, Any]], str | None]],
    analyze: Callable[[tuple[tuple[str, str], ...]], Mapping[str, Any]],
) -> dict[str, Any] | None:
    """Only request an analysis when the inactivity window and evidence are complete."""
    activity = churn_brief(daily_activity, as_of)
    if activity["status"] != "review":
        return None

    evidence = []
    for message in export_conversation(conversation, fetch_page):
        message_id, message_text = message["message_id"], message.get("text")
        if not isinstance(message_id, str) or not isinstance(message_text, str):
            raise ValueError("expected text evidence with a stable message ID")
        if message_text.strip():
            evidence.append((message_id, message_text))
    if not evidence:
        return None

    report = analyze(tuple(evidence))
    validated = validate_churn_report(report, {message_id for message_id, _ in evidence})
    return {**validated, "activity": activity}
