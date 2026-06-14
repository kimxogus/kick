export type Maker = {
  id: string;
  name: string;
  role?: string;
  profileUrl?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  demoUrl?: string;
  thumbnailUrl: string;
  gallery: string[];
  makers: Maker[];
  tags: string[];
  targetUsers: string[];
  useCases: string[];
  pricing?: string;
  status: "featured" | "published" | "draft";
  createdAt: string;
};

export type Launch = {
  id: string;
  rank: number;
  product: Product;
  voteCount: number;
  commentCount: number;
  isVotedByViewer: boolean;
  featuredReason: string;
  launchedAt: string;
};

export type Board = {
  id: string;
  period: "weekly" | "daily" | "monthly" | "yearly";
  title: string;
  startsOn: string;
  endsOn: string;
  launches: Launch[];
};

export type WeeklyBoardRequest = {
  q?: string;
  tag?: string;
  viewerId?: string;
};

export type WeeklyBoardResponse = {
  board: Board;
  filters: {
    q: string;
    tag: string | null;
    availableTags: string[];
  };
};

export type ProductDetailResponse = {
  product: Product;
  launch: Launch;
  relatedLaunches: Launch[];
};

export type VoteRequest = {
  launchId: string;
  viewerId: string;
};

export type VoteResponse = {
  launchId: string;
  voteCount: number;
  isVotedByViewer: boolean;
};

export type NewsletterSubscription = {
  id: string;
  email: string;
  source: "board" | "product" | "maker";
  createdAt: string;
};

export type NewsletterRequest = {
  email: string;
  source: "board" | "product" | "maker";
};

export type NewsletterResponse = {
  subscription: NewsletterSubscription;
};

export type MakerSubmissionDraft = {
  productName: string;
  websiteUrl?: string;
  descriptionDraft: string;
  targetUsers: string[];
  problem: string;
  features: string[];
  competitors?: string[];
};

export type KickSubmissionPayload = {
  productName: string;
  tagline: string;
  description: string;
  websiteUrl?: string;
  tags: string[];
  makerNote: string;
};

export type LaunchAssistResult = {
  appealPoints: string[];
  targetAnalysis: string[];
  sellingPoints: string[];
  differentiators: string[];
  risksOrUnknowns: string[];
  tagline: string;
  description: string;
  tags: string[];
  launchPageCopy: string;
  cardNewsCopy: string[];
  channelCopy: {
    productHunt: string;
    disquiet: string;
    internalDemo: string;
  };
  submissionPayload: KickSubmissionPayload;
  followUpQuestions: string[];
};

export type LaunchAssistResponse = {
  result: LaunchAssistResult;
};

export type MakerSubmission = {
  id: string;
  payload: KickSubmissionPayload;
  viewerId: string;
  status: "received";
  createdAt: string;
};

export type MakerSubmissionRequest = {
  payload: KickSubmissionPayload;
  viewerId: string;
};

export type MakerSubmissionResponse = {
  submission: MakerSubmission;
  status: "received";
  previewUrl: string;
};

export type MakerSubmissionDetailResponse = {
  submission: MakerSubmission;
};

export class KickServiceError extends Error {
  constructor(
    public readonly code: "VALIDATION_ERROR" | "NOT_FOUND",
    message: string,
    public readonly fields: string[] = []
  ) {
    super(message);
  }
}

export type KickService = {
  getWeeklyBoard(request: WeeklyBoardRequest): WeeklyBoardResponse;
  getProductDetail(slug: string, viewerId?: string): ProductDetailResponse;
  toggleVote(request: VoteRequest): VoteResponse;
  createNewsletterSubscription(request: NewsletterRequest): NewsletterResponse;
  createLaunchAssist(request: MakerSubmissionDraft): LaunchAssistResponse;
  createMakerSubmission(request: MakerSubmissionRequest): MakerSubmissionResponse;
  getMakerSubmission(id: string): MakerSubmissionDetailResponse;
};

type StoredLaunch = Omit<Launch, "isVotedByViewer">;

type KickState = {
  board: Omit<Board, "launches">;
  launches: StoredLaunch[];
  votes: Map<string, Set<string>>;
  subscriptions: NewsletterSubscription[];
  submissions: MakerSubmission[];
};

