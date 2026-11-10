import { functionUrl } from "./config";
import type { BootstrapResponse, LanguageCode } from "../types/journey";

export async function bootstrapAcademy(input: {
  initData: string;
  acquisitionSource?: string;
  markWelcomeStarted?: boolean;
  preferredLanguage?: LanguageCode;
  logOpenEvents?: boolean;
}): Promise<BootstrapResponse> {
  const response = await fetch(functionUrl("bootstrap"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  return (await response.json()) as BootstrapResponse;
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos cargar tu Academy.";
  } catch {
    return "No pudimos cargar tu Academy.";
  }
}
