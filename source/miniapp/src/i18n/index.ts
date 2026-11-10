import { createContext, createElement, useContext, type ReactNode } from "react";

import { en } from "./en";
import { esMX } from "./es-MX";
import { id } from "./id";
import { ptBR } from "./pt-BR";
import type { JourneyStep, StepTask } from "@/types/journey";
import type { TranslationStrings } from "./types";

export const languageOptions = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "pt-BR", flag: "🇧🇷", label: "Português" },
  { code: "id", flag: "🇮🇩", label: "Bahasa Indonesia" },
  { code: "en", flag: "🇬🇧", label: "English" },
] as const;

export type LanguageCode = (typeof languageOptions)[number]["code"];
export type { TranslationStrings };

export const translations: Record<LanguageCode, TranslationStrings> = {
  es: esMX,
  "pt-BR": ptBR,
  id,
  en,
};

type I18nContextValue = {
  language: LanguageCode;
  strings: TranslationStrings;
};

const I18nContext = createContext<I18nContextValue>({
  language: "en",
  strings: translations.en,
});

export function I18nProvider({
  children,
  language,
}: {
  children: ReactNode;
  language: LanguageCode;
}) {
  return createElement(I18nContext.Provider, {
    value: {
      language,
      strings: translations[language],
    },
  }, children);
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export function useStrings(): TranslationStrings {
  return useI18n().strings;
}

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && value in translations;
}

export function languageLabel(code: LanguageCode): string {
  return languageOptions.find((option) => option.code === code)?.label ?? code;
}

export function languageFromResponse(value: unknown): LanguageCode {
  return isLanguageCode(value) ? value : "en";
}

export function localizedStepTitle(
  strings: TranslationStrings,
  step: Pick<JourneyStep, "key" | "title"> | null | undefined,
): string {
  if (!step) {
    return strings.statuses.completed;
  }

  return strings.stepTitles[step.key as keyof typeof strings.stepTitles] ?? step.title;
}

export function localizedTaskTitle(
  strings: TranslationStrings,
  task: Pick<StepTask, "key" | "title">,
): string {
  return strings.taskTitles[task.key as keyof typeof strings.taskTitles] ?? task.title;
}

export const currentLocale = "es";
export const strings = esMX;
