import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  createRegisteredLaunch,
  nextLaunchRank,
  seedLaunches,
  type Launch,
  type KickService,
  type ProductDetailResponse,
  type ProductRegistrationInput,
  type ProductRegistrationResponse,
  type StoredLaunch,
  toProductRegistrationResponse
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
  const existing = readAll();
  const allLaunches = [...seedLaunches, ...existing];
  const storedLaunch = createRegisteredLaunch(input, allLaunches, nextLaunchRank(allLaunches));
  writeAll([...existing, storedLaunch]);
  return toProductRegistrationResponse(storedLaunch);
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

export function createRegisteredStoreKickService(baseService: KickService): KickService {
  return {
    ...baseService,
    async getProductDetail(slug, viewerId) {
      try {
        return await baseService.getProductDetail(slug, viewerId);
      } catch (error) {
        if ((error as { code?: string })?.code === "NOT_FOUND") {
          const registered = findRegisteredDetail(slug);
          if (registered) {
            return registered;
          }
        }
        throw error;
      }
    },
    async registerProduct(input) {
      return registerProduct(input);
    },
    async resetToSeed() {
      clearRegisteredStore();
      return baseService.resetToSeed();
    }
  };
}
