"use client";

import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";
import { useAdminSession } from "@/components/admin/use-admin-session";

export default function NewProjectPage() {
  const { session, loading } = useAdminSession();

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
            Please sign in to create a project.
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
      <header className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">New Project</h1>
        </div>
      </header>
      <div className="mt-8">
        <ProjectForm accessToken={session.access_token} />
      </div>
    </main>
  );
}
