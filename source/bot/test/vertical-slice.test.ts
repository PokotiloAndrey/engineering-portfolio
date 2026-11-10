import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

import {
  bootstrapStudent,
  type BootstrapRepository,
  type CreateStudentInput,
  type EventName,
  type Student,
  type UpdateStudentProfileInput,
} from "../../supabase/functions/_shared/bootstrap.ts";
import {
  initialStatusForStep,
  JOURNEY_STEPS,
  type JourneyStepState,
} from "../../supabase/functions/_shared/journey.ts";
import { openModuleForTelegramUser } from "../../supabase/functions/_shared/module-open.ts";
import {
  completeStepForTelegramUser,
  completeTaskForTelegramUser,
  PROGRESSION_STEPS,
  PROGRESSION_TASKS,
  ProgressionError,
  reviewStatusForTask,
  type HomeworkSubmissionInput,
  type ProgressionStepKey,
  type ProgressionTaskKey,
  type ProgressionTaskState,
  type StepCompletionTransitionResult,
  type TaskCompletionResult,
  type TasksByStep,
} from "../../supabase/functions/_shared/progression.ts";
import { resetProgressForTelegramUser } from "../../supabase/functions/_shared/reset-progress.ts";
import {
  assertModuleCanOpen,
  resolveTrustedModuleUrl,
} from "../../supabase/functions/_shared/redirect.ts";
import {
  TelegramAuthError,
  validateTelegramInitData,
} from "../../supabase/functions/_shared/telegram-auth.ts";
import { completeTask } from "../../miniapp/src/api/complete-task.ts";
import {
  canSubmitModuleOpen,
  moduleOpenButtonLabel,
  openModuleLearningDestination,
} from "../../miniapp/src/module-one/open-module-learning.ts";
import {
  canCompleteModuleOne,
  canSubmitTaskCompletion,
  updateTaskCompletionState,
} from "../../miniapp/src/module-one/self-check.ts";
import {
  canOpenStepDetail,
  createJourneyViewState,
  openProfileScreen,
  openStepDetail,
  returnToJourneyScreen,
  visibleJourneySteps,
} from "../../miniapp/src/navigation.ts";
import { openExternalLink } from "../../miniapp/src/telegram/web-app.ts";
import { translations } from "../../miniapp/src/i18n/index.ts";
import type {
  BootstrapResponse,
  HomeworkStatus,
  LanguageCode,
} from "../../miniapp/src/types/journey.ts";

const BOT_TOKEN = "123456:test-token";
const NOW_SECONDS = 1_800_000_000;

describe("Telegram initData validation", () => {
  it("accepts valid signed initData", async () => {
    const initData = signedInitData({
      auth_date: String(NOW_SECONDS),
      user: JSON.stringify({
        id: 1001,
        first_name: "Ana",
        username: "ana_stream",
        language_code: "es",
      }),
      start_param: "campaign_mx",
    });

    const validated = await validateTelegramInitData(initData, {
      botToken: BOT_TOKEN,
      maxAgeSeconds: 86_400,
      nowSeconds: NOW_SECONDS,
    });

    expect(validated.user.id).toBe(1001);
    expect(validated.user.first_name).toBe("Ana");
    expect(validated.startParam).toBe("campaign_mx");
  });

  it("rejects invalid signatures", async () => {
    const initData = `${signedInitData({
      auth_date: String(NOW_SECONDS),
      user: JSON.stringify({ id: 1001, first_name: "Ana" }),
    })}tampered=true`;

    await expect(
      validateTelegramInitData(initData, {
        botToken: BOT_TOKEN,
        maxAgeSeconds: 86_400,
        nowSeconds: NOW_SECONDS,
      }),
    ).rejects.toThrow(TelegramAuthError);
  });

  it("rejects expired auth_date values", async () => {
    const initData = signedInitData({
      auth_date: String(NOW_SECONDS - 90_000),
      user: JSON.stringify({ id: 1001, first_name: "Ana" }),
    });

    await expect(
      validateTelegramInitData(initData, {
        botToken: BOT_TOKEN,
        maxAgeSeconds: 86_400,
        nowSeconds: NOW_SECONDS,
      }),
    ).rejects.toThrow("expired");
  });
});

