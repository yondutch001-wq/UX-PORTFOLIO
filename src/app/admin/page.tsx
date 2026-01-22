"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAdminSession } from "@/components/admin/use-admin-session";

export default function AdminPage() {
  const { session, loading, supabase } = useAdminSession();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setSending(true);

    const normalizedEmail = email.normalize("NFKC").trim().toLowerCase();
    const scrubbedEmail = normalizedEmail.replace(/[\s\u200B-\u200D\uFEFF]/g, "");
    if (!scrubbedEmail) {
      setStatus("Enter your email address.");
      setSending(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(scrubbedEmail)) {
      setStatus("Enter a valid email address.");
      setSending(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: scrubbedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`
      }
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Check your email for the magic link.");
    }

    setSending(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <div className="card p-6">
        <p className="eyebrow">Admin Access</p>
        <h1 className="mt-3 text-3xl font-semibold">Portfolio Admin</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in with your admin email to manage projects.
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-muted">Checking session...</p>
        ) : session ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted">
              Signed in as <span className="font-semibold">{session.user.email}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/projects" className="btn btn-primary">
                Manage Projects
              </Link>
              <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <label className="text-sm text-muted">
              Admin email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}

        {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
      </div>
    </main>
  );
}
