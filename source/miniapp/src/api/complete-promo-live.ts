import { functionUrl } from "./config";
import type { BootstrapResponse } from "../types/journey";

export type CompletePromoLiveResponse = BootstrapResponse & {
  promo_live_completed_now: boolean;
};

export async function completePromoLive(input: {
  initData: string;
}): Promise<CompletePromoLiveResponse> {
  const response = await fetch(functionUrl("complete-promo-live"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  return (await response.json()) as CompletePromoLiveResponse;
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos completar el Promo Live.";
  } catch {
    return "No pudimos completar el Promo Live.";
  }
}