describe("v2 bootstrap and Journey", () => {
  it("initializes a new v2 student with exactly Module 1-4", async () => {
    const repository = new InMemoryRepository();

    const bootstrap = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
        username: "ana_stream",
      },
      acquisitionSource: "campaign_mx",
    });

    expect(repository.students).toHaveLength(1);
    expect(bootstrap.student.curriculum_version).toBe("v2");
    expect(bootstrap.journey.map((step) => step.key)).toEqual([
      "module_1",
      "module_2",
      "module_3",
      "module_4",
    ]);
    expect(bootstrap.journey.map((step) => [step.key, step.status])).toEqual(
      JOURNEY_STEPS.map((step) => [step.key, initialStatusForStep(step.key)]),
    );
    expect(bootstrap.current_step?.key).toBe("module_1");
    expect(bootstrap.welcome_required).toBe(true);
    expect(bootstrap.module_1_tasks.map((task) => task.key)).toEqual([
      "module_1_affiliate_registration",
      "module_1_demo_practice",
    ]);
  });

  it("keeps Welcome outside Journey and outside progress", async () => {
    const repository = new InMemoryRepository();
    const bootstrap = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
    });
    const completedSteps = bootstrap.journey.filter(
      (step) => step.required && step.status === "completed",
    );

    expect(bootstrap.welcome_required).toBe(true);
    expect(bootstrap.journey.map((step) => step.key)).not.toContain("welcome");
    expect(bootstrap.journey).toHaveLength(4);
    expect(completedSteps).toHaveLength(0);
  });

  it("activates v2 for a legacy student through a clean curriculum restart", async () => {
    const repository = new InMemoryRepository();
    repository.students.push({
      ...sampleStudent(),
      curriculum_version: "v1",
      course_completed_at: new Date(0).toISOString(),
    });
    repository.studentSteps.set(
      "student-1",
      JOURNEY_STEPS.map((step) => ({
        key: step.key,
        title: step.title,
        position: step.position,
        required: step.required,
        status: "completed",
      })),
    );
    await repository.logEvent("student-1", "welcome_started", {
      curriculum_version: "v1",
    });

    const bootstrap = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
    });

    expect(bootstrap.student.curriculum_version).toBe("v2");
    expect(bootstrap.student.course_completed_at).toBeNull();
    expect(bootstrap.journey.map((step) => [step.key, step.status])).toEqual(
      JOURNEY_STEPS.map((step) => [step.key, initialStatusForStep(step.key)]),
    );
    expect(bootstrap.welcome_required).toBe(true);
  });

  it("starts from Welcome and skips it for returning started students", async () => {
    const repository = new InMemoryRepository();
    const welcome = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
    });
    const started = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
      markWelcomeStarted: true,
    });
    const returning = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
    });

    expect(createJourneyViewState(toBootstrapResponse(welcome)).screen).toBe("welcome");
    expect(started.welcome_required).toBe(false);
    expect(createJourneyViewState(toBootstrapResponse(started)).screen).toBe("journey");
    expect(returning.welcome_required).toBe(false);
    expect(createJourneyViewState(toBootstrapResponse(returning)).screen).toBe("journey");
  });

  it("preserves language selection and resolves Telegram language fallback", async () => {
    const repository = new InMemoryRepository();
    const detected = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ayu",
        language_code: "id",
      },
    });
    await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ayu",
        language_code: "id",
      },
      preferredLanguage: "pt-BR",
      logOpenEvents: false,
    });
    const preferred = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ayu",
        language_code: "en",
      },
    });
    const unsupported = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 2002,
        first_name: "Lou",
        language_code: "fr",
      },
    });
    const spanish = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3001,
        first_name: "Luis",
        language_code: "es",
      },
    });
    const portuguese = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3002,
        first_name: "Joao",
        language_code: "pt",
      },
    });
    const portugueseRegion = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3003,
        first_name: "Joao",
        language_code: "pt-BR",
      },
    });
    const legacyIndonesian = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3004,
        first_name: "Ayu",
        language_code: "in",
      },
    });
    const malay = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3005,
        first_name: "Budi",
        language_code: "ms",
      },
    });
    const malayRegion = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3006,
        first_name: "Siti",
        language_code: "ms-MY",
      },
    });
    const english = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3007,
        first_name: "John",
        language_code: "en",
      },
    });
    const russian = await bootstrapStudent(new InMemoryRepository(), {
      telegramUser: {
        id: 3008,
        first_name: "Ivan",
        language_code: "ru",
      },
    });

    expect(detected.resolved_language).toBe("id");
    expect(preferred.resolved_language).toBe("pt-BR");
    expect(unsupported.resolved_language).toBe("en");
    expect(spanish.resolved_language).toBe("es");
    expect(portuguese.resolved_language).toBe("pt-BR");
    expect(portugueseRegion.resolved_language).toBe("pt-BR");
    expect(legacyIndonesian.resolved_language).toBe("id");
    expect(malay.resolved_language).toBe("id");
    expect(malayRegion.resolved_language).toBe("id");
    expect(english.resolved_language).toBe("en");
    expect(russian.resolved_language).toBe("en");
  });

  it("shows all four curriculum modules while keeping locked modules locked", () => {
    const journey = [
      ...journeyWithStatuses({
      module_1: "completed",
      module_2: "available",
      module_3: "locked",
      module_4: "locked",
      }),
      {
        key: "course_completed",
        title: "Course Completed",
        position: 5,
        required: false,
        status: "completed",
      },
    ];
    const visible = visibleJourneySteps(journey);

    expect(visible.map((step) => step.key)).toEqual([
      "module_1",
      "module_2",
      "module_3",
      "module_4",
    ]);
    expect(visible.map((step) => [step.key, step.status])).toEqual([
      ["module_1", "completed"],
      ["module_2", "available"],
      ["module_3", "locked"],
      ["module_4", "locked"],
    ]);
    expect(visible.map((step) => step.key)).not.toContain("course_completed");
    expect(translations.en.stepTitles.module_1).toBe("Module 1 — Academy Activation");
    expect(translations.en.stepTitles.module_2).toBe("Module 2 — Funnel");
    expect(translations.en.stepTitles.module_3).toBe("Module 3 — Trading");
    expect(translations.en.stepTitles.module_4).toBe("Module 4 — First Live");
  });
});

describe("v2 navigation", () => {
  it("opens Module 1 detail from the current Journey target", async () => {
    const repository = new InMemoryRepository();
    const bootstrap = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
      markWelcomeStarted: true,
    });
    const state = createJourneyViewState(toBootstrapResponse(bootstrap));
    const detail = openStepDetail(state, bootstrap.current_step?.key ?? "");

    expect(bootstrap.current_step?.key).toBe("module_1");
    expect(detail.screen).toBe("step");
    expect(detail.selectedStepKey).toBe("module_1");
  });

  it("opens Profile from the Journey profile control state", async () => {
    const repository = new InMemoryRepository();
    const bootstrap = await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
        username: "ana_stream",
      },
      markWelcomeStarted: true,
    });
    const profile = openProfileScreen(createJourneyViewState(toBootstrapResponse(bootstrap)));

    expect(profile.screen).toBe("profile");
    expect(profile.selectedStepKey).toBeNull();
    expect(profile.journeyData.student.telegram_username).toBe("ana_stream");
    expect(profile.journeyData.current_step?.key).toBe("module_1");
  });

  it("keeps Course Completed outside Journey", () => {
    const response = toBootstrapResponse({
      student: {
        ...sampleStudent(),
        course_completed_at: new Date(0).toISOString(),
      },
      journey: journeyWithStatuses({
        module_1: "completed",
        module_2: "completed",
        module_3: "completed",
        module_4: "completed",
      }),
      current_step: null,
    });
    const state = createJourneyViewState(response);

    expect(state.screen).toBe("course_completed");
    expect(response.journey.map((step) => step.key)).not.toContain("course_completed");
  });
});

