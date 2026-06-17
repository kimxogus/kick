import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "DEVELOPMENT.md",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  "plugins/kick/.codex-plugin/plugin.json",
  "plugins/kick/.claude-plugin/plugin.json",
  "plugins/kick/README.md",
  "plugins/kick/CHANGELOG.md",
  "plugins/kick/skills/kick/SKILL.md",
  "plugins/kick/skills/kick/references/product-registration-workflow.md"
];

const syncedPairs = [
  ["skills/kick/SKILL.md", "plugins/kick/skills/kick/SKILL.md"],
  [
    "skills/kick/references/product-registration-workflow.md",
    "plugins/kick/skills/kick/references/product-registration-workflow.md"
  ]
];

const requiredNeedles = [
  ["README.md", "codex plugin marketplace add kimxogus/kick"],
  ["README.md", "/plugin marketplace add kimxogus/kick"],
  ["README.md", "kick 스킬을 참고해서 내 제품 올려줘"],
  ["DEVELOPMENT.md", "npm run plugin:sync:kick"],
  ["apps/web/src/components/home-view.tsx", "https://github.com/kimxogus/kick#readme"],
  ["apps/web/src/components/home-view.tsx", "GitHub repo에서 kick plugin 설치 가이드 확인"]
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    failures.push(`missing required file: ${file}`);
  }
}

for (const [source, destination] of syncedPairs) {
  const sourceText = await readFile(resolve(root, source), "utf8");
  const destinationText = await readFile(resolve(root, destination), "utf8");
  if (sourceText !== destinationText) {
    failures.push(`plugin skill copy is out of sync: ${destination}`);
  }
}

for (const [file, needle] of requiredNeedles) {
  const text = await readFile(resolve(root, file), "utf8");
  if (!text.includes(needle)) {
    failures.push(`missing expected text in ${file}: ${needle}`);
  }
}

if (failures.length > 0) {
  console.error("kick plugin check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("kick plugin check passed");
