import { ArrowRight, CheckCircle2, Circle, LockKeyhole } from "lucide-react";

import { StatusBadge } from "@/components/journey/status-badge";
import { localizedStepTitle, useStrings } from "@/i18n";
import type { JourneyStep as JourneyStepType, StepStatus } from "@/types/journey";

export function JourneyStep({
  onOpen,
  step,
}: {
  onOpen?: () => void;
  step: JourneyStepType;
}) {
  const strings = useStrings();
  const content = (
    <>
      <StatusIcon status={step.status} />

      <div className="min-w-0 flex-1 text-left">
        <p className="text-sm font-medium leading-5">
          {localizedStepTitle(strings, step)}
        </p>
        <StatusBadge status={step.status} />
      </div>

      {onOpen ? <ArrowRight className="size-4 shrink-0 text-muted-foreground" /> : null}
    </>
  );

  if (onOpen) {
    return (
      <li>
        <button
          className="flex min-h-16 w-full items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground transition-colors hover:bg-muted/50"
          type="button"
          data-analytics-id={`journey.open.${step.key}`}
          onClick={onOpen}
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li
      className={`flex min-h-16 items-center gap-3 rounded-lg border bg-card p-3 ${
        step.status === "locked" ? "opacity-55" : ""
      }`}
    >
      {content}
    </li>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="size-4" />
      </div>
    );
  }

  if (status === "available" || status === "in_progress") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Circle className="size-4 fill-current" />
      </div>
    );
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <LockKeyhole className="size-4" />
    </div>
  );
}
