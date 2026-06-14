import type { MakerSubmission } from "@/server/kick-service";

export function submissionStorageKey(id: string): string {
  return `kick_submission_${id}`;
}

function getSubmissionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function saveSubmissionPreview(submission: MakerSubmission): void {
  const storage = getSubmissionStorage();
  if (!storage) {
    return;
  }
  storage.setItem(submissionStorageKey(submission.id), JSON.stringify(submission));
}

export function readSubmissionPreview(id: string): MakerSubmission | null {
  const storage = getSubmissionStorage();
  if (!storage) {
    return null;
  }
  const raw = storage.getItem(submissionStorageKey(id));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as MakerSubmission;
  } catch {
    return null;
  }
}