const baseMakers: Record<string, Maker> = {
  cursor: {
    id: "maker_cursor",
    name: "Anysphere",
    role: "AI code editor team",
    profileUrl: "https://cursor.com"
  },
  perplexity: {
    id: "maker_perplexity",
    name: "Perplexity",
    role: "AI search team",
    profileUrl: "https://www.perplexity.ai"
  },
  granola: {
    id: "maker_granola",
    name: "Granola",
    role: "meeting notes team",
    profileUrl: "https://www.granola.ai"
  },
  lovable: {
    id: "maker_lovable",
    name: "Lovable",
    role: "AI app builder team",
    profileUrl: "https://lovable.dev"
  }
};

const seedLaunches: StoredLaunch[] = [
  {
    id: "launch_cursor",
    rank: 1,
    product: {
      id: "product_cursor",
      slug: "cursor",
      name: "Cursor",
      tagline: "AI와 함께 코드를 읽고 고치는 개발자용 에디터",
      description:
        "Cursor는 개발자가 코드베이스를 이해하고 변경사항을 빠르게 적용하도록 돕는 AI 코드 에디터입니다.",
      websiteUrl: "https://cursor.com",
      demoUrl: "https://cursor.com",
      thumbnailUrl: "/seed/cursor.svg",
      gallery: ["/seed/cursor.svg"],
      makers: [baseMakers.cursor],
      tags: ["AI", "Productivity", "Developer Tools"],
      targetUsers: ["developer", "engineering team"],
      useCases: ["코드 검색", "리팩터링", "AI pair programming"],
      pricing: "Free / Pro",
      status: "featured",
      createdAt: "2026-06-10T00:00:00.000Z"
    },
    voteCount: 428,
    commentCount: 36,
    featuredReason: "AI 개발 도구의 실용성을 가장 선명하게 보여주는 제품",
    launchedAt: "2026-06-10T09:00:00.000Z"
  },
  {
    id: "launch_perplexity",
    rank: 2,
    product: {
      id: "product_perplexity",
      slug: "perplexity",
      name: "Perplexity",
      tagline: "출처와 함께 답을 찾는 AI 검색 엔진",
      description:
        "Perplexity는 웹 검색과 AI 답변을 결합해 사용자가 빠르게 근거 있는 정보를 탐색하도록 돕습니다.",
      websiteUrl: "https://www.perplexity.ai",
      thumbnailUrl: "/seed/perplexity.svg",
      gallery: ["/seed/perplexity.svg"],
      makers: [baseMakers.perplexity],
      tags: ["AI", "Search", "Research"],
      targetUsers: ["researcher", "founder", "marketer"],
      useCases: ["시장 조사", "자료 탐색", "근거 기반 답변"],
      status: "published",
      createdAt: "2026-06-11T00:00:00.000Z"
    },
    voteCount: 391,
    commentCount: 28,
    featuredReason: "탐색자가 정제된 정보를 빠르게 얻는 흐름과 잘 맞는 제품",
    launchedAt: "2026-06-11T09:00:00.000Z"
  },
  {
    id: "launch_granola",
    rank: 3,
    product: {
      id: "product_granola",
      slug: "granola",
      name: "Granola",
      tagline: "회의 내용을 자동으로 정리하는 AI 노트",
      description:
        "Granola는 회의 맥락을 기록하고 요약해 팀이 후속 액션을 놓치지 않도록 돕습니다.",
      websiteUrl: "https://www.granola.ai",
      thumbnailUrl: "/seed/granola.svg",
      gallery: ["/seed/granola.svg"],
      makers: [baseMakers.granola],
      tags: ["AI", "Meetings", "Productivity"],
      targetUsers: ["product manager", "sales team", "founder"],
      useCases: ["회의 요약", "액션 아이템 정리", "고객 미팅 기록"],
      status: "published",
      createdAt: "2026-06-12T00:00:00.000Z"
    },
    voteCount: 255,
    commentCount: 19,
    featuredReason: "실무 반복 업무를 줄이는 명확한 사용 사례를 가진 제품",
    launchedAt: "2026-06-12T09:00:00.000Z"
  },
  {
    id: "launch_lovable",
    rank: 4,
    product: {
      id: "product_lovable",
      slug: "lovable",
      name: "Lovable",
      tagline: "프롬프트로 앱을 빠르게 만드는 AI 빌더",
      description:
        "Lovable은 아이디어를 입력하면 웹 앱 초안을 빠르게 만들고 반복 개선할 수 있게 돕습니다.",
      websiteUrl: "https://lovable.dev",
      thumbnailUrl: "/seed/lovable.svg",
      gallery: ["/seed/lovable.svg"],
      makers: [baseMakers.lovable],
      tags: ["AI", "No-code", "Developer Tools"],
      targetUsers: ["maker", "founder", "designer"],
      useCases: ["MVP 제작", "프로토타입", "사내 도구 초안"],
      status: "published",
      createdAt: "2026-06-13T00:00:00.000Z"
    },
    voteCount: 233,
    commentCount: 17,
    featuredReason: "AI 시대의 빠른 제품 제작 흐름을 보여주는 제품",
    launchedAt: "2026-06-13T09:00:00.000Z"
  }
];

