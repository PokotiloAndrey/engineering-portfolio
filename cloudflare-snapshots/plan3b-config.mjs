export function plan3bRuntimeEnv(rawConfig) {
  const deny = {
    ID_AGENT_AUTOMATION_MODE: "shadow",
    AI_OUTBOUND_ENABLED: "false",
    ID_AGENT_CANARY_CHAT_IDS: "[]",
  };

  let config = rawConfig;

  if (typeof config === "string") {
    try {
      config = JSON.parse(config);
    } catch {
      return deny;
    }
  }

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return deny;
  }

  const mode = config.automation_mode;
  const outboundEnabled = config.outbound_enabled;
  const canaryChatIds = config.canary_chat_ids;

  if (
    mode !== "shadow" &&
    mode !== "canary" &&
    mode !== "qa_live"
  ) {
    return deny;
  }

  if (typeof outboundEnabled !== "boolean") {
    return deny;
  }

  if (!Array.isArray(canaryChatIds)) {
    return deny;
  }

  if (!canaryChatIds.every((id) => (
    typeof id === "string" &&
    id.length > 0 &&
    id === id.trim()
  ))) {
    return deny;
  }

  if (new Set(canaryChatIds).size !== canaryChatIds.length) {
    return deny;
  }

  if (mode === "shadow") {
    return deny;
  }

  if (mode === "canary" && canaryChatIds.length === 0) {
    return deny;
  }

  if (mode === "qa_live" && canaryChatIds.length !== 0) {
    return deny;
  }

  return {
    ID_AGENT_AUTOMATION_MODE: mode,
    AI_OUTBOUND_ENABLED: outboundEnabled ? "true" : "false",
    ID_AGENT_CANARY_CHAT_IDS: (
      mode === "canary"
        ? JSON.stringify(canaryChatIds)
        : "[]"
    ),
  };
}
export function plan3bConfigGroup(rawConfig, prefix) {
  if (typeof prefix !== "string" || !prefix) return {};
  let config = rawConfig;
  if (typeof config === "string") {
    try { config = JSON.parse(config); } catch { return {}; }
  }
  if (!config || typeof config !== "object" || Array.isArray(config)) return {};
  for (const [key, value] of Object.entries(config)) {
    if (!key.startsWith(prefix) || typeof value !== "string") return {};
  }
  return config;
}
