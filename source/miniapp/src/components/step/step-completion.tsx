import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStrings } from "@/i18n";

export function StepCompletion({
  body,
  next,
  title,
}: {
  body: ReactNode;
  next?: string;
  title: string;
}) {
  const strings = useStrings();

  return (
    <Alert>
      <CheckCircle2 className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div>{body}</div>
        {next ? (
          <span className="mt-3 block font-medium text-foreground">
            {strings.nextStep}: {next}
          </span>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
