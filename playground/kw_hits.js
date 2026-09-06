const fs = require("fs");
const readline = require("readline");
const path = require("path");

// Simple CSV parser
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const header = parseCSVLine(lines[0]);
  
  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = values[idx]?.trim() || "";
    });
    rows.push(obj);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const raw = parseCSV("./gotham.csv");
const MIN_N = 3;  // Minimum for t-test, but we'll show ratio-based significance regardless
const RATIO_THRESHOLD = 1.1;  // Consider significant if 1.5x more/less views
const MIN_KEYWORD_HITS = 5;
const TOP_KEYWORDS_LIMIT = 20;

function parseAgeMonths(publishDateStr) {
  if (!publishDateStr || publishDateStr.trim() === "") return null;
  
  try {
    const pubDate = new Date(publishDateStr);
    if (isNaN(pubDate.getTime())) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const ageMonths = diffDays / 30.44;
    
    return ageMonths > 0 ? ageMonths : 0;
  } catch (e) {
    return null;
  }
}

function getVideoDate(video) {
  if (!video.publishDate) return null;
  return video.publishDate;
}

function getDayOfWeekLabel(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getDateOfMonth(date) {
  return date.getDate();
}

function normalizeTitle(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/'\w*/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getScopedVideos(months) {
  return typeof months === "number"
    ? videos.filter(v => typeof v.ageMonths === "number" && v.ageMonths <= months)
    : videos;
}

function avgViews(arr) {
  return arr.reduce((a, b) => a + b.views, 0) / arr.length;
}

function getDayOfWeekDistribution(videos) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const distribution = {};
  days.forEach(d => distribution[d] = 0);

  videos.forEach(v => {
    const date = getVideoDate(v);
    if (date) {
      const day = getDayOfWeekLabel(date);
      distribution[day]++;
    }
  });

  const total = videos.filter(v => getVideoDate(v) !== null).length;
  return { distribution, total };
}

function getDateOfMonthDistribution(videos) {
  const distribution = {};
  for (let i = 1; i <= 31; i++) distribution[i] = 0;

  videos.forEach(v => {
    const date = getVideoDate(v);
    if (date) {
      const dayOfMonth = getDateOfMonth(date);
      distribution[dayOfMonth]++;
    }
  });

  const total = videos.filter(v => getVideoDate(v) !== null).length;
  return { distribution, total };
}

function getScopeLabel(months) {
  return typeof months === "number" ? `last ${months} months` : "all time";
}

function extractKeywordSet(title) {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "to", "of", "for", "in", "on", "at", "is", "it", "with", "my", "your",
    "this", "that", "from", "by", "as", "be", "are", "was", "were", "i", "you", "we", "they", "he", "she"
  ]);

  const words = normalizeTitle(title)
    .split(" ")
    .filter(w => w.length >= 3 && !stopWords.has(w));

  return new Set(words);
}