describe("trusted Module 1 opening", () => {
  it("logs module_opened server-side and returns the server-controlled URL", async () => {
    const repository = new InMemoryRepository();
    await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
      markWelcomeStarted: true,
    });

    const opened = await openModuleForTelegramUser(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
      moduleKey: "module_1",
      moduleUrl: "https://service-71583cba.example.invalid/module-1",
      allowLockedModuleTestRedirect: false,
    });

    expect(opened.redirect_url).toBe("https://service-71583cba.example.invalid/module-1");
    expect(repository.events.at(-1)).toMatchObject({
      eventName: "module_opened",
      properties: {
        curriculum_version: "v2",
        module_key: "module_1",
        redirect_host: "streamweb.com",
      },
    });
  });

  it("does not complete Module 1 after opening learning material", async () => {
    const repository = new InMemoryRepository();
    await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
      markWelcomeStarted: true,
    });

    await openModuleForTelegramUser(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
      },
      moduleKey: "module_1",
      moduleUrl: "https://service-71583cba.example.invalid/module-1",
      allowLockedModuleTestRedirect: false,
    });

    const journey = await repository.listJourney("student-1");
    expect(statusByKey(journey, "module_1")).toBe("available");
    expect(statusByKey(journey, "module_2")).toBe("locked");
  });

  it("keeps redirect target validation server-controlled", () => {
    expect(() =>
      resolveTrustedModuleUrl({
        moduleKey: "module_1",
        moduleUrl: "https://service-9e573a6c.example.invalid/streamer-academy/module-1",
      }),
    ).toThrow("temporary placeholder");
    expect(() =>
      resolveTrustedModuleUrl({
        moduleKey: "module_1",
        moduleUrl: "javascript:alert(1)",
      }),
    ).toThrow("https");
    expect(() =>
      resolveTrustedModuleUrl({
        moduleKey: "module_2",
      }),
    ).toThrow("STREAMWEB_MODULE_2_URL");
    expect(
      resolveTrustedModuleUrl({
        moduleKey: "module_4",
        moduleUrl: "https://service-71583cba.example.invalid/module-4",
      }).toString(),
    ).toBe("https://service-71583cba.example.invalid/module-4");
  });

  it("uses Telegram WebApp openLink when available", () => {
    const originalWindow = globalThis.window;
    const openLink = vi.fn();
    const assign = vi.fn();

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        Telegram: {
          WebApp: {
            initData: "signed-init-data",
            openLink,
          },
        },
        location: {
          assign,
        },
      },
    });

    try {
      openExternalLink("https://service-71583cba.example.invalid/module-1");
    } finally {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: originalWindow,
      });
    }

    expect(openLink).toHaveBeenCalledWith("https://service-71583cba.example.invalid/module-1", {
      try_instant_view: false,
    });
    expect(assign).not.toHaveBeenCalled();
  });
});

