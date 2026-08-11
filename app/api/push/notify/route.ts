import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/app/lib/admin-auth";
import { broadcastPushNotification } from "@/app/lib/push";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json({ status: "error", message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { title?: string; body?: string; url?: string };

  if (!body.title || !body.body) {
    return NextResponse.json({ status: "error", message: "Title and body are required." }, { status: 400 });
  }

  const result = await broadcastPushNotification({
    title: body.title,
    body: body.body,
    url: body.url,
  });

  return NextResponse.json(result, { status: result.status === "success" ? 200 : 500 });
}
