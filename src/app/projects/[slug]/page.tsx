import { projects } from "@/data/projects";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>

      <p className="mb-8 text-gray-600">
        Role: {project.role} · Duration: {project.duration}
      </p>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">Overview</h2>
        <p>{project.overview}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">Problem</h2>
        <p>{project.problem}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">Solution</h2>
        <p>{project.solution}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold">Outcome</h2>
        <p>{project.outcome}</p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Design Preview</h2>
        <div className="aspect-video overflow-hidden rounded-xl border">
          <iframe
            src={project.figmaEmbed}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  );
}
