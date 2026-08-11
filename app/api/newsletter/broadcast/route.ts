import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin-auth";
import { sendManualNewsletterBroadcast } from "@/app/lib/newsletter";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json({ status: "error", message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    subject?: string;
    bodyParagraphs?: string[];
    ctaLabel?: string;
    ctaHref?: string;
    footerNote?: string;
  };

  if (!body.subject || !body.bodyParagraphs?.length) {
    return NextResponse.json({ status: "error", message: "Subject and bodyParagraphs are required." }, { status: 400 });
  }

  const result = await sendManualNewsletterBroadcast({
    subject: body.subject,
    bodyParagraphs: body.bodyParagraphs,
    ctaLabel: body.ctaLabel,
    ctaHref: body.ctaHref,
    footerNote: body.footerNote,
  });

  return NextResponse.json(result, { status: result.status === "success" ? 200 : 500 });
}