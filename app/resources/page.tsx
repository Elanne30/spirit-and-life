import Link from "next/link";
import { listDownloadableResources } from "@/app/lib/resource-repository";

export default async function ResourcesPage() {
  const resources = await listDownloadableResources(true);
  return <main className="mx-auto max-w-5xl px-6 py-16"><p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Library</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Downloads</h1><p className="mt-4 max-w-2xl text-muted-foreground">Downloadable studies, essays, audio, and other resources from Spirit &amp; Life.</p>{resources.length === 0 ? <section className="mt-10 rounded-2xl border p-6"><h2 className="font-semibold">Resources coming soon</h2><p className="mt-2 text-sm text-muted-foreground">The download library is ready for resources to be published.</p></section> : <div className="mt-10 grid gap-4 sm:grid-cols-2">{resources.map((resource) => <Link key={resource.slug} href={`/resources/${resource.slug}`} className="rounded-2xl border p-5 hover:bg-muted/40"><p className="text-xs uppercase tracking-wider text-muted-foreground">{resource.kind}</p><h2 className="mt-2 font-semibold">{resource.title}</h2><p className="mt-2 text-sm text-muted-foreground">{resource.description}</p></Link>)}</div>}</main>;
}
