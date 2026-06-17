"use client";

// kick 콘테스트 발표 덱. 자체 구현(외부 의존성 없음).
// 키보드: ← → / Space 이동, F 풀스크린, O 개요(그리드), Home/End 처음·끝.
// 디자인 가이드(에디토리얼 + 컬러 블록 타일, 이모지 금지)를 따른다.

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  /** 좌상단 챕터 라벨 */
  kicker: string;
  /** 큰 헤드라인. \n으로 줄바꿈 */
  headline: string;
  /** 보조 문장 */
  lead?: string;
  /** 불릿 리스트 */
  points?: string[];
  /** 슬라이드 배경/잉크 톤 */
  bg: string;
  ink: string;
  accent: string;
  /** 발표자 노트(화면 미표시, 추후 노트 모드용) */
  note?: string;
};

const SLIDES: Slide[] = [
  {
    kicker: "kick",
    headline: "제품은 AI가 만들었는데,\n홍보는 왜 직접 하세요?",
    lead: "“올려줘” 한마디로 끝나는 웹 앱 런칭 플랫폼",
    bg: "#111111",
    ink: "#ffffff",
    accent: "#f4e84d",
    note: "훅 던지고 바로 다음 장."
  },
  {
    kicker: "Why · 문제",
    headline: "잘 만들어도\n모르면 안 만든 것",
    lead: "만드는 능력과 알리는 능력은 다르다.",
    points: [
      "제품 만드는 일은 점점 쉬워진다",
      "하지만 사람들이 모르면 세상에 없는 제품",
      "제작자 대다수는 무엇을·어떻게 알릴지 모른다"
    ],
    bg: "#f3c4e7",
    ink: "#5a2147",
    accent: "#5a2147"
  },
  {
    kicker: "What · 솔루션",
    headline: "“올려줘”\n한마디면 끝",
    lead: "웹 앱 런칭부터 초기 반응까지 한 흐름.",
    points: [
      "런칭 페이지 · 카드뉴스 · 타겟별 홍보 메시지",
      "위클리보드에서 좋아요로 반응을 확인하고, 제품의 피드백까지 전달받는다",
      "귀찮은 홍보 준비, “올려줘” 한마디면 agent가 대신 끝낸다"
    ],
    bg: "#cdd8f7",
    ink: "#1b2b54",
    accent: "#1b2b54"
  },
  {
    kicker: "Demo · 라이브",
    headline: "지금,\nagent에게 말합니다",
    lead: "“이 제품 kick에 올려줘”",
    bg: "#cfe3cf",
    ink: "#1f4329",
    accent: "#1f4329"
  },
  {
    kicker: "Flow · 지속",
    headline: "한 번 올리고\n끝이 아니다",
    lead: "뷰어와 제작자가 계속 맞물려 돌아간다.",
    points: [
      "위클리보드에서 좋아요로 관심 서비스를 만난다",
      "뉴스레터로 이번 주 트렌드를 놓치지 않는다",
      "뷰어의 반응이 다음 제작자의 피드백으로 이어진다"
    ],
    bg: "#bfe8dd",
    ink: "#0f4a3c",
    accent: "#0f4a3c"
  },
  {
    kicker: "If · 비전",
    headline: "아이디어가\n아이디어로 끝나지 않는다",
    lead: "올리고, 반응 받고, 다듬으며 진짜 서비스로 자란다.",
    bg: "#f4e84d",
    ink: "#4a4300",
    accent: "#4a4300"
  },
  {
    kicker: "kick",
    headline: "그 첫 발,\nkick이 찹니다",
    lead: "kick-web-ebon.vercel.app",
    bg: "#111111",
    ink: "#ffffff",
    accent: "#f4e84d"
  }
];

/** 슬라이드의 단계별 노출 항목 수(lead + 각 불릿). 헤드라인은 항상 보인다. */
function stepCount(slide: Slide): number {
  return (slide.lead ? 1 : 0) + (slide.points?.length ?? 0);
}

