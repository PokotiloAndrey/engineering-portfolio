import { Check, ChevronLeft } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenShell, type ScreenNavProps } from "@/components/navigation/screen-shell";
import { languageOptions, useStrings } from "@/i18n";
import type { LanguageCode } from "@/types/journey";

export type LanguageSaveState = "idle" | "submitting" | "error";

export function LanguageScreen({
  currentLanguage,
  error,
  onBack,
  onSelectLanguage,
  saveState,
  ...nav
}: {
  currentLanguage: LanguageCode;
  error: string | null;
  onBack: () => void;
  onSelectLanguage: (language: LanguageCode) => void;
  saveState: LanguageSaveState;
} & ScreenNavProps) {
  const strings = useStrings();

  return (
    <ScreenShell activeTab="profile" nav={nav}>
      <Button className="-ml-2 w-fit" size="sm" type="button" variant="ghost" onClick={onBack}>
        <ChevronLeft className="size-4" />
        {strings.profileTitle}
      </Button>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xl">{strings.languageSelectionTitle}</CardTitle>
          <p className="text-sm leading-5 text-muted-foreground">
            {strings.languageSelectionDescription}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {languageOptions.map((option) => {
            const selected = option.code === currentLanguage;
            const disabled = saveState === "submitting";

            return (
              <button
                key={option.code}
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50 disabled:opacity-60"
                disabled={disabled}
                type="button"
                onClick={() => onSelectLanguage(option.code)}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span aria-hidden="true" className="text-lg">
                    {option.flag}
                  </span>
                  <span className="font-medium">{option.label}</span>
                </span>

                {selected ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Check className="size-4" />
                    {strings.selectedLanguage}
                  </span>
                ) : null}
              </button>
            );
          })}

          {saveState === "submitting" ? (
            <p className="text-sm text-muted-foreground">{strings.languageSaving}</p>
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </ScreenShell>
  );
}
