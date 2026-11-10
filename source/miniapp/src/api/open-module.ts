import { functionUrl } from "./config";

export type OpenModuleResponse = {
  redirect_url: string;
};

export type ModuleKey =
  | "module_1"
  | "module_2"
  | "module_3"
  | "module_4";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const MODULE_OPEN_TIMEOUT_MS = 10_000;

export async function openModuleOne(
  input: {
    initData: string;
    acquisitionSource?: string;
    moduleKey?: ModuleKey;
  },
  options: {
    endpointUrl?: string;
    fetchImpl?: FetchLike;
    timeoutMs?: number;
  } = {},
): Promise<OpenModuleResponse> {
  const controller = new AbortController();
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? MODULE_OPEN_TIMEOUT_MS);

  try {
    const response = await fetchImpl(options.endpointUrl ?? functionUrl("module-redirect"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initData: input.initData,
        moduleKey: input.moduleKey ?? "module_1",
        acquisitionSource: input.acquisitionSource,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await responseError(response));
    }

    const body = (await response.json()) as { redirect_url?: unknown };

    if (typeof body.redirect_url !== "string" || !body.redirect_url.trim()) {
      throw new Error("No pudimos abrir el módulo.");
    }

    return {
      redirect_url: body.redirect_url,
    };
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error("Abrir el módulo tardó demasiado. Inténtalo de nuevo.", { cause: error });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("No pudimos abrir el módulo.", { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : "No pudimos abrir el módulo.";
  } catch {
    return "No pudimos abrir el módulo.";
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
