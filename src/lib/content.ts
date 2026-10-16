import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { AppLocale } from "@/i18n/routing";
import { lanes, type LaneId } from "@/lib/signal/data";

export type ProjectStatus = "completed" | "inProgress" | "planned";

export type ProjectKind = "product" | "client" | "startup" | "personal";
export type StoreId = "appStore" | "googlePlay";
export interface StoreLink {
  store: StoreId;
  href: string;
}

export interface ProjectMeta {
  slug: string;
  locale: AppLocale;
  fallback: boolean;
  title: string;
  summary: string;
  publishedAt: string;
  year: string;
  images: string[];
  cover: string;
  link?: string;
  status: ProjectStatus;
  role: string;
  stack: string[];
  featured: boolean;
  order: number;
  kind: ProjectKind;
  platforms: string[];
  storeLinks: StoreLink[];
  portraitImages: boolean;
  signal: LaneId | null;
}

const FALLBACK_LOCALE: AppLocale = "en";
const SLUG_PATTERN = /^[a-z0-9-]+$/i;
const STATUSES: ProjectStatus[] = ["completed", "inProgress", "planned"];
const KINDS: ProjectKind[] = ["product", "client", "startup", "personal"];
const STORES: StoreId[] = ["appStore", "googlePlay"];

function projectsDir() {
  return path.join(process.cwd(), "content", "projects");
}

function fileFor(slug: string, locale: AppLocale) {
  return path.join(projectsDir(), `${slug}.${locale}.mdx`);
}

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function toStatus(value: unknown): ProjectStatus {
  return STATUSES.includes(value as ProjectStatus) ? (value as ProjectStatus) : "completed";
}

function toKind(value: unknown): ProjectKind {
  return KINDS.includes(value as ProjectKind) ? (value as ProjectKind) : "personal";
}

function toSignal(value: unknown): LaneId | null {
  return lanes.some((l) => l.id === value) ? (value as LaneId) : null;
}

function toStoreLinks(value: unknown): StoreLink[] {
  if (!Array.isArray(value)) return [];
  const links: StoreLink[] = [];
  for (const item of value) {
    const { store, href } = (item ?? {}) as Record<string, unknown>;
    if (STORES.includes(store as StoreId) && typeof href === "string" && href) {
      links.push({ store: store as StoreId, href });
    }
  }
  return links;
}

function toMeta(
  slug: string,
  locale: AppLocale,
  fallback: boolean,
  data: Record<string, unknown>,
): ProjectMeta {
  const publishedAt = String(data.publishedAt ?? "");
  const images = Array.isArray(data.images) ? data.images.map(String) : [];
  return {
    slug,
    locale,
    fallback,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    publishedAt,
    year: data.year ? String(data.year) : publishedAt.slice(0, 4),
    images,
    cover: images[0] ?? "",
    link: data.link ? String(data.link) : undefined,
    status: toStatus(data.status),
    role: String(data.role ?? ""),
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    featured: data.featured === true,
    order: typeof data.order === "number" ? data.order : 99,
    kind: toKind(data.kind),
    platforms: Array.isArray(data.platforms) ? data.platforms.map(String) : [],
    storeLinks: toStoreLinks(data.storeLinks),
    portraitImages: data.portraitImages === true,
    signal: toSignal(data.signal),
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  const files = await readdir(projectsDir());
  const slugs: string[] = [];
  // English is the canonical source: a slug counts only when its `.en.mdx` exists.
  for (const file of files) {
    const match = /^(.+)\.en\.mdx$/.exec(file);
    if (match && SLUG_PATTERN.test(match[1])) slugs.push(match[1]);
  }
  return slugs.sort();
}

export async function getProject(
  slug: string,
  locale: AppLocale,
): Promise<{ meta: ProjectMeta; content: string } | null> {
  if (!SLUG_PATTERN.test(slug)) return null;

  let source = await readIfExists(fileFor(slug, locale));
  let resolved = locale;
  if (source === null && locale !== FALLBACK_LOCALE) {
    source = await readIfExists(fileFor(slug, FALLBACK_LOCALE));
    resolved = FALLBACK_LOCALE;
  }
  if (source === null) return null;

  const { data, content } = matter(source);
  return { meta: toMeta(slug, resolved, resolved !== locale, data), content };
}

export async function getProjects(locale: AppLocale): Promise<ProjectMeta[]> {
  const slugs = await getProjectSlugs();
  const loaded = await Promise.all(slugs.map((slug) => getProject(slug, locale)));
  const all = loaded.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => p.meta);

  const featured = all.filter((p) => p.featured).sort((a, b) => a.order - b.order);
  const rest = all
    .filter((p) => !p.featured)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return [...featured, ...rest];
}
