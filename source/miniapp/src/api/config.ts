export function functionUrl(
  functionName:
    | "bootstrap"
    | "complete-promo-live"
    | "complete-module-1-task"
    | "complete-module-1"
    | "complete-task"
    | "complete-step"
    | "reset-progress"
    | "module-redirect"
    | "submit-practical-qa"
    | "get-module-progress",
): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is not configured.");
  }

  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1/${functionName}`;
}

export function isModuleOneTestOpenEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_MODULE_1_TEST_OPEN === "true";
}
