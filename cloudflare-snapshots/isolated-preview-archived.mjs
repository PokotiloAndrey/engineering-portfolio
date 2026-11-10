import { plan3bRuntimeEnv, plan3bConfigGroup } from "./plan3b-config.mjs";
import { Container, getContainer } from "@cloudflare/containers";
import { dashboardEnvProbe, dashboardEnvRestart } from "./dashboard-env-probe.mjs";
import { env } from "cloudflare:workers";

function parseMetaCapiSecrets(raw) {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

const metaCapiSecrets = parseMetaCapiSecrets(env.META_CAPI_SECRETS_JSON);

const easywebEsConfig = plan3bConfigGroup(env.ID_AGENT_ENV_EASYWEB_ES_JSON, "EASYWEB_ES_");
const easywebIdConfig = plan3bConfigGroup(env.ID_AGENT_ENV_EASYWEB_ID_JSON, "EASYWEB_ID_");
const chatterfyEsConfig = plan3bConfigGroup(env.ID_AGENT_ENV_CHATTERFY_ES_JSON, "CHATTERFY_ES_");
const chatterfyIdConfig = plan3bConfigGroup(env.ID_AGENT_ENV_CHATTERFY_ID_JSON, "CHATTERFY_ID_");

// Delivery is an explicit single-chat opt-in. Do not pass a dedicated
// Chatterfy token or canary identity to the Container while disabled.
function resourceDeliveryEnv(bindings) {
  const active = bindings.FUNNEL_RESOURCE_DELIVERY_ENABLED === "true" &&
    bindings.FUNNEL_RESOURCE_LINKS_ENABLED === "true" &&
    bindings.FUNNEL_RESOURCE_ISSUER_ENABLED === "true";
  return {
    FUNNEL_RESOURCE_DELIVERY_ENABLED: active ? "true" : "false",
    FUNNEL_RESOURCE_DELIVERY_BOT_ID: active ? (bindings.FUNNEL_RESOURCE_DELIVERY_BOT_ID || "") : "",
    FUNNEL_RESOURCE_DELIVERY_CHAT_ID: active ? (bindings.FUNNEL_RESOURCE_DELIVERY_CHAT_ID || "") : "",
    FUNNEL_RESOURCE_DELIVERY_TELEGRAM_USER_ID: active ? (bindings.FUNNEL_RESOURCE_DELIVERY_TELEGRAM_USER_ID || "0") : "0",
    FUNNEL_RESOURCE_DELIVERY_CHATTERFY_TOKEN: active ? (bindings.FUNNEL_RESOURCE_DELIVERY_CHATTERFY_TOKEN || "") : "",
    FUNNEL_RESOURCE_DELIVERY_POLL_SECONDS: active ? (bindings.FUNNEL_RESOURCE_DELIVERY_POLL_SECONDS || "10") : "10",
  };
}

export class FastAPIContainer extends Container {
  defaultPort = 8000;
  sleepAfter = "10m";
  async fetch(request) {
    // Refresh credentials from current Worker bindings before any container
    // start. A Durable Object created before these bindings existed can retain
    // its original envVars object until it is explicitly refreshed.
    this.envVars = {
      ...this.envVars,
      ID_AGENT_DASHBOARD_USERNAME: env.ID_AGENT_DASHBOARD_USERNAME || "",
      ID_AGENT_DASHBOARD_PASSWORD: env.ID_AGENT_DASHBOARD_PASSWORD || "",
      FUNNEL_RESOURCE_LINKS_ENABLED: env.FUNNEL_RESOURCE_LINKS_ENABLED === "true" ? "true" : "false",
      FUNNEL_RESOURCE_DIGEST_KEY_HEX: env.FUNNEL_RESOURCE_LINKS_ENABLED === "true" ? (env.FUNNEL_RESOURCE_DIGEST_KEY_HEX || "") : "",
      FUNNEL_RESOURCE_ISSUER_ENABLED: env.FUNNEL_RESOURCE_ISSUER_ENABLED === "true" ? "true" : "false",
      FUNNEL_RESOURCE_ISSUER_SIGNING_KEY_HEX: env.FUNNEL_RESOURCE_ISSUER_ENABLED === "true" ? (env.FUNNEL_RESOURCE_ISSUER_SIGNING_KEY_HEX || "") : "",
      FUNNEL_RESOURCE_OUTBOX_KEY_HEX: env.FUNNEL_RESOURCE_ISSUER_ENABLED === "true" ? (env.FUNNEL_RESOURCE_OUTBOX_KEY_HEX || "") : "",
      FUNNEL_RESOURCE_BOT_GEO_JSON: env.FUNNEL_RESOURCE_BOT_GEO_JSON || "{}",
      FUNNEL_RESOURCE_ISSUER_CANARY_CHAT_IDS_JSON: env.FUNNEL_RESOURCE_ISSUER_CANARY_CHAT_IDS_JSON || "[]",
      ...resourceDeliveryEnv(env),
    };

    const url = new URL(request.url);
    const credentials = {
      username: env.ID_AGENT_DASHBOARD_USERNAME || "",
      password: env.ID_AGENT_DASHBOARD_PASSWORD || "",
    };
    if (url.pathname === "/__internal/container/dashboard-env-probe") {
      return dashboardEnvProbe(request, this.ctx.container, credentials);
    }
    if (url.pathname === "/__internal/container/dashboard-env-restart") {
      return dashboardEnvRestart(request, credentials, () => this.stop());
    }
    return this.containerFetch(request);
  }

  envVars = {
    DATABASE_URL: env.DATABASE_URL,
    FUNNEL_RESOURCE_LINKS_ENABLED: env.FUNNEL_RESOURCE_LINKS_ENABLED === "true" ? "true" : "false",
    FUNNEL_RESOURCE_DIGEST_KEY_HEX: env.FUNNEL_RESOURCE_LINKS_ENABLED === "true" ? (env.FUNNEL_RESOURCE_DIGEST_KEY_HEX || "") : "",
    FUNNEL_RESOURCE_ISSUER_ENABLED: env.FUNNEL_RESOURCE_ISSUER_ENABLED === "true" ? "true" : "false",
    FUNNEL_RESOURCE_ISSUER_SIGNING_KEY_HEX: env.FUNNEL_RESOURCE_ISSUER_ENABLED === "true" ? (env.FUNNEL_RESOURCE_ISSUER_SIGNING_KEY_HEX || "") : "",
    FUNNEL_RESOURCE_OUTBOX_KEY_HEX: env.FUNNEL_RESOURCE_ISSUER_ENABLED === "true" ? (env.FUNNEL_RESOURCE_OUTBOX_KEY_HEX || "") : "",
    FUNNEL_RESOURCE_BOT_GEO_JSON: env.FUNNEL_RESOURCE_BOT_GEO_JSON || "{}",
    FUNNEL_RESOURCE_ISSUER_CANARY_CHAT_IDS_JSON: env.FUNNEL_RESOURCE_ISSUER_CANARY_CHAT_IDS_JSON || "[]",
    ...resourceDeliveryEnv(env),
    ID_AGENT_INTERNAL_TOKEN: env.ID_AGENT_INTERNAL_TOKEN,
    ID_AGENT_GATEWAY_TOKEN: env.ID_AGENT_GATEWAY_TOKEN,
    ID_AGENT_GATEWAY_URL: env.ID_AGENT_GATEWAY_URL,
    CHATTERFY_API_TOKEN: env.CHATTERFY_API_TOKEN,
    ID_AGENT_CHATTERFY_API_TOKEN: env.ID_AGENT_CHATTERFY_API_TOKEN,
    ID_AGENT_CHATTERFY_BOT_ID: env.ID_AGENT_CHATTERFY_BOT_ID || "",
    ID_AGENT_ALL_CHATS_ENABLED: env.ID_AGENT_ALL_CHATS_ENABLED || "false",
    ID_AGENT_ALL_CHATS_NATIVE_AI_DISABLED: env.ID_AGENT_ALL_CHATS_NATIVE_AI_DISABLED || "false",
    ID_AGENT_DASHBOARD_USERNAME: env.ID_AGENT_DASHBOARD_USERNAME || "",
    ID_AGENT_DASHBOARD_PASSWORD: env.ID_AGENT_DASHBOARD_PASSWORD || "",
    ID_AGENT_F6_BULK_ENABLED: env.ID_AGENT_F6_BULK_ENABLED || "false",
    ID_AGENT_F6_NATIVE_AI_DISABLED: env.ID_AGENT_F6_NATIVE_AI_DISABLED || "false",
    ID_AGENT_F6_BULK_NOT_BEFORE_UTC: env.ID_AGENT_F6_BULK_NOT_BEFORE_UTC || "",
    ...plan3bRuntimeEnv(env.ID_AGENT_PLAN3B_CONFIG),
    ...easywebEsConfig,
    ...easywebIdConfig,
    ...chatterfyEsConfig,
    ...chatterfyIdConfig,
    EASYWEB_ES_MODULE_1_DYLAN_JIT_SCHEDULE_ID: easywebEsConfig.EASYWEB_ES_MODULE_1_DYLAN_SCHEDULE_2200,
    AI_WEB_RESEARCH_ENABLED: "false",
    AI_HOMEWORK_ACTIONS_ENABLED: "false",
    AI_PROGRESSION_ENABLED: "false",
    DATABASE_SSL: "true",
    AFFILIATE_POSTBACK_TOKEN: env.AFFILIATE_POSTBACK_TOKEN,
    META_CAPI_ENABLED: "false",
    META_CAPI_GRAPH_VERSION: "v26.0",
    META_CAPI_PIXEL_ID_ID: "8441414450774744",
    META_CAPI_TOKEN_ID: metaCapiSecrets.META_CAPI_TOKEN_ID,
    META_CAPI_PIXEL_ID_LATAM: "4944521382426690",
    META_CAPI_TOKEN_LATAM: metaCapiSecrets.META_CAPI_TOKEN_LATAM,
    META_CAPI_PIXEL_ID_BR: "7321604977719653",
    META_CAPI_TOKEN_BR: metaCapiSecrets.META_CAPI_TOKEN_BR,
    META_CAPI_TEST_EVENT_CODE: metaCapiSecrets.META_CAPI_TEST_EVENT_CODE,
    CHATTERFY_WEBHOOK_TOKEN: env.CHATTERFY_WEBHOOK_TOKEN,
    EASYWEB_WEBHOOK_TOKEN: env.EASYWEB_WEBHOOK_TOKEN,
    APP_ENV: "production",
    CHATTERFY_ES_POSTBACK_URL: env.CHATTERFY_ES_POSTBACK_URL,
    CHATTERFY_ID_POSTBACK_URL: env.CHATTERFY_ID_POSTBACK_URL,
    EASYWEB_RELAY_TOKEN: env.EASYWEB_RELAY_TOKEN,
    CHATTERFY_ID_WEBINAR_POSTBACK_URL: env.CHATTERFY_ID_WEBINAR_POSTBACK_URL,
    CHATTERFY_ID_WEBINAR_STEP_1600: env.CHATTERFY_ID_WEBINAR_STEP_1600,
    ACADEMY_BOT_ES_USERNAME: "example_bot_2e8f6a23",
    ACADEMY_BOT_ID_USERNAME: "example_bot_f5333db8",
    GOOGLE_CALENDAR_CLIENT_ID: env.GOOGLE_CALENDAR_CLIENT_ID,
    GOOGLE_CALENDAR_CLIENT_SECRET: env.GOOGLE_CALENDAR_CLIENT_SECRET,
    GOOGLE_CALENDAR_STATE_SECRET: env.GOOGLE_CALENDAR_STATE_SECRET,
    EASYWEB_ES_MODULE_1_DYLAN_JIT_SCHEDULE_ID: easywebEsConfig.EASYWEB_ES_MODULE_1_DYLAN_SCHEDULE_2200,
  };
}

export default {
  async fetch(request, env) {
    const container = getContainer(env.FASTAPI_CONTAINER, "api-prod-latam-v1");
    return container.fetch(request);
  },

  async scheduled(controller, env, ctx) {
    const container = getContainer(
      env.FASTAPI_CONTAINER,
      "api-prod-latam-v1",
    );

    const runtimeControl = plan3bRuntimeEnv(
      env.ID_AGENT_PLAN3B_CONFIG,
    );

    const request = new Request(
      "http://internal/internal/id-agent/drain",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.ID_AGENT_INTERNAL_TOKEN}`,
          "X-ID-Agent-Automation-Mode":
            runtimeControl.ID_AGENT_AUTOMATION_MODE,
          "X-AI-Outbound-Enabled":
            runtimeControl.AI_OUTBOUND_ENABLED,
          "X-ID-Agent-Canary-Chat-Ids":
            runtimeControl.ID_AGENT_CANARY_CHAT_IDS,
          // Explicit F6 shadow scope, never a Telegram ID.
          // Empty/missing binding is fail-closed in the authenticated route.
          "example_63dccf3426cc1b17a1":
            env.ID_AGENT_F6_SHADOW_CHAT_ID || "",
        },
      },
    );

    const drainStarted = Date.now();
    ctx.waitUntil(
      container.fetch(request).then(async (response) => {
        const body = await response.json().catch(() => null);
        const safe = {
          event: "id_agent_drain_result",
          http_status: response.status,
          worker_mode: runtimeControl.ID_AGENT_AUTOMATION_MODE,
          worker_outbound: runtimeControl.AI_OUTBOUND_ENABLED === "true",
          worker_canary_empty: runtimeControl.ID_AGENT_CANARY_CHAT_IDS === "[]",
          worker_f6_bulk: env.ID_AGENT_F6_BULK_ENABLED === "true",
          worker_f6_native_ai_disabled: env.ID_AGENT_F6_NATIVE_AI_DISABLED === "true",
          worker_bot_matches: env.ID_AGENT_CHATTERFY_BOT_ID === "800983e8-6b56-424d-8df8-9753cdb65de7",
          worker_token_present: Boolean(env.ID_AGENT_CHATTERFY_API_TOKEN),
          duration_ms: Date.now() - drainStarted,
        };
        for (const key of ["status", "reason", "mode"]) {
          const value = body?.[key];
          if (typeof value === "string" && /^[a-z0-9_]{1,100}$/.test(value)) {
            safe[key] = value;
          }
        }
        for (const key of ["claimed", "completed", "retryable_error", "failed", "superseded"]) {
          const value = body?.[key];
          if (Number.isSafeInteger(value) && value >= 0) safe[key] = value;
        }
        console.log(JSON.stringify(safe));
      }).catch((error) => {
        console.error(JSON.stringify({
          event: "id_agent_drain_request_failed",
          duration_ms: Date.now() - drainStarted,
        }));
        throw error;
      }),
    );

    // One bounded drain per scheduled minute. This deliberately trades up to
    // one minute of additional detection latency for fewer idle polls/wakes.
    // The model endpoint is called only when a newly observed job is drained.

  },
};
