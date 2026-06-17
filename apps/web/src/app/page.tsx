import { HomeView } from "@/components/home-view";
import { summarizeContests } from "@/lib/contest-summary";
import { kickService } from "@/server/service-singleton";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [board, contests] = await Promise.all([
    kickService.getWeeklyBoard({}),
    kickService.getContests()
  ]);

  const highlights = [...board.board.launches].sort((a, b) => a.rank - b.rank).slice(0, 3);

  return <HomeView highlights={highlights} contestSummary={summarizeContests(contests)} />;
}
