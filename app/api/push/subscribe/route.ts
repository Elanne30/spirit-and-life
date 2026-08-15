import { NextResponse } from "next/server";
import { savePushSubscription } from "@/app/lib/push";

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ status: "error", message: "Invalid push subscription." }, { status: 400 });
    }

    const result = await savePushSubscription(subscription);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[push] Subscription could not be saved.", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ status: "error", message: "Push subscription could not be saved." }, { status: 500 });
  }
}
