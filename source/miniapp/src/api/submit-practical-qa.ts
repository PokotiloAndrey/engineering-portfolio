import { functionUrl } from "./config";
import type {
  PracticalQaSubmissionInput,
  PracticalQaSubmissionResult,
} from "../types/practical-qa";

export async function submitPracticalQa(input: {
  initData: string;
  submission: PracticalQaSubmissionInput;
}): Promise<PracticalQaSubmissionResult> {
  const response = await fetch(functionUrl("submit-practical-qa"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData: input.initData,
      ...input.submission,
    }),
  });

  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  return (await response.json()) as PracticalQaSubmissionResult;
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    return typeof body.error === "string"
      ? body.error
      : "We couldn't submit this to Academy right now.";
  } catch {
    return "We couldn't submit this to Academy right now.";
  }
}
