/**
 * REPLACES src/playbook/content.ts
 * -----------------------------------------------------------------------
 * This file becomes a language-aware dispatcher instead of holding the
 * English content directly. The actual translated content now lives in:
 *   - src/playbook/content.en.ts
 *   - src/playbook/content.es-MX.ts
 *   - src/playbook/content.id.ts
 *   - src/playbook/content.pt-BR.ts
 *
 * Each of those files exports `playbookBlocks: PlaybookBlock[]` and
 * `playbookQuickAccess: PlaybookQuickAccessItem[]` with IDENTICAL keys
 * (block.key, topic.key, quickAccess.key) — only the text differs.
 *
 * playbook-screen.tsx must be updated to call getPlaybookBlocks(language)
 * / getPlaybookQuickAccess(language) instead of importing the constants
 * directly, and to pass `language` (from useI18n()) into
 * findPlaybookBlock / findPlaybookTopic.
 * -----------------------------------------------------------------------
 */
import type { LanguageCode } from "@/i18n";
import type {
  PlaybookBlock,
  PlaybookQuickAccessItem,
  PlaybookTopic,
} from "@/types/playbook";

import { playbookBlocks as playbookBlocksEn, playbookQuickAccess as playbookQuickAccessEn } from "./content.en";
import { playbookBlocks as playbookBlocksEsMX, playbookQuickAccess as playbookQuickAccessEsMX } from "./content.es-MX";
import { playbookBlocks as playbookBlocksId, playbookQuickAccess as playbookQuickAccessId } from "./content.id";
import { playbookBlocks as playbookBlocksPtBR, playbookQuickAccess as playbookQuickAccessPtBR } from "./content.pt-BR";

const blocksByLanguage: Record<LanguageCode, PlaybookBlock[]> = {
  en: playbookBlocksEn,
  es: playbookBlocksEsMX,
  id: playbookBlocksId,
  "pt-BR": playbookBlocksPtBR,
};

const quickAccessByLanguage: Record<LanguageCode, PlaybookQuickAccessItem[]> = {
  en: playbookQuickAccessEn,
  es: playbookQuickAccessEsMX,
  id: playbookQuickAccessId,
  "pt-BR": playbookQuickAccessPtBR,
};

export function getPlaybookBlocks(language: LanguageCode): PlaybookBlock[] {
  return blocksByLanguage[language] ?? blocksByLanguage.en;
}

export function getPlaybookQuickAccess(language: LanguageCode): PlaybookQuickAccessItem[] {
  return quickAccessByLanguage[language] ?? quickAccessByLanguage.en;
}

export function findPlaybookBlock(
  language: LanguageCode,
  blockKey: string,
): PlaybookBlock | undefined {
  return getPlaybookBlocks(language).find((block) => block.key === blockKey);
}

export function findPlaybookTopic(
  language: LanguageCode,
  blockKey: string,
  topicKey: string,
): PlaybookTopic | undefined {
  return findPlaybookBlock(language, blockKey)?.topics.find(
    (topic) => topic.key === topicKey,
  );
}

export function getPlaybookSearchText(topic: PlaybookTopic): string {
  return [
    topic.title,
    topic.quickAnswer,
    ...(topic.steps ?? []),
    ...(topic.scenarios ?? []),
    ...(topic.importantDetails ?? []),
    ...(topic.checklist?.items ?? []),
  ].join(" ");
}
