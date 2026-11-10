import type { ReactNode } from "react";

import { BottomNav, type BottomNavTab } from "@/components/navigation/bottom-nav";

const SAFE_AREA_TOP_PADDING =
  "calc(1rem + var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px))";

export type ScreenNavProps = {
  onOpenJourney: () => void;
  onOpenPlaybook: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
};

export function ScreenShell({
  children,
  activeTab,
  nav,
  maxWidthClassName = "max-w-md",
  contentClassName = "gap-5",
}: {
  children: ReactNode;
  activeTab: BottomNavTab | null;
  nav: ScreenNavProps;
  maxWidthClassName?: string;
  contentClassName?: string;
}) {
  return (
    <main
      className="min-h-dvh bg-background px-4 pb-24 pt-4 text-foreground"
      style={{ paddingTop: SAFE_AREA_TOP_PADDING }}
    >
      <div className={`mx-auto flex w-full ${maxWidthClassName} flex-col ${contentClassName}`}>
        {children}
      </div>

      {activeTab ? (
        <BottomNav
          activeTab={activeTab}
          onOpenAchievements={nav.onOpenAchievements}
          onOpenJourney={nav.onOpenJourney}
          onOpenPlaybook={nav.onOpenPlaybook}
          onOpenProfile={nav.onOpenProfile}
        />
      ) : null}
    </main>
  );
}