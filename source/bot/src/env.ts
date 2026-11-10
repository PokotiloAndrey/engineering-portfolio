import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../..", import.meta.url));
const rootEnvPath = resolve(rootDir, ".env");

if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

export type BotEnv = {
  TELEGRAM_BOT_TOKEN: string;
  MINI_APP_URL: string;
};

export function loadBotEnv(): BotEnv {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const miniAppUrl = process.env.MINI_APP_URL?.trim();

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is required to start the bot.");
  }

  if (!miniAppUrl) {
    throw new Error("MINI_APP_URL is required to start the bot.");
  }

  try {
    new URL(miniAppUrl);
  } catch {
    throw new Error("MINI_APP_URL must be a valid URL.");
  }

  return {
    TELEGRAM_BOT_TOKEN: token,
    MINI_APP_URL: miniAppUrl,
  };
}
