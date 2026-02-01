import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

async function notifyInquiry(payload: {
  name: string;
  email: string;
  message: string;
  project?: string | null;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/send-inquiry-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to send inquiry email.");
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const name = String(payload?.name ?? "").trim();
    const email = String(payload?.email ?? "").trim();
    const message = String(payload?.message ?? "").trim();
    const project = String(payload?.project ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      message,
      project: project || null
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await notifyInquiry({ name, email, message, project: project || null });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send inquiry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
