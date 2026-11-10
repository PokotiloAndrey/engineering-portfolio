import { functionUrl } from "./config";
import type { ModuleOneTask, ModuleOneTaskKey } from "../types/journey";

export type CompleteModuleOneTaskResponse = {
  task_completed_now: boolean;
  module_1_tasks: ModuleOneTask[];
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const TASK_COMPLETION_TIMEOUT_MS = 10_000;

export async function completeModuleOneTask(input: {
  initData: string;
  taskKey: ModuleOneTaskKey;
}, options: {
  endpointUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
} = {}): Promise<CompleteModuleOneTaskResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? TASK_COMPLETION_TIMEOUT_MS,
  );

  try {
    const response = await fetchImpl(options.endpointUrl ?? functionUrl("complete-module-1-task"), {
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

    return (await response.json()) as CompleteModuleOneTaskResponse;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Guardar el checklist tardó demasiado. Inténtalo de nuevo.", {
        cause: error,
      });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("No pudimos guardar tu checklist.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos guardar tu checklist.";
  } catch {
    return "No pudimos guardar tu checklist.";
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
