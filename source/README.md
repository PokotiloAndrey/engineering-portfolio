# Project source

Selected source from a team project for an educational platform. Deployment identifiers use example values.

| Component | Code |
| --- | --- |
| Telegram mini app | [React and TypeScript frontend](miniapp) |
| Telegram bot | [Bot source and tests](bot) |
| Cloudflare | [Archived Workers and release guards](../cloudflare-snapshots) |

To check the mini app locally with Node.js 22 or later, run `npm ci`, `npm run typecheck`, and `npm run build` from `source/miniapp`. The bot and Workers use deployment-specific credentials and service bindings. For an offline walkthrough of the integrations and data workflows, use the [portfolio examples](../README.md#run-locally).
