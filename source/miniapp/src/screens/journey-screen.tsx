import { BookOpen, ChevronRight, MessageCircleQuestion } from "lucide-react";

import { ScreenShell } from "@/components/navigation/screen-shell";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { JourneyStep } from "@/components/journey/journey-step";
import { quoteForDate } from "@/lib/daily-quote";
import { useStrings } from "@/i18n";
import { canOpenStepDetail } from "@/navigation";
import type { JourneyStep as JourneyStepType } from "@/types/journey";

export function JourneyScreen({
  completedSteps,
  currentStep,
  firstName,
  onOpenStep,
  onOpenJourney,
  onOpenAchievements,
  onOpenProfile,
  onOpenPlaybook,
  onOpenPracticalQa,
  playbookAvailable,
  practicalQaAvailable,
  notice,
  totalSteps,
  visibleSteps,
}: {
  completedSteps: number;
  currentStep: JourneyStepType | null;
  firstName: string;
  notice?: string | null;
  onOpenJourney: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
  onOpenPlaybook: () => void;
  onOpenPracticalQa: () => void;
  playbookAvailable: boolean;
  practicalQaAvailable: boolean;
  onOpenStep: (stepKey: string) => void;
  totalSteps: number;
  visibleSteps: JourneyStepType[];
}) {
  const strings = useStrings();
  const nav = { onOpenJourney, onOpenPlaybook, onOpenAchievements, onOpenProfile };
  const quote = quoteForDate(strings.dailyQuotes);

  // NOTE: currentStep is kept in the props (App.tsx still passes it) but is
  // not rendered right now — the old <CurrentStepCard> "next step" block
  // that used it (and localizedStepTitle) was removed when the progress
  // card was redesigned with CircularProgress + the daily quote. If you
  // want the "next step" card back, restore both the import of
  // CurrentStepCard/localizedStepTitle and the JSX block, and delete this
  // void line.
  void currentStep;

  return (
    <ScreenShell activeTab="journey" nav={nav}>
      <ScreenHeader
        subtitle={`${strings.greeting}, ${firstName}`}
        title={strings.productName}
      />

      {notice ? (
        <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
          {notice}
        </div>
      ) : null}

      <Card size="sm">
        <CardContent className="flex items-center gap-4 py-4">
          <CircularProgress completedSteps={completedSteps} totalSteps={totalSteps} />

          <div className="-ml-1 shrink-0">
            <p className="text-sm text-muted-foreground">{strings.progressLabel}</p>
            <CardTitle className="mt-0.5 text-base">
              {strings.progressSteps(completedSteps, totalSteps)}
            </CardTitle>
          </div>

          <div className="min-w-0 flex-1 border-l border-border pl-4">
            <p className="text-xs font-medium text-muted-foreground">
              {strings.todaysQuoteLabel}
            </p>
            <p
              className="mt-0.5 leading-5 text-foreground line-clamp-3"
              style={{ fontSize: "clamp(0.6875rem, 2.6vw, 0.875rem)" }}
            >
              {quote}
            </p>
          </div>
        </CardContent>
      </Card>

      {practicalQaAvailable ? (
        <button
          className="flex w-full items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-left transition hover:bg-primary/10"
          type="button"
          data-analytics-id="journey.open_practical_qa"
          onClick={onOpenPracticalQa}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <MessageCircleQuestion className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{strings.practicalQaTitle}</span>
            <span className="mt-1 block text-xs leading-4 text-muted-foreground">
              {strings.practicalQaJourneyDescription}
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      ) : null}

      {playbookAvailable ? (
        <button
          className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition hover:bg-muted/60"
          type="button"
          data-analytics-id="journey.open_playbook"
          onClick={onOpenPlaybook}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
            <BookOpen className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{strings.playbookTitle}</span>
            <span className="mt-1 block text-xs leading-4 text-muted-foreground">
              {strings.playbookJourneyDescription}
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      ) : null}

      <section>
        <div className="mb-2">
          <h2 className="text-xl font-semibold">{strings.yourPath}</h2>
        </div>

        <ol className="flex flex-col gap-2">
          {visibleSteps.map((step) => (
            <JourneyStep
              key={step.key}
              step={step}
              onOpen={
                canOpenStepDetail(step) ? () => onOpenStep(step.key) : undefined
              }
            />
          ))}
        </ol>
      </section>
    </ScreenShell>
  );
}
