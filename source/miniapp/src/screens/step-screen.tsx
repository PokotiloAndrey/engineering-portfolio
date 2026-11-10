import { ArrowRight, CheckCircle2, Play } from "lucide-react";

import { StepCompletion } from "@/components/step/step-completion";
import { StepLayout } from "@/components/step/step-layout";
import { Button } from "@/components/ui/button";
import { localizedTaskTitle, useStrings, type TranslationStrings } from "@/i18n";
import { moduleOneCompletedTaskCount } from "@/module-one/self-check";
import { AFFILIATE_REGISTRATION_LINK } from "@/lib/affiliate-registration";
import type { JourneyStep, StepTask, StepTaskKey } from "@/types/journey";

export function StepScreen({
  affiliateRegistrationUrl,
  onBack,
  onOpenAffiliateRegistrationDetail,
  onOpenFirstLiveDetail,
  onOpenModuleOneDetail,
  onOpenModuleFourDetail,
  onOpenModuleThreeDetail,
  onOpenModuleTwoDetail,
  onOpenProductExperienceDetail,
  onOpenStreamReadyDetail,
  onContinuePreparation,
  onReturnToJourney,
  step,
  tasks,
  onOpenJourney,
  onOpenPlaybook,
  onOpenAchievements,
  onOpenProfile,
}: {
  affiliateRegistrationUrl: string | null;
  onBack: () => void;
  onOpenAffiliateRegistrationDetail: () => void;
  onOpenFirstLiveDetail: () => void;
  onOpenModuleOneDetail: () => void;
  onOpenModuleFourDetail: () => void;
  onOpenModuleThreeDetail: () => void;
  onOpenModuleTwoDetail: () => void;
  onOpenProductExperienceDetail: () => void;
  onOpenStreamReadyDetail: () => void;
  onContinuePreparation: () => void;
  onReturnToJourney: () => void;
  step: JourneyStep;
  tasks: StepTask[];
  onOpenJourney: () => void;
  onOpenPlaybook: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
}) {
  const strings = useStrings();
  const nav = { onOpenJourney, onOpenPlaybook, onOpenAchievements, onOpenProfile };

  // Modules are informational; homework completion is not tracked here.
  const showCompletion = false;

  const v2Module = v2ModuleConfig(strings, step.key, {
    onOpenModuleTwoDetail,
    onOpenModuleThreeDetail,
    onOpenModuleFourDetail,
  });

  if (v2Module) {
    const nextTitle = v2Module.nextStepKey
      ? strings.stepTitles[v2Module.nextStepKey]
      : strings.courseCompletedTitle;

    return (
      <StepLayout
        description={showCompletion ? undefined : v2Module.description}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        subtitle={showCompletion ? undefined : v2Module.subtitle}
        title={v2Module.title}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {v2Module.title}
                  </span>
                  {step.key === "module_4" ? (
                    <span className="mt-2 block">{strings.courseCompletedReviewNote}</span>
                  ) : null}
                </>
              }
              next={v2Module.nextStepKey ? nextTitle : undefined}
              title={step.key === "module_4" ? strings.courseCompletedTitle : strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              {v2Module.nextStepKey ? (
                <Button
                  className="w-full"
                  size="lg"
                  type="button"
                  onClick={v2Module.onOpenNext}
                >
                  {strings.continueToNext}
                  <ArrowRight className="size-4" />
                </Button>
              ) : null}

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* "Open module" CTA and homework forms/complete buttons are
                  intentionally removed. Progress is now driven exclusively
                  by an external webhook writing to Supabase — this screen
                  only reads and displays the current state. */}
              <section className="space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    {strings.homeworkSectionTitle}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {tasks.length}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {tasks.map((task, index) => {
                    return (
                      <div key={task.key} className="space-y-2">
                        <div className="flex h-auto min-h-14 w-full items-start justify-start gap-3 rounded-lg border border-border px-3 py-3 text-left font-medium">
                          <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                              {index === 0 ? strings.homeworkOne : strings.homeworkTwo}
                            </span>
                            <span className="text-wrap leading-5">
                              {localizedTaskTitle(strings, task)}
                            </span>
                            <span className="text-xs font-normal text-muted-foreground">
                              {strings.homeworkReady}
                            </span>
                          </span>
                          
                        </div>

                        <div className="space-y-3 rounded-lg border border-border bg-card p-3">
                          <HomeworkInstructions
                            affiliateRegistrationUrl={affiliateRegistrationUrl}
                            taskKey={task.key}
                            strings={strings}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "module_1") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.moduleOneDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        title={strings.stepTitles.module_1}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.moduleOneShortTitle}
                  </span>
                </>
              }
              next={strings.affiliateRegistrationTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                type="button"
                onClick={onOpenAffiliateRegistrationDetail}
              >
                {strings.continueToNext}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    {strings.afterModule}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "affiliate_registration") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.affiliateRegistrationDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        title={strings.affiliateRegistrationTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.affiliateRegistrationTitle}
                  </span>
                </>
              }
              next={strings.productExperienceTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                type="button"
                onClick={onOpenProductExperienceDetail}
              >
                {strings.continueToNext}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    {strings.yourTask}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "product_experience") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.productExperienceDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        title={strings.productExperienceTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.productExperienceTitle}
                  </span>
                </>
              }
              next={strings.moduleTwoShortTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button className="w-full" size="lg" type="button" onClick={onOpenModuleTwoDetail}>
                {strings.continueToNext}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    {strings.yourTask}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "module_2") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.moduleTwoDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        subtitle={showCompletion ? undefined : strings.moduleTwoSubtitle}
        title={strings.moduleTwoShortTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.moduleTwoShortTitle}
                  </span>
                </>
              }
              next={strings.streamReadyTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button className="w-full" size="lg" type="button" onClick={onOpenStreamReadyDetail}>
                {strings.continueToNext}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "stream_ready") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.streamReadyDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        title={strings.streamReadyTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.streamReadyTitle}
                  </span>
                </>
              }
              next={strings.moduleThreeShortTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button className="w-full" size="lg" type="button" onClick={onOpenModuleThreeDetail}>
                {strings.continueToNext}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "module_3") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.moduleThreeDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        subtitle={showCompletion ? undefined : strings.moduleThreeSubtitle}
        title={strings.moduleThreeShortTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.moduleOneCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.moduleThreeShortTitle}
                  </span>
                </>
              }
              next={strings.firstLiveTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button className="w-full" size="lg" type="button" onClick={onOpenFirstLiveDetail}>
                {strings.continueToNext}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "first_live") {
    const completedTaskCount = moduleOneCompletedTaskCount(tasks);

    return (
      <StepLayout
        description={showCompletion ? undefined : strings.firstLiveDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        title={strings.firstLiveTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={
                <>
                  <span className="block">{strings.academyCompletedBody}</span>
                  <span className="block font-medium text-foreground">
                    {strings.academyCompletedFirstLive}
                  </span>
                </>
              }
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <Button
              className="w-full"
              size="lg"
              type="button"
              variant="secondary"
              onClick={onReturnToJourney}
            >
              {strings.backToMyJourney}
            </Button>
          ) : (
            <div className="space-y-5">
              <section className="space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{strings.yourChecklist}</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedTaskCount}/{tasks.length}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  if (step.key === "scholarship") {
    return (
      <StepLayout
        description={strings.scholarshipDescription}
        eyebrow={strings.productName}
        error={null}
        icon={<CheckCircle2 className="size-5" />}
        title={strings.scholarshipTeaserTitle}
        cta={
          <div className="space-y-3">
            <Button className="w-full" size="lg" type="button" onClick={onContinuePreparation}>
              {strings.continuePreparation}
              <ArrowRight className="size-4" />
            </Button>

            <Button
              className="w-full"
              size="lg"
              type="button"
              variant="secondary"
              onClick={onReturnToJourney}
            >
              {strings.backToMyJourney}
            </Button>
          </div>
        }
        onBack={onBack}
        {...nav}
      >
        <section className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              {strings.scholarshipTitle}
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {strings.scholarshipTeaserAmount}
            </p>
          </div>

          <div className="space-y-2 text-sm leading-6 text-muted-foreground">
            <p>{strings.scholarshipOpportunity}</p>
            <p>{strings.scholarshipEligibility}</p>
            <p>{strings.scholarshipNotGuaranteed}</p>
          </div>
        </section>
      </StepLayout>
    );
  }

  if (step.key === "promo_live") {
    return (
      <StepLayout
        description={showCompletion ? undefined : strings.promoLiveDescription}
        eyebrow={strings.productName}
        error={null}
        icon={showCompletion ? <CheckCircle2 className="size-5" /> : <Play className="size-5" />}
        title={strings.promoLiveTitle}
        completion={
          showCompletion ? (
            <StepCompletion
              body={strings.promoLiveCompleted}
              next={strings.moduleOneShortTitle}
              title={strings.stepCompletedTitle}
            />
          ) : undefined
        }
        cta={
          showCompletion ? (
            <div className="space-y-3">
              <Button className="w-full" size="lg" type="button" onClick={onOpenModuleOneDetail}>
                {strings.continueWithModuleOne}
                <ArrowRight className="size-4" />
              </Button>

              <Button
                className="w-full"
                size="lg"
                type="button"
                variant="secondary"
                onClick={onReturnToJourney}
              >
                {strings.backToMyJourney}
              </Button>
            </div>
          ) : undefined
        }
        onBack={onBack}
        {...nav}
      />
    );
  }

  return (
    <StepLayout
      eyebrow={strings.productName}
      icon={<CheckCircle2 className="size-5" />}
      title={strings.stepTitles[step.key as keyof typeof strings.stepTitles] ?? step.title}
      onBack={onBack}
      {...nav}
    />
  );
}

function v2ModuleConfig(
  strings: TranslationStrings,
  stepKey: string,
  handlers: {
    onOpenModuleTwoDetail: () => void;
    onOpenModuleThreeDetail: () => void;
    onOpenModuleFourDetail: () => void;
  },
): {
  title: string;
  subtitle?: string;
  description: string;
  nextStepKey: "module_2" | "module_3" | "module_4" | null;
  onOpenNext?: () => void;
} | null {
  switch (stepKey) {
    case "module_1":
      return {
        title: strings.moduleOneShortTitle,
        subtitle: strings.moduleOneV2Subtitle,
        description: strings.moduleOneDescription,
        nextStepKey: "module_2",
        onOpenNext: handlers.onOpenModuleTwoDetail,
      };
    case "module_2":
      return {
        title: strings.moduleTwoShortTitle,
        subtitle: strings.moduleTwoSubtitle,
        description: strings.moduleTwoDescription,
        nextStepKey: "module_3",
        onOpenNext: handlers.onOpenModuleThreeDetail,
      };
    case "module_3":
      return {
        title: strings.moduleThreeShortTitle,
        subtitle: strings.moduleThreeSubtitle,
        description: strings.moduleThreeDescription,
        nextStepKey: "module_4",
        onOpenNext: handlers.onOpenModuleFourDetail,
      };
    case "module_4":
      return {
        title: strings.moduleFourShortTitle,
        subtitle: strings.moduleFourSubtitle,
        description: strings.moduleFourDescription,
        nextStepKey: null,
      };
    default:
      return null;
  }
}

function HomeworkInstructions({
  affiliateRegistrationUrl,
  taskKey,
  strings,
}: {
  affiliateRegistrationUrl: string | null;
  taskKey: StepTaskKey;
  strings: TranslationStrings;
}) {
  const instruction = strings.homeworkInstructions[taskKey];

  return (
    <div className="space-y-3 rounded-md bg-muted/40 p-3 text-sm leading-5">
      <p>{instruction.intro}</p>

      <ol className="list-decimal space-y-1 pl-5">
        {instruction.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      {instruction.links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {instruction.links.map((link, index) => {
            const url =
              link.url === AFFILIATE_REGISTRATION_LINK
                ? affiliateRegistrationUrl
                : link.url;

            if (!url) return null;

            return (
              <a
                key={url}
                className="font-medium underline underline-offset-4"
                href={url}
                data-analytics-id={`homework.link.${taskKey}.${index + 1}`}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      ) : null}

      {taskKey === "module_1_affiliate_registration" &&
      !affiliateRegistrationUrl &&
      instruction.links.some((link) => link.url === AFFILIATE_REGISTRATION_LINK) ? (
        <p className="text-sm text-destructive">{strings.affiliateRegistrationUrlMissing}</p>
      ) : null}

      <p className="text-muted-foreground">{instruction.note}</p>
      <p className="font-medium">{instruction.submit}</p>
    </div>
  );
}

