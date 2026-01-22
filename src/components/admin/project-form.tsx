"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import type { Project, ProjectApproach, ProjectMetric } from "@/lib/projects";

type Props = {
  accessToken: string;
  project?: Project | null;
};

type FormState = {
  title: string;
  slug: string;
  client: string;
  year: string;
  category: string;
  role: string;
  duration: string;
  team: string;
  summary: string;
  overview: string;
  problem: string;
  solution: string;
  outcome: string;
  figmaEmbed: string;
  sortOrder: string;
  isFeatured: boolean;
  isPublished: boolean;
  coverBackground: string;
  coverForeground: string;
  coverImageUrl: string;
  toolsText: string;
  tagsText: string;
  goalsText: string;
  responsibilitiesText: string;
  highlightsText: string;
};

const DEFAULT_COVER_BACKGROUND =
  "linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #93c5fd 100%)";

function listToText(values: string[]) {
  return values.join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildInitialState(project?: Project | null): FormState {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    client: project?.client ?? "",
    year: project?.year ?? "",
    category: project?.category ?? "",
    role: project?.role ?? "",
    duration: project?.duration ?? "",
    team: project?.team ?? "",
    summary: project?.summary ?? "",
    overview: project?.overview ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    outcome: project?.outcome ?? "",
    figmaEmbed: project?.figmaEmbed ?? "",
    sortOrder: project?.sortOrder?.toString() ?? "0",
    isFeatured: project?.isFeatured ?? false,
    isPublished: project?.isPublished ?? true,
    coverBackground: project?.cover?.background ?? DEFAULT_COVER_BACKGROUND,
    coverForeground: project?.cover?.foreground ?? "#ffffff",
    coverImageUrl: project?.coverImageUrl ?? "",
    toolsText: listToText(project?.tools ?? []),
    tagsText: listToText(project?.tags ?? []),
    goalsText: listToText(project?.goals ?? []),
    responsibilitiesText: listToText(project?.responsibilities ?? []),
    highlightsText: listToText(project?.highlights ?? [])
  };
}

function buildMetricRows(metrics: ProjectMetric[]) {
  return metrics.length > 0 ? metrics : [{ value: "", label: "" }];
}

function buildApproachRows(approach: ProjectApproach[]) {
  return approach.length > 0 ? approach : [{ title: "", detail: "" }];
}

