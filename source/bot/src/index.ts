import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import { loadBotEnv } from "./env.js";
import { botMessages } from "./locales/es-MX.js";

export function createBot(token: string, miniAppUrl: string) {
  const bot = new Bot(token);

  bot.command("start", async (ctx) => {
    const startParam = typeof ctx.match === "string" ? ctx.match.trim() : "";
    const keyboard = new InlineKeyboard().webApp(
      botMessages.openAcademy,
      academyUrlWithStartParam(miniAppUrl, startParam),
    );

    await ctx.reply(botMessages.welcome, {
      reply_markup: keyboard,
    });
  });

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}`);

    if (err.error instanceof GrammyError) {
      console.error("Telegram API error:", err.error.description);
      return;
    }

    if (err.error instanceof HttpError) {
      console.error("HTTP error while contacting Telegram:", err.error);
      return;
    }

    console.error("Unknown bot error:", err.error);
  });

  return bot;
}

async function main() {
  const env = loadBotEnv();
  const bot = createBot(env.TELEGRAM_BOT_TOKEN, env.MINI_APP_URL);

  console.info("Starting Partner Academy bot.");
  await bot.start();
}

void main();

export function academyUrlWithStartParam(miniAppUrl: string, startParam: string): string {
  const url = new URL(miniAppUrl);
  const sanitized = sanitizeStartParam(startParam);

  if (sanitized) {
    url.searchParams.set("start", sanitized);
  }

  return url.toString();
}

function sanitizeStartParam(startParam: string): string {
  return startParam.replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 120);
}
