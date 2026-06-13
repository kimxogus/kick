// 킥(Kick) 데모용 더미 데이터
// 실제로는 등록 Skill이 생성해 local data로 기록하는 영역.
const KICK_PRODUCTS = [
  {
    id: "1",
    name: "모먼토",
    tagline: "오늘 하루를 한 장으로 남기는 AI 다이어리",
    category: "생산성",
    emoji: "📓",
    likes: 128,
    launchDate: "2026-06-09",
    website: "https://example.com/momento",
    description:
      "모먼토는 하루 동안의 메모, 사진, 일정을 모아 잠들기 전 자동으로 한 장의 일기로 정리해주는 AI 다이어리입니다. 글쓰기에 부담을 느끼는 사람도 매일 기록을 남길 수 있습니다.",
    kickPoint: "쓰지 않아도 쌓이는 일기 — 기록의 진입장벽을 없앤다.",
    targetMessages: [
      { audience: "바쁜 직장인", message: "퇴근길 3분, 오늘 하루가 자동으로 정리됩니다." },
      { audience: "콘텐츠 크리에이터", message: "매일의 기록이 곧 콘텐츠 소재가 됩니다." },
    ],
    cardNews: ["하루의 기록, 자동으로 완성", "쓰지 않아도 쌓이는 일기", "내일도 기록될 오늘"],
    tags: ["AI", "다이어리", "생산성", "기록"],
    comments: [
      { author: "민지", text: "매일 일기 쓰기 힘들었는데 딱이네요!" },
      { author: "현우", text: "카드뉴스 디자인도 깔끔하게 같이 나오는 게 신기해요." },
    ],
  },
  {
    id: "2",
    name: "픽셀멍",
    tagline: "사진 한 장으로 만드는 우리 강아지 캐릭터",
    category: "엔터테인먼트",
    emoji: "🐶",
    likes: 96,
    launchDate: "2026-06-09",
    website: "https://example.com/pixelmong",
    description:
      "반려동물 사진을 업로드하면 다양한 스타일의 픽셀아트 캐릭터와 스티커 세트를 생성해주는 서비스입니다. 생성된 캐릭터는 프로필, 카카오톡 이모티콘, 굿즈 제작에 활용할 수 있습니다.",
    kickPoint: "내 강아지를 세상에 하나뿐인 캐릭터로 — 즉시 굿즈화 가능.",
    targetMessages: [
      { audience: "반려동물 보호자", message: "우리 댕댕이가 캐릭터가 되는 마법, 30초 완성." },
      { audience: "굿즈 제작자", message: "고화질 캐릭터 시트로 바로 인쇄 발주까지." },
    ],
    cardNews: ["내 강아지, 캐릭터가 되다", "30초 픽셀아트 변환", "굿즈로 만드는 우리 댕댕이"],
    tags: ["AI", "이미지생성", "반려동물", "굿즈"],
    comments: [
      { author: "소영", text: "결과물 퀄리티 너무 좋아요 ㅎㅎ" },
    ],
  },
  {
    id: "3",
    name: "리포트메이트",
    tagline: "회의 녹음을 바로 보고서로 바꿔주는 도구",
    category: "업무 자동화",
    emoji: "🗂️",
    likes: 74,
    launchDate: "2026-06-08",
    website: "https://example.com/reportmate",
    description:
      "회의 녹음 파일을 업로드하면 핵심 논의 내용, 결정 사항, 액션 아이템을 정리한 보고서를 자동으로 생성합니다. 팀 협업 도구와 연동해 바로 공유할 수 있습니다.",
    kickPoint: "회의 끝나면 보고서도 끝 — 회의록 작성 시간을 0으로.",
    targetMessages: [
      { audience: "PM/팀 리더", message: "회의 끝나자마자 액션 아이템이 정리되어 도착합니다." },
      { audience: "스타트업 운영팀", message: "회의록 작성에 쓰던 시간을 본업에 쓰세요." },
    ],
    cardNews: ["회의 끝, 보고서 시작", "녹음 파일 → 정리된 보고서", "액션 아이템까지 자동 정리"],
    tags: ["AI", "회의록", "업무자동화", "협업"],
    comments: [
      { author: "지훈", text: "팀 단위로 도입하면 진짜 시간 많이 아낄듯요." },
      { author: "은서", text: "노션 연동도 되나요?" },
    ],
  },
  {
    id: "4",
    name: "메뉴딱",
    tagline: "사진 한 장으로 끝내는 외국어 메뉴판 번역",
    category: "여행",
    emoji: "🍜",
    likes: 61,
    launchDate: "2026-06-08",
    website: "https://example.com/menuddak",
    description:
      "해외 식당 메뉴판을 카메라로 찍으면 음식 설명, 알레르기 정보, 추천 메뉴까지 즉시 번역해주는 여행자용 앱입니다.",
    kickPoint: "말 안 통하는 식당에서도 자신있게 주문 — 여행자의 메뉴판 불안을 없앤다.",
    targetMessages: [
      { audience: "해외 여행자", message: "현지어 몰라도 메뉴판 걱정 끝." },
      { audience: "음식 알레르기가 있는 사용자", message: "알레르기 성분까지 한 번에 확인하세요." },
    ],
    cardNews: ["메뉴판 사진 한 장이면 끝", "현지어 몰라도 든든한 한 끼", "여행지에서도 자신있게 주문"],
    tags: ["AI", "번역", "여행", "OCR"],
    comments: [],
  },
  {
    id: "5",
    name: "스터디싱크",
    tagline: "함께 공부하는 친구들과 진행률을 맞추는 앱",
    category: "교육",
    emoji: "📚",
    likes: 45,
    launchDate: "2026-06-07",
    website: "https://example.com/studysync",
    description:
      "스터디 그룹원들의 학습 진행률, 목표, 타이머를 공유해 서로의 동기부여를 돕는 앱입니다. 주간 리포트로 그룹 전체의 학습 현황을 확인할 수 있습니다.",
    kickPoint: "혼자 하면 멈추는 공부, 함께면 계속된다.",
    targetMessages: [
      { audience: "취업 준비생 스터디 그룹", message: "오늘 우리 그룹의 진행률, 한눈에 확인하세요." },
      { audience: "온라인 강의 수강생", message: "강의 진도, 친구들과 함께 맞춰가요." },
    ],
    cardNews: ["함께라서 계속되는 공부", "그룹 진행률 한눈에", "오늘의 스터디, 인증 완료"],
    tags: ["교육", "스터디", "협업", "동기부여"],
    comments: [
      { author: "다은", text: "스터디 그룹 운영하는데 써보고 싶어요." },
    ],
  },
  {
    id: "6",
    name: "캐치레터",
    tagline: "내 SNS 글을 분석해 뉴스레터로 묶어주는 서비스",
    category: "마케팅",
    emoji: "✉️",
    likes: 39,
    launchDate: "2026-06-07",
    website: "https://example.com/catchletter",
    description:
      "최근 작성한 SNS 게시물과 블로그 글을 분석해 주간 뉴스레터 초안을 자동으로 작성해주는 서비스입니다. 크리에이터와 1인 창업자의 콘텐츠 재활용을 돕습니다.",
    kickPoint: "이미 쓴 글이 뉴스레터가 된다 — 콘텐츠 재활용의 자동화.",
    targetMessages: [
      { audience: "1인 창업자", message: "이번 주에 올린 글, 뉴스레터로 다시 활용하세요." },
      { audience: "뉴스레터 운영자", message: "발행 부담을 줄이고 꾸준함을 유지하세요." },
    ],
    cardNews: ["쓴 글이 다시 콘텐츠가 된다", "주간 뉴스레터, 초안 자동완성", "꾸준한 발행의 비밀"],
    tags: ["마케팅", "뉴스레터", "콘텐츠", "자동화"],
    comments: [
      { author: "재현", text: "1인 창업자한테 진짜 필요한 기능이네요." },
    ],
  },
];

// Weeklyboard용 콘테스트 더미 데이터
const KICK_CONTESTS = [
  {
    id: "c1",
    title: "2026 여름 바이브 코딩 챌린지",
    host: "킥 운영팀",
    prize: "총 상금 1,000,000원 (표시용)",
    deadline: "2026-06-30",
    productCount: 12,
    status: "진행중",
  },
  {
    id: "c2",
    title: "사내 해커톤: AI 업무도구 部門",
    host: "OO팀 해커톤 운영진",
    prize: "우승팀 상품권 (표시용)",
    deadline: "2026-06-20",
    productCount: 5,
    status: "진행중",
  },
  {
    id: "c3",
    title: "1차 킥 런칭 콘테스트",
    host: "킥 운영팀",
    prize: "총 상금 500,000원 (표시용)",
    deadline: "2026-05-31",
    productCount: 8,
    status: "마감",
  },
];
