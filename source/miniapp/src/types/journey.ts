export type StepStatus = "locked" | "available" | "in_progress" | "completed";
export type LanguageCode = "es" | "pt-BR" | "id" | "en";
export type HomeworkStatus = "locked" | "available" | "under_review" | "approved" | "revision_required";

export type JourneyStep = {
  key: string;
  title: string;
  position: number;
  required: boolean;
  status: StepStatus;
};

export type ModuleOneTaskKey =
  | "module_1_affiliate_registration"
  | "module_1_demo_practice";

export type StepTaskKey =
  | ModuleOneTaskKey
  | "module_2_tiktok_linktree"
  | "module_2_telegram_channel"
  | "module_3_demo_patterns"
  | "module_3_trade_examples"
  | "module_4_pre_live_readiness"
  | "module_4_first_live";

export type SupportedTaskStepKey =
  | "module_1"
  | "module_2"
  | "module_3"
  | "module_4";

export type StepTask = {
  key: StepTaskKey;
  step_key: SupportedTaskStepKey;
  title: string;
  position: number;
  completed: boolean;
  completed_at: string | null;
  status: HomeworkStatus;
  submission: Record<string, unknown>;
  checklist_state: Record<string, boolean>;
  submitted_at: string | null;
  review_comment: string | null;
  attempt_count: number;
};

export type ModuleOneTask = StepTask & {
  key: ModuleOneTaskKey;
  step_key: "module_1";
};

export type TasksByStep = Partial<Record<SupportedTaskStepKey, StepTask[]>>;

export type Student = {
  id: string;
  telegram_user_id: number;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  language_code: string | null;
  preferred_language: LanguageCode | null;
  curriculum_version: "v1" | "v2";
  course_completed_at: string | null;
  geo: "MX";
  locale: "es-MX";
  acquisition_source: string | null;
  created_at: string;
  updated_at: string;
};

export type BootstrapResponse = {
  student: Student;
  journey: JourneyStep[];
  current_step: JourneyStep | null;
  tasks_by_step: TasksByStep;
  module_1_tasks: ModuleOneTask[];
  welcome_required?: boolean;
  resolved_language?: LanguageCode;
};
