import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenShell, type ScreenNavProps } from "@/components/navigation/screen-shell";
import { useStrings } from "@/i18n";

export function StepLayout({
  backText,
  children,
  completion,
  cta,
  description,
  error,
  eyebrow,
  icon,
  onBack,
  subtitle,
  title,
  ...nav
}: {
  backText?: string;
  children?: ReactNode;
  completion?: ReactNode;
  cta?: ReactNode;
  description?: string;
  error?: string | null;
  eyebrow: string;
  icon: ReactNode;
  onBack: () => void;
  subtitle?: string;
  title: string;
} & ScreenNavProps) {
  const strings = useStrings();
  const resolvedBackText = backText ?? strings.backToJourneyDetail;

  return (
    <ScreenShell activeTab="journey" nav={nav}>
      <Button className="-ml-2 w-fit" size="sm" type="button" variant="ghost" onClick={onBack}>
        <ChevronLeft className="size-4" />
        {resolvedBackText}
      </Button>

      <Card size="sm">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>

          <p className="text-sm text-muted-foreground">{eyebrow}</p>
          <CardTitle className="text-xl">{title}</CardTitle>
          {subtitle ? (
            <p className="pt-1 text-base font-medium text-foreground">{subtitle}</p>
          ) : null}

          {description ? (
            <p className="pt-1 text-sm leading-5 text-muted-foreground">{description}</p>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4">
          {children}
          {completion}

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {cta}
        </CardContent>
      </Card>
    </ScreenShell>
  );
}
