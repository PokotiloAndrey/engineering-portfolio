/**
 * REPLACES src/screens/playbook-screen.tsx
 * -----------------------------------------------------------------------
 * Changes from the previous version:
 *  - Reads `language` from useI18n() and passes it into
 *    getPlaybookBlocks / getPlaybookQuickAccess / findPlaybookBlock /
 *    findPlaybookTopic so content is fully localized.
 *  - Replaces hardcoded "TikTok Account Safety & Strategy" with
 *    strings.playbookHeaderTitle.
 *  - Replaces hardcoded "Source note" with strings.playbookSourceNoteLabel.
 * -----------------------------------------------------------------------
 */
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  PlayCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";

import { trackContent } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n, useStrings } from "@/i18n";
import {
  findPlaybookBlock,
  findPlaybookTopic,
  getPlaybookBlocks,
  getPlaybookQuickAccess,
  getPlaybookSearchText,
} from "@/playbook/content";
import type { PlaybookBlock, PlaybookTopic } from "@/types/playbook";

import { ScreenShell, type ScreenNavProps } from "@/components/navigation/screen-shell";
import { ScreenHeader } from "@/components/navigation/screen-header";

export function PlaybookScreen({
  onBack,
  ...nav
}: { onBack: () => void } & ScreenNavProps) {
  const strings = useStrings();
  const { language } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedBlockKey, setSelectedBlockKey] = useState<string | null>(null);
  const [selectedTopicKey, setSelectedTopicKey] = useState<string | null>(null);

  const playbookBlocks = useMemo(() => getPlaybookBlocks(language), [language]);
  const playbookQuickAccess = useMemo(
    () => getPlaybookQuickAccess(language),
    [language],
  );

  const selectedBlock = selectedBlockKey
    ? findPlaybookBlock(language, selectedBlockKey)
    : undefined;
  const selectedTopic =
    selectedBlockKey && selectedTopicKey
      ? findPlaybookTopic(language, selectedBlockKey, selectedTopicKey)
      : undefined;

  // Track actual viewed Playbook block/topic; search text is never collected.
  useEffect(() => {
    if (selectedBlockKey && selectedTopicKey) {
      trackContent("playbook_topic", selectedBlockKey + ":" + selectedTopicKey);
    } else if (selectedBlockKey) {
      trackContent("playbook_block", selectedBlockKey);
    } else {
      trackContent("", "");
    }
    return () => trackContent("", "");
  }, [selectedBlockKey, selectedTopicKey]);

  const query = search.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!query) {
      return [];
    }

    return playbookBlocks.flatMap((block) =>
      block.topics
        .filter((topic) =>
          [block.title, block.description, getPlaybookSearchText(topic)]
            .join(" ")
            .toLowerCase()
            .includes(query),
        )
        .map((topic) => ({ block, topic })),
    );
  }, [playbookBlocks, query]);

  const goBack = () => {
    if (selectedTopicKey) {
      setSelectedTopicKey(null);
      return;
    }

    if (selectedBlockKey) {
      setSelectedBlockKey(null);
      return;
    }

    onBack();
  };

  const openTopic = (blockKey: string, topicKey: string) => {
    setSelectedBlockKey(blockKey);
    setSelectedTopicKey(topicKey);
  };

  if (selectedBlock && selectedTopic) {
    return (
      <PlaybookTopicView
        block={selectedBlock}
        topic={selectedTopic}
        onBack={goBack}
        {...nav}
      />
    );
  }

  if (selectedBlock) {
    return (
      <PlaybookBlockView
        block={selectedBlock}
        onBack={goBack}
        onOpenTopic={(topicKey) => setSelectedTopicKey(topicKey)}
        {...nav}
      />
    );
  }

  return (
    <ScreenShell activeTab="playbook" nav={nav}>
      <ScreenHeader
        navigateUpVariant="home"
        onNavigateUp={goBack}
        title={strings.productName}
      />

      <section>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {strings.playbookHeaderTitle}
          </h1>
          <Badge className="bg-success/10 text-success" variant="outline">
            {strings.playbookBadge}
          </Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {strings.playbookSubtitle}
        </p>
      </section>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-foreground"
          placeholder={strings.playbookSearchPlaceholder}
          type="search"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
        />
      </label>

      {query ? (
        <section className="space-y-2">
          {searchResults.length > 0 ? (
            searchResults.map(({ block, topic }) => (
              <button
                key={`${block.key}:${topic.key}`}
                data-analytics-id={`playbook.search_result.${block.key}.${topic.key}`}
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition hover:bg-muted/60"
                type="button"
                onClick={() => openTopic(block.key, topic.key)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold tabular-nums">
                  {block.position}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium leading-5">{topic.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {block.title}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))
          ) : (
            <Card size="sm">
              <CardContent className="py-2 text-sm text-muted-foreground">
                {strings.playbookNoResults}
              </CardContent>
            </Card>
          )}
        </section>
      ) : (
        <section className="space-y-2">
          {playbookBlocks.map((block) => (
            <button
              key={block.key}
              data-analytics-id={`playbook.block.${block.key}`}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition hover:bg-muted/60"
              type="button"
              onClick={() => setSelectedBlockKey(block.key)}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-base font-semibold tabular-nums">
                {block.position}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium leading-5">{block.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {strings.playbookTopicsCount(block.topics.length)}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </section>
      )}

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{strings.playbookQuickAccess}</h2>
        <div className="grid grid-cols-3 gap-2">
          {playbookQuickAccess.map((item, index) => {
            const Icon = [ShieldCheck, ShoppingBag, CalendarCheck][index];

            return (
              <button
                key={item.key}
                data-analytics-id={`playbook.quick_access.${item.key}`}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-2 text-center transition hover:bg-muted/60"
                type="button"
                onClick={() => openTopic(item.blockKey, item.topicKey)}
              >
                <Icon className="size-5 text-success" />
                <span className="text-xs font-medium leading-4">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </ScreenShell>
  );
}

function PlaybookBlockView({
  block,
  onBack,
  onOpenTopic,
  ...nav
}: {
  block: PlaybookBlock;
  onBack: () => void;
  onOpenTopic: (topicKey: string) => void;
} & ScreenNavProps) {
  const strings = useStrings();

  return (
    <ScreenShell activeTab="playbook" nav={nav}>
      <ScreenHeader
        navigateUpVariant="back"
        onNavigateUp={onBack}
        title={block.title}
      />

      <section>
        <Badge variant="secondary">{strings.playbookBlockLabel(block.position)}</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{block.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {block.description}
        </p>
      </section>

      <section className="space-y-2">
        {block.topics.map((topic, index) => (
          <button
            key={topic.key}
            data-analytics-id={`playbook.topic.${block.key}.${topic.key}`}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition hover:bg-muted/60"
            type="button"
            onClick={() => onOpenTopic(topic.key)}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold tabular-nums">
              {block.position}.{index + 1}
            </span>
            <span className="min-w-0 flex-1 font-medium leading-5">{topic.title}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </section>
    </ScreenShell>
  );
}

function PlaybookTopicView({
  block,
  topic,
  onBack,
  ...nav
}: {
  block: PlaybookBlock;
  topic: PlaybookTopic;
  onBack: () => void;
} & ScreenNavProps) {
  const strings = useStrings();
  const topicPosition = block.topics.findIndex((item) => item.key === topic.key) + 1;

  return (
    <ScreenShell activeTab="playbook" contentClassName="gap-4" nav={nav}>
      <ScreenHeader
        navigateUpVariant="back"
        onNavigateUp={onBack}
        title={block.title}
      />

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {strings.playbookBlockLabel(block.position)} · {block.position}.{topicPosition}
          </Badge>
          {topic.checklist ? (
            <Badge className="bg-success/10 text-success" variant="outline">
              {strings.playbookChecklistBadge}
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{topic.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {strings.playbookReferencePage}
        </p>
      </section>

      <ReferenceSection title={strings.playbookQuickAnswer}>
        <p className="text-sm leading-6">{topic.quickAnswer}</p>
      </ReferenceSection>

      {topic.checklist ? <ChecklistCard topic={topic} /> : null}

      {topic.steps?.length ? (
        <ReferenceSection title={strings.playbookStepByStep}>
          <NumberedList items={topic.steps} />
        </ReferenceSection>
      ) : null}

      {topic.scenarios?.length ? (
        <ReferenceSection title={strings.playbookPracticalScenarios}>
          <BulletList items={topic.scenarios} />
        </ReferenceSection>
      ) : null}

      {topic.importantDetails?.length ? (
        <ReferenceSection title={strings.playbookImportantDetails}>
          <BulletList items={topic.importantDetails} />
        </ReferenceSection>
      ) : null}

      {topic.sourceNote ? (
        <Card size="sm">
          <CardContent className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">{strings.playbookSourceNoteLabel}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {topic.sourceNote}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card size="sm">
        <CardContent className="flex items-start gap-3">
          <PlayCircle className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium">{strings.playbookWatchExplanation}</p>
            {topic.recordingUrl ? (
              <a
                className="mt-1 inline-block text-sm underline underline-offset-4"
                href={topic.recordingUrl}
                data-analytics-id={`playbook.recording.${block.key}.${topic.key}`}
                rel="noreferrer"
                target="_blank"
              >
                {strings.playbookRecordingAvailable}
              </a>
            ) : (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {strings.playbookRecordingPending}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </ScreenShell>
  );
}

function ChecklistCard({ topic }: { topic: PlaybookTopic }) {
  if (!topic.checklist) {
    return null;
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{topic.checklist.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {topic.checklist.description}
        </p>
        <ul className="space-y-2">
          {topic.checklist.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm leading-6">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-success" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {topic.checklist.note ? (
          <p className="rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground">
            {topic.checklist.note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 text-sm leading-6">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold tabular-nums">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-6">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ReferenceSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
