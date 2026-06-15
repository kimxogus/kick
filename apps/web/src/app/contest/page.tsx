import { ContestView } from "@/components/contest-view";
import { kickService } from "@/server/service-singleton";

export const dynamic = "force-dynamic";

export default async function ContestPage() {
  return <ContestView initialResponse={await kickService.getContests()} />;
}
