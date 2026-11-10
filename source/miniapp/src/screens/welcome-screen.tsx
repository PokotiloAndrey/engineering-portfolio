import { CheckCircle2, Sparkles } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStrings } from "@/i18n";

export type WelcomeStartState = "idle" | "submitting" | "error";

export function WelcomeScreen({
  error,
  startState,
  onStart,
}: {
  error: string | null;
  startState: WelcomeStartState;
  onStart: () => void;
}) {
  const strings = useStrings();
  const isSubmitting = startState === "submitting";

  return (
    <main className="min-h-dvh bg-background px-4 py-4 text-foreground">
      <section className="mx-auto flex w-full max-w-md flex-col gap-4">
        <header className="space-y-3 pt-1">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary">{strings.productName}</Badge>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              {strings.welcomeHeadline}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {strings.welcomeBody}
            </p>
          </div>
        </header>

        <Card size="sm">
          <CardContent className="space-y-4">
            <section className="space-y-3">
              <h2 className="text-base font-semibold">{strings.welcomeBenefitsTitle}</h2>
              <ul className="space-y-2">
                {strings.welcomeBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm leading-5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            <p className="text-sm leading-6 text-muted-foreground">
              {strings.welcomeNoExperience}
            </p>
          </CardContent>
        </Card>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          size="lg"
          type="button"
          onClick={onStart}
        >
          {isSubmitting ? strings.welcomeStarting : strings.welcomeStartCta}
        </Button>
      </section>
    </main>
  );
}
