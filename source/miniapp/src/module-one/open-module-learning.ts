import { openModuleOne, type ModuleKey, type OpenModuleResponse } from "../api/open-module";
import type { TranslationStrings } from "../i18n";
import { openExternalLink } from "../telegram/web-app";

export type ModuleOpenState = "idle" | "submitting" | "error";

export function canSubmitModuleOpen({
  canOpen,
  inFlight,
  state,
}: {
  canOpen: boolean;
  inFlight: boolean;
  state: ModuleOpenState;
}): boolean {
  return canOpen && !inFlight && state !== "submitting";
}

export function moduleOpenButtonLabel(
  state: ModuleOpenState,
  strings: TranslationStrings,
): string {
  if (state === "submitting") {
    return strings.openingModuleOne;
  }

  if (state === "error") {
    return strings.retry;
  }

  return strings.openModuleOne;
}

export async function openModuleLearningDestination(
  input: {
    initData: string;
    acquisitionSource?: string;
    moduleKey?: ModuleKey;
  },
  options: {
    openExternalLinkImpl?: (url: string) => void;
    openTrackedModule?: typeof openModuleOne;
  } = {},
): Promise<OpenModuleResponse> {
  const result = await (options.openTrackedModule ?? openModuleOne)(input);
  (options.openExternalLinkImpl ?? openExternalLink)(result.redirect_url);
  return result;
}