export default function ProjectForm({ accessToken, project }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [form, setForm] = useState<FormState>(() => buildInitialState(project));
  const [metrics, setMetrics] = useState<ProjectMetric[]>(
    buildMetricRows(project?.metrics ?? [])
  );
  const [approach, setApproach] = useState<ProjectApproach[]>(
    buildApproachRows(project?.approach ?? [])
  );
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetricChange = (
    index: number,
    field: keyof ProjectMetric,
    value: string
  ) => {
    setMetrics((prev) =>
      prev.map((metric, idx) =>
        idx === index ? { ...metric, [field]: value } : metric
      )
    );
  };

  const handleApproachChange = (
    index: number,
    field: keyof ProjectApproach,
    value: string
  ) => {
    setApproach((prev) =>
      prev.map((step, idx) =>
        idx === index ? { ...step, [field]: value } : step
      )
    );
  };

  const addMetric = () => setMetrics((prev) => [...prev, { value: "", label: "" }]);
  const removeMetric = (index: number) =>
    setMetrics((prev) => prev.filter((_, idx) => idx !== index));

  const addApproach = () =>
    setApproach((prev) => [...prev, { title: "", detail: "" }]);
  const removeApproach = (index: number) =>
    setApproach((prev) => prev.filter((_, idx) => idx !== index));

  const handleUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setStatus(null);

    const bucket =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "portfolio";
    const extension = file.name.split(".").pop();
    const safeSlug = slugify(form.slug || form.title || "project") || "project";
    const fileName = `${safeSlug}-${Date.now()}.${extension}`;
    const filePath = `projects/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (error) {
      setStatus(`Upload failed: ${error.message}`);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    handleChange("coverImageUrl", data.publicUrl);
    setStatus("Cover image uploaded.");
    setIsUploading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      client: form.client || null,
      year: form.year || null,
      category: form.category || null,
      role: form.role || null,
      duration: form.duration || null,
      team: form.team || null,
      summary: form.summary || null,
      overview: form.overview || null,
      problem: form.problem || null,
      solution: form.solution || null,
      outcome: form.outcome || null,
      figmaEmbed: form.figmaEmbed || null,
      sortOrder: Number(form.sortOrder) || 0,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      cover: {
        background: form.coverBackground || DEFAULT_COVER_BACKGROUND,
        foreground: form.coverForeground || "#ffffff"
      },
      coverImageUrl: form.coverImageUrl || null,
      tools: textToList(form.toolsText),
      tags: textToList(form.tagsText),
      goals: textToList(form.goalsText),
      responsibilities: textToList(form.responsibilitiesText),
      highlights: textToList(form.highlightsText),
      metrics: metrics
        .map((metric) => ({
          value: metric.value.trim(),
          label: metric.label.trim()
        }))
        .filter((metric) => metric.value && metric.label),
      approach: approach
        .map((step) => ({
          title: step.title.trim(),
          detail: step.detail.trim()
        }))
        .filter((step) => step.title && step.detail)
    };

    try {
      const endpoint = project
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects";
      const response = await fetch(endpoint, {
        method: project ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to save project.");
      }

      setStatus("Project saved.");

      if (!project && result?.project?.id) {
        router.push(`/admin/projects/${result.project.id}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save project.";
      setStatus(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="card p-6">
        <h2 className="text-xl font-semibold">Project Basics</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-muted">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              required
            />
          </label>
          <label className="text-sm text-muted">
            Slug
            <input
              type="text"
              value={form.slug}
              onChange={(event) => handleChange("slug", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              placeholder={slugify(form.title || "project-name")}
            />
          </label>
          <label className="text-sm text-muted">
            Client
            <input
              type="text"
              value={form.client}
              onChange={(event) => handleChange("client", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="text-sm text-muted">
            Year
            <input
              type="text"
              value={form.year}
              onChange={(event) => handleChange("year", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              placeholder="2024"
            />
          </label>
          <label className="text-sm text-muted">
            Category
            <input
              type="text"
              value={form.category}
              onChange={(event) => handleChange("category", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              placeholder="Fintech, Mobile, SaaS"
            />
          </label>
          <label className="text-sm text-muted">
            Role
            <input
              type="text"
              value={form.role}
              onChange={(event) => handleChange("role", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="text-sm text-muted">
            Duration
            <input
              type="text"
              value={form.duration}
              onChange={(event) => handleChange("duration", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              placeholder="6 weeks"
            />
          </label>
          <label className="text-sm text-muted">
            Team
            <input
              type="text"
              value={form.team}
              onChange={(event) => handleChange("team", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              placeholder="PM, 2 engineers"
            />
          </label>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="mt-4 grid gap-4">
          <label className="text-sm text-muted">
            Summary
            <textarea
              value={form.summary}
              onChange={(event) => handleChange("summary", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={3}
            />
          </label>
          <label className="text-sm text-muted">
            Overview
            <textarea
              value={form.overview}
              onChange={(event) => handleChange("overview", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
          <label className="text-sm text-muted">
            Problem
            <textarea
              value={form.problem}
              onChange={(event) => handleChange("problem", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
          <label className="text-sm text-muted">
            Goals (one per line)
            <textarea
              value={form.goalsText}
              onChange={(event) => handleChange("goalsText", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Responsibilities & Approach</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-muted">
            Responsibilities (one per line)
            <textarea
              value={form.responsibilitiesText}
              onChange={(event) =>
                handleChange("responsibilitiesText", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
          <label className="text-sm text-muted">
            Highlights (one per line)
            <textarea
              value={form.highlightsText}
              onChange={(event) =>
                handleChange("highlightsText", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
        </div>
        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Approach steps</p>
          {approach.map((step, index) => (
            <div key={`${step.title}-${index}`} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
              <input
                type="text"
                value={step.title}
                onChange={(event) =>
                  handleApproachChange(index, "title", event.target.value)
                }
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                placeholder="Discovery"
              />
              <input
                type="text"
                value={step.detail}
                onChange={(event) =>
                  handleApproachChange(index, "detail", event.target.value)
                }
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                placeholder="Mapped workflows and stakeholder needs."
              />
              <button
                type="button"
                onClick={() => removeApproach(index)}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addApproach}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink"
          >
            Add step
          </button>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Solution & Outcome</h2>
        <div className="mt-4 grid gap-4">
          <label className="text-sm text-muted">
            Solution
            <textarea
              value={form.solution}
              onChange={(event) => handleChange("solution", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
          <label className="text-sm text-muted">
            Outcome
            <textarea
              value={form.outcome}
              onChange={(event) => handleChange("outcome", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Metrics & Tags</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-muted">
            Tags (one per line)
            <textarea
              value={form.tagsText}
              onChange={(event) => handleChange("tagsText", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
          <label className="text-sm text-muted">
            Tools (one per line)
            <textarea
              value={form.toolsText}
              onChange={(event) => handleChange("toolsText", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              rows={4}
            />
          </label>
        </div>
        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Metrics</p>
          {metrics.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
              <input
                type="text"
                value={metric.value}
                onChange={(event) =>
                  handleMetricChange(index, "value", event.target.value)
                }
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                placeholder="12"
              />
              <input
                type="text"
                value={metric.label}
                onChange={(event) =>
                  handleMetricChange(index, "label", event.target.value)
                }
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                placeholder="Critical flows"
              />
              <button
                type="button"
                onClick={() => removeMetric(index)}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMetric}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink"
          >
            Add metric
          </button>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Media & Settings</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-muted">
            Figma Embed URL
            <input
              type="text"
              value={form.figmaEmbed}
              onChange={(event) => handleChange("figmaEmbed", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="text-sm text-muted">
            Sort order
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => handleChange("sortOrder", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="text-sm text-muted">
            Cover gradient
            <input
              type="text"
              value={form.coverBackground}
              onChange={(event) =>
                handleChange("coverBackground", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="text-sm text-muted">
            Cover text color
            <input
              type="text"
              value={form.coverForeground}
              onChange={(event) =>
                handleChange("coverForeground", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="text-sm text-muted">
            Cover image upload
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleUpload(file);
              }}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
            {isUploading ? (
              <p className="mt-2 text-xs text-muted">Uploading...</p>
            ) : null}
          </label>
          <label className="text-sm text-muted">
            Cover image URL
            <input
              type="text"
              value={form.coverImageUrl}
              onChange={(event) =>
                handleChange("coverImageUrl", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                handleChange("isPublished", event.target.checked)
              }
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) =>
                handleChange("isFeatured", event.target.checked)
              }
            />
            Featured
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save project"}
        </button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}
