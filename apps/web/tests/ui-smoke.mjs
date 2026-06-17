import { chromium } from "playwright";

const baseUrl = process.env.KICK_BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  permissions: ["clipboard-read", "clipboard-write"]
});
const page = await context.newPage();
const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
}

async function isVisible(locator, timeout = 3000) {
  try {
    await locator.waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

// ---- Home `/` ----
await page.goto(baseUrl, { waitUntil: "networkidle" });
record("home shows launch hero", await isVisible(page.getByRole("heading", { name: /kick에게 말 한마디로/ })));
record("home shows agent step", await isVisible(page.getByText("에이전트가 만듭니다")));
record("home shows weekly highlight", await isVisible(page.getByText("이번 주, 주목받는 제품")));
record("home shows contest summary", await isVisible(page.getByText("지금 콘테스트")));
record(
  "home shows contest status labels",
  (await isVisible(page.getByText("예정"))) &&
    (await isVisible(page.getByText("진행중"))) &&
    (await isVisible(page.getByText("종료")))
);

await page.getByRole("button", { name: "스킬 문구 복사" }).click();
record("home copy button toggles", await isVisible(page.getByText("복사됨")));

await page.getByLabel("탐색자 뉴스레터 이메일").fill("home@example.com");
await page.getByRole("button", { name: "구독" }).click();
record("home newsletter success", await isVisible(page.getByText("구독 의사를 저장했습니다.")));

await page.getByLabel("탐색자 뉴스레터 이메일").fill("bad-email");
await page.getByRole("button", { name: "구독" }).click();
record("home newsletter invalid email error", await isVisible(page.getByRole("alert")));

// ---- Weeklyboard `/week` ----
await page.goto(`${baseUrl}/week`, { waitUntil: "networkidle" });
record("week shows heading", await isVisible(page.getByRole("heading", { name: "위클리보드" })));
record("week shows ranking panel", await isVisible(page.getByRole("complementary", { name: "주간 랭킹" })));

const voteButton = page.getByRole("button", { name: "Cursor vote" });
const voteCountSpan = voteButton.locator("span:not(.heart)");
const beforeVoteCount = Number(await voteCountSpan.innerText());
await voteButton.click();
await page
  .waitForFunction(
    ({ label, expected }) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const button = buttons.find((candidate) => candidate.getAttribute("aria-label") === label);
      return Number(button?.querySelector("span:not(.heart)")?.textContent) === expected;
    },
    { label: "Cursor vote", expected: beforeVoteCount + 1 },
    { timeout: 3000 }
  )
  .catch(() => undefined);
const afterVoteCount = Number(await voteCountSpan.innerText());
record("week vote increments count", afterVoteCount === beforeVoteCount + 1, `${beforeVoteCount} -> ${afterVoteCount}`);

// ---- Products `/products` ----
await page.goto(`${baseUrl}/products`, { waitUntil: "networkidle" });
record("products shows heading", await isVisible(page.getByRole("heading", { name: "제품 탐색" })));
await page.getByLabel("제품 검색").fill("meeting");
record("products search keeps Granola", await page.getByRole("link", { name: /Granola/ }).first().isVisible());
record("products search hides Cursor", (await page.getByRole("link", { name: /Cursor/ }).count()) === 0);
await page.getByLabel("제품 검색").fill("");
record("products has category filter", await isVisible(page.getByLabel("카테고리 필터")));
record("products has sort", await isVisible(page.getByLabel("정렬")));

// ---- Product 상세 `/products/[slug]` ----
await page.goto(`${baseUrl}/products/cursor`, { waitUntil: "networkidle" });
record("product detail heading visible", await isVisible(page.getByRole("heading", { name: "Cursor" })));
record("product detail kick point visible", await isVisible(page.getByText("Kick Point")));
record("product detail card news visible", await isVisible(page.getByRole("heading", { name: "카드뉴스" })));
record("product detail vote visible", await isVisible(page.getByRole("button", { name: "Cursor vote" })));

// ---- Contest `/contest` ----
await page.goto(`${baseUrl}/contest`, { waitUntil: "networkidle" });
record("contest page heading visible", await isVisible(page.getByRole("heading", { name: "공개 콘테스트" })));
record("contest item visible", await isVisible(page.getByText("AI Workflow Challenge")));
record("contest has product link", await isVisible(page.getByRole("link", { name: /Cursor/ })));
const creationButtonPattern = new RegExp(["콘테스트 " + "개최하기", "개최", "상금 " + "등록"].join("|"));
record(
  "contest has no creation button",
  (await page.getByRole("button", { name: creationButtonPattern }).count()) === 0
);

// ---- Admin `/admin` (direct only) ----
await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
record("admin reset heading visible", await isVisible(page.getByRole("heading", { name: "Seed reset" })));

await browser.close();

const failed = results.filter((result) => !result.ok);
console.log(JSON.stringify({ ok: failed.length === 0, results }, null, 2));

if (failed.length > 0) {
  process.exit(1);
}
