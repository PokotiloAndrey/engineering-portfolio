import { functionUrl } from "./config";
import type { BootstrapResponse, SupportedTaskStepKey } from "../types/journey";

export type CompleteStepResponse = BootstrapResponse & {
  step_completed_now: boolean;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const STEP_COMPLETION_TIMEOUT_MS = 10_000;

export async function completeStep(input: {
  initData: string;
  stepKey: SupportedTaskStepKey;
}, options: {
  endpointUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
} = {}): Promise<CompleteStepResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? STEP_COMPLETION_TIMEOUT_MS,
  );

  try {
    const response = await fetchImpl(options.endpointUrl ?? functionUrl("complete-step"), {
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

    return (await response.json()) as CompleteStepResponse;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Completar el paso tardó demasiado. Inténtalo de nuevo.", {
        cause: error,
      });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("No pudimos completar este paso.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos completar este paso.";
  } catch {
    return "No pudimos completar este paso.";
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
