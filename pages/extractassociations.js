import Head from 'next/head';
import { useState, useMemo, useRef, useDeferredValue } from 'react';

const GRAPH_WIDTH = 1000;
const GRAPH_HEIGHT = 1000;
const GRAPH_PADDING = 40;
const MIN_NODE_DISTANCE = 34;
const wordFrequency = new Map();

function softmax(values) {
  if (!values.length) return [];

  const max = Math.max(...values);
  const exps = values.map(v => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);

  return exps.map(v => v / sum);
}
function isAbbrev(s, abbrev) {
  const single_abbrv = abbrev || [
    "a.m", "p.m", "etc", "vol", "inc", "jr", "dr",
    "tex", "co", "prof", "rev", "revd", "hon", "v.s",
    "ie", "eg", "et al", "st", "ph.d", "capt",
    "mr", "mrs", "ms"
  ];

  const lower = s.toLowerCase();

  if (
    single_abbrv.includes(lower) ||
    single_abbrv.includes(lower.replace(/\.$/, ""))
  ) {
    return true;
  }

  let cleaned = s;

  if (cleaned.endsWith(".")) {
    cleaned = cleaned.slice(0, -1);
  }

  const parts = cleaned.split(".");

  return (
    parts.length > 1 &&
    parts.filter(x => x.length <= 2).length > 0
  );
}

function extractsentences(body_text, abbrev, divider) {

  const sentences = [];

  const text = body_text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (!text) {
    return sentences;
  }

  divider = divider || [".", "?", "!"];

  let start = 0;


  for (let i = 0; i < text.length; i++) {

    const char = text[i];

    if (!divider.includes(char)) {
      continue;
    }


    // -----------------------------------------------
    // Decimal numbers
    // Don't split:
    //
    // 3.14
    // 10.5
    // -----------------------------------------------

    if (
      char === "." &&
      /\d/.test(text[i - 1] || "") &&
      /\d/.test(text[i + 1] || "")
    ) {
      continue;
    }


    // -----------------------------------------------
    // Get the text since the previous boundary
    // -----------------------------------------------

    const current = text.slice(start, i + 1);

    const words = current.trim().split(/\s+/);

    const lastWord = words[words.length - 1] || "";


    // -----------------------------------------------
    // Abbreviations
    // -----------------------------------------------

    if (
      char === "." &&
      isAbbrev(lastWord, abbrev)
    ) {
      continue;
    }


    // -----------------------------------------------
    // Initials
    //
    // A. Smith
    // J.R.R. Tolkien
    // U.S.
    // -----------------------------------------------

    if (
      char === "." &&
      /^[A-Za-z](?:\.[A-Za-z])*\.?$/.test(lastWord)
    ) {
      continue;
    }


    // -----------------------------------------------
    // URLs / emails
    // -----------------------------------------------

    if (
      char === "." &&
      (
        lastWord.includes("@") ||
        /^https?:\/\//i.test(lastWord) ||
        /^www\./i.test(lastWord)
      )
    ) {
      continue;
    }


    // -----------------------------------------------
    // Sentence boundary
    //
    // NO SPACE REQUIRED.
    //
    // These all work:
    //
    // Hello. World.
    // Hello.World.
    // Hello.\nWorld.
    // Hello!What?
    // -----------------------------------------------

    let end = i + 1;


    // Include closing punctuation
    while (
      end < text.length &&
      ['"', "'", ")", "]", "}"].includes(text[end])
    ) {
      end++;
    }


    const sentence = text
      .slice(start, end)
      .trim();


    console.log(sentence, start, end)
    if (sentence) {
      sentences.push(sentence);
    }


    start = end;

    i = end - 1;
  }


  // -----------------------------------------------
  // Anything left without punctuation
  // -----------------------------------------------

  const remainder = text
    .slice(start)
    .trim();

  if (remainder) {
    sentences.push(remainder);
  }


  return sentences;
}
function tokenizeSentence(sentence, stopwordSet) {
  return sentence
    .toLowerCase()
    // Normalize curly apostrophes to normal apostrophes
    .replace(/[’‘]/g, "'")
    // Remove punctuation EXCEPT apostrophes inside words
    .replace(/(?<![a-zA-Z0-9])'|'(?![a-zA-Z0-9])|[^a-zA-Z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(word => !stopwordSet.has(word));
}


function separateOverlappingNodes(nodes, minDistance) {
  if (nodes.length < 2) return;

  for (let iteration = 0; iteration < 30; iteration++) {
    let moved = false;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= minDistance) continue;

        if (distance < 0.001) {
          const angle = ((i + 1) * 37 + (j + 1) * 17) % 360;
          const radians = angle * (Math.PI / 180);

          dx = Math.cos(radians);
          dy = Math.sin(radians);
          distance = 1;
        }

        const push = (minDistance - distance) / 2;

        const offsetX = (dx / distance) * push;
        const offsetY = (dy / distance) * push;

        a.x = Math.max(
          GRAPH_PADDING,
          Math.min(
            GRAPH_WIDTH - GRAPH_PADDING,
            a.x - offsetX
          )
        );

        a.y = Math.max(
          GRAPH_PADDING,
          Math.min(
            GRAPH_HEIGHT - GRAPH_PADDING,
            a.y - offsetY
          )
        );

        b.x = Math.max(
          GRAPH_PADDING,
          Math.min(
            GRAPH_WIDTH - GRAPH_PADDING,
            b.x + offsetX
          )
        );

        b.y = Math.max(
          GRAPH_PADDING,
          Math.min(
            GRAPH_HEIGHT - GRAPH_PADDING,
            b.y + offsetY
          )
        );

        moved = true;
      }
    }

    if (!moved) break;
  }
}

