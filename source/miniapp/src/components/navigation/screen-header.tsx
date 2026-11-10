import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ScreenHeader({
  title,
  subtitle,
  onNavigateUp,
  navigateUpVariant = "back",
  navigateUpLabel,
  onOpenNotifications,
}: {
  title?: string;
  subtitle?: string;
  onNavigateUp?: () => void;
  navigateUpVariant?: "home" | "back";
  navigateUpLabel?: string;
  onOpenNotifications?: () => void;
}) {
  // NOTE: onOpenNotifications is kept in the props so callers don't need to
  // change, but the notifications bell button below is currently commented
  // out (it was a permanently-disabled placeholder with no real feature
  // behind it yet).
  void onOpenNotifications;

  return (
    <header className="flex w-full items-center justify-between gap-3">
      {onNavigateUp ? (
        <Button
          data-analytics-id={`navigation.${navigateUpVariant}`}
          aria-label={navigateUpLabel ?? (navigateUpVariant === "home" ? "Home" : "Back")}
          className="relative z-10 size-10 shrink-0 touch-manipulation rounded-lg p-0"
          size="icon-lg"
          type="button"
          variant="outline"
          onClick={onNavigateUp}
        >
          {navigateUpVariant === "home" ? (
            <Home className="size-5" />
          ) : (
            <ArrowLeft className="size-5" />
          )}
        </Button>
      ) : (
        <div className="size-10 shrink-0" />
      )}

      {title ? (
        <div className="min-w-0 flex-1 text-center">
          {subtitle ? (
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
          <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* TODO: re-enable the notifications bell button once notification
          logic is actually designed/implemented. It was a permanently
          disabled placeholder (no onOpenNotifications caller ever passed
          a real handler), so it's commented out for now.

      <Button
        aria-label="Notifications"
        className="relative z-10 size-10 shrink-0 touch-manipulation rounded-lg p-0"
        disabled={!onOpenNotifications}
        size="icon-lg"
        type="button"
        variant="outline"
        onClick={onOpenNotifications}
      >
        <Bell className="size-5" />
      </Button>
      */}
      <div className="size-10 shrink-0" />
    </header>
  );
}