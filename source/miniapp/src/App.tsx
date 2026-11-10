import { startAnalytics, trackScreen, trackContent } from "@/lib/analytics";
import { buildAffiliateRegistrationUrl } from "@/lib/affiliate-registration";
import { BookOpen, CheckCircle2, MessageCircleQuestion, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";


import { bootstrapAcademy } from "@/api/bootstrap";
import { getModuleProgress } from "@/api/get-module-progress";
import { resetProgress } from "@/api/reset-progress";
import { submitPracticalQa } from "@/api/submit-practical-qa";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  I18nProvider,
  languageFromResponse,
  strings as defaultStrings,
  useStrings,
} from "@/i18n";
import {
  createJourneyViewState,
  currentStepForDetail,
  openAchievementsScreen,
  openJourneyScreen,
  openLanguageSelection,
  openStepDetail,
  openProfileScreen,
  openPlaybookScreen,
  openPracticalQaScreen,
  returnToJourneyScreen,
  selectedStep,
  visibleJourneySteps,
} from "@/navigation";
import { JourneyScreen } from "@/screens/journey-screen";
import { LanguageScreen, type LanguageSaveState } from "@/screens/language-screen";
import { ProfileScreen, type ResetProgressState } from "@/screens/profile-screen";
import { PlaybookScreen } from "@/screens/playbook-screen";
import { PracticalQaScreen } from "@/screens/practical-qa-screen";
import { AchievementsScreen } from "@/screens/achievements-screen";
import { buildAchievements } from "@/achievements/achievements-data";
import { StepScreen } from "@/screens/step-screen";
import { WelcomeScreen, type WelcomeStartState } from "@/screens/welcome-screen";
import {
  initializeTelegramWebApp,
  type TelegramLaunchContext,
} from "@/telegram/web-app";
import type { BootstrapResponse, LanguageCode } from "@/types/journey";
import type { SupportedTaskStepKey } from "@/types/journey";
import type { PracticalQaMetrics, PracticalQaSubmissionInput } from "@/types/practical-qa";


type AppState =
  | { status: "loading"; launchContext: TelegramLaunchContext | null }
  | { status: "outside_telegram" }
  | {
      status: "error";
      message: string;
      launchContext: TelegramLaunchContext | null;
    }
  | {
      status: "ready";
      data: BootstrapResponse;
      launchContext: Extract<TelegramLaunchContext, { kind: "telegram" }>;
    };


export function App() {
  const [state, setState] = useState<AppState>({
    status: "loading",
    launchContext: null,
  });


  const loadAcademy = useCallback(
    async (existingContext?: TelegramLaunchContext) => {
      const launchContext = existingContext ?? initializeTelegramWebApp();


      if (launchContext.kind === "outside_telegram") {
        setState({ status: "outside_telegram" });
        return;
      }


      setState({ status: "loading", launchContext });


      try {
        const data = await bootstrapAcademy({
          initData: launchContext.initData,
          acquisitionSource: launchContext.acquisitionSource,
        });


        startAnalytics(launchContext.initData);
        setState({
          status: "ready",
          data,
          launchContext,
        });
      } catch {
        setState({
          status: "error",
          message: defaultStrings.loadError,
          launchContext,
        });
      }
    },
    [],
  );


  useEffect(() => {
    let cancelled = false;


    queueMicrotask(() => {
      if (!cancelled) {
        void loadAcademy();
      }
    });


    return () => {
      cancelled = true;
    };
  }, [loadAcademy]);


  // NOTE: Progress is now written exclusively by an external webhook
  // (Chatterfy → Supabase `student_steps`), not by any button inside this
  // Mini App. To reflect changes made externally while the app is already
  // open (without requiring the user to fully close and reopen it), we
  // re-run bootstrap whenever the WebView regains visibility/focus.
  const readyLaunchContext = state.status === "ready" ? state.launchContext : null;


  useEffect(() => {
    if (!readyLaunchContext) {
      return;
    }


    const refresh = () => {
      if (document.visibilityState === "visible") {
        void loadAcademy(readyLaunchContext);
      }
    };


    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);


    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [readyLaunchContext, loadAcademy]);


  if (state.status === "outside_telegram") {
    return (
      <CenteredShell>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Sparkles className="size-5" />
          </div>


          <div>
            <h1 className="text-xl font-semibold">
              {defaultStrings.outsideTelegramTitle}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {defaultStrings.outsideTelegramBody}
            </p>
          </div>
        </div>
      </CenteredShell>
    );
  }


  if (state.status === "loading") {
    return <AcademyLoadingState />;
  }


  if (state.status === "error") {
    return (
      <CenteredShell>
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{defaultStrings.loadError}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {defaultStrings.productName}
            </p>
          </div>


          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>


          <Button
            className="w-full"
            type="button"
            onClick={() => void loadAcademy(state.launchContext ?? undefined)}
          >
            <RotateCcw className="size-4" />
            {defaultStrings.retry}
          </Button>
        </div>
      </CenteredShell>
    );
  }


  return (
    <AcademyExperience
      data={state.data}
      launchContext={state.launchContext}
    />
  );
}


