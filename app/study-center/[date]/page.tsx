import { notFound } from "next/navigation";
import { getNextStudy, getPreviousStudy, getStudyByDate, studies } from "@/app/data/study-plan";
import { StudyWorkspace } from "@/app/study-center/study-workspace";

export function generateStaticParams() {
  return studies.map((study) => ({ date: study.date }));
}

export default async function StudyDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const study = getStudyByDate(date);

  if (!study) {
    notFound();
  }

  return (
    <main className="study-center-page study-detail-page">
      <div className="study-shell">
        <StudyWorkspace
          key={study.date}
          study={study}
          previous={getPreviousStudy(study.date)}
          next={getNextStudy(study.date)}
        />
      </div>
    </main>
  );
}
