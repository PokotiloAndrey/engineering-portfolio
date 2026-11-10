import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useStrings } from "@/i18n";

export function CurrentStepCard({
  onOpen,
  title,
}: {
  onOpen?: () => void;
  title: string;
}) {
  const strings = useStrings();

  const content = (
    <CardContent className="flex min-h-[76px] items-center gap-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ArrowRight className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{strings.nextStep}</p>
        <p className="mt-0.5 text-sm font-medium leading-5">{title}</p>
      </div>
    </CardContent>
  );

  if (onOpen) {
    return (
      <button className="w-full text-left" type="button" onClick={onOpen}>
        <Card className="border-primary/20 bg-primary/5 py-0 transition-colors hover:bg-primary/10">
          {content}
        </Card>
      </button>
    );
  }

  return <Card className="border-primary/20 bg-primary/5 py-0">{content}</Card>;
}