describe("v2 homework and progression", () => {
  const modules: Array<{
    stepKey: ProgressionStepKey;
    firstHomework: ProgressionTaskKey;
    secondHomework: ProgressionTaskKey;
    nextStepKey: ProgressionStepKey | null;
  }> = [
    {
      stepKey: "module_1",
      firstHomework: "module_1_affiliate_registration",
      secondHomework: "module_1_demo_practice",
      nextStepKey: "module_2",
    },
    {
      stepKey: "module_2",
      firstHomework: "module_2_tiktok_linktree",
      secondHomework: "module_2_telegram_channel",
      nextStepKey: "module_3",
    },
    {
      stepKey: "module_3",
      firstHomework: "module_3_demo_patterns",
      secondHomework: "module_3_trade_examples",
      nextStepKey: "module_4",
    },
    {
      stepKey: "module_4",
      firstHomework: "module_4_pre_live_readiness",
      secondHomework: "module_4_first_live",
      nextStepKey: null,
    },
  ];

  for (const moduleCase of modules) {
    it(`${moduleCase.stepKey} cannot complete before both homework submissions`, async () => {
      const repository = new InMemoryRepository();
      await prepareModule(repository, moduleCase.stepKey);

      await submitHomework(repository, moduleCase.firstHomework);

      await expect(
        completeStepForTelegramUser(repository, {
          id: 1001,
          first_name: "Ana",
        }, moduleCase.stepKey),
      ).rejects.toThrow(ProgressionError);
    });

    it(`${moduleCase.stepKey} HW2 completes the module and unlocks only the next module`, async () => {
      const repository = new InMemoryRepository();
      await prepareModule(repository, moduleCase.stepKey);

      await submitHomework(repository, moduleCase.firstHomework);
      const completed = await submitHomework(repository, moduleCase.secondHomework);

      expect(completed.step_completed_now).toBe(true);
      expect(statusByKey(completed.journey ?? [], moduleCase.stepKey)).toBe("completed");

      if (moduleCase.nextStepKey) {
        expect(statusByKey(completed.journey ?? [], moduleCase.nextStepKey)).toBe("available");
        expect(laterStepsAfter(completed.journey ?? [], moduleCase.nextStepKey).every(
          ([, status]) => status === "locked",
        )).toBe(true);
      } else {
        expect(completed.current_step).toBeNull();
        expect(completed.student?.course_completed_at).not.toBeNull();
      }
    });
  }

  it("rejects Homework 2 submission before Homework 1", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_2");

    await expect(
      completeTaskForTelegramUser(
        repository,
        {
          id: 1001,
          first_name: "Ana",
        },
        "module_2_telegram_channel",
        validHomeworkInput("module_2_telegram_channel").submission,
        validHomeworkInput("module_2_telegram_channel").checklistState,
      ),
    ).rejects.toThrow("homework anterior");
  });

  it("keeps Homework 2 locked until Homework 1 has been submitted", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_2");

    let tasks = await repository.listTasksByStep("student-1");
    expect(taskStatus(tasks, "module_2_tiktok_linktree")).toBe("available");
    expect(taskStatus(tasks, "module_2_telegram_channel")).toBe("locked");

    await submitHomework(repository, "module_2_tiktok_linktree");
    tasks = await repository.listTasksByStep("student-1");

    expect(taskStatus(tasks, "module_2_tiktok_linktree")).toBe("under_review");
    expect(taskStatus(tasks, "module_2_telegram_channel")).toBe("available");
  });

  it("accepts freeform Module 2 link fields", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_2");

    const first = await completeTaskForTelegramUser(
      repository,
      {
        id: 1001,
        first_name: "Ana",
      },
      "module_2_tiktok_linktree",
      {
        tiktokUrl: "@example_cdf792f5",
        linktreeUrl: "my link hub",
      },
      {
        streamerIdentityChosen: true,
        tiktokProfileConfigured: true,
        liveAccessChecked: true,
        bioHasThreeLines: true,
        linkHubCreated: true,
        linkHubLeadsToTelegram: true,
        tiktokUrlReady: true,
      },
    );

    expect(taskStatus(first.tasks_by_step, "module_2_tiktok_linktree")).toBe("under_review");

    const second = await completeTaskForTelegramUser(
      repository,
      {
        id: 1001,
        first_name: "Ana",
      },
      "module_2_telegram_channel",
      {
        telegramUrl: "@example_c53daf7c",
      },
      {
        channelName: true,
        profileImage: true,
        description: true,
        pinnedWelcomeCta: true,
        positioningAligned: true,
        initialContent: true,
        telegramUrlReady: true,
      },
    );

    expect(taskStatus(second.tasks_by_step, "module_2_telegram_channel")).toBe("under_review");
  });
  it("validates Module 3 DEMO operation count and pattern count", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_3");

    await expect(
      completeTaskForTelegramUser(
        repository,
        {
          id: 1001,
          first_name: "Ana",
        },
        "module_3_demo_patterns",
        {
          operationCount: 19,
          patternsUsed: "Pattern A",
          selfCheck: "I practiced.",
        },
      ),
    ).rejects.toMatchObject({
      validationErrors: expect.arrayContaining([
        expect.objectContaining({ field: "operation_count", code: "invalid_number" }),
        expect.objectContaining({ field: "patterns_used", code: "invalid_pattern_count" }),
      ]),
    });

    const accepted = await submitHomework(repository, "module_3_demo_patterns");

    expect(taskStatus(accepted.tasks_by_step, "module_3_demo_patterns")).toBe("approved");
  });

  it("validates First Live duration and contact thresholds while accepting zero outcomes", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_4");
    await submitHomework(repository, "module_4_pre_live_readiness");

    await expect(
      completeTaskForTelegramUser(
        repository,
        {
          id: 1001,
          first_name: "Ana",
        },
        "module_4_first_live",
        {
          duration: 59,
          viewers: 0,
          peopleContacted: 2,
          dmReplies: 0,
          newTelegramMembers: 0,
          registrations: 0,
          mainDifficulty: "Keeping the structure consistent.",
        },
      ),
    ).rejects.toMatchObject({
      validationErrors: expect.arrayContaining([
        expect.objectContaining({ field: "duration", code: "invalid_number" }),
        expect.objectContaining({ field: "people_contacted", code: "invalid_number" }),
      ]),
    });

    const accepted = await submitHomework(repository, "module_4_first_live");

    expect(accepted.student?.course_completed_at).not.toBeNull();
    expect(taskStatus(accepted.tasks_by_step, "module_4_first_live")).toBe("under_review");
  });

  it("records self-check as approved and expert-review homework as under_review", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_1");

    await submitHomework(repository, "module_1_affiliate_registration");
    await submitHomework(repository, "module_1_demo_practice");
    const tasks = await repository.listTasksByStep("student-1");

    expect(taskStatus(tasks, "module_1_affiliate_registration")).toBe("approved");
    expect(taskStatus(tasks, "module_1_demo_practice")).toBe("approved");
  });

  it("revision_required does not re-lock already unlocked progression", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_1");
    await submitHomework(repository, "module_1_affiliate_registration");
    await submitHomework(repository, "module_1_demo_practice");

    repository.setTaskStatus("student-1", "module_1_affiliate_registration", "revision_required");

    const journey = await repository.listJourney("student-1");
    expect(statusByKey(journey, "module_2")).toBe("available");
  });

  it("Course Completed is set by First Live submission, not approval", async () => {
    const repository = new InMemoryRepository();
    await prepareModule(repository, "module_4");
    await submitHomework(repository, "module_4_pre_live_readiness");

    const completed = await submitHomework(repository, "module_4_first_live");

    expect(completed.student?.course_completed_at).not.toBeNull();
    expect(repository.events.map((event) => event.eventName)).toEqual(
      expect.arrayContaining([
        "homework_submitted",
        "module_completed",
        "first_live_submitted",
        "course_completed",
      ]),
    );
    expect(taskStatus(completed.tasks_by_step, "module_4_first_live")).toBe("under_review");
  });
});

