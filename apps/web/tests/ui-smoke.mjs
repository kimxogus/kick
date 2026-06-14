import { chromium } from "playwright";

const baseUrl = process.env.KICK_BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
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

await page.goto(baseUrl, { waitUntil: "networkidle" });
record("home shows weekly board", await isVisible(page.getByText("이번 주 눈여겨볼 제품")));
record("home shows Cursor card", await isVisible(page.getByRole("link", { name: "Cursor" })));
record("home shows maker and comments", await isVisible(page.getByText("Anysphere")) && await isVisible(page.getByText("36 comments")));

await page.getByLabel("제품 검색").fill("meeting");
record("search keeps Granola visible", await page.getByRole("link", { name: "Granola" }).isVisible());
record("search hides Cursor", (await page.getByRole("link", { name: "Cursor" }).count()) === 0);
await page.getByLabel("제품 검색").fill("");

const voteButton = page.getByRole("button", { name: "Cursor vote" });
const beforeVoteCount = Number(await voteButton.locator("span").innerText());
await voteButton.click();
await page
  .waitForFunction(
    ({ label, expected }) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const button = buttons.find((candidate) => candidate.getAttribute("aria-label") === label);
      return Number(button?.querySelector("span")?.textContent) === expected;
    },
    { label: "Cursor vote", expected: beforeVoteCount + 1 },
    { timeout: 3000 }
  )
  .catch(() => undefined);
const afterVoteCount = Number(await voteButton.locator("span").innerText());
record("vote increments count", afterVoteCount === beforeVoteCount + 1, `${beforeVoteCount} -> ${afterVoteCount}`);

await page.getByText("Cursor").first().click();
await page.waitForURL("**/products/cursor");
record("product detail route", page.url().endsWith("/products/cursor"));
record("product detail heading visible", await page.getByRole("heading", { name: "Cursor" }).isVisible());
record("product detail vote visible", await isVisible(page.getByRole("button", { name: "Cursor vote" })));
await page.getByPlaceholder("you@example.com").fill("detail@example.com");
await page.getByRole("button", { name: "구독" }).click();
record("product newsletter success", await isVisible(page.getByText("제품 업데이트 구독 의사를 저장했습니다.")));

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.getByPlaceholder("you@example.com").fill("bad-email");
await page.getByRole("button", { name: "구독" }).click();
record("newsletter invalid email error", await page.getByRole("alert").isVisible());

await page.goto(`${baseUrl}/maker`, { waitUntil: "networkidle" });
await page.getByLabel("제품명").fill("DemoFlow");
await page.getByLabel("제품 URL").fill("https://example.com");
await page.getByLabel("제품 설명 초안").fill("시연 준비를 돕는 제품입니다.");
await page.getByLabel("대상 사용자").fill("maker");
await page.getByLabel("해결 문제").fill("발표 준비가 흩어져 있다");
await page.getByLabel("주요 기능").fill("데모 스크립트, 체크리스트");
await page.getByRole("button", { name: "분석하기" }).click();
record(
  "maker result tagline visible",
  await isVisible(page.getByRole("heading", { name: "DemoFlow로 maker의 데모 스크립트을 더 쉽게 만드세요." }))
);
record("maker copy blocks visible", await isVisible(page.getByText("런칭페이지 초안")));
await page.getByRole("button", { name: "제출 후보 저장" }).click();
const previewLink = page.locator('a[href^="/submissions/"]').last();
await previewLink.waitFor({ state: "visible" });
const previewHref = await previewLink.getAttribute("href");
record("maker submission preview link", Boolean(previewHref), previewHref ?? "");
await previewLink.click();
await page.waitForURL("**/submissions/**");
record(
  "submission preview page",
  await page.getByText("MVP에서는 제출 후보를 Weekly board에 자동 반영하지 않습니다.").isVisible()
);

await browser.close();

const failed = results.filter((result) => !result.ok);
console.log(JSON.stringify({ ok: failed.length === 0, results }, null, 2));

if (failed.length > 0) {
  process.exit(1);
}
