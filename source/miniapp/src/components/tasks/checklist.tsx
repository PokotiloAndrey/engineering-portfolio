import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localizedTaskTitle, useStrings } from "@/i18n";
import { cn } from "@/lib/utils";
import type { StepTask, StepTaskKey } from "@/types/journey";

export function Checklist({
  disabled,
  onCompleteTask,
  pendingTaskKeys,
  tasks,
}: {
  disabled?: boolean;
  onCompleteTask: (taskKey: StepTaskKey) => void;
  pendingTaskKeys: StepTaskKey[];
  tasks: StepTask[];
}) {
  const strings = useStrings();

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const isSubmitting = pendingTaskKeys.includes(task.key);
        const isDisabled = disabled || task.completed || task.status === "locked" || isSubmitting;

        return (
          <Button
            key={task.key}
            aria-pressed={task.completed}
            className={cn(
              "h-auto min-h-12 w-full justify-start gap-3 px-3 py-3 text-left font-medium",
              task.completed ? "border-success/50 bg-success/10 text-foreground" : "bg-card",
            )}
            disabled={isDisabled}
            type="button"
            variant="outline"
            onClick={() => onCompleteTask(task.key)}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded border",
                task.completed
                  ? "border-success bg-success text-success-foreground"
                  : "border-muted-foreground/40",
              )}
            >
              {task.completed ? <Check className="size-3.5" /> : null}
            </span>
            <span className="min-w-0 flex-1 text-wrap leading-5">
              {isSubmitting
                ? strings.saving
                : task.status === "locked"
                  ? strings.moduleLocked
                  : localizedTaskTitle(strings, task)}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
