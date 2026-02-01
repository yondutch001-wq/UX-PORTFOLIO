import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const VALID_EVENTS = new Set(["view", "inquiry", "click"]);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventType = String(payload?.eventType ?? "").toLowerCase();
    const projectSlug = String(payload?.projectSlug ?? "").trim();

    if (!VALID_EVENTS.has(eventType)) {
      return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
    }

    if (!projectSlug) {
      return NextResponse.json({ error: "Project slug is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("engagement_events").insert({
      project_slug: projectSlug,
      project_id: payload?.projectId ?? null,
      event_type: eventType,
      session_id: payload?.sessionId ?? null,
      pathname: payload?.pathname ?? null,
      referrer: payload?.referrer ?? null,
      user_agent: payload?.userAgent ?? null
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record engagement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
