import { Award, BookOpen, Home, Menu, User, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
};

export function AppMenuSheet({
  onOpenJourney,
  onOpenPlaybook,
  onOpenAchievements,
  onOpenProfile,
}: {
  onOpenJourney: () => void;
  onOpenPlaybook: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
}) {
  const [open, setOpen] = useState(false);

  const items: MenuItem[] = [
    {
      key: "journey",
      label: "Home",
      icon: <Home className="size-5" />,
      onSelect: onOpenJourney,
    },
    {
      key: "playbook",
      label: "Playbook",
      icon: <BookOpen className="size-5" />,
      onSelect: onOpenPlaybook,
    },
    {
      key: "achievements",
      label: "Achievements",
      icon: <Award className="size-5" />,
      onSelect: onOpenAchievements,
    },
    {
      key: "profile",
      label: "Profile",
      icon: <User className="size-5" />,
      onSelect: onOpenProfile,
    },
  ];

  const handleSelect = (item: MenuItem) => {
    setOpen(false);
    item.onSelect();
  };

  return (
    <>
      <Button
        aria-label="Menu"
        className="relative z-10 size-10 shrink-0 touch-manipulation rounded-lg p-0"
        size="icon-lg"
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            type="button"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col bg-background p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">Menu</p>

              <Button
                aria-label="Close menu"
                className="size-8 rounded-lg p-0"
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <button
                  key={item.key}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-muted"
                  type="button"
                  onClick={() => handleSelect(item)}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}