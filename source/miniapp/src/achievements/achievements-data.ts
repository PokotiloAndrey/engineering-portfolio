/** Achievements: module awards follow Chatterfy module_progress only. */
import type { TranslationStrings } from "@/i18n";
import type { BootstrapResponse } from "@/types/journey";


export type AchievementKey =
  | "journey_begins"
  | "first_step"
  | "funnel_specialist"
  | "trading_pro"
  | "going_live"
  | "academy_graduate"
  | "practitioner";


export type Achievement = {
  key: AchievementKey;
  title: string;
  description: string;
  unlocked: boolean;
};


const ACHIEVEMENT_KEYS: AchievementKey[] = [
  "journey_begins",
  "first_step",
  "funnel_specialist",
  "trading_pro",
  "going_live",
  "academy_graduate",
  "practitioner",
];


// A module award unlocks only when Chatterfy progression reaches the NEXT module.
// student_steps and homework completion are deliberately not used.
function isModuleCompletedByProgress(moduleKey: string, moduleProgress: number): boolean {
  const match = /^module_(\d)$/.exec(moduleKey);
  return match !== null && Number(match[1]) < moduleProgress;
}

function hasPracticalQaSubmission(journeyData: BootstrapResponse): boolean {
  const firstLiveTask = journeyData.tasks_by_step?.module_4?.find(
    (task) => task.key === "module_4_first_live",
  );
  return Boolean(firstLiveTask?.submission);
}


function unlockedByKey(
  key: AchievementKey,
  journeyData: BootstrapResponse,
  moduleProgress: number,
): boolean {
  switch (key) {
    case "journey_begins":
      return journeyData.welcome_required !== true;
    case "first_step":
      return isModuleCompletedByProgress("module_1", moduleProgress);
    case "funnel_specialist":
      return isModuleCompletedByProgress("module_2", moduleProgress);
    case "trading_pro":
      return isModuleCompletedByProgress("module_3", moduleProgress);
    case "going_live":
      return isModuleCompletedByProgress("module_4", moduleProgress);
    case "academy_graduate":
      return Boolean(journeyData.student.course_completed_at);
    case "practitioner":
      return hasPracticalQaSubmission(journeyData);
    default:
      return false;
  }
}


export function buildAchievements(
  journeyData: BootstrapResponse,
  strings: TranslationStrings,
  moduleProgress: number,
): Achievement[] {
  return ACHIEVEMENT_KEYS.map((key) => ({
    key,
    title: strings.achievements[key].title,
    description: strings.achievements[key].description,
    unlocked: unlockedByKey(key, journeyData, moduleProgress),
  }));
}