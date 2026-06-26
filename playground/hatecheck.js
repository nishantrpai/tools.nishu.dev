const fs = require("fs");
const readline = require("readline");

const raw = JSON.parse(fs.readFileSync("./timpool.json", "utf8"));
const MIN_N = 10;

const videos = raw
  .map(entry => {
    const title = entry["ytAttributedStringHost"];
    const viewStr = entry["ytAttributedStringHost (2)"] || "";
    const match = viewStr.match(/([\d.]+)(K|M)?/i);
    if (!match) return null;
    const num = parseFloat(match[1]);
    const mult = match[2]?.toUpperCase() === "M" ? 1_000_000 : match[2]?.toUpperCase() === "K" ? 1_000 : 1;
    const views = Math.round(num * mult);
    if (!title || isNaN(views)) return null;
    return { title, views };
  })
  .filter(Boolean);

console.log(`Loaded ${videos.length} valid entries`);

function tTest(a, b) {
  const mean = arr => arr.reduce((s, x) => s + x, 0) / arr.length;
  const variance = arr => arr.reduce((s, x) => s + (x - mean(arr)) ** 2, 0) / (arr.length - 1);
  const ma = mean(a), mb = mean(b);
  const va = variance(a), vb = variance(b);
  const se = Math.sqrt(va / a.length + vb / b.length);
  const t = (ma - mb) / se;
  const df = a.length + b.length - 2;
  const p = 2 * (1 - normalCDF(Math.abs(t)));
  return { t: t.toFixed(3), df, p: p.toFixed(4) };
}

function normalCDF(z) { return 0.5 * (1 + erf(z / Math.sqrt(2))); }
function erf(x) {
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign * y;
}

function test(term) {
  const hits   = videos.filter(v => v.title.toLowerCase().replace(/'\w*/g, "").includes(term.toLowerCase()));
  const misses = videos.filter(v => !v.title.toLowerCase().replace(/['']s\b/g, "").includes(term.toLowerCase()));
  const avg    = arr => arr.reduce((a, b) => a + b.views, 0) / arr.length;

  console.log(`\n"${term}"`);
  console.log(`  hit: ${(avg(hits)/1000).toFixed(1)}k (n=${hits.length})  |  miss: ${(avg(misses)/1000).toFixed(1)}k (n=${misses.length})`);

  if (hits.length < MIN_N || misses.length < MIN_N) {
    console.log(`  skipping — not enough data (n=${hits.length})`);
    return;
  }

  const result = tTest(hits.map(v => v.views), misses.map(v => v.views));
  console.log(`  t=${result.t}, p=${result.p}`);
  console.log(`  ${result.p < 0.05 ? (avg(hits) > avg(misses) ? "✓ significant — more views" : "✓ significant — fewer views") : "not significant"}`);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = () => rl.question("\nterm > ", input => { test(input.trim()); prompt(); });
prompt();