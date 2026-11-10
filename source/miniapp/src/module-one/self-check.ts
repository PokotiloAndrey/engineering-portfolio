import type { TranslationStrings } from "../i18n";
import type { StepTask, StepTaskKey } from "../types/journey";

export type ModuleOneCompletionState = "idle" | "submitting" | "error";

export function moduleOneCompletedTaskCount(tasks: StepTask[]): number {
  return tasks.filter((task) => task.completed).length;
}

export function canCompleteModuleOne(tasks: StepTask[]): boolean {
  return canCompleteRequiredTasks(tasks, 2);
}

export function canCompleteRequiredTasks(tasks: StepTask[], requiredCount: number): boolean {
  return tasks.length === requiredCount && tasks.every((task) => task.completed);
}

export function hasPendingTask(tasks: StepTask[], pendingTaskKeys: StepTaskKey[]): boolean {
  return tasks.some((task) => pendingTaskKeys.includes(task.key));
}

export function canCompleteRequiredTasksWithoutPending(
  tasks: StepTask[],
  requiredCount: number,
  pendingTaskKeys: StepTaskKey[],
): boolean {
  return canCompleteRequiredTasks(tasks, requiredCount) && !hasPendingTask(tasks, pendingTaskKeys);
}

export function canSubmitTaskCompletion({
  pendingTaskKeys,
  task,
}: {
  pendingTaskKeys: StepTaskKey[];
  task: StepTask;
}): boolean {
  return (
    (!task.completed || task.status === "revision_required") &&
    task.status !== "locked" &&
    !pendingTaskKeys.includes(task.key)
  );
}

export function updateTaskCompletionState(
  tasks: StepTask[],
  taskKey: StepTaskKey,
  completed: boolean,
  completedAt: string | null,
): StepTask[] {
  return tasks.map((task) =>
    task.key === taskKey
      ? {
          ...task,
          completed,
          completed_at: completedAt,
        }
      : task,
  );
}

export function moduleOneCompleteButtonLabel(
  state: ModuleOneCompletionState,
  strings: TranslationStrings,
): string {
  if (state === "submitting") {
    return strings.completingModuleOne;
  }

  if (state === "error") {
    return strings.retryCompleteModuleOne;
  }

  return strings.completeModuleOne;
}
