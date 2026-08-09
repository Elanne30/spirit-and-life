import Image from "next/image";
import Link from "next/link";
import {
  getStudyByDate,
  getStudiesByWeek,
  studies,
  studyPlan,
  movements,
  weeks,
} from "@/app/data/study-plan";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { WeekProgress } from "@/app/study-center/week-progress";

export default function StudyCenterPage() {
  const today = new Date().toISOString().split("T")[0];
  const currentStudy = getStudyByDate(today) ?? studies[0];
  const currentWeek = currentStudy.week ?? 1;
  const weekStudies = getStudiesByWeek(currentWeek);
  const currentWeekInfo = weeks.find((week) => week.number === currentWeek);
  const currentMovement = movements.find(
    (movement) => movement.title === currentStudy.movement,
  );

  return (
    <main className="study-center-page">
      <div className="study-shell">
        <header className="study-center-header">
          <Link className="study-brand" href="/">
            <Image
              src="/spiri_life_logo.jpg"
              alt="Spirit & Life"
              width={1280}
              height={853}
            />
          </Link>
          <div className="study-center-label">
            <span>Spirit &amp; Life</span>
            <strong>Study Center</strong>
          </div>
          <div className="study-header-actions">
            <Link href="/" className="study-back-link">Back to site</Link>
            <ThemeToggle />
          </div>
        </header>

        <section className="study-hero">
          <Image
            className="study-hero-image"
            src="/images/study_center_hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="study-hero-copy">
            <p className="eyebrow">A daily practice of attention</p>
            <h1>{studyPlan.title}</h1>
            <p>{studyPlan.subtitle}</p>
          </div>
          <div className="study-hero-aside">
            <span>Today&apos;s place in the journey</span>
            <strong>Week {currentWeek}</strong>
            <p>{currentStudy.movement}</p>
          </div>
        </section>

        <section className="study-today" aria-labelledby="today-study-title">
          <div className="study-today-heading">
            <div>
              <p className="eyebrow">Today&apos;s study</p>
              <p className="study-date">{currentStudy.weekday} · {currentStudy.date}</p>
            </div>
            <div className="study-progress">
              <WeekProgress studies={weekStudies} currentDate={currentStudy.date} showNavigation={false} />
            </div>
          </div>

          <div className="study-feature">
            <div className="study-feature-main">
              <div className="study-feature-kicker">
                <span>Week {currentWeek}</span>
                <span>{currentStudy.movement}</span>
              </div>
              <h2 id="today-study-title">{currentWeekInfo?.title ?? currentStudy.weekTitle}</h2>
              <p className="study-focus">{currentStudy.focus}</p>
              <dl className="study-facts">
                <div><dt>Passage</dt><dd>{currentStudy.passage}</dd></div>
                <div><dt>Movement</dt><dd>{currentStudy.movement}</dd></div>
              </dl>
              <Link className="button button-primary study-open-action" href={`/study-center/${currentStudy.date}`}>Begin today&apos;s study</Link>
            </div>
            <aside className="study-reflection">
              <span>Reflection</span>
              <p>{currentStudy.reflection}</p>
            </aside>
          </div>
        </section>

        <section className="study-week-section" aria-labelledby="week-title">
          <div className="study-section-heading">
            <div>
              <p className="eyebrow">This week</p>
              <h2 id="week-title">{currentWeekInfo?.title ?? currentStudy.weekTitle}</h2>
            </div>
            <p>{currentStudy.movement}</p>
          </div>
          <WeekProgress studies={weekStudies} currentDate={currentStudy.date} />
        </section>

        <section className="study-movements" aria-labelledby="movements-title">
          <div className="study-section-heading">
            <div><p className="eyebrow">The larger journey</p><h2 id="movements-title">Five movements through the study.</h2></div>
            <p>Each stage gives the daily work a wider direction.</p>
          </div>
          <div className="movement-grid">
            {movements.map((movement, index) => {
              const movementWeeks = weeks.filter((week) => week.movement === movement.title);
              const movementStudies = studies.filter((study) => study.movement === movement.title);
              return (
              <details className={`movement-card${movement.title === currentMovement?.title ? " is-current" : ""}`} key={movement.title} open={movement.title === currentMovement?.title}>
                <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{movement.title}</h3>
                <p className="movement-period">{movement.period}</p>
                <p>{movement.description}</p>
                </summary>
                <div className="movement-studies">
                  {movementWeeks.map((week) => <div key={week.number}><strong>Week {week.number}</strong><span>{week.title}</span></div>)}
                  {movementStudies[0] ? <Link className="content-card-link" href={`/study-center/${movementStudies[0].date}`}>Open first study</Link> : null}
                </div>
              </details>
              );
            })}
          </div>
        </section>

        <section className="study-practice-grid">
          <div className="study-rhythm" aria-labelledby="rhythm-title">
            <p className="eyebrow">The weekly rhythm</p>
            <h2 id="rhythm-title">Seven ways to stay with the text.</h2>
            <div className="rhythm-list">
              {studyPlan.weeklyPattern.map(([day, practice]) => {
                const [label, description] = practice.split(" — ");
                const dayStudy = weekStudies.find((study) => study.weekday === day);
                return <Link className="rhythm-item" href={dayStudy ? `/study-center/${dayStudy.date}` : "#"} key={day}><strong>{day}</strong><span>{label}</span><p>{description}</p></Link>;
              })}
            </div>
          </div>
          <div className="study-time-model" aria-labelledby="time-title">
            <p className="eyebrow">The time model</p>
            <h2 id="time-title">An hour for attention.</h2>
            <ol>
              {studyPlan.timeModel.map(([duration, activity]) => <li key={activity}><time>{duration}</time><span>{activity}</span></li>)}
            </ol>
          </div>
        </section>

        <section className="study-golden-rule">
          <p className="eyebrow">The golden rule</p>
          <blockquote>{studyPlan.goldenRule}</blockquote>
        </section>

        <section className="study-method">
          <div className="study-method-introduction">
            <p className="eyebrow">The study pattern</p>
            <h2>Text → Understanding → Truth → Heart → Prayer → Obedience.</h2>
          </div>
          <p className="study-method-copy">A way of reading that moves beyond collecting information. Scripture is read carefully, understood in context, brought into reflection, and carried into life.</p>
      </section>
      </div>
    </main>
  );
}