describe("reset and commercial history", () => {
  it("resets v2 education state while preserving language and affiliate history events", async () => {
    const repository = new InMemoryRepository();
    await bootstrapStudent(repository, {
      telegramUser: {
        id: 1001,
        first_name: "Ana",
        language_code: "es",
      },
      preferredLanguage: "pt-BR",
      markWelcomeStarted: true,
    });
    await submitHomework(repository, "module_1_affiliate_registration");
    await repository.logEvents("student-1", [
      { eventName: "affiliate_registration" },
      { eventName: "ftd_received" },
      { eventName: "deposit_received" },
    ]);

    const reset = await resetProgressForTelegramUser(repository, {
      id: 1001,
      first_name: "Ana",
    });

    expect(reset.journey.map((step) => [step.key, step.status])).toEqual(
      JOURNEY_STEPS.map((step) => [step.key, initialStatusForStep(step.key)]),
    );
    expect(reset.tasks_by_step.module_1?.every((task) => !task.completed)).toBe(true);
    expect(reset.student.preferred_language).toBe("pt-BR");
    expect(reset.resolved_language).toBe("pt-BR");
    expect(reset.welcome_required).toBe(true);
    expect(repository.events.map((event) => event.eventName)).toEqual(
      expect.arrayContaining(["affiliate_registration", "ftd_received", "deposit_received"]),
    );
  });
});

describe("Mini App task and button helpers", () => {
  it("keeps Module 1 open actions finite and duplicate-protected", () => {
    expect(canSubmitModuleOpen({ canOpen: true, inFlight: false, state: "idle" })).toBe(true);
    expect(canSubmitModuleOpen({ canOpen: true, inFlight: true, state: "idle" })).toBe(false);
    expect(canSubmitModuleOpen({ canOpen: true, inFlight: false, state: "submitting" })).toBe(
      false,
    );
    expect(moduleOpenButtonLabel("idle", translations.es)).toBe("Abrir Módulo 1");
    expect(moduleOpenButtonLabel("submitting", translations.es)).toBe("Abriendo Módulo 1...");
  });

  it("rolls back failed optimistic task completion state", () => {
    const [task] = moduleOneTasks([]);
    const optimisticTasks = updateTaskCompletionState(
      [task],
      "module_1_affiliate_registration",
      true,
      new Date(0).toISOString(),
    );
    const rolledBackTasks = updateTaskCompletionState(
      optimisticTasks,
      "module_1_affiliate_registration",
      false,
      null,
    );

    expect(optimisticTasks[0].completed).toBe(true);
    expect(rolledBackTasks[0]).toMatchObject({
      key: "module_1_affiliate_registration",
      completed: false,
      completed_at: null,
    });
  });

  it("uses the generic task endpoint for homework submission responses", async () => {
    const response = await completeTask(
      {
        initData: "signed-init-data",
        taskKey: "module_1_affiliate_registration",
      },
      {
        endpointUrl: "https://service-66da5adf.example.invalid/functions/v1/complete-task",
        fetchImpl: async (_url, init) => {
          expect(init?.method).toBe("POST");
          expect(JSON.parse(String(init?.body))).toEqual({
            initData: "signed-init-data",
            taskKey: "module_1_affiliate_registration",
          });

          return Response.json({
            task_completed_now: true,
            tasks_by_step: tasksByStep(["module_1_affiliate_registration"]),
          });
        },
      },
    );

    expect(response.task_completed_now).toBe(true);
    expect(response.tasks_by_step.module_1?.[0].completed).toBe(true);
  });

  it("opens the tracked backend URL through the external link adapter", async () => {
    const openExternalLinkImpl = vi.fn();
    const openTrackedModule = vi.fn(async () => ({
      redirect_url: "https://service-71583cba.example.invalid/module-1",
    }));

    const response = await openModuleLearningDestination(
      {
        initData: "signed-init-data",
        acquisitionSource: "campaign_mx",
      },
      {
        openExternalLinkImpl,
        openTrackedModule,
      },
    );

    expect(response.redirect_url).toBe("https://service-71583cba.example.invalid/module-1");
    expect(openExternalLinkImpl).toHaveBeenCalledWith("https://service-71583cba.example.invalid/module-1");
  });

  it("does not allow locked modules to open", () => {
    expect(() => assertModuleCanOpen("module_2", journeyWithStatuses({}), false)).toThrow(
      "not available",
    );
    expect(canOpenStepDetail(journeyStep("module_1", "available"))).toBe(true);
    expect(canOpenStepDetail(journeyStep("module_2", "locked"))).toBe(false);
  });

  it("returns from Step Detail to Journey without reloading state", () => {
    const response = toBootstrapResponse({
      student: sampleStudent(),
      journey: journeyWithStatuses({}),
      current_step: journeyStep("module_1", "available"),
    });
    const detail = openStepDetail(createJourneyViewState(response), "module_1");
    const returned = returnToJourneyScreen(detail);

    expect(returned.screen).toBe("journey");
    expect(returned.journeyData.current_step?.key).toBe("module_1");
  });

  it("enables Module 1 completion helper after both v2 homework items", () => {
    expect(canCompleteModuleOne(moduleOneTasks([]))).toBe(false);
    expect(canCompleteModuleOne(moduleOneTasks(["module_1_affiliate_registration"]))).toBe(false);
    expect(
      canCompleteModuleOne(
        moduleOneTasks(["module_1_affiliate_registration", "module_1_demo_practice"]),
      ),
    ).toBe(true);
    expect(
      canSubmitTaskCompletion({
        task: moduleOneTasks([])[0],
        pendingTaskKeys: ["module_1_affiliate_registration"],
      }),
    ).toBe(false);
  });
});

function statusByKey(journey: JourneyStepState[], key: string): string | undefined {
  return journey.find((step) => step.key === key)?.status;
}

