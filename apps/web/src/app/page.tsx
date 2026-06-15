import { HomeView } from "@/components/home-view";
import { kickService } from "@/server/service-singleton";

export const dynamic = "force-dynamic";

export default function Page() {
  return <HomeView initialResponse={kickService.getWeeklyBoard({})} />;
}