const boardBase: Omit<Board, "launches"> = {
  id: "board_weekly_2026_24",
  period: "weekly",
  title: "이번 주 kick 제품",
  startsOn: "2026-06-08",
  endsOn: "2026-06-14"
};

export function createKickService(): KickService {
  const state: KickState = {
    board: { ...boardBase },
    launches: structuredClone(seedLaunches),
    votes: new Map(),
    subscriptions: [],
    submissions: []
  };

  return {
    getWeeklyBoard(request) {
      const q = request.q?.trim().toLowerCase() ?? "";
      const tag = request.tag?.trim() || null;
      const launches = state.launches
        .filter((launch) => matchesSearch(launch.product, q))
        .filter((launch) => (tag ? launch.product.tags.includes(tag) : true))
        .sort((left, right) => left.rank - right.rank)
        .map((launch) => withViewerVote(launch, state, request.viewerId));

      return {
        board: {
          ...state.board,
          launches
        },
        filters: {
          q,
          tag,
          availableTags: getAvailableTags(state.launches)
        }
      };
    },

    getProductDetail(slug, viewerId) {
      const launch = state.launches.find((candidate) => candidate.product.slug === slug);
      if (!launch) {
        throw new KickServiceError("NOT_FOUND", "제품을 찾을 수 없습니다.", ["slug"]);
      }

      const relatedLaunches = state.launches
        .filter((candidate) => candidate.product.slug !== slug)
        .slice(0, 3)
        .map((candidate) => withViewerVote(candidate, state, viewerId));

      return {
        product: launch.product,
        launch: withViewerVote(launch, state, viewerId),
        relatedLaunches
      };
    },

    toggleVote(request) {
      if (!request.launchId) {
        throw new KickServiceError("VALIDATION_ERROR", "launchId가 필요합니다.", ["launchId"]);
      }
      if (!request.viewerId) {
        throw new KickServiceError("VALIDATION_ERROR", "viewerId가 필요합니다.", ["viewerId"]);
      }

      const launch = state.launches.find((candidate) => candidate.id === request.launchId);
      if (!launch) {
        throw new KickServiceError("NOT_FOUND", "launch를 찾을 수 없습니다.", ["launchId"]);
      }

      const voters = state.votes.get(request.launchId) ?? new Set<string>();
      const wasVoted = voters.has(request.viewerId);
      if (wasVoted) {
        voters.delete(request.viewerId);
        launch.voteCount -= 1;
      } else {
        voters.add(request.viewerId);
        launch.voteCount += 1;
      }
      state.votes.set(request.launchId, voters);

      return {
        launchId: request.launchId,
        voteCount: launch.voteCount,
        isVotedByViewer: !wasVoted
      };
    },

    createNewsletterSubscription(request) {
      if (!isValidEmail(request.email)) {
        throw new KickServiceError("VALIDATION_ERROR", "이메일 형식을 확인해주세요.", ["email"]);
      }

      const subscription: NewsletterSubscription = {
        id: `newsletter_${state.subscriptions.length + 1}`,
        email: request.email.trim(),
        source: request.source,
        createdAt: new Date().toISOString()
      };
      state.subscriptions.push(subscription);

      return { subscription };
    },

    createLaunchAssist(request) {
      const productName = request.productName.trim();
      if (!productName) {
        throw new KickServiceError("VALIDATION_ERROR", "제품명이 필요합니다.", ["productName"]);
      }

      const followUpQuestions: string[] = [];
      if (request.targetUsers.length === 0) {
        followUpQuestions.push("대상 사용자를 더 구체적으로 알려주세요.");
      }
      if (!request.problem.trim()) {
        followUpQuestions.push("제품이 해결하려는 문제를 한 문장으로 알려주세요.");
      }

      const primaryFeature = request.features[0] ?? "핵심 기능";
      const target = request.targetUsers[0] ?? "초기 사용자";
      const tagline = `${productName}로 ${target}의 ${primaryFeature}을 더 쉽게 만드세요.`;
      const description = `${productName}은 ${request.descriptionDraft} 제작자가 전달한 기능을 사용자 이득 중심으로 정리해 런칭 준비를 돕습니다.`;
      const tags = uniqueTags(["AI", "Launch", ...request.features.map(toTag)]);

      return {
        result: {
          appealPoints: [
            `${primaryFeature}을 바로 시연할 수 있습니다.`,
            "대상 사용자와 문제를 한 화면에서 설명할 수 있습니다.",
            "등록 payload까지 이어져 제작자 플로우가 끊기지 않습니다."
          ],
          targetAnalysis: request.targetUsers.length > 0 ? request.targetUsers : ["대상 사용자 구체화 필요"],
          sellingPoints: request.features.slice(0, 3).map((feature) => `${feature}을 사용자 결과 중심으로 보여줍니다.`),
          differentiators: ["런칭 문구와 제출 payload를 함께 준비합니다."],
          risksOrUnknowns: followUpQuestions.length > 0 ? ["입력 정보가 부족해 일부 문구는 보수적으로 작성했습니다."] : [],
          tagline,
          description,
          tags,
          launchPageCopy: `${tagline}\n\n${description}`,
          cardNewsCopy: [
            `${productName}은 누구를 위한 제품인가요?`,
            `${primaryFeature}로 어떤 시간을 줄이나요?`,
            "지금 바로 데모에서 핵심 흐름을 확인하세요."
          ],
          channelCopy: {
            productHunt: `${productName} helps teams turn a rough product story into launch-ready positioning.`,
            disquiet: `${productName}은 ${target}이 제품의 핵심 가치를 빠르게 정리하도록 돕습니다.`,
            internalDemo: `${productName}은 사내 시연에서 문제, 기능, 런칭 메시지를 한 흐름으로 보여줍니다.`
          },
          submissionPayload: {
            productName,
            tagline,
            description,
            websiteUrl: request.websiteUrl,
            tags,
            makerNote: "제작자 런칭 보조 결과로 생성된 MVP 제출 후보입니다."
          },
          followUpQuestions
        }
      };
    },

    createMakerSubmission(request) {
      const missingFields = validateSubmissionPayload(request.payload);
      if (!request.viewerId) {
        missingFields.push("viewerId");
      }
      if (missingFields.length > 0) {
        throw new KickServiceError("VALIDATION_ERROR", "제출 payload를 확인해주세요.", missingFields);
      }

      const submission: MakerSubmission = {
        id: `submission_${state.submissions.length + 1}`,
        payload: request.payload,
        viewerId: request.viewerId,
        status: "received",
        createdAt: new Date().toISOString()
      };
      state.submissions.push(submission);

      return {
        submission,
        status: "received",
        previewUrl: `/submissions/${submission.id}`
      };
    },

    getMakerSubmission(id) {
      const submission = state.submissions.find((candidate) => candidate.id === id);
      if (!submission) {
        throw new KickServiceError("NOT_FOUND", "제출 후보를 찾을 수 없습니다.", ["id"]);
      }
      return { submission };
    }
  };
}

