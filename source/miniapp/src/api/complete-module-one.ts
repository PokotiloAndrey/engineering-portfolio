import { functionUrl } from "./config";
import type { BootstrapResponse } from "../types/journey";

export type CompleteModuleOneResponse = BootstrapResponse & {
  module_1_completed_now: boolean;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const MODULE_ONE_COMPLETION_TIMEOUT_MS = 10_000;

export async function completeModuleOne(input: {
  initData: string;
}, options: {
  endpointUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
} = {}): Promise<CompleteModuleOneResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? MODULE_ONE_COMPLETION_TIMEOUT_MS,
  );

  try {
    const response = await fetchImpl(options.endpointUrl ?? functionUrl("complete-module-1"), {
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

    return (await response.json()) as CompleteModuleOneResponse;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Completar Módulo 1 tardó demasiado. Inténtalo de nuevo.", {
        cause: error,
      });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("No pudimos completar Módulo 1.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos completar Módulo 1.";
  } catch {
    return "No pudimos completar Módulo 1.";
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
