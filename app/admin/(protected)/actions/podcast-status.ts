"use server";
import { revalidatePath } from "next/cache";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { sql } from "@vercel/postgres";
export async function setPodcastPublished(slug: string, published: boolean) { if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." }; await sql`UPDATE podcast_episodes SET status = ${published ? "published" : "draft"}, updated_at = now() WHERE slug = ${slug}`; revalidatePath("/admin/podcast"); revalidatePath(`/admin/podcast/${slug}`); revalidatePath("/podcast"); revalidatePath(`/podcast/${slug}`); return { ok: true as const }; }
