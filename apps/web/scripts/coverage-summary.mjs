import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , summaryPath, outputPath] = process.argv;

if (!summaryPath) {
  console.error("사용법: node scripts/coverage-summary.mjs <coverage-summary.json> [output.md]");
  process.exit(1);
}

const summary = JSON.parse(await readFile(summaryPath, "utf8"));

const metrics = ["lines", "statements", "functions", "branches"];

function formatPercent(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0%";
  }

  return `${value.toFixed(2)}%`;
}

function formatCoverage(metric) {
  return `${metric.covered}/${metric.total}`;
}

function metricRow(label, metric) {
  return `| ${label} | ${formatCoverage(metric)} | ${formatPercent(metric.pct)} |`;
}

function fileRows() {
  return Object.entries(summary)
    .filter(([file]) => file !== "total")
    .map(([file, value]) => ({
      file,
      value,
      linePct: value.lines?.pct ?? 0
    }))
    .sort((left, right) => left.linePct - right.linePct)
    .slice(0, 10)
    .map(({ file, value }) => {
      const relativeFile = path.relative(process.cwd(), file);
      return `| \`${relativeFile}\` | ${formatPercent(value.lines?.pct)} | ${formatPercent(value.branches?.pct)} | ${formatPercent(value.functions?.pct)} | ${formatPercent(value.statements?.pct)} |`;
    });
}

const total = summary.total;

if (!total) {
  console.error("coverage-summary.json에 total 항목이 없습니다.");
  process.exit(1);
}

const markdown = [
  "## Coverage Report",
  "",
  "Coverage는 테스트 품질을 대체하지 않는 진단 지표입니다. MVP 단계에서는 threshold gate 없이 추세 확인용으로 기록합니다.",
  "",
  "| Metric | Covered | Coverage |",
  "| --- | ---: | ---: |",
  metricRow("Lines", total.lines),
  metricRow("Statements", total.statements),
  metricRow("Functions", total.functions),
  metricRow("Branches", total.branches),
  "",
  "### 낮은 line coverage 파일",
  "",
  "| File | Lines | Branches | Functions | Statements |",
  "| --- | ---: | ---: | ---: | ---: |",
  ...fileRows()
].join("\n");

console.log(markdown);

if (outputPath) {
  await writeFile(outputPath, `${markdown}\n`);
}
