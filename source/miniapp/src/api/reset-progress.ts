import { functionUrl } from "./config";
import type { BootstrapResponse } from "../types/journey";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const RESET_PROGRESS_TIMEOUT_MS = 10_000;

export async function resetProgress(input: {
  initData: string;
}, options: {
  endpointUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
} = {}): Promise<BootstrapResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? RESET_PROGRESS_TIMEOUT_MS,
  );

  try {
    const response = await fetchImpl(options.endpointUrl ?? functionUrl("reset-progress"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await responseError(response));
    }

    return (await response.json()) as BootstrapResponse;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Reiniciar tu progreso tardó demasiado. Inténtalo de nuevo.", {
        cause: error,
      });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("No pudimos reiniciar tu progreso.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos reiniciar tu progreso.";
  } catch {
    return "No pudimos reiniciar tu progreso.";
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