function AcademyExperience({
  data,
  launchContext,
}: {
  data: BootstrapResponse;
  launchContext: Extract<TelegramLaunchContext, { kind: "telegram" }>;
}) {
  const [language, setLanguage] = useState<LanguageCode>(() =>
    languageFromResponse(data.resolved_language),
  );


  return (
    <I18nProvider language={language}>
      <AcademyExperienceContent
        data={data}
        language={language}
        launchContext={launchContext}
        setLanguage={setLanguage}
      />
    </I18nProvider>
  );
}


function AcademyExperienceContent({
  data,
  language,
  launchContext,
  setLanguage,
}: {
  data: BootstrapResponse;
  language: LanguageCode;
  launchContext: Extract<TelegramLaunchContext, { kind: "telegram" }>;
  setLanguage: (language: LanguageCode) => void;
}) {
  const strings = useStrings();
  const [viewState, setViewState] = useState(() => createJourneyViewState(data));
  useEffect(() => {
    trackScreen(viewState.screen === "step" ? `step:${viewState.selectedStepKey ?? "unknown"}` : viewState.screen);
    trackContent(viewState.screen === "step" && viewState.selectedStepKey ? "module_or_step" : "",viewState.screen === "step" ? viewState.selectedStepKey ?? "" : "");
  }, [viewState.screen, viewState.selectedStepKey]);
  const [resetProgressState, setResetProgressState] =
    useState<ResetProgressState>("idle");
  const [resetProgressError, setResetProgressError] = useState<string | null>(null);
  const [welcomeStartState, setWelcomeStartState] =
    useState<WelcomeStartState>("idle");
  const [welcomeStartError, setWelcomeStartError] = useState<string | null>(null);
  const [languageSaveState, setLanguageSaveState] =
    useState<LanguageSaveState>("idle");
  const [languageSaveError, setLanguageSaveError] = useState<string | null>(null);
  const [journeyNotice, setJourneyNotice] = useState<string | null>(null);

  // Module stage comes from events → module_progress → get-module-progress.
  // Historic student_steps and homework completion do not grant module access.
  const [moduleProgress, setModuleProgress] = useState(1);
  const loadModuleProgress = useCallback(async () => {
    try {
      const response = await getModuleProgress({ initData: launchContext.initData });
      const reached = Number(response.highest_module_reached);
      if (Number.isInteger(reached) && reached >= 1 && reached <= 4) {
        setModuleProgress((previous) => Math.max(previous, reached));
      }
    } catch {
      // Fail closed: do not grant access from stale student_steps statuses.
    }
  }, [launchContext.initData]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) void loadModuleProgress(); });
    const refresh = () => { if (document.visibilityState === "visible") void loadModuleProgress(); };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [loadModuleProgress]);

  const moduleNumberFromStepKey = (stepKey: string): number | null => {
    const match = /^module_(\d)$/.exec(stepKey);
    return match ? Number(match[1]) : null;
  };
  const isStepUnlockedByChatterfyProgress = (stepKey: string): boolean => {
    const number = moduleNumberFromStepKey(stepKey);
    return number !== null && number <= moduleProgress;
  };

  const firstName =
    viewState.journeyData.student.first_name ??
    viewState.journeyData.student.telegram_username ??
    "Streamer";
  const visibleSteps = visibleJourneySteps(viewState.journeyData.journey).map((step) => ({
    ...step,
    // These are learning stages, not homework completion states.
    status: (isStepUnlockedByChatterfyProgress(step.key) ? "available" : "locked") as typeof step.status,
  }));
  const totalSteps = visibleSteps.length;
  const completedSteps = Math.max(0, Math.min(moduleProgress - 1, totalSteps));
  const progress = totalSteps > 0 ? Math.round(completedSteps / totalSteps * 100) : 0;
  const currentStep = currentStepForDetail(viewState.journeyData);
  const activeStep = selectedStep(
    visibleSteps,
    viewState.selectedStepKey,
  );


  const navigateToJourney = () =>
    setViewState((current) => returnToJourneyScreen(current));
  const navigateToStep = (stepKey: string) => {
    setJourneyNotice(null);
    setViewState((current) => openStepDetail(current, stepKey));
  };
  const navigateToProfile = () => {
    setJourneyNotice(null);
    setResetProgressError(null);
    setLanguageSaveError(null);
    setViewState((current) => openProfileScreen(current));
  };
  const navigateToLanguage = () => {
    setLanguageSaveError(null);
    setViewState((current) => openLanguageSelection(current));
  };
  const navigateToPlaybook = () => {
    setJourneyNotice(null);
    setViewState((current) => openPlaybookScreen(current));
  };
  const navigateToPracticalQa = () => {
    setJourneyNotice(null);
    setViewState((current) => openPracticalQaScreen(current));
  };
  const navigateToAchievements = () => {
    setJourneyNotice(null);
    setViewState((current) => openAchievementsScreen(current));
  };
  const navigateToCurrentRequiredStep = () => {
    if (currentStep?.required && isStepUnlockedByChatterfyProgress(currentStep.key)) {
      navigateToStep(currentStep.key);
      return;
    }


    navigateToJourney();
  };
  const tasksForStep = (stepKey: string) =>
    viewState.journeyData.tasks_by_step?.[stepKey as SupportedTaskStepKey] ??
    (stepKey === "module_1" ? viewState.journeyData.module_1_tasks : []);
  const firstLiveTask = tasksForStep("module_4").find(
    (task) => task.key === "module_4_first_live",
  );
  const suggestedPracticalCase = suggestedCaseFromFirstLive(firstLiveTask?.submission);


  const submitWelcomeStart = async () => {
    if (welcomeStartState === "submitting") {
      return;
    }


    setWelcomeStartState("submitting");
    setWelcomeStartError(null);


    try {
      const updated = await bootstrapAcademy({
        initData: launchContext.initData,
        acquisitionSource: launchContext.acquisitionSource,
        markWelcomeStarted: true,
      });


      setViewState(openJourneyScreen(createJourneyViewState({
        ...updated,
        welcome_required: false,
      })));
      setLanguage(languageFromResponse(updated.resolved_language));
      setJourneyNotice(null);
      setWelcomeStartState("idle");
    } catch {
      setWelcomeStartError(strings.welcomeStartError);
      setWelcomeStartState("error");
    }
  };


  const submitLanguageChange = async (preferredLanguage: LanguageCode) => {
    if (preferredLanguage === language || languageSaveState === "submitting") {
      return;
    }


    setLanguageSaveState("submitting");
    setLanguageSaveError(null);


    try {
      const updated = await bootstrapAcademy({
        initData: launchContext.initData,
        acquisitionSource: launchContext.acquisitionSource,
        preferredLanguage,
        logOpenEvents: false,
      });
      const resolvedLanguage = languageFromResponse(updated.resolved_language);


      setLanguage(resolvedLanguage);
      setViewState((current) => ({
        ...current,
        journeyData: {
          ...current.journeyData,
          ...updated,
        },
      }));
      setLanguageSaveState("idle");
      setViewState((current) => openProfileScreen(current));
    } catch {
      setLanguageSaveError(strings.languageSaveError);
      setLanguageSaveState("error");
    }
  };


  const submitProgressReset = async () => {
    if (resetProgressState === "submitting") {
      return;
    }


    setResetProgressState("submitting");
    setResetProgressError(null);


    try {
      const updated = await resetProgress({
        initData: launchContext.initData,
      });


      setWelcomeStartError(null);
      setWelcomeStartState("idle");
      setLanguage(languageFromResponse(updated.resolved_language));
      setViewState(createJourneyViewState(updated));
      setJourneyNotice(null);
      setResetProgressState("idle");
    } catch {
      setResetProgressError(strings.resetProgressError);
      setResetProgressState("error");
    }
  };


  if (viewState.screen === "profile") {
    return (
      <ProfileScreen
        completedSteps={completedSteps}
        currentStep={currentStep}
        currentLanguage={language}
        progress={progress}
        resetError={resetProgressError}
        resetState={resetProgressState}
        student={viewState.journeyData.student}
        totalSteps={totalSteps}
        onBack={navigateToJourney}
        onOpenLanguage={navigateToLanguage}
        onResetProgress={() => void submitProgressReset()}
        onOpenJourney={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        onOpenAchievements={navigateToAchievements}
        onOpenProfile={navigateToProfile}
      />
    );
  }


  if (viewState.screen === "language") {
    return (
      <LanguageScreen
        currentLanguage={language}
        error={languageSaveError}
        saveState={languageSaveState}
        onBack={navigateToProfile}
        onSelectLanguage={(preferredLanguage) => void submitLanguageChange(preferredLanguage)}
        onOpenJourney={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        onOpenAchievements={navigateToAchievements}
        onOpenProfile={navigateToProfile}
      />
    );
  }


  if (viewState.screen === "welcome") {
    return (
      <WelcomeScreen
        error={welcomeStartError}
        startState={welcomeStartState}
        onStart={() => void submitWelcomeStart()}
      />
    );
  }


  if (viewState.screen === "playbook") {
    return (
      <PlaybookScreen
        onBack={navigateToJourney}
        onOpenJourney={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        onOpenAchievements={navigateToAchievements}
        onOpenProfile={navigateToProfile}
      />
    );
  }


  if (viewState.screen === "practical_qa") {
    return (
      <PracticalQaScreen
        onBack={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        suggestedCase={suggestedPracticalCase}
        onSubmit={(submission: PracticalQaSubmissionInput) =>
          submitPracticalQa({
            initData: launchContext.initData,
            submission,
          })
        }
        onOpenJourney={navigateToJourney}
        onOpenAchievements={navigateToAchievements}
        onOpenProfile={navigateToProfile}
      />
    );
  }


  if (viewState.screen === "achievements") {
    return (
      <AchievementsScreen
        achievements={buildAchievements(viewState.journeyData, strings, moduleProgress)}
        onBack={navigateToJourney}
        onOpenJourney={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        onOpenAchievements={navigateToAchievements}
        onOpenProfile={navigateToProfile}
      />
    );
  }


  if (viewState.screen === "course_completed") {
    return (
      <CourseCompletedScreen
        onOpenJourney={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        onOpenPracticalQa={navigateToPracticalQa}
      />
    );
  }


  if (viewState.screen !== "journey" && activeStep) {
    return (
      <StepScreen
        affiliateRegistrationUrl={buildAffiliateRegistrationUrl({
          telegramUserId: viewState.journeyData.student.telegram_user_id,
          studentAcquisitionSource: viewState.journeyData.student.acquisition_source,
          launchAcquisitionSource: launchContext.acquisitionSource,
          language,
        })}
        step={activeStep}
        tasks={tasksForStep(activeStep.key)}
        onBack={navigateToJourney}
        onOpenAffiliateRegistrationDetail={() => navigateToStep("affiliate_registration")}
        onOpenFirstLiveDetail={() => navigateToStep("first_live")}
        onOpenProductExperienceDetail={() => navigateToStep("product_experience")}
        onOpenModuleTwoDetail={() => navigateToStep("module_2")}
        onOpenModuleThreeDetail={() => navigateToStep("module_3")}
        onOpenModuleFourDetail={() => navigateToStep("module_4")}
        onOpenStreamReadyDetail={() => navigateToStep("stream_ready")}
        onContinuePreparation={navigateToCurrentRequiredStep}
        onOpenModuleOneDetail={() => navigateToStep("module_1")}
        onReturnToJourney={navigateToJourney}
        onOpenJourney={navigateToJourney}
        onOpenPlaybook={navigateToPlaybook}
        onOpenAchievements={navigateToAchievements}
        onOpenProfile={navigateToProfile}
      />
    );
  }


  return (
    <JourneyScreen
      completedSteps={completedSteps}
      currentStep={currentStep}
      firstName={firstName}
      notice={journeyNotice}
      totalSteps={totalSteps}
      visibleSteps={visibleSteps}
      onOpenJourney={navigateToJourney}
      onOpenAchievements={navigateToAchievements}
      onOpenProfile={navigateToProfile}
      onOpenPlaybook={navigateToPlaybook}
      onOpenPracticalQa={navigateToPracticalQa}
      playbookAvailable={Boolean(viewState.journeyData.student.course_completed_at)}
      practicalQaAvailable={Boolean(viewState.journeyData.student.course_completed_at)}
      onOpenStep={(stepKey) => {
        const step = visibleSteps.find(
          (item) => item.key === stepKey,
        );


        if (step && isStepUnlockedByChatterfyProgress(stepKey)) {
          navigateToStep(step.key);
        }
      }}
    />
  );
}


function suggestedCaseFromFirstLive(
  submission: Record<string, unknown> | undefined,
): { whatHappened: string; metrics: PracticalQaMetrics } | undefined {
  if (!submission) {
    return undefined;
  }


  const whatHappened =
    typeof submission.main_difficulty === "string"
      ? submission.main_difficulty.trim()
      : "";


  if (!whatHappened) {
    return undefined;
  }


  const metrics: PracticalQaMetrics = { lives_completed: 1 };
  const newTelegramMembers = nonNegativeSubmissionNumber(
    submission.new_telegram_members,
  );
  const dmReplies = nonNegativeSubmissionNumber(submission.dm_replies);
  const registrations = nonNegativeSubmissionNumber(
    submission.registrations_if_any,
  );


  if (newTelegramMembers !== undefined) {
    metrics.telegram_joins = newTelegramMembers;
  }


  if (dmReplies !== undefined) {
    metrics.dm_replies = dmReplies;
  }


  if (registrations !== undefined) {
    metrics.registrations = registrations;
  }


  return { whatHappened, metrics };
}


function nonNegativeSubmissionNumber(value: unknown): number | undefined {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;


  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : undefined;
}


function AcademyLoadingState() {
  return (
    <main className="min-h-dvh bg-background px-4 py-5">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-52" />
          </div>


          <Skeleton className="size-11 rounded-2xl" />
        </div>


        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />


        <div className="space-y-3">
          <Skeleton className="h-6 w-28" />


          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}


function CourseCompletedScreen({
  onOpenJourney,
  onOpenPlaybook,
  onOpenPracticalQa,
}: {
  onOpenJourney: () => void;
  onOpenPlaybook: () => void;
  onOpenPracticalQa: () => void;
}) {
  const strings = useStrings();


  return (
    <main className="min-h-dvh bg-background px-4 py-5 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
          <CheckCircle2 className="size-5" />
        </div>


        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            {strings.productName}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {strings.courseCompletedTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {strings.courseCompletedBody}
          </p>
        </div>


        <Card size="sm">
          <CardContent className="space-y-2">
            <p className="font-medium">{strings.courseCompletedFirstLiveSubmitted}</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {strings.courseCompletedReviewNote}
            </p>
          </CardContent>
        </Card>


        <Button className="w-full" size="lg" type="button" onClick={onOpenPracticalQa}>
          <MessageCircleQuestion className="size-4" />
          {strings.openPracticalQa}
        </Button>


        <Button
          className="w-full"
          size="lg"
          type="button"
          variant="outline"
          onClick={onOpenPlaybook}
        >
          <BookOpen className="size-4" />
          {strings.openPlaybook}
        </Button>


        <Button
          className="w-full"
          size="lg"
          type="button"
          variant="outline"
          onClick={onOpenJourney}
        >
          {strings.backToMyJourney}
        </Button>
      </div>
    </main>
  );
}


function CenteredShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-8 text-center text-foreground">
      <Card className="w-full max-w-sm">
        <CardContent className="py-6">{children}</CardContent>
      </Card>
    </main>
  );
}