export function DeckView() {
  const [index, setIndex] = useState(0);
  // 현재 슬라이드에서 펼쳐진 단계 수(0 = 헤드라인만)
  const [step, setStep] = useState(0);
  const [overview, setOverview] = useState(false);

  // 최신값을 키 핸들러에서 읽기 위한 ref
  const indexRef = useRef(index);
  const stepRef = useRef(step);
  indexRef.current = index;
  stepRef.current = step;

  const goSlide = useCallback((next: number, startStep: "first" | "last") => {
    const max = SLIDES.length - 1;
    const clamped = next < 0 ? 0 : next > max ? max : next;
    setIndex(clamped);
    setStep(startStep === "last" ? stepCount(SLIDES[clamped]) : 0);
  }, []);

  // 다음: 현재 슬라이드에 남은 단계 먼저, 끝나면 다음 슬라이드
  const advance = useCallback(() => {
    const max = stepCount(SLIDES[indexRef.current]);
    if (stepRef.current < max) {
      setStep((s) => s + 1);
    } else if (indexRef.current < SLIDES.length - 1) {
      goSlide(indexRef.current + 1, "first");
    }
  }, [goSlide]);

  // 이전: 현재 단계 먼저 줄이고, 0이면 이전 슬라이드(전부 펼친 상태)
  const retreat = useCallback(() => {
    if (stepRef.current > 0) {
      setStep((s) => s - 1);
    } else if (indexRef.current > 0) {
      goSlide(indexRef.current - 1, "last");
    }
  }, [goSlide]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          event.preventDefault();
          setOverview(false);
          advance();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          setOverview(false);
          retreat();
          break;
        case "Home":
          goSlide(0, "first");
          break;
        case "End":
          goSlide(SLIDES.length - 1, "last");
          break;
        case "o":
        case "O":
          setOverview((v) => !v);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) {
            void document.exitFullscreen();
          } else {
            void document.documentElement.requestFullscreen();
          }
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, retreat, goSlide]);

  if (overview) {
    return (
      <div className="deck-overview">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            className="deck-thumb"
            style={{ background: slide.bg, color: slide.ink }}
            onClick={() => {
              goSlide(i, "first");
              setOverview(false);
            }}
          >
            <span className="deck-thumb-kicker" style={{ color: slide.accent }}>
              {String(i + 1).padStart(2, "0")} · {slide.kicker}
            </span>
            <span className="deck-thumb-head">{slide.headline.replace("\n", " ")}</span>
          </button>
        ))}
      </div>
    );
  }

  const slide = SLIDES[index];

  return (
    <div className="deck-stage" style={{ background: slide.bg, color: slide.ink }}>
      <div className="deck-slide">
        <span className="deck-kicker" style={{ color: slide.accent }}>
          {slide.kicker}
        </span>
        <h1 className="deck-headline">
          {slide.headline.split("\n").map((line, i) => (
            <span key={i} className="deck-line">
              {line}
            </span>
          ))}
        </h1>
        {slide.lead ? (
          <p className={`deck-lead deck-reveal${step >= 1 ? " is-in" : ""}`}>{slide.lead}</p>
        ) : null}
        {slide.points ? (
          <ul className="deck-points">
            {slide.points.map((point, i) => {
              // lead가 있으면 불릿은 step 2부터 노출
              const order = (slide.lead ? 1 : 0) + i + 1;
              return (
                <li key={i} className={`deck-reveal${step >= order ? " is-in" : ""}`}>
                  {point}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <div className="deck-footer">
        <button className="deck-nav" onClick={retreat} aria-label="이전">
          ←
        </button>
        <span className="deck-counter" style={{ color: slide.accent }}>
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        <button className="deck-nav" onClick={advance} aria-label="다음">
          →
        </button>
      </div>

      <div className="deck-progress">
        <span
          className="deck-progress-bar"
          style={{
            width: `${((index + 1) / SLIDES.length) * 100}%`,
            background: slide.accent
          }}
        />
      </div>
    </div>
  );
}
