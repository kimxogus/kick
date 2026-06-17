import { WeeklyBoardView } from "@/components/weekly-board-view";
import { kickService } from "@/server/service-singleton";

export const dynamic = "force-dynamic";

export default async function WeekPage() {
  return <WeeklyBoardView initialResponse={await kickService.getWeeklyBoard({})} />;
}
