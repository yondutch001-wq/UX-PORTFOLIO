import { getSql } from "@/lib/neon";
import { slugify } from "@/lib/slugify";

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectApproach = {
  title: string;
  detail: string;
};

export type ProjectCover = {
  background: string;
  foreground: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  year: string | null;
  category: string | null;
  role: string | null;
  duration: string | null;
  tools: string[];
  team: string | null;
  summary: string | null;
  overview: string | null;
  problem: string | null;
  goals: string[];
  responsibilities: string[];
  approach: ProjectApproach[];
  solution: string | null;
  outcome: string | null;
  highlights: string[];
  metrics: ProjectMetric[];
  tags: string[];
  cover: ProjectCover;
  coverImageUrl: string | null;
  figmaEmbed: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  slug?: string;
  title: string;
  client?: string | null;
  year?: string | null;
  category?: string | null;
  role?: string | null;
  duration?: string | null;
  tools?: string[];
  team?: string | null;
  summary?: string | null;
  overview?: string | null;
  problem?: string | null;
  goals?: string[];
  responsibilities?: string[];
  approach?: ProjectApproach[];
  solution?: string | null;
  outcome?: string | null;
  highlights?: string[];
  metrics?: ProjectMetric[];
  tags?: string[];
  cover?: ProjectCover;
  coverImageUrl?: string | null;
  figmaEmbed?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
};

const FALLBACK_COVER: ProjectCover = {
  background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #93c5fd 100%)",
  foreground: "#ffffff"
};

function toRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  if (result && typeof result === "object" && "rows" in result) {
    const rows = (result as { rows?: T[] }).rows;
    return Array.isArray(rows) ? rows : [];
  }
  return [];
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function toBoolean(value: unknown) {
  return value === true || value === "t" || value === 1;
}

function normalizeRow(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    client: row.client ? String(row.client) : null,
    year: row.year ? String(row.year) : null,
    category: row.category ? String(row.category) : null,
    role: row.role ? String(row.role) : null,
    duration: row.duration ? String(row.duration) : null,
    tools: parseJson<string[]>(row.tools, []),
    team: row.team ? String(row.team) : null,
    summary: row.summary ? String(row.summary) : null,
    overview: row.overview ? String(row.overview) : null,
    problem: row.problem ? String(row.problem) : null,
    goals: parseJson<string[]>(row.goals, []),
    responsibilities: parseJson<string[]>(row.responsibilities, []),
    approach: parseJson<ProjectApproach[]>(row.approach, []),
    solution: row.solution ? String(row.solution) : null,
    outcome: row.outcome ? String(row.outcome) : null,
    highlights: parseJson<string[]>(row.highlights, []),
    metrics: parseJson<ProjectMetric[]>(row.metrics, []),
    tags: parseJson<string[]>(row.tags, []),
    cover: parseJson<ProjectCover>(row.cover, FALLBACK_COVER),
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : null,
    figmaEmbed: row.figma_embed ? String(row.figma_embed) : null,
    isFeatured: toBoolean(row.is_featured),
    isPublished: toBoolean(row.is_published),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at ? String(row.created_at) : "",
    updatedAt: row.updated_at ? String(row.updated_at) : ""
  };
}

function buildPayload(input: ProjectInput, slug: string) {
  const clean = (value?: string | null) =>
    value ? value.trim() : null;

  return {
    slug,
    title: input.title.trim(),
    client: clean(input.client),
    year: clean(input.year),
    category: clean(input.category),
    role: clean(input.role),
    duration: clean(input.duration),
    tools: JSON.stringify(input.tools ?? []),
    team: clean(input.team),
    summary: clean(input.summary),
    overview: clean(input.overview),
    problem: clean(input.problem),
    goals: JSON.stringify(input.goals ?? []),
    responsibilities: JSON.stringify(input.responsibilities ?? []),
    approach: JSON.stringify(input.approach ?? []),
    solution: clean(input.solution),
    outcome: clean(input.outcome),
    highlights: JSON.stringify(input.highlights ?? []),
    metrics: JSON.stringify(input.metrics ?? []),
    tags: JSON.stringify(input.tags ?? []),
    cover: JSON.stringify(input.cover ?? FALLBACK_COVER),
    coverImageUrl: clean(input.coverImageUrl),
    figmaEmbed: clean(input.figmaEmbed),
    isFeatured: Boolean(input.isFeatured),
    isPublished: input.isPublished ?? true,
    sortOrder: input.sortOrder ?? 0
  };
}

