/**
 * REPLACES src/screens/achievements-screen.tsx
 * -----------------------------------------------------------------------
 * Changes from the previous version:
 *  - Uses useStrings() for "Awards" title, unlocked count, and Close aria-label.
 *  - Now wrapped in ScreenShell + ScreenHeader (per the 23.09 BottomNav
 *    refactor) instead of a raw <main> + close button — matches the
 *    current architecture described in the context files.
 *  - Screen title changed from "Achievements" to strings.awardsTitle
 *    ("Awards") per the renaming decision.
 * -----------------------------------------------------------------------
 */
import { ClipboardCheck, Filter, Footprints, GraduationCap, Lock, Radio, Rocket, TrendingUp } from "lucide-react";

import type { Achievement, AchievementKey } from "@/achievements/achievements-data";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { ScreenShell, type ScreenNavProps } from "@/components/navigation/screen-shell";
import { useStrings } from "@/i18n";

const ICONS: Record<AchievementKey, React.ReactNode> = {
  journey_begins: <Rocket className="size-6" />,
  first_step: <Footprints className="size-6" />,
  funnel_specialist: <Filter className="size-6" />,
  trading_pro: <TrendingUp className="size-6" />,
  going_live: <Radio className="size-6" />,
  academy_graduate: <GraduationCap className="size-6" />,
  practitioner: <ClipboardCheck className="size-6" />,
};

export function AchievementsScreen({
  achievements,
  onBack,
  ...nav
}: {
  achievements: Achievement[];
  onBack: () => void;
} & ScreenNavProps) {
  const strings = useStrings();
  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <ScreenShell activeTab="achievements" nav={nav}>
      <ScreenHeader
        navigateUpVariant="home"
        onNavigateUp={onBack}
        subtitle={strings.awardsUnlockedCount(unlockedCount, achievements.length)}
        title={strings.awardsTitle}
      />

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.key}
            className={
              achievement.unlocked
                ? "flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
                : "flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4 opacity-60"
            }
          >
            <span
              className={
                achievement.unlocked
                  ? "flex size-11 items-center justify-center rounded-lg bg-foreground text-background"
                  : "flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground"
              }
            >
              {achievement.unlocked ? ICONS[achievement.key] : <Lock className="size-5" />}
            </span>

            <p className="text-sm font-semibold leading-5">{achievement.title}</p>
            <p className="text-xs leading-4 text-muted-foreground">{achievement.description}</p>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
