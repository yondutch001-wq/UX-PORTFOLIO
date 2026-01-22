"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProjectForm from "@/components/admin/project-form";
import { useAdminSession } from "@/components/admin/use-admin-session";
import type { Project } from "@/lib/projects";

type Props = {
  params: { id: string };
};

export default function EditProjectPage({ params }: Props) {
  const { session, loading } = useAdminSession();
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<string | null>("Loading project...");

  useEffect(() => {
    if (!session) return;

    const loadProject = async () => {
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(result?.error ?? "Failed to load project.");
        return;
      }

      setProject(result.project);
      setStatus(null);
    };

    loadProject();
  }, [params.id, session]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <p className="text-sm text-muted">Checking session...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <div className="card p-6">
          <p className="text-sm text-muted">
            Please sign in to edit a project.
          </p>
          <Link href="/admin" className="btn btn-primary mt-4">
            Go to admin sign-in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Edit Project</h1>
        </div>
        <Link href="/admin/projects" className="btn btn-ghost">
          Back to projects
        </Link>
      </header>

      {status ? <p className="mt-6 text-sm text-muted">{status}</p> : null}

      {project ? (
        <div className="mt-8">
          <ProjectForm accessToken={session.access_token} project={project} />
        </div>
      ) : null}
    </main>
  );
}
