export type TelegramLaunchContext =
  | {
      kind: "telegram";
      initData: string;
      acquisitionSource?: string;
    }
  | {
      kind: "outside_telegram";
    };

const TELEGRAM_SDK_SRC = "https://service-3f00c5a2.example.invalid/js/telegram-web-app.js?63";
const TELEGRAM_SDK_ID = "academy-telegram-web-app-sdk";

export function initializeTelegramWebApp(): TelegramLaunchContext {
  const webApp = window.Telegram?.WebApp;

  initializeLoadedTelegramWebApp();

  const initData = webApp?.initData?.trim() || readTelegramInitDataFromUrl();

  if (!initData) {
    return { kind: "outside_telegram" };
  }

  // Do not let the external Telegram SDK block Academy startup.
  // The bootstrap request starts in the current task; SDK loading begins later.
  window.setTimeout(loadTelegramSdkInBackground, 0);

  return {
    kind: "telegram",
    initData,
    acquisitionSource: readAcquisitionSource(),
  };
}

export function openExternalLink(url: string): void {
  const webApp = window.Telegram?.WebApp;

  if (webApp?.openLink) {
    webApp.openLink(url, { try_instant_view: false });
    return;
  }

  window.location.assign(url);
}

function loadTelegramSdkInBackground(): void {
  if (window.Telegram?.WebApp) {
    initializeLoadedTelegramWebApp();
    return;
  }

  if (document.getElementById(TELEGRAM_SDK_ID)) {
    return;
  }

  const script = document.createElement("script");

  script.id = TELEGRAM_SDK_ID;
  script.src = TELEGRAM_SDK_SRC;
  script.async = true;

  script.addEventListener(
    "load",
    () => {
      initializeLoadedTelegramWebApp();
    },
    { once: true },
  );

  document.head.appendChild(script);
}

function initializeLoadedTelegramWebApp(): void {
  const webApp = window.Telegram?.WebApp;

  webApp?.ready?.();
  webApp?.expand?.();
}

function readTelegramInitDataFromUrl(): string | undefined {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  const initData =
    hashParams.get("tgWebAppData") ??
    searchParams.get("tgWebAppData");

  const trimmed = initData?.trim();
  return trimmed || undefined;
}

function readAcquisitionSource(): string | undefined {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  const source =
    searchParams.get("source") ??
    hashParams.get("source") ??
    hashParams.get("tgWebAppStartParam") ??
    searchParams.get("tgWebAppStartParam") ??
    searchParams.get("start") ??
    hashParams.get("start");

  const trimmed = source?.trim();
  return trimmed || undefined;
}