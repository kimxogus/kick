import { SubmissionView } from "@/components/submission-view";

type SubmissionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubmissionPage({ params }: SubmissionPageProps) {
  const { id } = await params;
  return <SubmissionView id={id} />;
}
