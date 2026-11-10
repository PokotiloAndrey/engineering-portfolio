"""Durable webhook ingestion and an outbox with explicit delivery states."""

from __future__ import annotations

import hashlib
import hmac
import json
import sqlite3
from typing import Any

EVENT_TYPES = {"registered", "sandbox_trade", "live_trade", "first_conversion"}


def connect(path: str) -> sqlite3.Connection:
    db = sqlite3.connect(path, isolation_level=None)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS events (
            source TEXT NOT NULL, event_id TEXT NOT NULL, payload TEXT NOT NULL,
            PRIMARY KEY (source, event_id)
        );
        CREATE TABLE IF NOT EXISTS outbox (
            source TEXT NOT NULL, event_id TEXT NOT NULL, target TEXT NOT NULL,
            state TEXT NOT NULL DEFAULT 'pending'
                CHECK (state IN ('pending', 'claimed', 'accepted', 'uncertain')),
            PRIMARY KEY (source, event_id),
            FOREIGN KEY (source, event_id) REFERENCES events(source, event_id)
        );
        """
    )
    return db


def authenticate(body: bytes, signature: str, secret: bytes) -> bool:
    if not secret:
        raise ValueError("webhook secret is required")
    return hmac.compare_digest(hmac.new(secret, body, hashlib.sha256).hexdigest(), signature)


def ingest(
    db: sqlite3.Connection,
    source: str,
    payload: dict[str, Any],
    identities: dict[str, str],
) -> str:
    """Persist an authenticated event before creating its downstream work item."""
    event_id, event_type, refcode = (
        payload.get("event_id"),
        payload.get("type"),
        payload.get("refcode"),
    )
    if not source or not isinstance(event_id, str) or not event_id.strip():
        raise ValueError("source and event ID are required")
    if not isinstance(event_type, str) or event_type not in EVENT_TYPES:
        raise ValueError("unsupported event type")
    if refcode is not None and not isinstance(refcode, str):
        raise ValueError("refcode must be a string")
    canonical = json.dumps(payload, sort_keys=True, allow_nan=False)
    target = identities.get(refcode) if refcode else None
    db.execute("BEGIN IMMEDIATE")
    try:
        inserted = db.execute(
            "INSERT INTO events VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
            (source, event_id, canonical),
        ).rowcount
        if not inserted:
            previous = db.execute(
                "SELECT payload FROM events WHERE source = ? AND event_id = ?",
                (source, event_id),
            ).fetchone()
            if previous["payload"] != canonical:
                raise ValueError("event ID already has a different payload")
            result = "duplicate"
        elif target:
            db.execute(
                "INSERT INTO outbox (source, event_id, target) VALUES (?, ?, ?)",
                (source, event_id, target),
            )
            result = "queued"
        else:
            result = "unattributed"
        db.commit()
        return result
    except BaseException:
        db.rollback()
        raise


def claim(db: sqlite3.Connection, source: str, event_id: str) -> str | None:
    row = db.execute(
        """
        UPDATE outbox SET state = 'claimed'
        WHERE source = ? AND event_id = ? AND state = 'pending'
        RETURNING target
        """,
        (source, event_id),
    ).fetchone()
    return row["target"] if row else None


def finish(db: sqlite3.Connection, source: str, event_id: str, *, accepted: bool) -> None:
    changed = db.execute(
        """
        UPDATE outbox SET state = ?
        WHERE source = ? AND event_id = ? AND state = 'claimed'
        """,
        ("accepted" if accepted else "uncertain", source, event_id),
    ).rowcount
    if changed != 1:
        raise ValueError("delivery has no active claim")
