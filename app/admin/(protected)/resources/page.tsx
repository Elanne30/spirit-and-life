import Link from "next/link";
import { DOWNLOADABLE_RESOURCES } from "@/app/content/resources";

export default function AdminResourcesPage() {
  return <main className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Admin</p><h1 className="text-3xl font-semibold">Downloads</h1></div><Link href="/admin/resources/new" className="rounded-md border px-4 py-2 text-sm">New resource</Link></div><div className="mt-8 space-y-3">{DOWNLOADABLE_RESOURCES.length === 0 ? <div className="rounded-xl border p-5 text-sm text-muted-foreground">No downloadable resources yet. Create one to attach a PDF, document, or audio file.</div> : DOWNLOADABLE_RESOURCES.map((resource) => <Link key={resource.slug} href={`/admin/resources/${resource.slug}`} className="block rounded-xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{resource.title}</h2><p className="mt-1 text-sm text-muted-foreground">{resource.kind} · {resource.publishedAt}</p></Link>)}</div></main>;
}