function taskStatus(tasksByStep: TasksByStep, key: ProgressionTaskKey): HomeworkStatus | undefined {
  return Object.values(tasksByStep)
    .flat()
    .find((task) => task?.key === key)?.status;
}

function laterStepsAfter(journey: JourneyStepState[], key: string): Array<[string, string]> {
  const step = journey.find((item) => item.key === key);

  if (!step) {
    throw new Error(`Step not found: ${key}`);
  }

  return journey
    .filter((item) => item.position > step.position)
    .map((item) => [item.key, item.status]);
}

function journeyWithStatuses(
  overrides: Partial<Record<(typeof JOURNEY_STEPS)[number]["key"], JourneyStepState["status"]>>,
): JourneyStepState[] {
  return JOURNEY_STEPS.map((step) => ({
    key: step.key,
    title: step.title,
    position: step.position,
    required: step.required,
    status: overrides[step.key] ?? initialStatusForStep(step.key),
  }));
}

function journeyStep(
  key: (typeof JOURNEY_STEPS)[number]["key"],
  status: JourneyStepState["status"],
): JourneyStepState {
  const step = JOURNEY_STEPS.find((item) => item.key === key);

  if (!step) {
    throw new Error(`Step not found: ${key}`);
  }

  return {
    key: step.key,
    title: step.title,
    position: step.position,
    required: step.required,
    status,
  };
}

function moduleOneTasks(completedKeys: Array<"module_1_affiliate_registration" | "module_1_demo_practice">): ProgressionTaskState[] {
  const completed = new Set(completedKeys);

  return PROGRESSION_STEPS.module_1.taskKeys.map((key) => taskState(key, completed.has(key)));
}

function tasksByStep(completedKeys: ProgressionTaskKey[]): TasksByStep {
  const completed = new Set(completedKeys);
  const result: TasksByStep = {};

  for (const stepKey of Object.keys(PROGRESSION_STEPS) as ProgressionStepKey[]) {
    result[stepKey] = PROGRESSION_STEPS[stepKey].taskKeys.map((key) =>
      taskState(key, completed.has(key)),
    );
  }

  return result;
}

function taskState(
  taskKey: ProgressionTaskKey,
  completed: boolean,
  overrideStatus?: HomeworkStatus,
): ProgressionTaskState {
  const task = PROGRESSION_TASKS[taskKey];
  const status = overrideStatus ?? (completed ? reviewStatusForTask(taskKey) : "available");
  const completedAt = completed ? new Date(0).toISOString() : null;

  return {
    key: task.key,
    step_key: task.stepKey,
    title: task.title,
    position: task.position,
    completed,
    completed_at: completedAt,
    status,
    submission: {},
    checklist_state: {},
    submitted_at: completedAt,
    review_comment: null,
    attempt_count: completed ? 1 : 0,
  };
}

function sampleStudent(): Student {
  const now = new Date(0).toISOString();

  return {
    id: "student-1",
    telegram_user_id: 1001,
    telegram_username: "ana_stream",
    first_name: "Ana",
    last_name: null,
    language_code: "es",
    preferred_language: null,
    curriculum_version: "v2",
    course_completed_at: null,
    acquisition_source: "campaign_mx",
    geo: "MX",
    locale: "es-MX",
    created_at: now,
    updated_at: now,
  };
}

async function prepareModule(
  repository: InMemoryRepository,
  stepKey: ProgressionStepKey,
): Promise<void> {
  await bootstrapStudent(repository, {
    telegramUser: {
      id: 1001,
      first_name: "Ana",
    },
    markWelcomeStarted: true,
  });

  const order = ["module_1", "module_2", "module_3", "module_4"] as const;

  for (const previousStepKey of order.slice(0, order.indexOf(stepKey))) {
    for (const taskKey of PROGRESSION_STEPS[previousStepKey].taskKeys) {
      await submitHomework(repository, taskKey);
    }
  }
}

async function submitHomework(
  repository: InMemoryRepository,
  taskKey: ProgressionTaskKey,
): Promise<TaskCompletionResult> {
  const input = validHomeworkInput(taskKey);

  return await completeTaskForTelegramUser(
    repository,
    {
      id: 1001,
      first_name: "Ana",
    },
    taskKey,
    input.submission,
    input.checklistState,
  );
}

function validHomeworkInput(taskKey: ProgressionTaskKey): HomeworkSubmissionInput {
  switch (taskKey) {
    case "module_1_affiliate_registration":
      return {
        submission: { referralCode: "REG-1001" },
        checklistState: {},
      };
    case "module_1_demo_practice":
      return {
        submission: {},
        checklistState: { confirmed: true },
      };
    case "module_2_tiktok_linktree":
      return {
        submission: {
          tiktokUrl: "https://service-7ba54f73.example.invalid/@ana_stream",
          linktreeUrl: "https://service-92643b8f.example.invalid/ana_stream",
        },
        checklistState: {
          streamerIdentityChosen: true,
          tiktokProfileConfigured: true,
          liveAccessChecked: true,
          bioHasThreeLines: true,
          linkHubCreated: true,
          linkHubLeadsToTelegram: true,
          tiktokUrlReady: true,
        },
      };
    case "module_2_telegram_channel":
      return {
        submission: { telegramUrl: "https://telegram.example.invalid/example_cce75605" },
        checklistState: {
          channelName: true,
          profileImage: true,
          description: true,
          pinnedWelcomeCta: true,
          positioningAligned: true,
          initialContent: true,
          telegramUrlReady: true,
        },
      };
    case "module_3_demo_patterns":
      return {
        submission: {
          operationCount: 20,
          patternsUsed: "Pattern A\nPattern B",
          selfCheck: "I practiced the two selected demo patterns.",
        },
        checklistState: {},
      };
    case "module_3_trade_examples":
      return {
        submission: {
          pattern: "Pattern A",
          whyEntered: "The setup matched the practiced pattern.",
          whatHappened: "The price moved after entry.",
          result: "I documented the trade outcome.",
        },
        checklistState: {},
      };
    case "module_4_pre_live_readiness":
      return {
        submission: {},
        checklistState: {
          twoDevicesReady: true,
          quietLocation: true,
          batteryOrCharger: true,
          internetChecked: true,
          terminalReady: true,
          chartIndicatorsReady: true,
          notesReady: true,
          telegramVisibleInNotes: true,
        },
      };
    case "module_4_first_live":
      return {
        submission: {
          duration: 60,
          viewers: 0,
          peopleContacted: 3,
          dmReplies: 0,
          newTelegramMembers: 0,
          registrations: 0,
          mainDifficulty: "Keeping the structure consistent.",
        },
        checklistState: {},
      };
  }
}

