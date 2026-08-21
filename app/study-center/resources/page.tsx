import Link from "next/link";

const resources = [
  { title: "Bible Studies", description: "Work through Scripture with the existing daily study experience.", href: "/study-center" },
  { title: "Study Notes", description: "A home for future notes that accompany studies and Scripture passages.", href: "/study-center" },
  { title: "Apologetics Studies", description: "A pathway for future studies on questions of faith, reason, and Christian belief.", href: "/questions" },
  { title: "Reading Plans", description: "Use structured reading practices already built into the Study Center.", href: "/study-center" },
  { title: "Questions", description: "Start with a difficult question and follow it into connected resources.", href: "/questions" },
];

export default function StudyResourcesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/study-center" className="text-sm text-muted-foreground hover:underline">← Study Center</Link>
      <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Learn</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Study Resources</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">A growing place for Bible studies, questions, notes, reading plans, and other resources for careful Christian learning.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {resources.map((resource) => <Link key={resource.title} href={resource.href} className="rounded-2xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{resource.title}</h2><p className="mt-2 text-sm text-muted-foreground">{resource.description}</p></Link>)}
      </div>
    </main>
  );
}
