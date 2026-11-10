import { functionUrl } from "./config";

export type ModuleProgressResponse = {
  highest_module_reached: number;
  last_event_name: string | null;
  last_event_at: string | null;
};

export async function getModuleProgress(input: {
  initData: string;
}): Promise<ModuleProgressResponse> {
  const response = await fetch(functionUrl("get-module-progress"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  return (await response.json()) as ModuleProgressResponse;
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos cargar tu progreso.";
  } catch {
    return "No pudimos cargar tu progreso.";
  }
}
