import { Badge } from "@/components/ui/badge";
import { useStrings } from "@/i18n";
import type { StepStatus } from "@/types/journey";

export function StatusBadge({ status }: { status: StepStatus }) {
  const strings = useStrings();

  return (
    <Badge
      className="mt-1"
      variant={
        status === "completed"
          ? "secondary"
          : status === "locked"
            ? "outline"
            : "default"
      }
    >
      {strings.statuses[status]}
    </Badge>
  );
}
