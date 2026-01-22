import { projects } from "@/data/projects";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="mb-12 text-4xl font-bold">Case Studies</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="rounded-2xl border p-6 transition hover:shadow-lg"
          >
            <h2 className="mb-2 text-2xl font-semibold">
              {project.title}
            </h2>
            <p className="text-gray-600">{project.overview}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
