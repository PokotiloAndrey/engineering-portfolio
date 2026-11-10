import type { LanguageCode } from "../types/journey";

export const AFFILIATE_REGISTRATION_LINK = "affiliate-registration";

type AffiliateSource = "es" | "id" | "br";

function parseAffiliateSource(value: string | null | undefined): AffiliateSource | null {
  const source = value?.trim().toLowerCase();
  switch (source) {
    case "id":
    case "stokiti":
      return "id";
    case "es":
    case "latam":
      return "es";
    case "br":
    case "pt-br":
    case "pt_br":
      return "br";
    default:
      return null;
  }
}

export function buildAffiliateRegistrationUrl(input: {
  telegramUserId: number;
  studentAcquisitionSource: string | null;
  launchAcquisitionSource?: string;
  language: LanguageCode;
}): string | null {
  // Prefer the funnel stored during authenticated bootstrap. Changing the
  // app's display language must not silently switch the affiliate market.
  const source =
    parseAffiliateSource(input.studentAcquisitionSource) ??
    parseAffiliateSource(input.launchAcquisitionSource) ??
    (input.language === "id"
      ? "id"
      : input.language === "pt-BR"
        ? "br"
        : input.language === "es"
          ? "es"
          : null);

  // Never substitute a shared affiliate ID or send an untracked direct link.
  if (
    !source ||
    !Number.isSafeInteger(input.telegramUserId) ||
    input.telegramUserId <= 0
  ) {
    return null;
  }

  const params = new URLSearchParams({
    chat_id: String(input.telegramUserId),
    source,
  });

  return `https://api.partner-platform.example.invalid/go/affiliate?${params.toString()}`;
}
