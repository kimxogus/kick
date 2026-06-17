import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  KickServiceError,
  seedLaunches,
  type Launch,
  type Maker,
  type Product,
  type ProductDetailResponse,
  type ProductRegistrationInput,
  type ProductRegistrationResponse,
  type StoredLaunch
} from "./kick-service";

// product-kick Skill이 등록한 제품을 보관하는 파일 백업 store.
// Next dev는 요청을 여러 worker로 분산해 in-memory가 worker마다 분리되므로,
// worker 무관하게 공유되는 파일을 source of truth로 쓴다.
// 서버 부팅 시 instrumentation에서 clearRegisteredStore()로 비워 재시작 시 소멸한다.
// RSC worker와 route handler worker의 process.cwd()가 다를 수 있어 cwd 무관한 tmpdir에 둔다.
const STORE_PATH = join(tmpdir(), "kick-producthunt-registered.json");

function readAll(): StoredLaunch[] {
  if (!existsSync(STORE_PATH)) {
    return [];
  }
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8")) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredLaunch[]) : [];
  } catch {
    return [];
  }
}

function writeAll(launches: StoredLaunch[]): void {
  writeFileSync(STORE_PATH, JSON.stringify(launches, null, 2), "utf8");
}

export function clearRegisteredStore(): void {
  if (existsSync(STORE_PATH)) {
    rmSync(STORE_PATH, { force: true });
  }
}

export function registerProduct(input: ProductRegistrationInput): ProductRegistrationResponse {
  const name = input?.name?.trim();
  const missing: string[] = [];
  if (!name) {
    missing.push("name");
  }
  for (const field of ["category", "tagline", "description", "kickPoint"] as const) {
    if (!input?.[field]?.trim()) {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    throw new KickServiceError("VALIDATION_ERROR", "제품 등록 정보를 확인해주세요.", missing);
  }

  const existing = readAll();
  const slug = ensureUniqueSlug(slugify(name as string), existing);
  const now = new Date().toISOString();
  const maker: Maker | undefined = input.maker?.name?.trim()
    ? {
        id: `maker_${slug}`,
        name: input.maker.name.trim(),
        role: input.maker.role,
        profileUrl: input.maker.profileUrl
      }
    : undefined;

  const product: Product = {
    id: `product_${slug}`,
    slug,
    name: name as string,
    tagline: input.tagline.trim(),
    category: input.category.trim(),
    emoji: input.emoji?.trim() || undefined,
    description: input.description.trim(),
    websiteUrl: maker?.profileUrl ?? "#",
    thumbnailUrl: "",
    gallery: [],
    makers: maker ? [maker] : [],
    tags: dedupe(input.tags),
    targetUsers: dedupe(input.targetUsers),
    useCases: dedupe(input.useCases),
    kickPoint: input.kickPoint.trim(),
    cardNewsCopy: (input.cardNewsCopy ?? []).map((copy) => copy.trim()).filter(Boolean),
    targetMessages: (input.targetMessages ?? []).filter(
      (message) => message?.audience?.trim() && message?.message?.trim()
    ),
    status: "published",
    createdAt: now
  };

  const storedLaunch: StoredLaunch = {
    id: `launch_${slug}`,
    rank: seedLaunches.length + existing.length + 1,
    product,
    voteCount: 0,
    commentCount: 0,
    featuredReason: "",
    launchedAt: now
  };

  writeAll([...existing, storedLaunch]);

  return {
    product,
    launch: { ...storedLaunch, isVotedByViewer: false },
    detailUrl: `/products/${slug}`
  };
}

export function findRegisteredDetail(slug: string): ProductDetailResponse | null {
  const launch = readAll().find((candidate) => candidate.product.slug === slug);
  if (!launch) {
    return null;
  }
  // 관련 제품은 seed 상위 3개로 고정한다.
  const relatedLaunches: Launch[] = seedLaunches
    .slice(0, 3)
    .map((related) => ({ ...related, isVotedByViewer: false }));
  return {
    product: launch.product,
    launch: { ...launch, isVotedByViewer: false },
    relatedLaunches
  };
}

function dedupe(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

function ensureUniqueSlug(base: string, registered: StoredLaunch[]): string {
  const used = new Set([
    ...seedLaunches.map((launch) => launch.product.slug),
    ...registered.map((launch) => launch.product.slug)
  ]);
  if (!used.has(base)) {
    return base;
  }
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}
