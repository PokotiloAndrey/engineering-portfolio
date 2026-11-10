import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScreenShell } from "@/components/navigation/screen-shell";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { languageLabel, localizedStepTitle, useStrings } from "@/i18n";
import type { JourneyStep, LanguageCode, Student } from "@/types/journey";

export type ResetProgressState = "idle" | "submitting" | "error";

export function ProfileScreen({
  completedSteps,
  currentStep,
  currentLanguage,
  onBack,
  onOpenLanguage,
  onResetProgress,
  progress,
  resetError,
  resetState,
  student,
  totalSteps,
  onOpenJourney,
  onOpenPlaybook,
  onOpenAchievements,
  onOpenProfile,
}: {
  completedSteps: number;
  currentStep: JourneyStep | null;
  currentLanguage: LanguageCode;
  onBack: () => void;
  onOpenLanguage: () => void;
  onResetProgress: () => void;
  progress: number;
  resetError: string | null;
  resetState: ResetProgressState;
  student: Student;
  totalSteps: number;
  onOpenJourney: () => void;
  onOpenPlaybook: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
}) {
  const strings = useStrings();
  // NOTE: confirmOpen / onResetProgress / resetError / resetState are kept as
  // props and would still be wired correctly if the reset-progress section
  // below is re-enabled — only the JSX rendering it is currently commented out.
  void onResetProgress;
  void resetError;
  void resetState;
  const nav = { onOpenJourney, onOpenPlaybook, onOpenAchievements, onOpenProfile };
  const displayName =
    [student.first_name, student.last_name].filter(Boolean).join(" ").trim() ||
    student.telegram_username ||
    "Streamer";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SA";

  return (
    <ScreenShell activeTab="profile" nav={nav}>
      <ScreenHeader
        navigateUpVariant="home"
        onNavigateUp={onBack}
        title={strings.profileTitle}
      />

      <Card size="sm">
        <CardContent className="space-y-4 pt-4">
          <section className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold">{displayName}</h2>
              {student.telegram_username ? (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  @{student.telegram_username}
                </p>
              ) : null}
            </div>

            <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
              {initials}
            </div>
          </section>

          <Card className="bg-muted/40 py-0">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{strings.yourPath}</p>
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </div>

              <Progress value={progress} />

              <p className="text-sm text-muted-foreground">
                {strings.progressStepsCompleted(completedSteps, totalSteps)}
              </p>
            </CardContent>
          </Card>

          <section className="space-y-2 text-sm">
            {/* TODO: re-enable "Partner Academy / <locale>" row when needed
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{strings.academyLabel}</span>
              <span className="font-medium">{student.locale}</span>
            </div>
            */}

            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">{strings.currentStepLabel}</span>
              <span className="min-w-0 max-w-48 text-right font-medium leading-5">
                {localizedStepTitle(strings, currentStep)}
              </span>
            </div>

            <button
              className="flex w-full items-center justify-between gap-3 rounded-lg py-2 text-left"
              type="button"
              onClick={onOpenLanguage}
            >
              <span className="text-muted-foreground">{strings.languageSettingLabel}</span>
              <span className="flex min-w-0 items-center gap-1 font-medium">
                <span className="truncate">{languageLabel(currentLanguage)}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </span>
            </button>
          </section>

          <Button className="w-full" size="lg" type="button" onClick={onBack}>
            {strings.backToMyJourney}
          </Button>

          {/* TODO: re-enable the entire reset-progress section (Separator +
              title/description + destructive button + confirmation modal)
              when this feature should be available to students again.

          <Separator />

          <section className="space-y-3">
            <div>
              <h2 className="text-base font-semibold">{strings.resetProgressTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {strings.resetProgressDescription}
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              type="button"
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <RotateCcw className="size-4" />
              {strings.resetProgressCta}
            </Button>
          </section>
          */}
        </CardContent>
      </Card>

      {/* TODO: re-enable the reset-progress confirmation modal together with
          the section above (requires restoring `const [confirmOpen, setConfirmOpen] = useState(false);`
          near the top of this component).

      {confirmOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end bg-black/50 px-4 py-5 sm:items-center"
          role="dialog"
        >
          <Card className="mx-auto w-full max-w-md">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    {strings.resetProgressConfirmTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {strings.resetProgressConfirmBody}
                  </p>
                </div>
              </div>

              {resetError ? (
                <Alert variant="destructive">
                  <AlertDescription>{resetError}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid grid-cols-1 gap-3">
                <Button
                  className="w-full"
                  disabled={resetState === "submitting"}
                  size="lg"
                  type="button"
                  variant="destructive"
                  onClick={onResetProgress}
                >
                  {resetState === "submitting"
                    ? strings.resettingProgress
                    : strings.resetProgressConfirmCta}
                </Button>

                <Button
                  className="w-full"
                  disabled={resetState === "submitting"}
                  size="lg"
                  type="button"
                  variant="secondary"
                  onClick={() => setConfirmOpen(false)}
                >
                  {strings.cancel}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
      */}
    </ScreenShell>
  );
}