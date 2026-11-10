// Live-card release wiring. No provider or database calls in this module.
export const RELEASE_MARKER = 'live7-v84-production-candidate-v1';
const IDENTITY_PATH = '/internal/live7/runtime-identity';

export function liveCardEnv(bindings) {
  const requested = bindings.STREAM_LIVE_CLICK_MODE;
  const secret = bindings.STREAM_LIVE_CLICK_ID_SECRET || '';
  const stepKey = bindings.STREAM_LIVE_CLICK_ID_STEP_KEY || '';
  const postback = bindings.STREAM_LIVE_CF_ID_POSTBACK_URL || '';
  const canaryChat = bindings.STREAM_LIVE_CLICK_ID_CANARY_CHAT_ID || '';
  const validCanary = typeof canaryChat === 'string' && /^[1-9][0-9]{0,17}$/.test(canaryChat) &&
    BigInt(canaryChat) < 9223372036854775808n;
  const basic = typeof secret === 'string' && /^[!-~]{40,256}$/.test(secret) &&
    typeof stepKey === 'string' && /^[A-Za-z0-9_.:-]{1,128}$/.test(stepKey);
  const endpoint = typeof postback === 'string' && /^https:\/\/api\.chatterfy\.ai\/api\/postbacks\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/bot-postback$/.exec(postback);
  const validEndpoint = endpoint && endpoint[1].replaceAll('-', '') !== '0'.repeat(32);
  const preview = basic && requested === 'preview';
  const live = basic && validCanary && requested === 'live' &&
    bindings.STREAM_LIVE_CLICK_LIVE_RELEASE_READY === 'true' &&
    validEndpoint;
  const mode = live ? 'live' : preview ? 'preview' : 'off';
  return {
    STREAM_LIVE_CLICK_MODE: mode,
    STREAM_LIVE_CLICK_ID_SECRET: mode === 'off' ? '' : secret,
    STREAM_LIVE_CLICK_ID_STEP_KEY: mode === 'off' ? '' : stepKey,
    STREAM_LIVE_CF_ID_POSTBACK_URL: mode === 'live' ? postback : '',
    STREAM_LIVE_CLICK_ID_CANARY_CHAT_ID: mode === 'live' ? canaryChat : '',
  };
}

export function liveReadinessRequest(request) {
  if (new URL(request.url).pathname !== IDENTITY_PATH) return request;
  const headers = new Headers(request.headers);
  headers.delete('Cloudflare-Workers-Version-Overrides');
  return new Request(request, { headers });
}

export function markReadinessResponse(request, response, side) {
  if (new URL(request.url).pathname !== IDENTITY_PATH) return response;
  const marked = new Response(response.body, response);
  marked.headers.set(side === 'do' ? 'X-Live7-DO-Revision' : 'X-Live7-Worker-Revision', RELEASE_MARKER);
  return marked;
}
