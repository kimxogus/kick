import type { ContestListResponse } from "@/server/kick-service";

export type ContestSummary = {
  upcoming: number;
  open: number;
  closed: number;
};

export function summarizeContests(response: ContestListResponse): ContestSummary {
  return response.contests.reduce<ContestSummary>(
    (summary, contest) => {
      summary[contest.status] += 1;
      return summary;
    },
    { upcoming: 0, open: 0, closed: 0 }
  );
}
