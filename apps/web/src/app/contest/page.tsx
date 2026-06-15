import { ContestView } from "@/components/contest-view";
import { kickService } from "@/server/service-singleton";

export default function ContestPage() {
  return <ContestView initialResponse={kickService.getContests()} />;
}
