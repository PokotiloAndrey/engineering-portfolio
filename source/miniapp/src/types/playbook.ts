export type PlaybookChecklist = {
  title: string;
  description: string;
  items: string[];
  note?: string;
};

export type PlaybookTopic = {
  key: string;
  title: string;
  quickAnswer: string;
  steps?: string[];
  scenarios?: string[];
  importantDetails?: string[];
  checklist?: PlaybookChecklist;
  sourceNote?: string;
  recordingUrl?: string | null;
};

export type PlaybookBlock = {
  key: string;
  position: number;
  title: string;
  description: string;
  topics: PlaybookTopic[];
};

export type PlaybookQuickAccessItem = {
  key: string;
  label: string;
  blockKey: string;
  topicKey: string;
};
