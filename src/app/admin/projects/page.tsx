"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects";
import { useAdminSession } from "@/components/admin/use-admin-session";

export default function AdminProjectsPage() {
  const { session, loading } = useAdminSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const loadProjects = async () => {
      setStatus("Loading projects...");
      const response = await fetch("/api/admin/projects", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(result?.error ?? "Failed to load projects.");
        return;
      }

      setProjects(result.projects ?? []);
      setStatus(null);
    };

    loadProjects();
  }, [session]);

  const handleDelete = async (projectId: string) => {
    if (!session) return;
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus(result?.error ?? "Failed to delete project.");
      return;
    }

    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

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
            Please sign in to manage projects.
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
          <h1 className="mt-2 text-3xl font-semibold">Manage Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          New Project
        </Link>
      </header>

      {status ? <p className="mt-6 text-sm text-muted">{status}</p> : null}

      <div className="mt-8 space-y-4">
        {projects.length === 0 ? (
          <div className="card p-6">
            <p className="text-sm text-muted">No projects yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {project.category ?? "Uncategorized"} / {project.year ?? "N/A"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {project.isPublished ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="btn btn-ghost"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
