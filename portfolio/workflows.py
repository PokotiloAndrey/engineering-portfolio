"""Booking windows, attendance reconciliation and evidence-first churn briefs."""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo


def booking_window(
    local_start: str, zone_name: str, *, duration_minutes: int = 45
) -> tuple[datetime, datetime]:
    """Resolve a local slot to UTC and reject ambiguous or nonexistent times."""
    if duration_minutes <= 0:
        raise ValueError("duration must be positive")
    local = datetime.fromisoformat(local_start)
    if local.tzinfo is not None:
        raise ValueError("provide a local time and an IANA timezone")
    utc, zone = ZoneInfo("UTC"), ZoneInfo(zone_name)
    candidates = {
        local.replace(tzinfo=zone, fold=fold).astimezone(utc)
        for fold in (0, 1)
    }
    valid = {
        value for value in candidates
        if value.astimezone(zone).replace(tzinfo=None) == local
    }
    if len(valid) != 1:
        raise ValueError("local time is ambiguous or nonexistent")
    start = valid.pop()
    return start, start + timedelta(minutes=duration_minutes)


@dataclass(frozen=True)
class Presence:
    participant: str
    joined: datetime
    left: datetime


def attendance_seconds(
    sessions: list[Presence], verified_participants: set[str],
    window: tuple[datetime, datetime],
) -> dict[str, int]:
    """Clip and merge overlapping joins per verified participant."""
    start, end = window
    if start.utcoffset() is None or end.utcoffset() is None or end <= start:
        raise ValueError("expected a timezone-aware booking window")
    segments: dict[str, list[tuple[datetime, datetime]]] = defaultdict(list)
    for entry in sessions:
        if entry.participant not in verified_participants:
            continue
        if entry.joined.utcoffset() is None or entry.left.utcoffset() is None:
            raise ValueError("expected timezone-aware attendance")
        left, right = max(start, entry.joined), min(end, entry.left)
        if right > left:
            segments[entry.participant].append((left, right))
    counts = {}
    for participant, intervals in segments.items():
        merged: list[tuple[datetime, datetime]] = []
        for left, right in sorted(intervals):
            if merged and left <= merged[-1][1]:
                merged[-1] = merged[-1][0], max(right, merged[-1][1])
            else:
                merged.append((left, right))
        counts[participant] = int(sum((right-left).total_seconds() for left, right in merged))
    return counts


def churn_brief(
    daily_activity: dict[date, int], as_of: date, minimum_inactive_days: int = 2,
) -> dict[str, str | int | None]:
    """Detect an inactivity window on complete observations; leave causes for review."""
    if minimum_inactive_days < 1 or any(value < 0 for value in daily_activity.values()):
        raise ValueError("invalid inactivity inputs")
    active = [day for day, count in daily_activity.items() if day <= as_of and count > 0]
    if not active:
        return {"status": "insufficient_history", "inactive_days": None, "last_active": None}
    last_active = max(active)
    inactive_days = (as_of - last_active).days
    observed = sum(last_active < day <= as_of for day in daily_activity)
    if observed != inactive_days:
        return {"status": "incomplete_window", "inactive_days": None,
                "last_active": last_active.isoformat()}
    return {
        "status": "review" if inactive_days >= minimum_inactive_days else "active",
        "inactive_days": inactive_days,
        "last_active": last_active.isoformat(),
    }
