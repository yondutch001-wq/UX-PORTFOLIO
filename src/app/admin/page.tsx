"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAdminSession } from "@/components/admin/use-admin-session";
import type { Project } from "@/lib/projects";

type EngagementTotals = {
  slug: string;
  total: number;
  views: number;
  saves: number;
  inquiries: number;
  clicks: number;
  uniqueSessions: number;
};

export default function AdminPage() {
  const { session, loading, supabase } = useAdminSession();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsStatus, setProjectsStatus] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [engagements, setEngagements] = useState<EngagementTotals[]>([]);
  const [engagementStatus, setEngagementStatus] = useState<string | null>(null);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const [windowDays, setWindowDays] = useState(30);

  const stats = useMemo(() => {
    const published = projects.filter((project) => project.isPublished).length;
    const featured = projects.filter((project) => project.isFeatured).length;
    return { published, featured };
  }, [projects]);

  const engagementBySlug = useMemo(() => {
    const map = new Map<string, EngagementTotals>();
    engagements.forEach((entry) => {
      map.set(entry.slug, entry);
    });
    return map;
  }, [engagements]);

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
      email: scrubbedEmail
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Check your email for the verification code.");
      setAwaitingOtp(true);
    }

    setSending(false);
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);

    const normalizedEmail = email.normalize("NFKC").trim().toLowerCase();
    const scrubbedEmail = normalizedEmail.replace(/[\s\u200B-\u200D\uFEFF]/g, "");
    const scrubbedOtp = otp.trim();

    if (!scrubbedEmail) {
      setStatus("Enter your email address.");
      return;
    }
    if (!scrubbedOtp) {
      setStatus("Enter the verification code.");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: scrubbedEmail,
      token: scrubbedOtp,
      type: "email"
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Signed in.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAwaitingOtp(false);
    setOtp("");
  };

  useEffect(() => {
    if (!session) return;

    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsStatus(null);

      try {
        const response = await fetch("/api/admin/projects", {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        const text = await response.text();
        let result: { error?: string; projects?: Project[] } = {};
        if (text) {
          try {
            result = JSON.parse(text) as { error?: string; projects?: Project[] };
          } catch {
            result = {};
          }
        }

        if (!response.ok) {
          setProjectsStatus(result?.error ?? "Failed to load projects.");
          return;
        }

        setProjects(result.projects ?? []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load projects.";
        setProjectsStatus(message);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const loadEngagements = async () => {
      setEngagementLoading(true);
      setEngagementStatus(null);

      try {
        const response = await fetch(`/api/admin/engagement?days=${windowDays}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        const text = await response.text();
        let result: { error?: string; totals?: EngagementTotals[]; windowDays?: number } = {};
        if (text) {
          try {
            result = JSON.parse(text) as {
              error?: string;
              totals?: EngagementTotals[];
              windowDays?: number;
            };
          } catch {
            result = {};
          }
        }

        if (!response.ok) {
          setEngagementStatus(result?.error ?? "Failed to load engagements.");
          return;
        }

        setEngagements(result.totals ?? []);
        if (result.windowDays) setWindowDays(result.windowDays);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load engagements.";
        setEngagementStatus(message);
      } finally {
        setEngagementLoading(false);
      }
    };

    loadEngagements();
  }, [session, windowDays]);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      {!session ? (
        <div className="card mx-auto max-w-3xl p-6">
          <p className="eyebrow">Admin Access</p>
          <h1 className="mt-3 text-3xl font-semibold">Portfolio Admin</h1>
          <p className="mt-3 text-sm text-muted">
            Sign in with your admin email to manage projects.
          </p>

          {loading ? (
            <p className="mt-6 text-sm text-muted">Checking session...</p>
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
                {sending ? "Sending..." : "Send login code"}
              </button>
            </form>
          )}

          {awaitingOtp ? (
            <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
              <label className="text-sm text-muted">
                Verification code
                <input
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                  placeholder="Enter the code from your email"
                  inputMode="numeric"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn btn-primary">
                  Verify code
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setAwaitingOtp(false);
                    setOtp("");
                    setStatus(null);
                  }}
                >
                  Change email
                </button>
              </div>
            </form>
          ) : null}

          {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
        </div>
      ) : null}

      {session ? (
        <div className="mt-10 space-y-10">
          <section className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Dashboard</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Project control center
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Manage case studies, monitor engagement signals, and keep
                  featured work fresh.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/projects" className="btn btn-primary">
                  Manage projects
                </Link>
                <Link href="/admin/projects/new" className="btn btn-ghost">
                  New project
                </Link>
                <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="stat">
                <p className="stat-value">{projects.length}</p>
                <p className="stat-label">Total projects</p>
              </div>
              <div className="stat">
                <p className="stat-value">{stats.published}</p>
                <p className="stat-label">Published</p>
              </div>
              <div className="stat">
                <p className="stat-value">{stats.featured}</p>
                <p className="stat-label">Featured</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Projects</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Recent case studies
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Review visibility, publishing state, and highlights at a glance.
                </p>
              </div>
              <Link href="/admin/projects" className="text-sm font-semibold text-ink">
                Manage all projects
              </Link>
            </div>

            {projectsLoading ? (
              <p className="text-sm text-muted">Loading projects...</p>
            ) : projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.slice(0, 6).map((project) => (
                  <div key={project.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">
                          {project.category ?? "Uncategorized"}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                          {project.summary ?? project.overview ?? "No summary yet."}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                        <span className="rounded-full border border-border px-3 py-1 text-muted">
                          {project.isPublished ? "Published" : "Draft"}
                        </span>
                        {project.isFeatured ? (
                          <span className="rounded-full border border-border px-3 py-1 text-muted">
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-ink transition hover:text-accent"
                      >
                        Edit project
                      </Link>
                      <Link
                        href={`/work/${project.slug}`}
                        className="text-muted transition hover:text-ink"
                      >
                        View case study
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6">
                <p className="text-sm text-muted">
                  No projects yet. Create your first case study to get started.
                </p>
              </div>
            )}

            {projectsStatus ? (
              <p className="text-sm text-muted">{projectsStatus}</p>
            ) : null}
          </section>

          <section className="space-y-4">
            <div>
              <p className="eyebrow">Metrics</p>
              <h2 className="mt-2 text-2xl font-semibold">
                Engagement snapshot
              </h2>
              <p className="mt-2 text-sm text-muted">
                Live engagement totals for the last {windowDays} days.
              </p>
            </div>

            {engagementLoading ? (
              <p className="text-sm text-muted">Loading engagement metrics...</p>
            ) : projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.slice(0, 6).map((project) => {
                  const engagement = engagementBySlug.get(project.slug);
                  const total = engagement?.total ?? 0;
                  const views = engagement?.views ?? 0;
                  const inquiries = engagement?.inquiries ?? 0;
                  const sessions = engagement?.uniqueSessions ?? 0;

                  return (
                    <div key={`${project.id}-metrics`} className="card p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">
                            {project.category ?? "Case study"}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {project.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">
                            Engagements
                          </p>
                          <p className="text-2xl font-semibold">{total}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                          { label: "Views", value: views },
                          { label: "Inquiries", value: inquiries },
                          { label: "Sessions", value: sessions }
                        ].map((metric) => (
                          <div key={`${project.id}-${metric.label}`} className="stat">
                            <p className="stat-value">{metric.value}</p>
                            <p className="stat-label">{metric.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card p-6">
                <p className="text-sm text-muted">
                  Engagement data will appear after visitors view case studies.
                </p>
              </div>
            )}

            {engagementStatus ? (
              <p className="text-sm text-muted">{engagementStatus}</p>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