function runTopKeywords(months, limit = TOP_KEYWORDS_LIMIT) {
  const scoped = getScopedVideos(months);
  const scopeLabel = getScopeLabel(months);

  if (scoped.length < MIN_N * 2) {
    console.log(`\nTop keywords (${scopeLabel}) — not enough data (n=${scoped.length})`);
    return;
  }

  const keywordToVideos = new Map();

  scoped.forEach(video => {
    const keywords = extractKeywordSet(video.title);
    keywords.forEach(kw => {
      if (!keywordToVideos.has(kw)) keywordToVideos.set(kw, []);
      keywordToVideos.get(kw).push(video);
    });
  });

  const ranked = [];

  keywordToVideos.forEach((hits, keyword) => {
    if (hits.length < MIN_KEYWORD_HITS) return;

    const hitsSet = new Set(hits);
    const misses = scoped.filter(v => !hitsSet.has(v));
    if (misses.length < MIN_N) return;

    const avgHits = avgViews(hits);
    const avgMisses = avgViews(misses);
    if (!Number.isFinite(avgHits) || !Number.isFinite(avgMisses) || avgMisses <= 0) return;

    const ratio = avgHits / avgMisses;
    ranked.push({ keyword, hits: hits.length, misses: misses.length, ratio, avgHits, avgMisses, hitVideos: hits });
  });

  ranked.sort((a, b) => b.ratio - a.ratio || b.hits - a.hits);
  const top = ranked.slice(0, limit);

  if (top.length === 0) {
    console.log(`\nTop keywords (${scopeLabel}) — no keyword met minimum sample (min hits=${MIN_KEYWORD_HITS})`);
    return;
  }

  console.log(`\nTop ${top.length} keywords by hit ratio (${scopeLabel})`);
  console.log(`  scope size: n=${scoped.length}, min keyword hits=${MIN_KEYWORD_HITS}`);

  top.forEach((row, i) => {
    console.log(
      `  ${String(i + 1).padStart(2, " ")}. ${row.keyword.padEnd(18, " ")} ` +
      `ratio=${row.ratio.toFixed(2)}x  hit=${(row.avgHits / 1000).toFixed(1)}k (n=${row.hits})  ` +
      `miss=${(row.avgMisses / 1000).toFixed(1)}k (n=${row.misses})`
    );

    // Day of week distribution - top 3
    const { distribution: dayDist, total: dayTotal } = getDayOfWeekDistribution(row.hitVideos);
    if (dayTotal > 0) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayEntries = days.map(d => ({ day: d, count: dayDist[d] })).sort((a, b) => b.count - a.count).slice(0, 3);
      console.log(`      days: ${dayEntries.map(e => `${e.day} - ${e.count}/${dayTotal}`).join("  ")}`);
    }

    // Date of month distribution - top 3
    const { distribution: dateDist, total: dateTotal } = getDateOfMonthDistribution(row.hitVideos);
    if (dateTotal > 0) {
      const dateEntries = [];
      for (let j = 1; j <= 31; j++) {
        if (dateDist[j] > 0) {
          dateEntries.push({ date: j, count: dateDist[j] });
        }
      }
      // Sort by count descending, then by date ascending
      dateEntries.sort((a, b) => b.count - a.count || a.date - b.date);
      const top3 = dateEntries.slice(0, 3);
      if (top3.length > 0) {
        const dateStr = top3.map(e => `${e.date} - ${e.count}/${dateTotal}`).join("  ");
        console.log(`      dates: ${dateStr}`);
      }
    }
  });
}

const videos = raw
  .map(entry => {
    const title = entry["Video Title"];
    const viewStr = String(entry["Views"] || "").trim();
    const publishDateStr = String(entry["Publish Date"] || "").trim();
    
    // Parse views (handle K, M suffixes and commas)
    let views = 0;
    const viewMatch = viewStr.match(/([\d,.]+)(K|M)?/i);
    if (viewMatch) {
      const num = parseFloat(viewMatch[1].replace(/,/g, ""));
      const mult = viewMatch[2]?.toUpperCase() === "M" ? 1_000_000 : viewMatch[2]?.toUpperCase() === "K" ? 1_000 : 1;
      views = Math.round(num * mult);
    }
    
    const ageMonths = parseAgeMonths(publishDateStr);
    const publishDate = publishDateStr ? new Date(publishDateStr) : null;
    
    if (!title || isNaN(views) || views === 0) return null;
    return { title, views, ageMonths, publishDateStr, publishDate };
  })
  .filter(Boolean);

console.log(`Loaded ${videos.length} valid entries`);
console.log(`Entries with recency info: ${videos.filter(v => typeof v.ageMonths === "number").length}`);

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

