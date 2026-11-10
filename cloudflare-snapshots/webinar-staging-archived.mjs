import { Container } from "@cloudflare/containers";

// F6 staging bootstrap only. This Worker intentionally NEVER starts the container.
// An isolated database and runtime-bound outbound gate must be verified before
// any authenticated proxy or scheduled invocation is added in a separate change.
export class F6StagingContainer extends Container {
  defaultPort = 8000;
  sleepAfter = "10m";

  envVars = {
    APP_ENV: "staging",
    ID_AGENT_AUTOMATION_MODE: "shadow",
    ID_AGENT_CANARY_CHAT_IDS: "[]",
    ID_AGENT_F6_SHADOW_CHAT_ID: "",
    AI_OUTBOUND_ENABLED: "false",
    AI_PROGRESSION_ENABLED: "false",
    AI_HOMEWORK_ACTIONS_ENABLED: "false",
    AI_WEB_RESEARCH_ENABLED: "false",
    META_CAPI_ENABLED: "false",
  };
}

export default {
  async fetch() {
    // No public route, no API proxy, no Chatterfy, no DB, no container activation.
    return new Response("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  },
};
