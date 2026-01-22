import { getSupabaseAdmin } from "@/lib/supabase/admin";

type AdminResult =
  | { ok: true; email: string }
  | { ok: false; status: number; message: string };

export async function requireAdmin(request: Request): Promise<AdminResult> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return { ok: false, status: 401, message: "Missing access token." };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!adminEmail) {
    return { ok: false, status: 500, message: "ADMIN_EMAIL is not configured." };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.email) {
    return { ok: false, status: 401, message: "Invalid session." };
  }

  if (data.user.email.toLowerCase() !== adminEmail) {
    return { ok: false, status: 403, message: "Not authorized." };
  }

  return { ok: true, email: data.user.email };
}
