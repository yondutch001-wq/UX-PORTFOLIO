import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import EngagementTracker from "@/components/analytics/engagement-tracker";
import CaseStudyActions from "@/components/work/case-study-actions";
import CoverImage from "@/components/work/cover-image";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  const project = await getProjectBySlug(slug, true);

  if (!project) return notFound();

  const clientLabel = project.client ?? project.title;
  const relatedProjects: Project[] = (await getProjects({ publishedOnly: true }))
    .filter((item: Project) => item.slug !== project.slug)
    .slice(0, 2);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <EngagementTracker projectSlug={project.slug} projectId={project.id} />
      <Link
        href="/work"
        className="text-sm font-semibold text-muted transition hover:text-ink"
      >
        &larr; Back to Work
      </Link>

      <section className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            {project.summary ?? project.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="stat">
                <p className="stat-value">{metric.value}</p>
                <p className="stat-label">{metric.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CaseStudyActions projectSlug={project.slug} projectId={project.id} />
          </div>
        </div>

        <div className="card overflow-hidden">
          <CoverImage project={project} className="aspect-[16/9]" />
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Case Study
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{clientLabel}</h2>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
              {project.year}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Project Snapshot
            </p>
            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                  Role
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {project.role}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                  Team
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {project.team}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                  Duration
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {project.duration}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                  Tools
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="pill">
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <nav
        className="mt-10 flex flex-wrap gap-3 text-sm text-muted"
        aria-label="Case study sections"
      >
        {[
          { label: "Overview", href: "#overview" },
          { label: "Problem", href: "#problem" },
          { label: "Goals", href: "#goals" },
          { label: "Approach", href: "#approach" },
          { label: "Solution", href: "#solution" },
          { label: "Outcome", href: "#outcome" },
          { label: "Preview", href: "#preview" }
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-border bg-white px-4 py-2 transition hover:border-ink hover:text-ink"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <section id="overview" className="section-anchor mt-10 grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-3 text-sm text-muted">{project.overview}</p>
        </div>
        <div id="problem" className="section-anchor card p-6">
          <h2 className="text-2xl font-semibold">Problem</h2>
          <p className="mt-3 text-sm text-muted">{project.problem}</p>
        </div>
        <div id="goals" className="section-anchor card p-6">
          <h2 className="text-2xl font-semibold">Goals</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {project.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div id="responsibilities" className="section-anchor card p-6">
          <h2 className="text-2xl font-semibold">Responsibilities</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {project.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div id="approach" className="section-anchor card p-6">
          <h2 className="text-2xl font-semibold">Approach</h2>
          <div className="mt-4 space-y-4 text-sm text-muted">
            {project.approach.map((step, index) => (
              <div key={step.title}>
                <p className="text-sm font-semibold text-ink">
                  0{index + 1} {step.title}
                </p>
                <p className="mt-1 text-sm text-muted">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div id="solution" className="section-anchor card p-6">
          <h2 className="text-2xl font-semibold">Solution</h2>
          <p className="mt-3 text-sm text-muted">{project.solution}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div id="outcome" className="section-anchor card p-6">
          <h2 className="text-2xl font-semibold">Outcome</h2>
          <p className="mt-3 text-sm text-muted">{project.outcome}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="stat text-center">
                <p className="stat-value">{metric.value}</p>
                <p className="stat-label">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="section-anchor mt-12">
        <p className="eyebrow">Design Preview</p>
        {project.figmaEmbed ? (
          <div className="card mt-4 overflow-hidden">
            <div className="aspect-video">
              <iframe
                title={`${project.title} Figma Preview`}
                src={project.figmaEmbed}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="card mt-4 p-6">
            <p className="text-sm text-muted">
              Design preview available upon request.
            </p>
          </div>
        )}
      </section>

      {relatedProjects.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow">More Work</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {relatedProjects.map((item) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1"
              >
                <CoverImage project={item} className="aspect-[16/9]" />
                <div className="flex h-full flex-col gap-3 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {item.category ?? "Case Study"}
                  </p>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{item.team}</span>
                    <span>{item.duration}</span>
                  </div>
                  {item.summary ? (
                    <p className="text-sm text-muted line-clamp-3">
                      {item.summary}
                    </p>
                  ) : null}
                  {item.tools.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <span key={tool} className="pill">
                          {tool}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-ink">
                    View case study
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
