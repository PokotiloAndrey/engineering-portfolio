// Cloudflare Worker example. BACKEND is a service binding; WEBHOOK_KEY is a secret.
const MAX_BODY_BYTES = 64 * 1024;
const MAX_CLOCK_SKEW = 300;

async function readBounded(stream) {
  if (!stream) return new Uint8Array();
  const reader = stream.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export default {
  async fetch(request, env) {
    const {pathname} = new URL(request.url);
    if (request.method === "GET" && pathname === "/health") {
      return Response.json({status: "ready"});
    }
    if (request.method !== "POST" || pathname !== "/events") {
      return new Response(null, {status: 404});
    }
    if (!env.WEBHOOK_KEY || !env.BACKEND) {
      return new Response(null, {status: 503});
    }
    const timestamp = request.headers.get("X-Event-Timestamp") ?? "";
    const signature = request.headers.get("X-Event-Signature") ?? "";
    if (!/^\d{10}$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature) ||
        Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_CLOCK_SKEW) {
      return new Response(null, {status: 401});
    }
    const body = await readBounded(request.body);
    if (body === null) return new Response(null, {status: 413});
    const encoder = new TextEncoder();
    const prefix = encoder.encode(timestamp + ".");
    const signed = new Uint8Array(prefix.length + body.length);
    signed.set(prefix);
    signed.set(body, prefix.length);
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(env.WEBHOOK_KEY), {name: "HMAC", hash: "SHA-256"}, false, ["verify"],
    );
    const expected = Uint8Array.from(signature.match(/../g), hex => parseInt(hex, 16));
    if (!await crypto.subtle.verify("HMAC", key, expected, signed)) {
      return new Response(null, {status: 401});
    }
    try {
      // No caller-supplied destination or credentials enter the service request.
      // The bound service deduplicates event IDs within the signature validity window.
      return await env.BACKEND.fetch("https://backend.example.invalid/events", {
        method: "POST", body, headers: {"Content-Type": "application/json"},
      });
    } catch {
      return new Response(null, {status: 502});
    }
  },
};
