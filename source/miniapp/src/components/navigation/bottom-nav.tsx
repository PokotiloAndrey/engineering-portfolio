import { Award, BookOpen, Home, User } from "lucide-react";
import type { ComponentType } from "react";

import { useStrings } from "@/i18n";

export type BottomNavTab = "journey" | "playbook" | "achievements" | "profile";

export type BottomNavProps = {
  activeTab: BottomNavTab;
  onOpenJourney: () => void;
  onOpenPlaybook: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
};

export function BottomNav({
  activeTab,
  onOpenJourney,
  onOpenPlaybook,
  onOpenAchievements,
  onOpenProfile,
}: BottomNavProps) {
  const strings = useStrings();

  const items: {
    key: BottomNavTab;
    label: string;
    icon: ComponentType<{ className?: string }>;
    onClick: () => void;
  }[] = [
    { key: "journey", label: strings.navLabels.home, icon: Home, onClick: onOpenJourney },
    { key: "playbook", label: strings.navLabels.playbook, icon: BookOpen, onClick: onOpenPlaybook },
    { key: "achievements", label: strings.navLabels.awards, icon: Award, onClick: onOpenAchievements },
    { key: "profile", label: strings.navLabels.profile, icon: User, onClick: onOpenProfile },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background"
      style={{
        paddingBottom: "var(--tg-safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-between px-2">
        {items.map(({ key, label, icon: Icon, onClick }) => {
          const isActive = key === activeTab;

          return (
            <button
              key={key}
              data-analytics-id={`navigation.tab.${key}`}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium"
              type="button"
              onClick={onClick}
            >
              <Icon
                className={
                  isActive
                    ? "size-5 text-foreground"
                    : "size-5 text-muted-foreground"
                }
              />
              <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}