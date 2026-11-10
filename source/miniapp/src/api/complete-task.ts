import { functionUrl } from "./config";
import type {
  JourneyStep,
  StepTaskKey,
  Student,
  TasksByStep,
} from "../types/journey";

export type CompleteTaskResponse = {
  task_completed_now: boolean;
  task_resubmitted_now?: boolean;
  tasks_by_step: TasksByStep;
  student?: Student;
  journey?: JourneyStep[];
  current_step?: JourneyStep | null;
  step_completed_now?: boolean;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
const TASK_COMPLETION_TIMEOUT_MS = 10_000;

export async function completeTask(input: {
  initData: string;
  taskKey: StepTaskKey;
  submission?: Record<string, string>;
  checklistState?: Record<string, boolean>;
}, options: {
  endpointUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
} = {}): Promise<CompleteTaskResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? TASK_COMPLETION_TIMEOUT_MS,
  );

  try {
    const response = await fetchImpl(options.endpointUrl ?? functionUrl("complete-task"), {
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

    return (await response.json()) as CompleteTaskResponse;
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Guardar la tarea tardó demasiado. Inténtalo de nuevo.", {
        cause: error,
      });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("No pudimos guardar tu tarea.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos guardar tu tarea.";
  } catch {
    return "No pudimos guardar tu tarea.";
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
