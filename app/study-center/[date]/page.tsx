import { notFound } from "next/navigation";
import { getNextStudy, getPreviousStudy, getStudiesByWeek, getStudyByDate, studies } from "@/app/data/study-plan";
import { scriptureReferences } from "@/app/content/scripture";
import { studyPlanRelationships } from "@/app/content/relationships";
import { RelatedContent } from "@/app/components/related-content";
import { StudyWorkspace } from "@/app/study-center/study-workspace";
import { WeekProgress } from "@/app/study-center/week-progress";

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

  const weekStudies = getStudiesByWeek(study.week ?? 1);
  const relatedScriptureSlugs = scriptureReferences
    .filter((reference) => reference.relatedStudyPlanDates?.includes(study.date))
    .map((reference) => reference.slug);

  return (
    <main className="study-center-page study-detail-page">
      <div className="study-shell">
        <div className="study-workspace-layout">
          <aside className="study-workspace-sidebar">
            <div className="study-workspace-sidebar-card">
              <p className="eyebrow">Current study</p>
              <h2>{study.weekTitle}</h2>
              <p>{study.focus}</p>
              <dl>
                <div>
                  <dt>Passage</dt>
                  <dd>{study.passage}</dd>
                </div>
                <div>
                  <dt>Movement</dt>
                  <dd>{study.movement}</dd>
                </div>
              </dl>
            </div>
            <div className="study-workspace-sidebar-card">
              <p className="eyebrow">This week</p>
              <WeekProgress studies={weekStudies} currentDate={study.date} showNavigation={false} />
            </div>
          </aside>
          <div className="study-workspace-main">
            <StudyWorkspace
              key={study.date}
              study={study}
              previous={getPreviousStudy(study.date)}
              next={getNextStudy(study.date)}
            />
          </div>
        </div>
        <RelatedContent relations={studyPlanRelationships[study.date] ?? {}} scriptureSlugs={relatedScriptureSlugs} />
      </div>
    </main>
  );
}
