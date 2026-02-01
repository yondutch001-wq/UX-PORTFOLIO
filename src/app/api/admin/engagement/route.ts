import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type EngagementTotals = {
  slug: string;
  total: number;
  views: number;
  inquiries: number;
  clicks: number;
  uniqueSessions: number;
};

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const url = new URL(request.url);
  const daysParam = Number(url.searchParams.get("days") ?? 30);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("engagement_events")
    .select("project_slug,event_type,session_id,created_at")
    .gte("created_at", since);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalsBySlug = new Map<string, EngagementTotals>();

  (data ?? []).forEach((row) => {
    const slug = row.project_slug as string;
    if (!slug) return;

    if (!totalsBySlug.has(slug)) {
      totalsBySlug.set(slug, {
        slug,
        total: 0,
        views: 0,
        inquiries: 0,
        clicks: 0,
        uniqueSessions: 0
      });
    }

    const record = totalsBySlug.get(slug)!;
    record.total += 1;

    switch (String(row.event_type)) {
      case "view":
        record.views += 1;
        break;
      case "inquiry":
        record.inquiries += 1;
        break;
      case "click":
        record.clicks += 1;
        break;
      default:
        break;
    }
  });

  // Compute unique sessions per project
  const sessionMap = new Map<string, Set<string>>();
  (data ?? []).forEach((row) => {
    const slug = row.project_slug as string;
    const sessionId = row.session_id as string | null;
    if (!slug || !sessionId) return;
    if (!sessionMap.has(slug)) sessionMap.set(slug, new Set());
    sessionMap.get(slug)!.add(sessionId);
  });

  sessionMap.forEach((sessions, slug) => {
    const record = totalsBySlug.get(slug);
    if (record) record.uniqueSessions = sessions.size;
  });

  return NextResponse.json({
    windowDays: days,
    totals: Array.from(totalsBySlug.values())
  });
}
