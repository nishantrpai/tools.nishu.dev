import nlp from "compromise";

const STOP_NOUNS = new Set([]);

const subreddit = process.argv[2] ?? "freelance";

const headers = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
};

const res = await fetch(
  `https://www.reddit.com/r/${subreddit}.json?limit=100`,
  {
    headers,
  }
);

const json = await res.json();

const counts = new Map();

const normalize = value => value.trim().toLowerCase();
const stripSigns = text => text
  .replace(/[^\p{L}\p{N}\s]/gu, " ")
  .replace(/\s+/g, " ")
  .trim();


for (const { data } of json.data.children) {
  const text = stripSigns(`${data.title}\n${data.selftext || ""}`.toLowerCase());

  const doc = nlp(text);

  const nouns = [...new Set(
    doc.nouns().toSingular().out("array")
      .map(normalize)
      .filter(Boolean)
  )]
    .filter(noun => !STOP_NOUNS.has(noun));

  for (const noun of nouns) {
    const sentences = doc.match(noun).sentences();

    const verbs = sentences
      .verbs()
      .toInfinitive()
      .out("array")
      .map(normalize)
      .filter(Boolean);

    if (!counts.has(noun)) {
      counts.set(noun, new Map());
    }

    const verbCounts = counts.get(noun);

    for (const verb of verbs) {
      verbCounts.set(verb, (verbCounts.get(verb) ?? 0) + 1);
    }
  }
}

const output = [...counts.entries()]
  .map(([noun, verbCounts]) => ({
    noun,
    verbs: [...verbCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  }))
  .sort((a, b) => a.noun.localeCompare(b.noun));

console.log(JSON.stringify({ subreddit, nouns: output }, null, 2));