function toBootstrapResponse(response: {
  student: Student;
  journey: JourneyStepState[];
  current_step: JourneyStepState | null;
  tasks_by_step?: TasksByStep;
  module_1_tasks?: BootstrapResponse["module_1_tasks"];
  welcome_required?: boolean;
  resolved_language?: LanguageCode;
}): BootstrapResponse {
  return {
    ...response,
    tasks_by_step: response.tasks_by_step ?? tasksByStep([]),
    module_1_tasks:
      response.module_1_tasks ??
      (tasksByStep([]).module_1 as BootstrapResponse["module_1_tasks"]),
    welcome_required: response.welcome_required ?? false,
    resolved_language: response.resolved_language ?? "es",
  };
}

function signedInitData(fields: Record<string, string>): string {
  const dataCheckString = Object.entries(fields)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const params = new URLSearchParams(fields);
  params.set("hash", hash);
  return params.toString();
}

type StudentTaskRecord = {
  completedAt: string;
  status: HomeworkStatus;
  submission: Record<string, unknown>;
  checklistState: Record<string, boolean>;
  attemptCount: number;
};

class InMemoryRepository implements BootstrapRepository {
  students: Student[] = [];
  events: Array<{ studentId: string; eventName: EventName; properties?: Record<string, unknown> }> =
    [];
  studentSteps = new Map<string, JourneyStepState[]>();
  studentTasks = new Map<string, Map<ProgressionTaskKey, StudentTaskRecord>>();

  async findStudentByTelegramUserId(telegramUserId: number): Promise<Student | null> {
    return this.students.find((student) => student.telegram_user_id === telegramUserId) ?? null;
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const existing = await this.findStudentByTelegramUserId(input.telegram_user_id);

    if (existing) {
      return existing;
    }

    const student: Student = {
      ...sampleStudent(),
      id: `student-${this.students.length + 1}`,
      telegram_user_id: input.telegram_user_id,
      telegram_username: input.telegram_username ?? null,
      first_name: input.first_name ?? null,
      last_name: input.last_name ?? null,
      language_code: input.language_code ?? null,
      preferred_language: null,
      acquisition_source: input.acquisition_source ?? null,
    };
    this.students.push(student);
    return student;
  }

  async updateStudentProfile(
    studentId: string,
    input: UpdateStudentProfileInput,
  ): Promise<Student> {
    const student = this.student(studentId);
    student.telegram_username = input.telegram_username ?? null;
    student.first_name = input.first_name ?? null;
    student.last_name = input.last_name ?? null;
    student.language_code = input.language_code ?? null;
    return student;
  }

  async activateV2Curriculum(studentId: string): Promise<Student> {
    const student = this.student(studentId);
    student.curriculum_version = "v2";
    student.course_completed_at = null;
    this.studentTasks.delete(studentId);
    this.studentSteps.delete(studentId);
    return student;
  }

  async updateStudentPreferredLanguage(
    studentId: string,
    preferredLanguage: NonNullable<Student["preferred_language"]>,
  ): Promise<Student> {
    const student = this.student(studentId);
    student.preferred_language = preferredLanguage;
    return student;
  }

  async ensureInitialStudentSteps(studentId: string): Promise<void> {
    if (this.studentSteps.has(studentId)) {
      return;
    }

    this.studentSteps.set(
      studentId,
      JOURNEY_STEPS.map((step) => ({
        key: step.key,
        title: step.title,
        position: step.position,
        required: step.required,
        status: initialStatusForStep(step.key),
      })),
    );
  }

  async listJourney(studentId: string): Promise<JourneyStepState[]> {
    return this.studentSteps.get(studentId) ?? [];
  }

  async listModuleOneTasks(studentId: string): Promise<BootstrapResponse["module_1_tasks"]> {
    return (await this.listTasksByStep(studentId)).module_1 as BootstrapResponse["module_1_tasks"];
  }

  async listTasksByStep(studentId: string): Promise<TasksByStep> {
    const completedTasks = this.studentTasks.get(studentId) ?? new Map();
    const result: TasksByStep = {};

    for (const stepKey of Object.keys(PROGRESSION_STEPS) as ProgressionStepKey[]) {
      result[stepKey] = PROGRESSION_STEPS[stepKey].taskKeys.map((taskKey, index) => {
        const stored = completedTasks.get(taskKey);
        const previousTaskKeys = PROGRESSION_STEPS[stepKey].taskKeys.slice(0, index);
        const status =
          stored?.status ??
          (previousTaskKeys.every((previousTaskKey) => completedTasks.has(previousTaskKey))
            ? "available"
            : "locked");
        const state = taskState(taskKey, Boolean(stored), status);

        return {
          ...state,
          submission: stored?.submission ?? state.submission,
          checklist_state: stored?.checklistState ?? state.checklist_state,
          attempt_count: stored?.attemptCount ?? state.attempt_count,
        };
      });
    }

    return result;
  }