function withViewerVote(launch: StoredLaunch, state: KickState, viewerId?: string): Launch {
  return {
    ...launch,
    product: {
      ...launch.product,
      makers: launch.product.makers.map((maker) => ({ ...maker })),
      tags: [...launch.product.tags],
      targetUsers: [...launch.product.targetUsers],
      useCases: [...launch.product.useCases],
      gallery: [...launch.product.gallery]
    },
    isVotedByViewer: viewerId ? state.votes.get(launch.id)?.has(viewerId) ?? false : false
  };
}

function matchesSearch(product: Product, q: string): boolean {
  if (!q) {
    return true;
  }
  const haystack = [
    product.name,
    product.tagline,
    product.description,
    ...product.tags,
    ...product.targetUsers
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function getAvailableTags(launches: StoredLaunch[]): string[] {
  return [...new Set(launches.flatMap((launch) => launch.product.tags))].sort((left, right) =>
    left.localeCompare(right)
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function toTag(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.filter(Boolean))].slice(0, 5);
}

function validateSubmissionPayload(payload: KickSubmissionPayload): string[] {
  const missingFields: string[] = [];
  if (!payload?.productName?.trim()) {
    missingFields.push("productName");
  }
  if (!payload?.tagline?.trim()) {
    missingFields.push("tagline");
  }
  if (!payload?.description?.trim()) {
    missingFields.push("description");
  }
  if (!payload?.makerNote?.trim()) {
    missingFields.push("makerNote");
  }
  if (!Array.isArray(payload?.tags) || payload.tags.length === 0) {
    missingFields.push("tags");
  }
  return missingFields;
}
