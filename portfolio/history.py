"""Portable chat export controls and evidence validation for support analysis."""

from __future__ import annotations

from collections.abc import Callable, Iterable, Mapping
from typing import Any


def export_conversation(
    conversation: str,
    fetch_page: Callable[[str, str | None], tuple[list[dict[str, Any]], str | None]],
    *,
    max_pages: int = 100,
) -> list[dict[str, Any]]:
    """Collect a complete export or raise on cursor loops, mixed identities or caps."""
    if not conversation or max_pages < 1:
        raise ValueError("conversation and positive page limit are required")
    seen_cursors = set()
    messages: dict[str, dict[str, Any]] = {}
    cursor = None
    for _ in range(max_pages):
        batch, next_cursor = fetch_page(conversation, cursor)
        for message in batch:
            message_id = message.get("message_id")
            if message.get("conversation") != conversation or not message_id:
                raise ValueError("message identity could not be verified")
            if message_id in messages and messages[message_id] != message:
                raise ValueError("conflicting content for one message")
            messages[message_id] = dict(message)
        if next_cursor is None:
            return list(messages.values())
        if not next_cursor or next_cursor in seen_cursors:
            raise ValueError("invalid or repeated pagination cursor")
        seen_cursors.add(next_cursor)
        cursor = next_cursor
    raise ValueError("pagination limit reached before completion")


def validate_export_counts(expected: int, rows: Iterable[Mapping[str, str]]) -> int:
    """Reject incomplete exports and duplicate or missing user identities."""
    identities = set()
    for row in rows:
        identity = row.get("external_id", "").strip()
        if not identity or identity in identities:
            raise ValueError("missing or duplicate user identity")
        identities.add(identity)
    if len(identities) != expected:
        raise ValueError("export does not match the source count")
    return len(identities)


def validate_churn_report(report: Mapping[str, Any], evidence: set[str]) -> dict[str, Any]:
    """Validate a report supplied by a model or analyst before showing it in a review."""
    required = {"summary", "root_cause", "trigger", "facts", "hypotheses", "actions"}
    if set(report) != required:
        raise ValueError("invalid report fields")
    for key in ("summary", "root_cause", "trigger"):
        value = report[key]
        if not isinstance(value, str) or not value.strip() or len(value) > 2000:
            raise ValueError(f"invalid {key}")
    for key in ("facts", "hypotheses"):
        items = report[key]
        if not isinstance(items, list):
            raise ValueError(f"invalid {key}")
        for item in items:
            if not isinstance(item, dict) or set(item) != {"text", "evidence_ids"}:
                raise ValueError("invalid evidence entry")
            refs = item["evidence_ids"]
            if (
                not isinstance(item["text"], str)
                or not item["text"].strip()
                or not isinstance(refs, list)
                or not refs
                or any(not isinstance(ref, str) or ref not in evidence for ref in refs)
            ):
                raise ValueError("unverified evidence reference")
    actions = report["actions"]
    if not isinstance(actions, list) or any(
        not isinstance(action, str) or not action.strip() for action in actions
    ):
        raise ValueError("invalid actions")
    return {**report, "review_status": "pending_human_review"}