async function ensureUniqueSlug(slug: string, excludeId?: string) {
  const sql = getSql();
  let candidate = slug;
  let suffix = 1;

  while (true) {
    const result = excludeId
      ? await sql(
          "SELECT id FROM projects WHERE slug = $1 AND id <> $2 LIMIT 1",
          [candidate, excludeId]
        )
      : await sql("SELECT id FROM projects WHERE slug = $1 LIMIT 1", [candidate]);
    const rows = toRows<Record<string, unknown>>(result);

    if (rows.length === 0) return candidate;

    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
}

export async function getProjects(options?: {
  publishedOnly?: boolean;
  limit?: number;
}) {
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? true;
  const limit = options?.limit ?? null;
  const whereClause = publishedOnly ? "WHERE is_published = true" : "";
  const limitClause = limit ? `LIMIT ${Number(limit)}` : "";

  const result = await sql(
    `SELECT * FROM projects ${whereClause} ORDER BY is_featured DESC, sort_order DESC, created_at DESC ${limitClause}`
  );

  const rows = toRows<Record<string, unknown>>(result);
  return rows.map(normalizeRow);
}

export async function getProjectBySlug(slug: string, publishedOnly = true) {
  const sql = getSql();
  const result = publishedOnly
    ? await sql(
        "SELECT * FROM projects WHERE slug = $1 AND is_published = true LIMIT 1",
        [slug]
      )
    : await sql("SELECT * FROM projects WHERE slug = $1 LIMIT 1", [slug]);

  const rows = toRows<Record<string, unknown>>(result);
  if (rows.length === 0) return null;
  return normalizeRow(rows[0]);
}

export async function getProjectById(id: string) {
  const sql = getSql();
  const result = await sql("SELECT * FROM projects WHERE id = $1 LIMIT 1", [id]);
  const rows = toRows<Record<string, unknown>>(result);
  if (rows.length === 0) return null;
  return normalizeRow(rows[0]);
}

export async function createProject(input: ProjectInput) {
  if (!input.title?.trim()) {
    throw new Error("Project title is required.");
  }

  const baseSlug = slugify(input.slug?.trim() || input.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const payload = buildPayload(input, slug);
  const sql = getSql();

  const result = await sql(
    `INSERT INTO projects (
      slug, title, client, year, category, role, duration, tools, team,
      summary, overview, problem, goals, responsibilities, approach, solution,
      outcome, highlights, metrics, tags, cover, cover_image_url, figma_embed,
      is_featured, is_published, sort_order
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9,
      $10, $11, $12, $13::jsonb, $14::jsonb, $15::jsonb, $16,
      $17, $18::jsonb, $19::jsonb, $20::jsonb, $21::jsonb, $22, $23,
      $24, $25, $26
    ) RETURNING *`,
    [
      payload.slug,
      payload.title,
      payload.client,
      payload.year,
      payload.category,
      payload.role,
      payload.duration,
      payload.tools,
      payload.team,
      payload.summary,
      payload.overview,
      payload.problem,
      payload.goals,
      payload.responsibilities,
      payload.approach,
      payload.solution,
      payload.outcome,
      payload.highlights,
      payload.metrics,
      payload.tags,
      payload.cover,
      payload.coverImageUrl,
      payload.figmaEmbed,
      payload.isFeatured,
      payload.isPublished,
      payload.sortOrder
    ]
  );

  const rows = toRows<Record<string, unknown>>(result);
  return normalizeRow(rows[0]);
}

export async function updateProject(id: string, input: ProjectInput) {
  if (!input.title?.trim()) {
    throw new Error("Project title is required.");
  }

  const baseSlug = slugify(input.slug?.trim() || input.title);
  const slug = await ensureUniqueSlug(baseSlug, id);
  const payload = buildPayload(input, slug);
  const sql = getSql();

  const result = await sql(
    `UPDATE projects SET
      slug = $1,
      title = $2,
      client = $3,
      year = $4,
      category = $5,
      role = $6,
      duration = $7,
      tools = $8::jsonb,
      team = $9,
      summary = $10,
      overview = $11,
      problem = $12,
      goals = $13::jsonb,
      responsibilities = $14::jsonb,
      approach = $15::jsonb,
      solution = $16,
      outcome = $17,
      highlights = $18::jsonb,
      metrics = $19::jsonb,
      tags = $20::jsonb,
      cover = $21::jsonb,
      cover_image_url = $22,
      figma_embed = $23,
      is_featured = $24,
      is_published = $25,
      sort_order = $26
    WHERE id = $27
    RETURNING *`,
    [
      payload.slug,
      payload.title,
      payload.client,
      payload.year,
      payload.category,
      payload.role,
      payload.duration,
      payload.tools,
      payload.team,
      payload.summary,
      payload.overview,
      payload.problem,
      payload.goals,
      payload.responsibilities,
      payload.approach,
      payload.solution,
      payload.outcome,
      payload.highlights,
      payload.metrics,
      payload.tags,
      payload.cover,
      payload.coverImageUrl,
      payload.figmaEmbed,
      payload.isFeatured,
      payload.isPublished,
      payload.sortOrder,
      id
    ]
  );

  const rows = toRows<Record<string, unknown>>(result);
  if (rows.length === 0) return null;
  return normalizeRow(rows[0]);
}

export async function deleteProject(id: string) {
  const sql = getSql();
  const result = await sql("DELETE FROM projects WHERE id = $1 RETURNING id", [
    id
  ]);
  const rows = toRows<Record<string, unknown>>(result);
  return rows.length > 0;
}
