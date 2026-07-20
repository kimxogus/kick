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
  type VoteRequest,
  type VoteResponse,
  toProductRegistrationResponse
} from "./kick-service";

// product-kick Skill이 등록한 제품을 보관하는 파일 백업 store.
// Next dev는 요청을 여러 worker로 분산해 in-memory가 worker마다 분리되므로,
// worker 무관하게 공유되는 파일을 source of truth로 쓴다.
// 서버 부팅 시 instrumentation에서 clearRegisteredStore()로 비워 재시작 시 소멸한다.
// RSC worker와 route handler worker의 process.cwd()가 다를 수 있어 cwd 무관한 tmpdir에 둔다.
const STORE_PATH = join(tmpdir(), "kick-producthunt-registered.json");

type RegisteredStoreState = {
  launches: StoredLaunch[];
  votes: Record<string, string[]>;
};

function readStore(): RegisteredStoreState {
  if (!existsSync(STORE_PATH)) {
    return { launches: [], votes: {} };
  }
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      return { launches: parsed as StoredLaunch[], votes: {} };
    }
    if (isRecord(parsed) && Array.isArray(parsed.launches)) {
      return {
        launches: parsed.launches as StoredLaunch[],
        votes: normalizeVotes(parsed.votes)
      };
    }
    return { launches: [], votes: {} };
  } catch {
    return { launches: [], votes: {} };
  }
}

function writeStore(state: RegisteredStoreState): void {
  writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), "utf8");
}

export function clearRegisteredStore(): void {
  if (existsSync(STORE_PATH)) {
    rmSync(STORE_PATH, { force: true });
  }
}

export function registerProduct(input: ProductRegistrationInput): ProductRegistrationResponse {
  const state = readStore();
  const existing = state.launches;
  const allLaunches = [...seedLaunches, ...existing];
  const storedLaunch = createRegisteredLaunch(input, allLaunches, nextLaunchRank(allLaunches));
  writeStore({ ...state, launches: [...existing, storedLaunch] });
  return toProductRegistrationResponse(storedLaunch);
}

export function findRegisteredDetail(slug: string, viewerId?: string): ProductDetailResponse | null {
  const state = readStore();
  const launch = state.launches.find((candidate) => candidate.product.slug === slug);
  if (!launch) {
    return null;
  }
  // 관련 제품은 seed 상위 3개로 고정한다.
  const relatedLaunches: Launch[] = seedLaunches
    .slice(0, 3)
    .map((related) => ({ ...related, isVotedByViewer: false }));
  return {
    product: launch.product,
    launch: {
      ...launch,
      isVotedByViewer: viewerId ? state.votes[launch.id]?.includes(viewerId) ?? false : false
    },
    relatedLaunches
  };
}

export function toggleRegisteredVote(request: VoteRequest): VoteResponse | null {
  const state = readStore();
  const launch = state.launches.find((candidate) => candidate.id === request.launchId);
  if (!launch) {
    return null;
  }

  const voters = new Set(state.votes[launch.id] ?? []);
  const wasVoted = voters.has(request.viewerId);
  if (wasVoted) {
    voters.delete(request.viewerId);
    launch.voteCount = Math.max(0, launch.voteCount - 1);
  } else {
    voters.add(request.viewerId);
    launch.voteCount += 1;
  }
  state.votes[launch.id] = [...voters];
  writeStore(state);

  return {
    launchId: launch.id,
    voteCount: launch.voteCount,
    isVotedByViewer: !wasVoted
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
          const registered = findRegisteredDetail(slug, viewerId);
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
    async toggleVote(request) {
      try {
        return await baseService.toggleVote(request);
      } catch (error) {
        if ((error as { code?: string })?.code === "NOT_FOUND") {
          const vote = toggleRegisteredVote(request);
          if (vote) {
            return vote;
          }
        }
        throw error;
      }
    },
    async resetToSeed() {
      clearRegisteredStore();
      return baseService.resetToSeed();
    }
  };
}

function normalizeVotes(value: unknown): Record<string, string[]> {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).flatMap(([launchId, viewerIds]) =>
      Array.isArray(viewerIds)
        ? [[launchId, viewerIds.filter((viewerId): viewerId is string => typeof viewerId === "string")]]
        : []
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
