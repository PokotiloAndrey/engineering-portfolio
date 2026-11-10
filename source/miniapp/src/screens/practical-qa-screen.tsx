import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Send,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenShell, type ScreenNavProps } from "@/components/navigation/screen-shell";
import { useStrings } from "@/i18n";
import type {
  PracticalQaCategory,
  PracticalQaMetrics,
  PracticalQaSubmissionInput,
  PracticalQaSubmissionResult,
} from "@/types/practical-qa";

type SubmissionState = "idle" | "submitting" | "success" | "error";
type QaMode = "case" | "question";

const categories: PracticalQaCategory[] = [
  "tiktok_viewers",
  "viewer_retention",
  "trading_what_to_say",
  "telegram_joins",
  "telegram_content",
  "leads_dm",
  "registrations",
  "partner_performance",
  "technical",
  "other",
];

export function PracticalQaScreen({
  onBack,
  onOpenPlaybook,
  onSubmit,
  suggestedCase,
  ...nav
}: {
  onBack: () => void;
  onOpenPlaybook: () => void;
  suggestedCase?: {
    whatHappened: string;
    metrics: PracticalQaMetrics;
  };
  onSubmit: (input: PracticalQaSubmissionInput) => Promise<PracticalQaSubmissionResult>;
} & ScreenNavProps) {
  const strings = useStrings();
  const [mode, setMode] = useState<QaMode>("case");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [result, setResult] = useState<PracticalQaSubmissionResult | null>(null);
  const fullNav = { onOpenPlaybook, ...nav };

  const submit = async (input: PracticalQaSubmissionInput) => {
    if (submissionState === "submitting") {
      return;
    }

    setSubmissionState("submitting");
    setSubmissionError(null);

    try {
      const submitted = await onSubmit(input);
      setResult(submitted);
      setSubmissionState("success");
    } catch (error) {
      setSubmissionError(
        error instanceof Error && error.message
          ? error.message
          : strings.practicalQaSubmitError,
      );
      setSubmissionState("error");
    }
  };

  const resetSubmission = () => {
    setSubmissionState("idle");
    setSubmissionError(null);
    setResult(null);
  };

  if (submissionState === "success" && result) {
    return (
      <ScreenShell activeTab="journey" nav={fullNav}>
        <Button
          className="w-fit px-0"
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          {strings.practicalQaBack}
        </Button>

        <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="size-6" />
        </div>

        <div>
          <Badge variant="secondary">{strings.practicalQaSubmittedBadge}</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {strings.practicalQaSubmittedTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {strings.practicalQaSubmittedBody}
          </p>
        </div>

        <Card size="sm">
          <CardContent className="space-y-2">
            <p className="text-sm font-medium">{strings.practicalQaSelectionNoteTitle}</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {strings.practicalQaSelectionNoteBody}
            </p>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" type="button" onClick={resetSubmission}>
          {strings.practicalQaSubmitAnother}
        </Button>
        <Button className="w-full" size="lg" type="button" variant="outline" onClick={onBack}>
          {strings.practicalQaBackToAcademy}
        </Button>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell activeTab="journey" nav={fullNav}>
      <header>
        <Button
          className="mb-3 w-fit px-0"
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          {strings.practicalQaBack}
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <Badge variant="secondary">{strings.practicalQaFrequency}</Badge>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {strings.practicalQaTitle}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {strings.practicalQaSubtitle}
        </p>
      </header>

      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4" />
            {strings.practicalQaHowSessionsWorkTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-6 text-muted-foreground">
          <p>{strings.practicalQaHowSessionsWorkBody}</p>
          <p className="font-medium text-foreground">{strings.practicalQaSessionMix}</p>
          <p>{strings.practicalQaScheduleNote}</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="size-4" />
            {strings.practicalQaKnowledgeBaseTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">
            {strings.practicalQaKnowledgeBaseBody}
          </p>
          <Button className="w-full" type="button" variant="outline" onClick={onOpenPlaybook}>
            <BookOpen className="size-4" />
            {strings.practicalQaOpenPlaybook}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        <button
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "case" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
          type="button"
          onClick={() => {
            setMode("case");
            setSubmissionError(null);
          }}
        >
          {strings.practicalQaCaseTab}
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "question" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
          type="button"
          onClick={() => {
            setMode("question");
            setSubmissionError(null);
          }}
        >
          {strings.practicalQaQuestionTab}
        </button>
      </div>

      {mode === "case" ? (
        <PracticalCaseForm
          disabled={submissionState === "submitting"}
          suggestedCase={suggestedCase}
          onSubmit={(input) => void submit(input)}
        />
      ) : (
        <QaQuestionForm
          disabled={submissionState === "submitting"}
          onSubmit={(input) => void submit(input)}
        />
      )}

      {submissionError ? (
        <Alert variant="destructive">
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      ) : null}

      <Card size="sm">
        <CardContent className="space-y-2 text-sm leading-6 text-muted-foreground">
          <p className="font-medium text-foreground">{strings.practicalQaLoopTitle}</p>
          <p>{strings.practicalQaLoop}</p>
        </CardContent>
      </Card>
    </ScreenShell>
  );
}

function PracticalCaseForm({
  disabled,
  onSubmit,
  suggestedCase,
}: {
  disabled: boolean;
  suggestedCase?: {
    whatHappened: string;
    metrics: PracticalQaMetrics;
  };
  onSubmit: (input: PracticalQaSubmissionInput) => void;
}) {
  const strings = useStrings();
  const [category, setCategory] = useState<PracticalQaCategory>(
    suggestedCase ? "other" : "tiktok_viewers",
  );
  const [whatHappened, setWhatHappened] = useState(suggestedCase?.whatHappened ?? "");
  const [alreadyTried, setAlreadyTried] = useState("");
  const [links, setLinks] = useState("");
  const [question, setQuestion] = useState("");
  const [knowledgeBaseChecked, setKnowledgeBaseChecked] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, string>>(() =>
    stringMetrics(suggestedCase?.metrics),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      kind: "practical_case",
      category,
      whatHappened: whatHappened.trim(),
      metrics: {
        lives_completed: optionalNumber(metrics.lives_completed),
        average_viewers: optionalNumber(metrics.average_viewers),
        peak_viewers: optionalNumber(metrics.peak_viewers),
        telegram_joins: optionalNumber(metrics.telegram_joins),
        dm_replies: optionalNumber(metrics.dm_replies),
        registrations: optionalNumber(metrics.registrations),
      },
      alreadyTried: alreadyTried.trim(),
      links: links.trim(),
      question: question.trim(),
      knowledgeBaseChecked,
    });
  };

  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="size-4" />
          {strings.practicalQaCaseTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {suggestedCase ? (
            <Alert>
              <AlertDescription>
                <span className="font-medium">{strings.practicalQaPrefilledTitle}</span>
                <span className="mt-1 block">{strings.practicalQaPrefilledBody}</span>
              </AlertDescription>
            </Alert>
          ) : null}

          <Field label={strings.practicalQaStrugglingWith}>
            <CategorySelect value={category} onChange={setCategory} />
          </Field>

          <Field label={strings.practicalQaWhatHappened}>
            <textarea
              className={textareaClassName}
              disabled={disabled}
              maxLength={2000}
              placeholder={strings.practicalQaWhatHappenedPlaceholder}
              required
              rows={4}
              value={whatHappened}
              onChange={(event) => setWhatHappened(event.target.value)}
            />
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium">{strings.practicalQaYourNumbers}</p>
            <div className="grid grid-cols-2 gap-2">
              <MetricInput
                disabled={disabled}
                label={strings.practicalQaMetricLives}
                value={metrics.lives_completed ?? ""}
                onChange={(value) => setMetrics((current) => ({ ...current, lives_completed: value }))}
              />
              <MetricInput
                disabled={disabled}
                label={strings.practicalQaMetricAverageViewers}
                value={metrics.average_viewers ?? ""}
                onChange={(value) => setMetrics((current) => ({ ...current, average_viewers: value }))}
              />
              <MetricInput
                disabled={disabled}
                label={strings.practicalQaMetricPeakViewers}
                value={metrics.peak_viewers ?? ""}
                onChange={(value) => setMetrics((current) => ({ ...current, peak_viewers: value }))}
              />
              <MetricInput
                disabled={disabled}
                label={strings.practicalQaMetricTelegramJoins}
                value={metrics.telegram_joins ?? ""}
                onChange={(value) => setMetrics((current) => ({ ...current, telegram_joins: value }))}
              />
              <MetricInput
                disabled={disabled}
                label={strings.practicalQaMetricDmReplies}
                value={metrics.dm_replies ?? ""}
                onChange={(value) => setMetrics((current) => ({ ...current, dm_replies: value }))}
              />
              <MetricInput
                disabled={disabled}
                label={strings.practicalQaMetricRegistrations}
                value={metrics.registrations ?? ""}
                onChange={(value) => setMetrics((current) => ({ ...current, registrations: value }))}
              />
            </div>
          </div>

          <Field label={strings.practicalQaAlreadyTried}>
            <textarea
              className={textareaClassName}
              disabled={disabled}
              maxLength={1500}
              placeholder={strings.practicalQaAlreadyTriedPlaceholder}
              required
              rows={3}
              value={alreadyTried}
              onChange={(event) => setAlreadyTried(event.target.value)}
            />
          </Field>

          <Field label={strings.practicalQaLinks} optional={strings.practicalQaOptional}>
            <textarea
              className={textareaClassName}
              disabled={disabled}
              maxLength={2000}
              placeholder={strings.practicalQaLinksPlaceholder}
              rows={2}
              value={links}
              onChange={(event) => setLinks(event.target.value)}
            />
          </Field>

          <Field label={strings.practicalQaMasterQuestion}>
            <textarea
              className={textareaClassName}
              disabled={disabled}
              maxLength={1200}
              placeholder={strings.practicalQaMasterQuestionPlaceholder}
              required
              rows={3}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </Field>

          <KnowledgeBaseCheck
            checked={knowledgeBaseChecked}
            disabled={disabled}
            onChange={setKnowledgeBaseChecked}
          />

          <Button className="w-full" disabled={disabled} size="lg" type="submit">
            <Send className="size-4" />
            {disabled ? strings.practicalQaSubmitting : strings.practicalQaSubmitCase}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function QaQuestionForm({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (input: PracticalQaSubmissionInput) => void;
}) {
  const strings = useStrings();
  const [category, setCategory] = useState<PracticalQaCategory>("other");
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [knowledgeBaseChecked, setKnowledgeBaseChecked] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      kind: "question",
      category,
      question: question.trim(),
      context: context.trim(),
      knowledgeBaseChecked,
    });
  };

  return (
    <Card size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CircleHelp className="size-4" />
          {strings.practicalQaQuestionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label={strings.practicalQaQuestionCategory}>
            <CategorySelect value={category} onChange={setCategory} />
          </Field>

          <Field label={strings.practicalQaQuestionLabel}>
            <textarea
              className={textareaClassName}
              disabled={disabled}
              maxLength={1200}
              placeholder={strings.practicalQaQuestionPlaceholder}
              required
              rows={4}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </Field>

          <Field label={strings.practicalQaQuestionContext} optional={strings.practicalQaOptional}>
            <textarea
              className={textareaClassName}
              disabled={disabled}
              maxLength={1500}
              placeholder={strings.practicalQaQuestionContextPlaceholder}
              rows={3}
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
          </Field>

          <KnowledgeBaseCheck
            checked={knowledgeBaseChecked}
            disabled={disabled}
            onChange={setKnowledgeBaseChecked}
          />

          <Button
            className="w-full"
            disabled={disabled || !knowledgeBaseChecked}
            size="lg"
            type="submit"
          >
            <Send className="size-4" />
            {disabled ? strings.practicalQaSubmitting : strings.practicalQaSubmitQuestion}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CategorySelect({
  value,
  onChange,
}: {
  value: PracticalQaCategory;
  onChange: (value: PracticalQaCategory) => void;
}) {
  const strings = useStrings();

  return (
    <select
      className={inputClassName}
      value={value}
      onChange={(event) => onChange(event.target.value as PracticalQaCategory)}
    >
      {categories.map((category) => (
        <option key={category} value={category}>
          {strings.practicalQaCategories[category]}
        </option>
      ))}
    </select>
  );
}

function KnowledgeBaseCheck({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) {
  const strings = useStrings();

  return (
    <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm leading-5">
      <input
        checked={checked}
        className="mt-0.5 size-4 accent-current"
        disabled={disabled}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <span className="font-medium">{strings.practicalQaKbCheckTitle}</span>
        <span className="mt-1 block text-muted-foreground">
          {strings.practicalQaKbCheckBody}
        </span>
      </span>
    </label>
  );
}

function Field({
  children,
  label,
  optional,
}: {
  children: React.ReactNode;
  label: string;
  optional?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted-foreground">({optional})</span> : null}
      </span>
      {children}
    </label>
  );
}

function MetricInput({
  disabled,
  label,
  value,
  onChange,
}: {
  disabled: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <input
        className={inputClassName}
        disabled={disabled}
        inputMode="numeric"
        min={0}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function stringMetrics(
  metrics: PracticalQaMetrics | undefined,
): Record<string, string> {
  if (!metrics) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(metrics)
      .filter(([, value]) => typeof value === "number")
      .map(([key, value]) => [key, String(value)]),
  );
}

function optionalNumber(value: string | undefined): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : undefined;
}

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50";

const textareaClassName =
  "w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-5 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50";
