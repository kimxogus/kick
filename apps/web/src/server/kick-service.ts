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
  category: string;
  emoji?: string;
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
  },
  momento: {
    id: "maker_momento",
    name: "Momento Labs",
    role: "AI diary team",
    profileUrl: "https://example.com/momento"
  },
  pixelmong: {
    id: "maker_pixelmong",
    name: "Pixelmong Studio",
    role: "pet character team",
    profileUrl: "https://example.com/pixelmong"
  },
  reportmate: {
    id: "maker_reportmate",
    name: "ReportMate",
    role: "workflow automation team",
    profileUrl: "https://example.com/reportmate"
  },
  menuddak: {
    id: "maker_menuddak",
    name: "MenuDdak",
    role: "travel translation team",
    profileUrl: "https://example.com/menuddak"
  },
  studysync: {
    id: "maker_studysync",
    name: "StudySync",
    role: "study collaboration team",
    profileUrl: "https://example.com/studysync"
  },
  catchletter: {
    id: "maker_catchletter",
    name: "Catchletter",
    role: "creator marketing team",
    profileUrl: "https://example.com/catchletter"
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
      category: "개발 도구",
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
      category: "리서치",
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
      category: "생산성",
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
      category: "노코드",
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
  },
  {
    id: "launch_momento",
    rank: 5,
    product: {
      id: "product_momento",
      slug: "momento",
      name: "모먼토",
      tagline: "오늘 하루를 한 장으로 남기는 AI 다이어리",
      category: "생산성",
      emoji: "📓",
      description:
        "모먼토는 하루 동안의 메모, 사진, 일정을 모아 잠들기 전 자동으로 한 장의 일기로 정리해주는 AI 다이어리입니다. 글쓰기에 부담을 느끼는 사람도 매일 기록을 남길 수 있습니다.",
      websiteUrl: "https://example.com/momento",
      thumbnailUrl: "/seed/momento.svg",
      gallery: ["/seed/momento.svg"],
      makers: [baseMakers.momento],
      tags: ["AI", "다이어리", "생산성", "기록"],
      targetUsers: ["바쁜 직장인", "콘텐츠 크리에이터"],
      useCases: ["하루 기록 자동 정리", "사진과 일정 기반 회고", "콘텐츠 소재 아카이브"],
      kickPoint: "쓰지 않아도 쌓이는 일기 — 기록의 진입장벽을 없앤다.",
      cardNewsCopy: ["하루의 기록, 자동으로 완성", "쓰지 않아도 쌓이는 일기", "내일도 기록될 오늘"],
      targetMessages: [
        {
          audience: "바쁜 직장인",
          message: "퇴근길 3분, 오늘 하루가 자동으로 정리됩니다."
        },
        {
          audience: "콘텐츠 크리에이터",
          message: "매일의 기록이 곧 콘텐츠 소재가 됩니다."
        }
      ],
      status: "published",
      createdAt: "2026-06-09T00:00:00.000Z"
    },
    voteCount: 128,
    commentCount: 2,
    featuredReason: "기록을 시작하기 어려운 사람에게 자동화된 첫 장을 만들어주는 제품",
    launchedAt: "2026-06-09T09:00:00.000Z"
  },
  {
    id: "launch_pixelmong",
    rank: 6,
    product: {
      id: "product_pixelmong",
      slug: "pixelmong",
      name: "픽셀멍",
      tagline: "사진 한 장으로 만드는 우리 강아지 캐릭터",
      category: "엔터테인먼트",
      emoji: "🐶",
      description:
        "반려동물 사진을 업로드하면 다양한 스타일의 픽셀아트 캐릭터와 스티커 세트를 생성해주는 서비스입니다. 생성된 캐릭터는 프로필, 이모티콘, 굿즈 제작에 활용할 수 있습니다.",
      websiteUrl: "https://example.com/pixelmong",
      thumbnailUrl: "/seed/pixelmong.svg",
      gallery: ["/seed/pixelmong.svg"],
      makers: [baseMakers.pixelmong],
      tags: ["AI", "이미지생성", "반려동물", "굿즈"],
      targetUsers: ["반려동물 보호자", "굿즈 제작자"],
      useCases: ["반려동물 캐릭터 생성", "프로필 이미지 제작", "굿즈 시안 제작"],
      kickPoint: "내 강아지를 세상에 하나뿐인 캐릭터로 — 즉시 굿즈화 가능.",
      cardNewsCopy: ["내 강아지, 캐릭터가 되다", "30초 픽셀아트 변환", "굿즈로 만드는 우리 댕댕이"],
      targetMessages: [
        {
          audience: "반려동물 보호자",
          message: "우리 댕댕이가 캐릭터가 되는 마법, 30초 완성."
        },
        {
          audience: "굿즈 제작자",
          message: "고화질 캐릭터 시트로 바로 인쇄 발주까지."
        }
      ],
      status: "published",
      createdAt: "2026-06-09T00:00:00.000Z"
    },
    voteCount: 96,
    commentCount: 1,
    featuredReason: "사진 한 장에서 공유하고 싶은 캐릭터 자산으로 이어지는 흐름이 명확한 제품",
    launchedAt: "2026-06-09T10:00:00.000Z"
  },
  {
    id: "launch_reportmate",
    rank: 7,
    product: {
      id: "product_reportmate",
      slug: "reportmate",
      name: "리포트메이트",
      tagline: "회의 녹음을 바로 보고서로 바꿔주는 도구",
      category: "업무 자동화",
      emoji: "🗂️",
      description:
        "회의 녹음 파일을 업로드하면 핵심 논의 내용, 결정 사항, 액션 아이템을 정리한 보고서를 자동으로 생성합니다. 팀 협업 도구와 연동해 바로 공유할 수 있습니다.",
      websiteUrl: "https://example.com/reportmate",
      thumbnailUrl: "/seed/reportmate.svg",
      gallery: ["/seed/reportmate.svg"],
      makers: [baseMakers.reportmate],
      tags: ["AI", "회의록", "업무자동화", "협업"],
      targetUsers: ["PM/팀 리더", "스타트업 운영팀"],
      useCases: ["회의 녹음 요약", "액션 아이템 정리", "보고서 공유"],
      kickPoint: "회의 끝나면 보고서도 끝 — 회의록 작성 시간을 0으로.",
      cardNewsCopy: ["회의 끝, 보고서 시작", "녹음 파일 → 정리된 보고서", "액션 아이템까지 자동 정리"],
      targetMessages: [
        {
          audience: "PM/팀 리더",
          message: "회의 끝나자마자 액션 아이템이 정리되어 도착합니다."
        },
        {
          audience: "스타트업 운영팀",
          message: "회의록 작성에 쓰던 시간을 본업에 쓰세요."
        }
      ],
      status: "published",
      createdAt: "2026-06-08T00:00:00.000Z"
    },
    voteCount: 74,
    commentCount: 2,
    featuredReason: "회의 후 반복 정리 시간을 줄이는 실무형 자동화 제품",
    launchedAt: "2026-06-08T09:00:00.000Z"
  },
  {
    id: "launch_menuddak",
    rank: 8,
    product: {
      id: "product_menuddak",
      slug: "menuddak",
      name: "메뉴딱",
      tagline: "사진 한 장으로 끝내는 외국어 메뉴판 번역",
      category: "여행",
      emoji: "🍜",
      description:
        "해외 식당 메뉴판을 카메라로 찍으면 음식 설명, 알레르기 정보, 추천 메뉴까지 즉시 번역해주는 여행자용 앱입니다.",
      websiteUrl: "https://example.com/menuddak",
      thumbnailUrl: "/seed/menuddak.svg",
      gallery: ["/seed/menuddak.svg"],
      makers: [baseMakers.menuddak],
      tags: ["AI", "번역", "여행", "OCR"],
      targetUsers: ["해외 여행자", "음식 알레르기가 있는 사용자"],
      useCases: ["메뉴판 OCR 번역", "알레르기 성분 확인", "현지 추천 메뉴 이해"],
      kickPoint: "말 안 통하는 식당에서도 자신있게 주문 — 여행자의 메뉴판 불안을 없앤다.",
      cardNewsCopy: ["메뉴판 사진 한 장이면 끝", "현지어 몰라도 든든한 한 끼", "여행지에서도 자신있게 주문"],
      targetMessages: [
        {
          audience: "해외 여행자",
          message: "현지어 몰라도 메뉴판 걱정 끝."
        },
        {
          audience: "음식 알레르기가 있는 사용자",
          message: "알레르기 성분까지 한 번에 확인하세요."
        }
      ],
      status: "published",
      createdAt: "2026-06-08T00:00:00.000Z"
    },
    voteCount: 61,
    commentCount: 0,
    featuredReason: "여행 중 바로 겪는 메뉴판 불안을 짧은 사용 흐름으로 해결하는 제품",
    launchedAt: "2026-06-08T10:00:00.000Z"
  },
  {
    id: "launch_studysync",
    rank: 9,
    product: {
      id: "product_studysync",
      slug: "studysync",
      name: "스터디싱크",
      tagline: "함께 공부하는 친구들과 진행률을 맞추는 앱",
      category: "교육",
      emoji: "📚",
      description:
        "스터디 그룹원들의 학습 진행률, 목표, 타이머를 공유해 서로의 동기부여를 돕는 앱입니다. 주간 리포트로 그룹 전체의 학습 현황을 확인할 수 있습니다.",
      websiteUrl: "https://example.com/studysync",
      thumbnailUrl: "/seed/studysync.svg",
      gallery: ["/seed/studysync.svg"],
      makers: [baseMakers.studysync],
      tags: ["교육", "스터디", "협업", "동기부여"],
      targetUsers: ["취업 준비생 스터디 그룹", "온라인 강의 수강생"],
      useCases: ["그룹 진행률 공유", "학습 목표 관리", "주간 리포트 확인"],
      kickPoint: "혼자 하면 멈추는 공부, 함께면 계속된다.",
      cardNewsCopy: ["함께라서 계속되는 공부", "그룹 진행률 한눈에", "오늘의 스터디, 인증 완료"],
      targetMessages: [
        {
          audience: "취업 준비생 스터디 그룹",
          message: "오늘 우리 그룹의 진행률, 한눈에 확인하세요."
        },
        {
          audience: "온라인 강의 수강생",
          message: "강의 진도, 친구들과 함께 맞춰가요."
        }
      ],
      status: "published",
      createdAt: "2026-06-07T00:00:00.000Z"
    },
    voteCount: 45,
    commentCount: 1,
    featuredReason: "그룹의 진행률을 보이게 만들어 학습 지속성을 높이는 제품",
    launchedAt: "2026-06-07T09:00:00.000Z"
  },
  {
    id: "launch_catchletter",
    rank: 10,
    product: {
      id: "product_catchletter",
      slug: "catchletter",
      name: "캐치레터",
      tagline: "내 SNS 글을 분석해 뉴스레터로 묶어주는 서비스",
      category: "마케팅",
      emoji: "✉️",
      description:
        "최근 작성한 SNS 게시물과 블로그 글을 분석해 주간 뉴스레터 초안을 자동으로 작성해주는 서비스입니다. 크리에이터와 1인 창업자의 콘텐츠 재활용을 돕습니다.",
      websiteUrl: "https://example.com/catchletter",
      thumbnailUrl: "/seed/catchletter.svg",
      gallery: ["/seed/catchletter.svg"],
      makers: [baseMakers.catchletter],
      tags: ["마케팅", "뉴스레터", "콘텐츠", "자동화"],
      targetUsers: ["1인 창업자", "뉴스레터 운영자"],
      useCases: ["SNS 글 재활용", "주간 뉴스레터 초안 생성", "콘텐츠 발행 루틴 유지"],
      kickPoint: "이미 쓴 글이 뉴스레터가 된다 — 콘텐츠 재활용의 자동화.",
      cardNewsCopy: ["쓴 글이 다시 콘텐츠가 된다", "주간 뉴스레터, 초안 자동완성", "꾸준한 발행의 비밀"],
      targetMessages: [
        {
          audience: "1인 창업자",
          message: "이번 주에 올린 글, 뉴스레터로 다시 활용하세요."
        },
        {
          audience: "뉴스레터 운영자",
          message: "발행 부담을 줄이고 꾸준함을 유지하세요."
        }
      ],
      status: "published",
      createdAt: "2026-06-07T00:00:00.000Z"
    },
    voteCount: 39,
    commentCount: 1,
    featuredReason: "이미 만든 콘텐츠를 정리해 다시 발행할 수 있게 돕는 제품",
    launchedAt: "2026-06-07T10:00:00.000Z"
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
  },
  {
    id: "contest_summer_vibe_coding",
    slug: "summer-vibe-coding-challenge-2026",
    title: "2026 여름 바이브 코딩 챌린지",
    host: "kick community",
    description: "여름 시즌에 바로 써보고 싶은 AI 제품과 생산성 도구를 모아보는 공개 챌린지입니다.",
    status: "open",
    startsOn: "2026-06-09",
    endsOn: "2026-06-30",
    productCount: 12,
    featuredLaunchIds: ["launch_momento", "launch_pixelmong"]
  },
  {
    id: "contest_internal_ai_tools",
    slug: "internal-ai-tools-hackathon",
    title: "사내 해커톤: AI 업무도구",
    host: "OO팀 해커톤",
    description: "팀의 반복 업무를 줄이고 협업 흐름을 개선하는 사내 해커톤 출품작을 모아봅니다.",
    status: "open",
    startsOn: "2026-06-10",
    endsOn: "2026-06-20",
    productCount: 5,
    featuredLaunchIds: ["launch_reportmate", "launch_granola"]
  },
  {
    id: "contest_first_launch",
    slug: "kick-launch-contest-1",
    title: "1차 kick 런칭 콘테스트",
    host: "kick launch club",
    description: "초기 메이커가 제품의 첫 메시지를 다듬고 탐색자 반응을 확인하는 런칭 콘테스트입니다.",
    status: "closed",
    startsOn: "2026-05-18",
    endsOn: "2026-05-31",
    productCount: 8,
    featuredLaunchIds: ["launch_studysync", "launch_catchletter"]
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
    product.category,
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
