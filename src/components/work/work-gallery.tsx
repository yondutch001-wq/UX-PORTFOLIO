"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, LayoutList, Search } from "lucide-react";
import type { Project } from "@/lib/projects";

type ViewMode = "grid" | "list";

type Props = {
  projects: Project[];
};

function getCoverStyle(project: Project) {
  if (project.coverImageUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.8)), url(${project.coverImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: project.cover.foreground
    };
  }

  return {
    background: project.cover.background,
    color: project.cover.foreground
  };
}

function matchesQuery(project: Project, query: string) {
  if (!query) return true;
  const haystack = [
    project.title,
    project.summary ?? project.overview,
    project.overview,
    project.category,
    project.client,
    project.tags.join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function WorkGallery({ projects }: Props) {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categories = useMemo(() => {
    const unique = new Set(
      projects
        .map((project) => project.category)
        .filter((value): value is string => Boolean(value))
    );
    return ["All", ...Array.from(unique).sort()];
  }, [projects]);

  const tags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });
    return [
      "All",
      ...Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([tag]) => tag)
    ];
  }, [projects]);

  const stats = useMemo(() => {
    const clientCount = new Set(
      projects
        .map((project) => project.client)
        .filter((value): value is string => Boolean(value))
    ).size;
    const categoryCount = new Set(
      projects
        .map((project) => project.category)
        .filter((value): value is string => Boolean(value))
    ).size;
    return [
      { value: `${projects.length}`, label: "Case Studies" },
      { value: `${clientCount}`, label: "Client Partners" },
      { value: `${categoryCount}`, label: "Industries" }
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;
      const matchesTag =
        activeTag === "All" || project.tags.includes(activeTag);
      return matchesCategory && matchesTag && matchesQuery(project, query);
    });
  }, [projects, activeCategory, activeTag, query]);

  const featuredProject =
    projects.find((project) => project.isFeatured) ?? projects[0];
  const isFiltering =
    query.trim().length > 0 || activeCategory !== "All" || activeTag !== "All";
  const listProjects = isFiltering
    ? filteredProjects
    : projects.filter((project) => project.slug !== featuredProject?.slug);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <header className="max-w-3xl">
        <p className="eyebrow">Work</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
          Case studies that show strategy, craft, and results.
        </h1>
        <p className="mt-4 text-muted">
          Explore projects that highlight UX problem-solving, visual craft, and
          scalable design systems.
        </p>
      </header>

      {projects.length === 0 ? (
        <section className="mt-10">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold">No case studies yet.</h2>
            <p className="mt-3 text-sm text-muted">
              Publish a project to start showcasing your work here.
            </p>
            <Link href="/contact" className="btn btn-primary mt-6">
              Start a Project
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="stat">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card p-5">
              <label className="text-xs uppercase tracking-[0.2em] text-muted">
                Search
                <span className="sr-only">projects</span>
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
                <Search className="h-4 w-4 text-muted" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by client, category, or keyword"
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label="Search projects"
                />
              </div>
              <p className="mt-3 text-xs text-muted" aria-live="polite">
                {filteredProjects.length} projects match your filters.
              </p>
            </div>

            <div className="card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                View
              </p>
              <div className="mt-4 flex gap-2">
                {(
                  [
                    { id: "grid", label: "Grid", icon: LayoutGrid },
                    { id: "list", label: "List", icon: LayoutList }
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id)}
                    aria-pressed={viewMode === mode.id}
                    className={clsx(
                      "flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition",
                      viewMode === mode.id
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white text-ink"
                    )}
                  >
                    <mode.icon className="h-4 w-4" aria-hidden />
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
                Categories
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={clsx(
                      "rounded-full border px-3 py-1 text-xs font-semibold transition",
                      activeCategory === category
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white text-ink-soft"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={activeTag === tag}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    activeTag === tag
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-white text-ink-soft"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

      {featuredProject && !isFiltering ? (
        <section className="mt-12">
          <p className="eyebrow">Featured Case Study</p>
          <Link
            href={`/work/${featuredProject.slug}`}
            className="card group mt-4 flex flex-col overflow-hidden transition hover:-translate-y-1 focus-ring"
          >
            <div className="p-8 text-white" style={getCoverStyle(featuredProject)}>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                {featuredProject.category}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {featuredProject.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                {featuredProject.summary ?? featuredProject.overview}
              </p>
            {[
              featuredProject.client,
              featuredProject.year,
              featuredProject.duration
            ]
              .filter(Boolean)
              .join(" / ") ? (
              <p className="mt-4 text-xs text-white/70">
                {[
                  featuredProject.client,
                  featuredProject.year,
                  featuredProject.duration
                ]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
            ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{featuredProject.role}</span>
                <span>{featuredProject.team}</span>
              </div>
              <p className="text-sm text-muted">{featuredProject.overview}</p>
              <div className="flex flex-wrap gap-2">
                {featuredProject.tags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-ink">
                View case study
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{isFiltering ? "Results" : "All Case Studies"}</p>
          {isFiltering ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
                setActiveTag("All");
              }}
              className="text-xs font-semibold text-ink transition hover:text-accent"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {listProjects.length === 0 ? (
          <div className="card mt-6 p-6">
            <p className="text-sm text-muted">
              No projects match your current filters.
            </p>
          </div>
        ) : (
          <motion.div
            layout={!reducedMotion}
            className={clsx(
              "mt-6 grid gap-6",
              viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1"
            )}
          >
            <AnimatePresence mode="popLayout">
              {listProjects.map((project) => (
                <motion.article
                  key={project.id}
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className={clsx(
                      "card group flex h-full overflow-hidden transition hover:-translate-y-1 focus-ring",
                      viewMode === "list" && "lg:flex-row"
                    )}
                  >
                    <div
                      className={clsx(
                        "p-6 text-white",
                        viewMode === "list" ? "lg:w-[45%]" : ""
                      )}
                      style={getCoverStyle(project)}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                        {project.category}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/80">
                        {project.summary ?? project.overview}
                      </p>
                    </div>
                    <div className="flex h-full flex-1 flex-col gap-4 p-6">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{project.role}</span>
                        <span>{project.duration}</span>
                      </div>
                      <p className="text-sm text-muted">{project.overview}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-ink">
                        View case study
                        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

          <section className="mt-20">
            <div className="card flex flex-col items-center gap-6 px-8 py-12 text-center">
              <p className="eyebrow">Next Step</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Want to explore a design partnership?
              </h2>
              <p className="max-w-2xl text-muted">
                Share your product goals and I will recommend a design plan tailored
                to your timeline.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Book a Project Call
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
