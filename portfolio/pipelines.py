"""Portable ETL and CRM reconciliation examples using only the Python stdlib."""

from __future__ import annotations

import csv
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True)
class Partner:
    refcode: str
    region: str
    external_id: str
    click_id: str = ""
    status: str = ""


def _normalize(value: str) -> str:
    return " ".join(value.strip().casefold().split())


def read_rows(path: Path, required: set[str]) -> list[dict[str, str]]:
    """Read a CSV by header, rejecting ambiguous headers and damaged rows."""
    with path.open(encoding="utf-8-sig", newline="") as file:
        rows = csv.reader(file, strict=True)
        fields = [_normalize(value) for value in next(rows, [])]
        if not all(fields) or len(set(fields)) != len(fields):
            raise ValueError("blank or duplicate column")
        if missing := required.difference(fields):
            raise ValueError(f"missing columns: {', '.join(sorted(missing))}")
        data = []
        for number, row in enumerate(rows, start=2):
            if not row:
                continue
            if len(row) != len(fields):
                raise ValueError(f"wrong number of columns on line {number}")
            data.append(dict(zip(fields, row, strict=True)))
        return data


def match_partners(
    source: Iterable[Partner],
    directory: Iterable[Partner],
) -> tuple[dict[str, Partner], dict[str, str]]:
    """Match exact referral identities and quarantine ambiguous ownership."""
    incoming = list(source)
    by_ref: dict[str, set[Partner]] = defaultdict(set)
    owners: dict[tuple[str, str], set[str]] = defaultdict(set)
    for row in directory:
        if row.refcode and row.region and row.external_id:
            by_ref[row.refcode].add(row)
            owners[row.region, row.external_id].add(row.refcode)
    source_counts = Counter(row.refcode for row in incoming)
    matched, rejected = {}, {}
    for row in incoming:
        if not row.refcode:
            rejected[""] = "missing_refcode"
            continue
        if source_counts[row.refcode] != 1:
            rejected[row.refcode] = "duplicate_source"
            continue
        candidates = by_ref[row.refcode]
        if len(candidates) != 1:
            rejected[row.refcode] = "unknown" if not candidates else "conflict"
            continue
        target = next(iter(candidates))
        if (
            owners[target.region, target.external_id] != {row.refcode}
            or (row.region and row.region != target.region)
            or (row.external_id and row.external_id != target.external_id)
            or (row.click_id and target.click_id and row.click_id != target.click_id)
        ):
            rejected[row.refcode] = "conflict"
            continue
        matched[row.refcode] = target
    return matched, rejected


def registration_audit(
    registrations: Iterable[tuple[str, date]],
    known_refcodes: set[str],
) -> dict[str, dict[str, int]]:
    """Deduplicate the input and reconcile daily attribution totals."""
    grouped: dict[str, Counter] = defaultdict(Counter)
    dates: dict[str, date] = {}
    for refcode, day in registrations:
        if not refcode:
            raise ValueError("registration without refcode")
        if refcode in dates and dates[refcode] != day:
            raise ValueError("conflicting dates for one refcode")
        dates[refcode] = day
    for refcode, day in dates.items():
        counts = grouped[day.isoformat()]
        counts["total"] += 1
        counts["matched" if refcode in known_refcodes else "unattributed"] += 1
    return {
        day: {key: counts[key] for key in ("total", "matched", "unattributed")}
        for day, counts in sorted(grouped.items())
    }


def metric_freshness(
    expected_day: date,
    source_dates: dict[str, date | None],
    mart_dates: dict[str, date | None],
) -> dict[str, dict[str, str | int | None]]:
    """Separate a missing upstream feed from a delayed downstream load."""
    rows = {}
    for metric in sorted(source_dates.keys() | mart_dates.keys()):
        source, mart = source_dates.get(metric), mart_dates.get(metric)
        if (source and source > expected_day) or (mart and mart > expected_day):
            raise ValueError("future observation in freshness check")
        if source is None:
            state = "source_missing"
        elif mart is None or mart < source:
            state = "mart_delayed"
        elif mart > source:
            state = "source_mart_inconsistent"
        elif source < expected_day:
            state = "source_delayed"
        else:
            state = "fresh"
        rows[metric] = {
            "source_date": source.isoformat() if source else None,
            "mart_date": mart.isoformat() if mart else None,
            "lag_days": (expected_day - mart).days if mart else None,
            "state": state,
        }
    return rows