  async hasStartedAcademy(studentId: string): Promise<boolean> {
    const latestOnboardingEvent = [...this.events]
      .reverse()
      .find(
        (event) =>
          event.studentId === studentId &&
          (event.eventName === "welcome_started" || event.eventName === "progress_reset") &&
          event.properties?.curriculum_version === "v2",
      );

    return latestOnboardingEvent?.eventName === "welcome_started";
  }

  async completeProgressionTask(
    studentId: string,
    taskKey: ProgressionTaskKey,
    input: HomeworkSubmissionInput,
  ): Promise<TaskCompletionResult> {
    const journey = this.studentSteps.get(studentId);

    if (!journey) {
      throw new Error("Student journey is missing.");
    }

    const task = PROGRESSION_TASKS[taskKey];
    const step = journey.find((item) => item.key === task.stepKey);

    if (!step) {
      throw new ProgressionError("Student step is missing.", 409);
    }

    if (!["available", "in_progress", "completed"].includes(step.status)) {
      throw new ProgressionError("This step is not available yet.", 409);
    }

    const orderedTaskKeys = PROGRESSION_STEPS[task.stepKey].taskKeys;
    const taskIndex = orderedTaskKeys.indexOf(taskKey);
    const existing = this.studentTasks.get(studentId) ?? new Map<ProgressionTaskKey, StudentTaskRecord>();

    if (taskIndex > 0) {
      const previousTaskKeys = orderedTaskKeys.slice(0, taskIndex);

      if (previousTaskKeys.some((previousTaskKey) => !existing.has(previousTaskKey))) {
        throw new ProgressionError("Completa el homework anterior antes de continuar.", 409);
      }
    }

    const stored = existing.get(taskKey);

    if (stored?.status === "revision_required") {
      stored.status = reviewStatusForTask(taskKey);
      stored.submission = input.submission;
      stored.checklistState = input.checklistState;
      stored.attemptCount += 1;

      return {
        task_completed_now: false,
        task_resubmitted_now: true,
        tasks_by_step: await this.listTasksByStep(studentId),
      };
    }

    const completedNow = !stored;

    if (completedNow) {
      existing.set(taskKey, {
        completedAt: new Date(0).toISOString(),
        status: reviewStatusForTask(taskKey),
        submission: input.submission,
        checklistState: input.checklistState,
        attemptCount: 1,
      });
      this.studentTasks.set(studentId, existing);
    }

    return {
      task_completed_now: completedNow,
      tasks_by_step: await this.listTasksByStep(studentId),
    };
  }

  async completeProgressionStep(
    studentId: string,
    stepKey: ProgressionStepKey,
  ): Promise<StepCompletionTransitionResult> {
    const journey = this.studentSteps.get(studentId);

    if (!journey) {
      throw new Error("Student journey is missing.");
    }

    const currentStep = journey.find((step) => step.key === stepKey);
    const nextStepKey = PROGRESSION_STEPS[stepKey].nextStepKey;
    const nextStep = nextStepKey
      ? journey.find((step) => step.key === nextStepKey)
      : undefined;

    if (!currentStep || (nextStepKey && !nextStep)) {
      throw new ProgressionError("Student step is missing.", 409);
    }

    if (!["available", "in_progress", "completed"].includes(currentStep.status)) {
      throw new ProgressionError("Step cannot be completed from current status.", 409);
    }

    const tasks = await this.listTasksByStep(studentId);
    const requiredTasks = tasks[stepKey] ?? [];

    if (
      requiredTasks.length !== PROGRESSION_STEPS[stepKey].taskKeys.length ||
      requiredTasks.some((task) => !task.completed)
    ) {
      throw new ProgressionError("Completa tus homework antes de terminar este módulo.", 409);
    }

    const completedNow =
      currentStep.status === "available" ||
      currentStep.status === "in_progress";

    if (completedNow) {
      currentStep.status = "completed";
    }

    if (nextStep?.status === "locked") {
      nextStep.status = "available";
    }

    if (stepKey === "module_4") {
      this.student(studentId).course_completed_at ??= new Date(0).toISOString();
    }

    return { completedNow };
  }

  async resetProgress(studentId: string): Promise<void> {
    const student = this.student(studentId);
    student.curriculum_version = "v2";
    student.course_completed_at = null;
    this.studentTasks.delete(studentId);
    this.studentSteps.set(
      studentId,
      JOURNEY_STEPS.map((step) => ({
        key: step.key,
        title: step.title,
        position: step.position,
        required: step.required,
        status: initialStatusForStep(step.key),
      })),
    );
  }

  setTaskStatus(
    studentId: string,
    key: ProgressionTaskKey,
    status: HomeworkStatus,
  ): void {
    const task = this.studentTasks.get(studentId)?.get(key);

    if (!task) {
      throw new Error(`Task not found: ${key}`);
    }

    task.status = status;
  }

  async logEvent(
    studentId: string,
    eventName: EventName,
    properties?: Record<string, unknown>,
  ): Promise<void> {
    if (eventName === "task_completed" && typeof properties?.task_key === "string") {
      const existing = this.events.some(
        (event) =>
          event.studentId === studentId &&
          event.eventName === "task_completed" &&
          event.properties?.task_key === properties.task_key,
      );

      if (existing) {
        return;
      }
    }

    this.events.push({ studentId, eventName, properties });
  }

  async logEvents(
    studentId: string,
    events: Array<{ eventName: EventName; properties?: Record<string, unknown> }>,
  ): Promise<void> {
    for (const event of events) {
      await this.logEvent(studentId, event.eventName, event.properties);
    }
  }

  private student(studentId: string): Student {
    const student = this.students.find((item) => item.id === studentId);

    if (!student) {
      throw new Error("Student not found.");
    }

    return student;
  }
}
