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
  kickPoint: string;
  cardNewsCopy: string[];
  targetMessages: TargetMessage[];
  pricing?: string;
  status: "featured" | "published" | "draft";
  createdAt: string;
};

export type TargetMessage = {
  audience: string;
  message: string;
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

export type Contest = {
  id: string;
  slug: string;
  title: string;
  host: string;
  description: string;
  status: "open" | "upcoming" | "closed";
  startsOn: string;
  endsOn: string;
  productCount: number;
  featuredLaunches: Launch[];
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

export type ContestListResponse = {
  contests: Contest[];
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
  getContests(): ContestListResponse;
  toggleVote(request: VoteRequest): VoteResponse;
  createNewsletterSubscription(request: NewsletterRequest): NewsletterResponse;
  createLaunchAssist(request: MakerSubmissionDraft): LaunchAssistResponse;
  createMakerSubmission(request: MakerSubmissionRequest): MakerSubmissionResponse;
  getMakerSubmission(id: string): MakerSubmissionDetailResponse;
};

type StoredLaunch = Omit<Launch, "isVotedByViewer">;
type StoredContest = Omit<Contest, "featuredLaunches"> & {
  featuredLaunchIds: string[];
};
type UnknownRecord = Record<string, unknown>;

type KickState = {
  board: Omit<Board, "launches">;
  launches: StoredLaunch[];
  contests: StoredContest[];
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
      kickPoint: "코드베이스 이해와 변경 적용을 한 흐름으로 묶어 개발자의 반복 시간을 줄입니다.",
      cardNewsCopy: [
        "낯선 코드도 대화로 맥락을 찾습니다.",
        "변경 범위를 제안받고 바로 고칩니다.",
        "팀의 개발 속도를 코드 리뷰 전 단계부터 끌어올립니다."
      ],
      targetMessages: [
        {
          audience: "개발자",
          message: "큰 코드베이스를 읽는 시간을 줄이고 바로 수정 흐름으로 넘어갈 수 있습니다."
        },
        {
          audience: "엔지니어링 팀",
          message: "반복적인 탐색과 리팩터링을 줄여 제품 개발에 더 많은 시간을 씁니다."
        }
      ],
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
      kickPoint: "출처가 있는 AI 답변으로 탐색자가 정보의 신뢰도를 빠르게 판단하게 합니다.",
      cardNewsCopy: [
        "질문하면 답과 출처를 함께 봅니다.",
        "시장 조사와 자료 탐색을 한 화면에서 끝냅니다.",
        "팀 의사결정에 필요한 근거를 빠르게 공유합니다."
      ],
      targetMessages: [
        {
          audience: "리서처",
          message: "흩어진 자료를 출처와 함께 정리해 검증 시간을 줄입니다."
        },
        {
          audience: "창업자",
          message: "시장과 경쟁 제품을 빠르게 훑고 다음 실험을 정합니다."
        }
      ],
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
      kickPoint: "회의에서 놓치기 쉬운 맥락과 후속 액션을 자동으로 정리합니다.",
      cardNewsCopy: [
        "회의 흐름을 방해하지 않고 기록합니다.",
        "중요한 논의와 액션 아이템을 요약합니다.",
        "고객 미팅 후속 작업을 더 빠르게 시작합니다."
      ],
      targetMessages: [
        {
          audience: "제품 매니저",
          message: "회의 후 정리 시간을 줄이고 결정 사항을 바로 공유할 수 있습니다."
        },
        {
          audience: "세일즈 팀",
          message: "고객 미팅의 니즈와 다음 액션을 놓치지 않습니다."
        }
      ],
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
      kickPoint: "아이디어를 바로 앱 초안으로 바꿔 초기 검증까지의 시간을 줄입니다.",
      cardNewsCopy: [
        "만들고 싶은 앱을 자연어로 설명합니다.",
        "화면과 동작 초안을 빠르게 확인합니다.",
        "피드백을 반영해 제품 방향을 좁힙니다."
      ],
      targetMessages: [
        {
          audience: "메이커",
          message: "구현 전에 아이디어를 앱 형태로 보여주며 반응을 확인할 수 있습니다."
        },
        {
          audience: "창업자",
          message: "초기 MVP를 빠르게 만들어 고객 인터뷰의 질을 높입니다."
        }
      ],
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

const contestFixtures: StoredContest[] = [
  {
    id: "contest_ai_workflow",
    slug: "ai-workflow-challenge",
    title: "AI Workflow Challenge",
    host: "kick community",
    description: "일하는 방식을 바꾸는 AI 제품을 모아보는 공개 챌린지입니다.",
    status: "open",
    startsOn: "2026-06-08",
    endsOn: "2026-06-21",
    productCount: 12,
    featuredLaunchIds: ["launch_cursor", "launch_granola"]
  },
  {
    id: "contest_founder_tools",
    slug: "founder-tools-week",
    title: "Founder Tools Week",
    host: "kick editorial",
    description: "창업자가 시장 조사, MVP 제작, 팀 운영에 바로 쓸 수 있는 제품을 소개합니다.",
    status: "upcoming",
    startsOn: "2026-06-22",
    endsOn: "2026-06-28",
    productCount: 8,
    featuredLaunchIds: ["launch_perplexity", "launch_lovable"]
  }
];

export function createKickService(): KickService {
  const state: KickState = {
    board: { ...boardBase },
    launches: structuredClone(seedLaunches),
    contests: structuredClone(contestFixtures),
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

    getContests() {
      return {
        contests: state.contests.map((contest) => ({
          id: contest.id,
          slug: contest.slug,
          title: contest.title,
          host: contest.host,
          description: contest.description,
          status: contest.status,
          startsOn: contest.startsOn,
          endsOn: contest.endsOn,
          productCount: contest.productCount,
          featuredLaunches: contest.featuredLaunchIds
            .map((launchId) => state.launches.find((launch) => launch.id === launchId))
            .filter((launch): launch is StoredLaunch => Boolean(launch))
            .map((launch) => withViewerVote(launch, state))
        }))
      };
    },

    toggleVote(request) {
      const body = requireBodyRecord(request);
      const invalidFields: string[] = [];
      const launchId = collectRequiredText(body, "launchId", invalidFields);
      const viewerId = collectRequiredText(body, "viewerId", invalidFields);
      throwIfInvalidFields(invalidFields, "vote 요청을 확인해주세요.");

      const launch = state.launches.find((candidate) => candidate.id === launchId);
      if (!launch) {
        throw new KickServiceError("NOT_FOUND", "launch를 찾을 수 없습니다.", ["launchId"]);
      }

      const voters = state.votes.get(launchId) ?? new Set<string>();
      const wasVoted = voters.has(viewerId);
      if (wasVoted) {
        voters.delete(viewerId);
        launch.voteCount -= 1;
      } else {
        voters.add(viewerId);
        launch.voteCount += 1;
      }
      state.votes.set(launchId, voters);

      return {
        launchId,
        voteCount: launch.voteCount,
        isVotedByViewer: !wasVoted
      };
    },

    createNewsletterSubscription(request) {
      const body = requireBodyRecord(request);
      const source = body.source;
      if (!isValidNewsletterSource(source)) {
        throw new KickServiceError("VALIDATION_ERROR", "newsletter 요청을 확인해주세요.", ["source"]);
      }
      const email = body.email;
      if (!isValidEmail(email)) {
        throw new KickServiceError("VALIDATION_ERROR", "이메일 형식을 확인해주세요.", ["email"]);
      }

      const subscription: NewsletterSubscription = {
        id: `newsletter_${state.subscriptions.length + 1}`,
        email: email.trim(),
        source,
        createdAt: new Date().toISOString()
      };
      state.subscriptions.push(subscription);

      return { subscription };
    },

    createLaunchAssist(request) {
      const body = requireBodyRecord(request);
      const invalidFields: string[] = [];
      const productName = collectRequiredText(body, "productName", invalidFields);
      const descriptionDraft = collectOptionalText(body, "descriptionDraft", invalidFields) ?? "";
      const targetUsers = collectStringArray(body, "targetUsers", invalidFields);
      const problem = collectOptionalText(body, "problem", invalidFields) ?? "";
      const features = collectStringArray(body, "features", invalidFields);
      const websiteUrl = collectOptionalText(body, "websiteUrl", invalidFields);
      throwIfInvalidFields(invalidFields, "제작자 런칭 보조 요청을 확인해주세요.");

      const followUpQuestions: string[] = [];
      if (targetUsers.length === 0) {
        followUpQuestions.push("대상 사용자를 더 구체적으로 알려주세요.");
      }
      if (!problem.trim()) {
        followUpQuestions.push("제품이 해결하려는 문제를 한 문장으로 알려주세요.");
      }

      const primaryFeature = features[0] ?? "핵심 기능";
      const target = targetUsers[0] ?? "초기 사용자";
      const tagline = `${productName}로 ${target}의 ${primaryFeature}을 더 쉽게 만드세요.`;
      const description = `${productName}은 ${descriptionDraft} 제작자가 전달한 기능을 사용자 이득 중심으로 정리해 런칭 준비를 돕습니다.`;
      const tags = uniqueTags(["AI", "Launch", ...features.map(toTag)]);

      return {
        result: {
          appealPoints: [
            `${primaryFeature}을 바로 시연할 수 있습니다.`,
            "대상 사용자와 문제를 한 화면에서 설명할 수 있습니다.",
            "등록 후보까지 이어져 제작자 플로우가 끊기지 않습니다."
          ],
          targetAnalysis: targetUsers.length > 0 ? targetUsers : ["대상 사용자 구체화 필요"],
          sellingPoints: features.slice(0, 3).map((feature) => `${feature}을 사용자 결과 중심으로 보여줍니다.`),
          differentiators: ["런칭 문구와 제출 후보를 함께 준비합니다."],
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
            websiteUrl,
            tags,
            makerNote: "제작자 런칭 보조 결과로 생성된 제출 후보입니다."
          },
          followUpQuestions
        }
      };
    },

    createMakerSubmission(request) {
      const body = requireBodyRecord(request);
      const invalidFields: string[] = [];
      const viewerId = collectRequiredText(body, "viewerId", invalidFields);
      const payload = collectSubmissionPayload(body.payload, invalidFields);
      throwIfInvalidFields(invalidFields, "제출 내용을 확인해주세요.");

      const submission: MakerSubmission = {
        id: `submission_${state.submissions.length + 1}`,
        payload,
        viewerId,
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
      gallery: [...launch.product.gallery],
      cardNewsCopy: [...launch.product.cardNewsCopy],
      targetMessages: launch.product.targetMessages.map((targetMessage) => ({ ...targetMessage }))
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

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidNewsletterSource(source: unknown): source is NewsletterRequest["source"] {
  return source === "board" || source === "product" || source === "maker";
}

function requireBodyRecord(value: unknown): UnknownRecord {
  if (!isRecord(value)) {
    throw new KickServiceError("VALIDATION_ERROR", "JSON 요청 본문을 확인해주세요.", ["body"]);
  }
  return value;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectRequiredText(body: UnknownRecord, field: string, invalidFields: string[]): string {
  const value = body[field];
  if (typeof value !== "string" || !value.trim()) {
    pushField(invalidFields, field);
    return "";
  }
  return value.trim();
}

function collectOptionalText(body: UnknownRecord, field: string, invalidFields: string[]): string | undefined {
  const value = body[field];
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    pushField(invalidFields, field);
    return undefined;
  }
  return value.trim() || undefined;
}

function collectStringArray(body: UnknownRecord, field: string, invalidFields: string[]): string[] {
  const value = body[field];
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    pushField(invalidFields, field);
    return [];
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function collectSubmissionPayload(value: unknown, invalidFields: string[]): KickSubmissionPayload {
  if (!isRecord(value)) {
    pushField(invalidFields, "payload");
    return {
      productName: "",
      tagline: "",
      description: "",
      tags: [],
      makerNote: ""
    };
  }

  const productName = collectRequiredText(value, "productName", invalidFields);
  const tagline = collectRequiredText(value, "tagline", invalidFields);
  const description = collectRequiredText(value, "description", invalidFields);
  const makerNote = collectRequiredText(value, "makerNote", invalidFields);
  const tags = collectStringArray(value, "tags", invalidFields);
  const websiteUrl = collectOptionalText(value, "websiteUrl", invalidFields);
  if (tags.length === 0) {
    pushField(invalidFields, "tags");
  }

  return {
    productName,
    tagline,
    description,
    websiteUrl,
    tags,
    makerNote
  };
}

function throwIfInvalidFields(fields: string[], message: string): void {
  if (fields.length > 0) {
    throw new KickServiceError("VALIDATION_ERROR", message, fields);
  }
}

function pushField(fields: string[], field: string): void {
  if (!fields.includes(field)) {
    fields.push(field);
  }
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
