export type PracticalQaSubmissionKind = "practical_case" | "question";

export type PracticalQaCategory =
  | "tiktok_viewers"
  | "viewer_retention"
  | "trading_what_to_say"
  | "telegram_joins"
  | "telegram_content"
  | "leads_dm"
  | "registrations"
  | "partner_performance"
  | "technical"
  | "other";

export type PracticalQaMetrics = {
  lives_completed?: number;
  average_viewers?: number;
  peak_viewers?: number;
  telegram_joins?: number;
  dm_replies?: number;
  registrations?: number;
};

export type PracticalCaseSubmissionInput = {
  kind: "practical_case";
  category: PracticalQaCategory;
  whatHappened: string;
  metrics: PracticalQaMetrics;
  alreadyTried: string;
  links: string;
  question: string;
  knowledgeBaseChecked: boolean;
};

export type QaQuestionSubmissionInput = {
  kind: "question";
  category: PracticalQaCategory;
  question: string;
  context: string;
  knowledgeBaseChecked: boolean;
};

export type PracticalQaSubmissionInput =
  | PracticalCaseSubmissionInput
  | QaQuestionSubmissionInput;

export type PracticalQaSubmissionResult = {
  id: string;
  status: "submitted";
  priority: 1 | 2 | 3;
  created_at: string;
};
