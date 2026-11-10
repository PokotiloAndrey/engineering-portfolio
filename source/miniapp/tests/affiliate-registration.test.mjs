import assert from "node:assert/strict";
import { URL } from "node:url";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildAffiliateRegistrationUrl,
  AFFILIATE_REGISTRATION_LINK,
} from "../src/lib/affiliate-registration.ts";

const base = {
  telegramUserId: 9263507963,
  studentAcquisitionSource: null,
  language: "en",
};

function redirect(input) {
  return buildAffiliateRegistrationUrl({ ...base, ...input });
}

test("routes Indonesian funnel to /go/affiliate with per-user ID and source=id", () => {
  assert.equal(
    redirect({ studentAcquisitionSource: "id" }),
    "https://api.partner-platform.example.invalid/go/affiliate?chat_id=example&source=id",
  );
});

test("routes Spanish and Brazilian funnels through tracked redirects", () => {
  assert.equal(new URL(redirect({ studentAcquisitionSource: "es" })).searchParams.get("source"), "es");
  assert.equal(new URL(redirect({ studentAcquisitionSource: "br" })).searchParams.get("source"), "br");
  assert.equal(new URL(redirect({ studentAcquisitionSource: "pt-BR" })).searchParams.get("source"), "br");
});

test("stored acquisition source beats launch param and display language", () => {
  assert.equal(
    redirect({ studentAcquisitionSource: "id", launchAcquisitionSource: "es", language: "pt-BR" }),
    "https://api.partner-platform.example.invalid/go/affiliate?chat_id=example&source=id",
  );
});

test("launch source takes precedence over changed UI language when student source absent", () => {
  assert.equal(new URL(redirect({ launchAcquisitionSource: "id", language: "es" })).searchParams.get("source"), "id");
});

test("recognized UI language is a last resort for missing funnel data", () => {
  assert.equal(new URL(redirect({ language: "id" })).searchParams.get("source"), "id");
  assert.equal(new URL(redirect({ language: "pt-BR" })).searchParams.get("source"), "br");
  assert.equal(new URL(redirect({ language: "es" })).searchParams.get("source"), "es");
  assert.equal(redirect({ language: "en" }), null);
});

test("rejects unsafe identities instead of falling back to static shared partner IDs", () => {
  for (const telegramUserId of [0, -1, NaN, Infinity, 4.25, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(redirect({ telegramUserId, studentAcquisitionSource: "id" }), null);
  }
});

test("partner signup links follow the language resolved by bootstrap", () => {
  const expectedByLanguage = {
    en: "https://service-6a2bdae2.example.invalid/en?ref=example",
    "es-MX": "https://service-6a2bdae2.example.invalid/es?ref=example",
    id: "https://service-6a2bdae2.example.invalid/id?ref=example",
    "pt-BR": "https://service-6a2bdae2.example.invalid/pt?ref=example",
  };

  for (const [language, expectedUrl] of Object.entries(expectedByLanguage)) {
    const source = readFileSync(new URL(`../src/i18n/${language}.ts`, import.meta.url), "utf8");
    assert.ok(source.includes(`url: "${expectedUrl}"`), language);
    assert.ok(!source.includes(`url: "${AFFILIATE_REGISTRATION_LINK}"`), language);
    const parsed = new URL(expectedUrl);
    assert.equal(parsed.searchParams.get("ref"), "87868170b544");
    assert.equal(parsed.searchParams.has("sa"), false);
    assert.deepEqual([...parsed.searchParams.keys()], ["ref"]);
  }

  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /languageFromResponse\(data\.resolved_language\)/);
  assert.match(app, /<I18nProvider language=\{language\}>/);
});

test("homework link remains tracked with the original analytics identifier", () => {
  const source = readFileSync(new URL("../src/screens/step-screen.tsx", import.meta.url), "utf8");
  assert.match(source, /data-analytics-id=\{`homework\.link\.\$\{taskKey\}\.\$\{index \+ 1\}`\}/);
  assert.match(source, /href=\{url\}/);
});