export default function Home() {
  const [text, setText] = useState(`The cat sat on the mat.

The cat ate the fish.

The cat sat on the rug.`);
  const [customStopwords, setCustomStopwords] = useState('');

  const [result, setResult] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const [minWeight, setMinWeight] = useState(1);

  const [fullNodes, setFullNodes] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [copied, setCopied] = useState(false);

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const [highlightTop10, setHighlightTop10] = useState(false);
  // ------------------------------------------------------------
  // BUILD ASSOCIATION NETWORK
  // ------------------------------------------------------------

  const stopwords = [];
  function buildAssociations() {
    const stopwordSet = new Set(stopwords);

    customStopwords
      .split(',')
      .forEach(word => {
        const trimmed = word.trim().toLowerCase();

        if (trimmed) {
          stopwordSet.add(trimmed);
        }
      });


    // --------------------------------------------------
    // 1. SPLIT INPUT INTO SENTENCES
    // --------------------------------------------------
    // Newlines are treated as sentence boundaries.
    //
    // Example:
    //
    // "the cat sat on the mat .
    //
    //  the cat ate the fish .
    //
    //  the cat sat on the rug ."
    //
    // becomes 3 separate sentences.
    // --------------------------------------------------

    const sentences = extractsentences(text)
    console.log('sentences', sentences)

    // --------------------------------------------------
    // 2. TOKENIZE EACH SENTENCE
    // --------------------------------------------------

    const sentenceWords = sentences.map(sentence => {

      return tokenizeSentence(
        sentence,
        stopwordSet
      );

    });


    // --------------------------------------------------
    // 3. WORD FREQUENCY
    // --------------------------------------------------
    // Count every occurrence globally.
    //
    // the = 6
    // cat = 3
    // --------------------------------------------------


    sentenceWords.forEach(words => {

      words.forEach(word => {

        wordFrequency.set(
          word,
          (wordFrequency.get(word) || 0) + 1
        );

      });

    });


    // --------------------------------------------------
    // 4. BUILD ASSOCIATION GRID
    // --------------------------------------------------
    //
    // This follows the simple experiment:
    //
    // for every sentence:
    //   for every occurrence of wordA:
    //     for every occurrence of wordB:
    //       association[A][B] += 1
    //
    // Therefore:
    //
    // sentence 1:
    // the = 2
    // cat = 1
    //
    // the → cat = 2 × 1 = 2
    //
    // Across 3 sentences:
    //
    // the → cat = 2 + 2 + 2 = 6
    // --------------------------------------------------

    const associationGrid = new Map();

    const ensureWord = word => {

      if (!associationGrid.has(word)) {
        associationGrid.set(word, new Map());
      }

    };


    sentenceWords.forEach(words => {

      words.forEach(wordA => {

        ensureWord(wordA);

        words.forEach(wordB => {

          if (wordA === wordB) {
            return;
          }

          ensureWord(wordB);

          const row = associationGrid.get(wordA);

          row.set(
            wordB,
            (row.get(wordB) || 0) + 1
          );

        });

      });

    });


    // --------------------------------------------------
    // DEBUG
    // --------------------------------------------------

    console.log("=== ASSOCIATION CHECK ===");

    console.table(associationGrid)

    // --------------------------------------------------
    // 5. CONVERT GRID INTO EDGES
    // --------------------------------------------------

    const edges = [];

    const edgeMap = new Map();

    associationGrid.forEach((row, source) => {

      row.forEach((weight, target) => {

        if (weight <= 0) {
          return;
        }

        // Undirected visual edge.
        // "the → cat" and "cat → the"
        // represent the same connection.
        const key = [source, target]
          .sort()
          .join("||");

        if (!edgeMap.has(key)) {

          edgeMap.set(key, {
            source,
            target,
            weight,
            strength: weight,
            type: 'sentence'
          });

        }

      });

    });


    edgeMap.forEach(edge => {
      edges.push(edge);
    });


    // --------------------------------------------------
    // 6. BUILD NODES
    // --------------------------------------------------

    const nodes = [];

    associationGrid.forEach((row, word) => {

      nodes.push({
        id: word,
        label: word,
        frequency: wordFrequency.get(word) || 0
      });

    });


    // --------------------------------------------------
    // 7. FORCE SIMULATION
    // --------------------------------------------------

    const simNodes = nodes.map(node => ({
      ...node,
      x: Math.random() * 800,
      y: Math.random() * 600
    }));


    // Keep your existing force simulation here.
    // If your current buildAssociations() has a specific
    // simulation block, retain that block unchanged.


    // --------------------------------------------------
    // 8. STORE RESULT
    // --------------------------------------------------
    setFullNodes(simNodes);

    setResult({
      nodes: simNodes,
      edges,
      associationGrid,
      wordFrequency
    });
  }
  // ------------------------------------------------------------
  // SEARCH / HIGHLIGHT
  // ------------------------------------------------------------

  const highlightedData = useMemo(() => {
    if (
      !result ||
      !searchTerm.trim()
    ) {
      return {
        nodes: fullNodes,
        edges: result?.edges || [],
        term: '',
        termSet: new Set(),
        connectionWeightMap: new Map(),
        maxConnWeight: 1,
        level1Set: new Set(),
        occurrence: 0,
        hasSearch: false
      };
    }

    const term =
      searchTerm
        .trim()
        .toLowerCase();

    const escapedTerm =
      term.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    const termRegex =
      new RegExp(
        `(?:^|\\s)${escapedTerm}(?:\\s|$)`
      );

    const termSet = new Set(
      result.nodes
        .map(node => node.id)
        .filter(
          id =>
            id === term ||
            termRegex.test(id)
        )
    );

    if (termSet.size === 0) {
      return {
        nodes: [],
        edges: [],
        term,
        termSet: new Set(),
        connectionWeightMap: new Map(),
        maxConnWeight: 1,
        level1Set: new Set(),
        occurrence: 0,
        hasSearch: true
      };
    }

    const occurrence = Array.from(termSet).reduce(
      (total, matchedTerm) =>
        total + (result.wordFrequency.get(matchedTerm) || 0),
      0
    );

    const directEdges =
      result.edges.filter(
        edge =>
          termSet.has(edge.source) ||
          termSet.has(edge.target)
      );

    const connectionWeightMap =
      new Map();

    directEdges.forEach(edge => {
      const isSourceCenter =
        termSet.has(edge.source);

      const neighbor =
        isSourceCenter
          ? edge.target
          : edge.source;

      if (!termSet.has(neighbor)) {
        connectionWeightMap.set(
          neighbor,
          (connectionWeightMap.get(neighbor) || 0) +
          edge.weight
        );
      }
    });

    const maxConnWeight =
      Array.from(
        connectionWeightMap.values()
      ).reduce(
        (max, value) => Math.max(max, value),
        1
      );
    const level1Set =
      new Set(
        connectionWeightMap.keys()
      );

    // Search only filters the already-built graph.
    // No tokenization, association building, or layout happens here.
    const visibleNodeIds = new Set([
      ...termSet,
      ...level1Set
    ]);

    const visibleNodes = fullNodes.filter(node =>
      visibleNodeIds.has(node.id)
    );

    const visibleEdges = result.edges.filter(edge =>
      termSet.has(edge.source) ||
      termSet.has(edge.target)
    );

    return {
      nodes: visibleNodes,
      edges: visibleEdges,
      term,
      termSet,
      connectionWeightMap,
      maxConnWeight,
      level1Set,
      occurrence,
      hasSearch: true
    };
  }, [
    result,
    deferredSearchTerm,
    fullNodes
  ]);


  const top10Nodes = useMemo(() => {
    if (!result) return new Set();

    const degree = new Map();

    result.edges.forEach(({ source, target }) => {
      degree.set(source, (degree.get(source) || 0) + 1);
      degree.set(target, (degree.get(target) || 0) + 1);
    });

    return new Set(
      [...degree.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word)
    );
  }, [result]);
  // ------------------------------------------------------------
  // COPY ASSOCIATIONS
  // ------------------------------------------------------------

  const copyAssociations = () => {
    if (!result) return;

    let lines;

    if (highlightedData.hasSearch) {
      lines =
        Array.from(
          highlightedData.level1Set
        )
          .map(term => ({
            term,
            weight:
              highlightedData
                .connectionWeightMap
                .get(term) || 0
          }))
          .filter(
            ({ weight }) =>
              weight >= minWeight
          )
          .sort(
            (a, b) =>
              b.weight - a.weight
          )
          .map(
            ({ term, weight }) =>
              `${highlightedData.term} → ${term} (${weight})`
          )
          .join('\n');
    } else {
      lines =
        [...result.edges]
          .filter(
            edge =>
              edge.weight >= minWeight
          )
          .sort(
            (a, b) =>
              b.weight - a.weight
          )
          .map(
            edge =>
              `${edge.source} → ${edge.target} (${edge.weight}, ${(edge.strength * 100).toFixed(1)}%)`
          )
          .join('\n');
    }

    navigator.clipboard
      .writeText(lines)
      .then(() => {
        setCopied(true);

        setTimeout(
          () => setCopied(false),
          1800
        );
      });
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <>
      <Head>
        <title>Visualize Language Network</title>
        <meta name="description" content="Visualize language network from large text and words associated with each other." />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main
        style={{
          padding: '20px',
          background: '#000',
          color: '#fff',
          fontFamily: 'system-ui',
          maxWidth: '100%',
          width: '100%',
          minHeight: '100vh'
        }}
      >
        <h1
          style={{
            textAlign: 'center'
          }}
        >
          Language Network
        </h1>

        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Visualize language network and words associated with each other</span>

        <div
          style={{
            width: '100%'
          }}
        >
          {/* INPUT */}

          <textarea
            value={text}
            onChange={e =>
              setText(e.target.value)
            }
            placeholder={`The cat sat on the mat.

The cat ate the fish.

The cat sat on the rug.`}
            style={{
              width: '100%',
              height: '140px',
              padding: '12px',
              background: '#111',
              border: '1px solid #333',
              color: '#fff',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
          />

          <input
            type="text"
            value={customStopwords}
            onChange={e =>
              setCustomStopwords(
                e.target.value
              )
            }
            placeholder="Custom stopwords (comma separated)"
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              background: '#111',
              border: '1px solid #333',
              color: '#fff',
              fontFamily: 'monospace'
            }}
          />

          {/* CONTROLS 

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '10px 0',
              flexWrap: 'wrap'
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#aaa',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
            >
              Min weight

              <input
                type="number"
                min="1"
                value={minWeight}
                onChange={e =>
                  setMinWeight(
                    Math.max(
                      1,
                      parseInt(
                        e.target.value
                      ) || 1
                    )
                  )
                }
                style={{
                  width: '60px',
                  padding: '4px 8px',
                  background: '#111',
                  border: '1px solid #333',
                  color: '#fff',
                  fontFamily: 'monospace'
                }}
              />
            </label>
          </div>*/}

          {/* BUTTONS */}

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginTop: '10px'
            }}
          >
            <button
              onClick={buildAssociations}
            >
              Build Network
            </button>

            {result && (
              <button
                onClick={copyAssociations}
              >
                {copied
                  ? 'copied!'
                  : 'copy associations'}
              </button>
            )}
            {result && (
              <button
                onClick={() => setHighlightTop10(value => !value)}
              >
                {highlightTop10 ? 'Show All Nodes' : 'Highlight Top 10'}
              </button>
            )}
          </div>

          {/* GRAPH */}

          {result && (
            <div
              style={{
                marginTop: '30px'
              }}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={e =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search a word to highlight..."
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  background: '#111',
                  border: '1px solid #444',
                  color: '#fff',
                  marginBottom: '10px',
                  fontFamily: 'monospace'
                }}
              />

              {/* ZOOM */}

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '10px',
                  alignItems: 'center'
                }}
              >
                <button
                  onClick={() =>
                    setZoom(z =>
                      Math.min(
                        z + 0.2,
                        5
                      )
                    )
                  }
                >
                  +
                </button>

                <button
                  onClick={() =>
                    setZoom(z =>
                      Math.max(
                        z - 0.2,
                        0.2
                      )
                    )
                  }
                >
                  −
                </button>

                <button
                  onClick={() => {
                    setZoom(1);
                    setPan({
                      x: 0,
                      y: 0
                    });
                  }}
                >
                  reset
                </button>

                <span
                  style={{
                    color: '#555',
                    fontFamily:
                      'monospace',
                    fontSize: '12px'
                  }}
                >
                  {Math.round(
                    zoom * 100
                  )}
                  %
                </span>
              </div>

              {/* SVG CONTAINER */}

              <div
                style={{
                  width: '100%',
                  height: '82vh',
                  overflow: 'hidden',
                  background:
                    '#0a0a0a',
                  borderRadius:
                    '12px',
                  border:
                    '1px solid #222',
                  cursor:
                    isPanning.current
                      ? 'grabbing'
                      : 'grab',
                  userSelect:
                    'none'
                }}
                onMouseDown={e => {
                  isPanning.current =
                    true;

                  panStart.current = {
                    x: e.clientX,
                    y: e.clientY
                  };

                  panOrigin.current = {
                    ...pan
                  };
                }}
                onMouseMove={e => {
                  if (
                    !isPanning.current
                  ) {
                    return;
                  }

                  setPan({
                    x:
                      panOrigin.current
                        .x +
                      (e.clientX -
                        panStart.current
                          .x),

                    y:
                      panOrigin.current
                        .y +
                      (e.clientY -
                        panStart.current
                          .y)
                  });
                }}
                onMouseUp={() => {
                  isPanning.current =
                    false;
                }}
                onMouseLeave={() => {
                  isPanning.current =
                    false;
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  style={{
                    display:
                      'block'
                  }}
                >
                  <g
                    transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                  >
                    {/* ----------------------------------------
                        EDGES
                    ----------------------------------------- */}

                    {(() => {
                      const visibleEdges =
                        highlightedData.edges.filter(
                          edge =>
                            edge.weight >= minWeight
                        );

                      const maxWeight =
                        visibleEdges.reduce(
                          (max, edge) => Math.max(max, edge.weight),
                          1
                        );

                      return visibleEdges.map(
                        (edge, index) => {
                          const source =
                            highlightedData.nodes.find(
                              node =>
                                node.id ===
                                edge.source
                            );

                          const target =
                            highlightedData.nodes.find(
                              node =>
                                node.id ===
                                edge.target
                            );

                          if (
                            !source ||
                            !target
                          ) {
                            return null;
                          }

                          const isConnected =
                            highlightedData.hasSearch &&
                            (
                              highlightedData.termSet.has(
                                edge.source
                              ) ||
                              highlightedData.termSet.has(
                                edge.target
                              )
                            );

                          const connRatio =
                            isConnected
                              ? edge.weight /
                              highlightedData.maxConnWeight
                              : 0;

                          const strokeOpacity =
                            !highlightedData.hasSearch
                              ? 0.05 +
                              (edge.weight /
                                maxWeight) *
                              0.15
                              : isConnected
                                ? 0.15 +
                                connRatio *
                                0.15
                                : 0.02;

                          const strokeWidth =
                            !highlightedData.hasSearch
                              ? 0.5 +
                              (edge.weight /
                                maxWeight) *
                              1.5
                              : isConnected
                                ? 0.5 +
                                connRatio *
                                2
                                : 0.2;

                          return (
                            <g
                              key={index}
                            >
                              {/* EDGE */}

                              <line
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                stroke="#e5e7eb"
                                strokeOpacity={
                                  strokeOpacity
                                }
                                strokeWidth={
                                  strokeWidth
                                }
                              />

                              {/* EDGE LABEL */}

                              {/* <text
                                x={
                                  (source.x +
                                    target.x) /
                                  2
                                }
                                y={
                                  (source.y +
                                    target.y) /
                                  2 -
                                  4
                                }
                                textAnchor="middle"
                                fill="#333"
                                fontSize="8"
                                fontFamily="monospace"
                                pointerEvents="none"
                              >
                                {edge.source}
                                {' → '}
                                {edge.target}
                                {' · '}
                                {edge.weight}
                                {' · '}
                                {(
                                  edge.strength *
                                  100
                                ).toFixed(1)}
                                %
                              </text> */}
                            </g>
                          );
                        }
                      );
                    })()}

                    {/* ----------------------------------------
                        NODES
                    ----------------------------------------- */}

                    {highlightedData.nodes
                      .filter(node => {
                        if (highlightedData.hasSearch) {
                          return true;
                        }

                        return highlightedData.edges.some(
                          edge =>
                            edge.weight >= minWeight &&
                            (edge.source === node.id ||
                              edge.target === node.id)
                        );
                      })
                      .map(node => {
                        const isCenter =
                          highlightedData.hasSearch &&
                          highlightedData.termSet.has(
                            node.id
                          );

                        const connWeight =
                          highlightedData.hasSearch
                            ? highlightedData.connectionWeightMap.get(
                              node.id
                            )
                            : undefined;

                        const isConnected =
                          connWeight !==
                          undefined;

                        const isTop10 =
                          highlightTop10 &&
                          !highlightedData.hasSearch &&
                          top10Nodes.has(node.id);

                        const connRatio =
                          isConnected
                            ? connWeight /
                            highlightedData.maxConnWeight
                            : 0;

                        const radius =
                          isCenter
                            ? 22
                            : isTop10
                              ? 18
                              : 12;

                        const nodeOpacity =
                          !highlightedData.hasSearch
                            ? 1
                            : isCenter
                              ? 1
                              : isConnected
                                ? 0.2 +
                                connRatio *
                                0.8
                                : 0.1;

                        const brightness =
                          Math.round(
                            80 +
                            connRatio *
                            175
                          );

                        const textFill =
                          isTop10
                            ? '#fff'
                            : !highlightedData.hasSearch
                              ? '#888'
                              : isCenter
                                ? '#fff'
                                : isConnected
                                  ? `rgb(${brightness},${brightness},${brightness})`
                                  : '#333';

                        return (
                          <g
                            key={node.id}
                            opacity={
                              nodeOpacity
                            }
                          >
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={radius}
                              fill="transparent"
                              stroke={isTop10 ? '#fff' : 'transparent'}
                              strokeWidth={isTop10 ? 1.5 : 0}
                            />

                            <text
                              x={node.x}
                              y={
                                node.y + 5
                              }
                              textAnchor="middle"
                              fill={textFill}
                              fontSize={
                                isCenter
                                  ? '13.5'
                                  : isTop10
                                    ? '15'
                                    : isConnected
                                      ? '11'
                                      : '9.5'
                              }
                              fontFamily="monospace"
                              fontWeight={
                                isCenter ||
                                  isConnected ||
                                  isTop10
                                  ? 'bold'
                                  : 'normal'
                              }
                            >
                              {node.id}
                            </text>
                          </g>
                        );
                      })}
                  </g>
                </svg>
              </div>

              {/* ------------------------------------------
                  SEARCH RESULTS
              ------------------------------------------- */}

              {searchTerm &&
                highlightedData.hasSearch && (
                  <div
                    style={{
                      marginTop: '20px',
                      marginBottom: '10px',
                      fontFamily: 'monospace',
                      color: '#aaa'
                    }}
                  >
                    <span style={{ color: '#fff' }}>
                      {highlightedData.occurrence}
                    </span>{' '}
                    occurrence{highlightedData.occurrence === 1 ? '' : 's'}
                  </div>
                )}

              {searchTerm &&
                highlightedData.hasSearch &&
                highlightedData.level1Set
                  .size > 0 && (
                  <div
                    style={{
                      marginTop:
                        '20px'
                    }}
                  >
                    <h3
                      style={{
                        color: '#aaa',
                        fontSize:
                          '14px',
                        marginBottom:
                          '10px',
                        fontFamily:
                          'monospace'
                      }}
                    >
                      Terms associated
                      with{' '}
                      <strong
                        style={{
                          color:
                            '#fff'
                        }}
                      >
                        "{searchTerm}"
                      </strong>
                    </h3>

                    <table
                      style={{
                        width: '100%',
                        borderCollapse:
                          'collapse',
                        fontFamily:
                          'monospace',
                        fontSize:
                          '13px'
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom:
                              '1px solid #333'
                          }}
                        >
                          <th
                            style={{
                              textAlign:
                                'left',
                              padding:
                                '8px 12px',
                              color:
                                '#666',
                              fontWeight:
                                'normal'
                            }}
                          >
                            #
                          </th>

                          <th
                            style={{
                              textAlign:
                                'left',
                              padding:
                                '8px 12px',
                              color:
                                '#666',
                              fontWeight:
                                'normal'
                            }}
                          >
                            Term
                          </th>

                          <th
                            style={{
                              textAlign:
                                'right',
                              padding:
                                '8px 12px',
                              color:
                                '#666',
                              fontWeight:
                                'normal'
                            }}
                          >
                            Co-occurrences
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {Array.from(
                          highlightedData.level1Set
                        )
                          .map(term => ({
                            term,
                            weight:
                              highlightedData
                                .connectionWeightMap
                                .get(term) ||
                              0
                          }))
                          .filter(
                            ({ weight }) =>
                              weight >=
                              minWeight
                          )
                          .sort(
                            (a, b) =>
                              b.weight -
                              a.weight
                          )
                          .map(
                            (
                              {
                                term,
                                weight
                              },
                              index
                            ) => (
                              <tr
                                key={term}
                                style={{
                                  borderBottom:
                                    '1px solid #1a1a1a',
                                  cursor:
                                    'pointer'
                                }}
                                onClick={() =>
                                  setSearchTerm(
                                    term
                                  )
                                }
                              >
                                <td
                                  style={{
                                    padding:
                                      '8px 12px',
                                    color:
                                      '#555'
                                  }}
                                >
                                  {index +
                                    1}
                                </td>

                                <td
                                  style={{
                                    padding:
                                      '8px 12px',
                                    color:
                                      '#c8c8c8'
                                  }}
                                >
                                  {term}
                                </td>

                                <td
                                  style={{
                                    padding:
                                      '8px 12px',
                                    color:
                                      '#666',
                                    textAlign:
                                      'right'
                                  }}
                                >
                                  {weight}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                )}

              {searchTerm && (
                <p
                  style={{
                    textAlign:
                      'center',
                    marginTop:
                      '12px',
                    color: '#aaa'
                  }}
                >
                  Highlighting{' '}
                  <strong>
                    "{searchTerm}"
                  </strong>{' '}
                  and its direct
                  connections
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}