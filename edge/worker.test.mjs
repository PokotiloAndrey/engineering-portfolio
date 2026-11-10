import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import test from "node:test";
import worker from "./worker.mjs";

const demoKey = "fixture-key";
const body = '{"event_id":"demo-01","type":"registered"}';

function request(text, offset = 0, digestBody = text) {
  const now = String(Math.floor(Date.now()/1000) + offset);
  return new Request("https://gateway.example.invalid/events", {
    method: "POST", body: text,
    headers: {
      "X-Event-Timestamp": now,
      "X-Event-Signature": createHmac("sha256", demoKey).update(now + "." + digestBody).digest("hex"),
      Authorization: "fixture-client-header",
    },
  });
}

test("signed payload is routed to the configured service with minimal headers", async () => {
  const result = await worker.fetch(request(body), {
    WEBHOOK_KEY: demoKey,
    BACKEND: {fetch: async (url, init) => {
      assert.equal(new URL(url).pathname, "/events");
      assert.deepEqual(Object.keys(init.headers), ["Content-Type"]);
      assert.equal(new TextDecoder().decode(init.body), body);
      return new Response(null, {status: 202});
    }},
  });
  assert.equal(result.status, 202);
});

test("stale and tampered requests do not call the backend", async () => {
  let calls = 0;
  const env = {WEBHOOK_KEY: demoKey, BACKEND: {fetch: async () => {
    calls++;
    return new Response(null, {status: 202});
  }}};
  assert.equal((await worker.fetch(request(body, -601), env)).status, 401);
  assert.equal((await worker.fetch(request(body + "x", 0, body), env)).status, 401);
  assert.equal((await worker.fetch(request("x".repeat(65537)), env)).status, 413);
  assert.equal(calls, 0);
});

test("isolated release requires a pinned image and refuses public routes", async () => {
  const {previewConfig} = await import("./release.mjs");
  const args = {
    workerName: "preview-smoke",
    image: "registry.example.invalid/demo/service@sha256:" + "a".repeat(64),
    liveEnabled: false,
  };
  assert.equal(previewConfig(args).workers_dev, false);
  assert.throws(() => previewConfig({...args, image: "service:latest"}), /digest/);
  assert.throws(() => previewConfig({...args, routes: ["example.invalid/*"]}), /routes/);
  assert.throws(() => previewConfig({...args, liveEnabled: true}), /disabled/);
});