function test(term, months) {
  const query = term.toLowerCase().trim();
  const scoped = getScopedVideos(months);

  const hits = scoped.filter(v => normalizeTitle(v.title).includes(query));
  const misses = scoped.filter(v => !normalizeTitle(v.title).includes(query));

  if (hits.length === 0) {
    const scopeLabel = getScopeLabel(months);
    console.log(`\n"${term}" (${scopeLabel}) — no matches found`);
    return;
  }

  if (misses.length === 0) {
    const scopeLabel = getScopeLabel(months);
    console.log(`\n"${term}" (${scopeLabel}) — no misses to compare against`);
    return;
  }

  const avgHits = avgViews(hits);
  const avgMisses = avgViews(misses);
  const ratio = avgMisses === 0 ? Infinity : avgHits / avgMisses;

  const scopeLabel = getScopeLabel(months);
  console.log(`\n"${term}" (${scopeLabel})`);
  console.log(`  scope size: n=${scoped.length}`);
  console.log(`  hit: ${(avgHits/1000).toFixed(1)}k (n=${hits.length})  |  miss: ${(avgMisses/1000).toFixed(1)}k (n=${misses.length})  |  ratio: ${ratio.toFixed(2)}x`);

  // Show statistical test if we have enough samples
  if (hits.length >= MIN_N && misses.length >= MIN_N) {
    const result = tTest(hits.map(v => v.views), misses.map(v => v.views));
    console.log(`  t=${result.t}, p=${result.p}`);
  } else {
    console.log(`  small sample (hits n=${hits.length}, misses n=${misses.length})`);
  }

  // Effect size based significance (only flag if MORE views)
  if (ratio >= RATIO_THRESHOLD) {
    console.log(`  significant: ${ratio.toFixed(1)}x more views`);
  } else if (ratio < 1) {
    console.log(`  not significant — ${(ratio).toFixed(1)}x usual views`);
  } else {
    console.log(`  not significant (ratio < ${RATIO_THRESHOLD}x)`);
  }

  // Day of week distribution - top 3
  const { distribution: dayDist, total: dayTotal } = getDayOfWeekDistribution(hits);
  if (dayTotal > 0) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayEntries = days.map(d => ({ day: d, count: dayDist[d] })).sort((a, b) => b.count - a.count).slice(0, 3);
    console.log(`  likely days: ${dayEntries.map(e => `${e.day} - ${e.count}/${dayTotal}`).join("  ")}`);
  }

  // Date of month distribution - top 3
  const { distribution: dateDist, total: dateTotal } = getDateOfMonthDistribution(hits);
  if (dateTotal > 0) {
    const dateEntries = [];
    for (let i = 1; i <= 31; i++) {
      if (dateDist[i] > 0) {
        dateEntries.push({ date: i, count: dateDist[i] });
      }
    }
    // Sort by count descending, then by date ascending
    dateEntries.sort((a, b) => b.count - a.count || a.date - b.date);
    const top3 = dateEntries.slice(0, 3);
    if (top3.length > 0) {
      const dateStr = top3.map(e => `${e.date} - ${e.count}/${dateTotal}`).join("  ");
      console.log(`  likely dates: ${dateStr}`);
    }
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function parseMonthsInput(input) {
  if (!input || !input.trim()) return [null];
  const months = input
    .split(",")
    .map(s => Number(s.trim()))
    .filter(n => Number.isFinite(n) && n > 0);
  return months.length ? months : [null];
}

function parseTopCommand(term) {
  const match = term.trim().toLowerCase().match(/^top(?:\s+(\d+(?:\.\d+)?))?$/);
  if (!match) return null;
  const inlineMonths = match[1] ? Number(match[1]) : null;
  return {
    isTop: true,
    inlineMonths: Number.isFinite(inlineMonths) && inlineMonths > 0 ? inlineMonths : null
  };
}

const prompt = () => rl.question("\nterm > ", termInput => {
  const term = termInput.trim();
  if (!term) return prompt();

  const topCommand = parseTopCommand(term);

  if (topCommand && topCommand.inlineMonths !== null) {
    runTopKeywords(topCommand.inlineMonths);
    return prompt();
  }

  rl.question("months (e.g. 3,6,12; empty=all) > ", monthsInput => {
    const monthsList = parseMonthsInput(monthsInput);
    monthsList.forEach(m => {
      if (topCommand?.isTop) {
        runTopKeywords(m);
      } else {
        test(term, m);
      }
    });
    prompt();
  });
});

prompt();