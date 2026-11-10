# Engineering portfolio

**Andrey Pokotilo** · Backend engineering, integrations, data pipelines, and cloud operations.

Runnable examples based on problems I worked on in a team product. The implementations in this repository were written for the portfolio and use fictional records and local test doubles.

## Explore the work

| Area | Engineering problem | Example |
| --- | --- | --- |
| Partner attribution | Track registration events, preserve unlinked events, and reconcile totals by date | [CSV and attribution pipeline](portfolio/pipelines.py) |
| Webhooks and conversion delivery | Persist an event before downstream actions, handle retries, and keep uncertain deliveries visible | [SQLite event ledger and outbox](portfolio/events.py) |
| CRM automation | Match records by verified identities, protect regional routing, and reject ambiguous updates | [Identity reconciliation](portfolio/pipelines.py) |
| User and chat exports | Detect incomplete pages, reject mismatched counts, and keep conversation identities separate | [Export validation](portfolio/history.py) |
| Scheduling and attendance | Normalize regional slots to UTC, handle DST and count overlapping joins once | [Calendar and attendance](portfolio/workflows.py) |
| Analytics operations | Distinguish missing data from zero activity and isolate upstream vs. downstream lag | [Freshness checks](portfolio/pipelines.py) · [PostgreSQL query](examples/analytics.sql) |
| AI-assisted review | Separate inactivity detection from causal claims and verify evidence IDs in model output | [Inactivity](portfolio/workflows.py) · [Evidence validation](portfolio/history.py) |
| Cloudflare and release safety | Verify signed ingress, route through a service binding, and gate an isolated preview | [Worker](edge/worker.mjs) · [Preview checks](edge/release.mjs) |

[Engineering case notes](docs/case-studies.md) describe the original contribution areas and what each example demonstrates.

## Run locally

With Python 3.11+ and Node.js 22+:

```bash
python -m portfolio.demo
python -m unittest discover -s tests -v
node --test edge/worker.test.mjs
```

The Python demo prints attribution totals, a duplicate webhook result, a delayed mart, a UTC booking window, and a churn review candidate. The tests exercise edge request signing and routing with an in-memory backend binding.

## How the examples fit together

```mermaid
flowchart LR
    A["Partner events"] --> B["Signed gateway"]
    B --> C["Event ledger"]
    C --> D["CRM delivery"]
    C --> E["Daily reporting"]
```

CSV input and the local SQLite database are intentionally small so each failure mode is easy to reproduce. SQL, cloud routing and review workflows are independent examples.
