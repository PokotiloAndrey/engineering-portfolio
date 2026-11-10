import type { BootstrapResponse, JourneyStep } from "./types/journey";

export type JourneyScreenName =
  | "welcome"
  | "journey"
  | "course_completed"
  | "step"
  | "completion"
  | "profile"
  | "language"
  | "playbook"
  | "practical_qa"
  | "achievements";

export type JourneyViewState = {
  screen: JourneyScreenName;
  selectedStepKey: string | null;
  journeyData: BootstrapResponse;
};

export function createJourneyViewState(journeyData: BootstrapResponse): JourneyViewState {
  return {
    screen:
      journeyData.welcome_required === true
        ? "welcome"
        : journeyData.student.course_completed_at
          ? "course_completed"
          : "journey",
    selectedStepKey: null,
    journeyData,
  };
}

export function openJourneyScreen(state: JourneyViewState): JourneyViewState {
  return {
    ...state,
    screen: "journey",
    selectedStepKey: null,
  };
}

export function openStepDetail(state: JourneyViewState, stepKey: string): JourneyViewState {
  return {
    ...state,
    screen: "step",
    selectedStepKey: stepKey,
  };
}

export function openStepCompletion(state: JourneyViewState, stepKey: string): JourneyViewState {
  return {
    ...state,
    screen: "completion",
    selectedStepKey: stepKey,
  };
}

export function openProfileScreen(state: JourneyViewState): JourneyViewState {
  return {
    ...state,
    screen: "profile",
    selectedStepKey: null,
  };
}

export function openLanguageSelection(state: JourneyViewState): JourneyViewState {
  return {
    ...state,
    screen: "language",
    selectedStepKey: null,
  };
}

export function openPlaybookScreen(state: JourneyViewState): JourneyViewState {
  return {
    ...state,
    screen: "playbook",
    selectedStepKey: null,
  };
}

export function openPracticalQaScreen(state: JourneyViewState): JourneyViewState {
  return {
    ...state,
    screen: "practical_qa",
    selectedStepKey: null,
  };
}

export function openAchievementsScreen(state: JourneyViewState): JourneyViewState {
  return { ...state, screen: "achievements", selectedStepKey: null };
}

export function returnToJourneyScreen(state: JourneyViewState): JourneyViewState {
  return {
    ...state,
    screen: "journey",
    selectedStepKey: null,
  };
}

export function applyPromoLiveCompletion(
  state: JourneyViewState,
  journeyData: BootstrapResponse,
): JourneyViewState {
  return {
    ...state,
    journeyData,
  };
}

export function visibleJourneySteps(journey: JourneyStep[]): JourneyStep[] {
  return journey.filter((step) =>
    step.key === "module_1" ||
    step.key === "module_2" ||
    step.key === "module_3" ||
    step.key === "module_4",
  );
}

export function selectedStep(
  journey: JourneyStep[],
  selectedStepKey: string | null,
): JourneyStep | undefined {
  if (!selectedStepKey) {
    return undefined;
  }

  return journey.find((step) => step.key === selectedStepKey);
}

export function canOpenStepDetail(step: JourneyStep): boolean {
  return (
    step.status !== "locked" &&
    (step.key === "module_1" ||
      step.key === "module_2" ||
      step.key === "module_3" ||
      step.key === "module_4")
  );
}

export function currentStepForDetail(journeyData: BootstrapResponse): JourneyStep | null {
  return journeyData.current_step;
}
