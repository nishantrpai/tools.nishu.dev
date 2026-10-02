import Head from 'next/head';
import { useState, useMemo, useRef, useDeferredValue, useEffect } from 'react';

const GRAPH_WIDTH = 1000;
const GRAPH_HEIGHT = 1000;
const GRAPH_PADDING = 40;
const MIN_NODE_DISTANCE = 34;
const INITIAL_INDEX_SENTENCE_LIMIT = 200;

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

function createPathSearch(terms) {
  const termIndex = new Map(
    terms.map((term, index) => [term, index])
  );
  const initialMask = 1 << termIndex.get(terms[0]);

  return {
    terms,
    termIndex,
    fullMask: (1 << terms.length) - 1,
    queue: [{
      current: terms[0],
      path: [terms[0]],
      mask: initialMask
    }],
    queueIndex: 0,
    currentState: null,
    currentNeighbors: null,
    seen: new Map([
      [`${terms[0]}|${initialMask}`, {
        depth: 1,
        count: 1
      }]
    ]),
    paths: [],
    shortestPathLength: null,
    done: false
  };
}

function advancePathSearch(search, adjacency, terms, budget = 250) {
  let processed = 0;
  const maxPathLength = terms.length > 2 ? 8 : Infinity;

  while (processed < budget && !search.done) {
    if (!search.currentState) {
      if (search.queueIndex >= search.queue.length) {
        search.done = true;
        break;
      }

      search.currentState =
        search.queue[search.queueIndex++];
      processed++;

      const state = search.currentState;

      if (
        search.shortestPathLength !== null &&
        state.path.length > search.shortestPathLength
      ) {
        search.done = true;
        break;
      }

      if (state.mask === search.fullMask) {
        search.shortestPathLength = state.path.length;
        search.paths.push(state.path);

        if (search.paths.length >= 20) {
          search.done = true;
        }

        search.currentState = null;
        continue;
      }

      if (state.path.length >= maxPathLength) {
        search.currentState = null;
        continue;
      }

      search.currentNeighbors =
        adjacency
          .get(state.current)
          ?.values();
    }

    const nextNeighbor =
      search.currentNeighbors?.next();

    if (!nextNeighbor || nextNeighbor.done) {
      search.currentState = null;
      search.currentNeighbors = null;
      continue;
    }

    processed++;

    const neighbor = nextNeighbor.value;
    const state = search.currentState;

    if (state.path.includes(neighbor)) {
      continue;
    }

    let mask = state.mask;
    const termIndex = search.termIndex.get(neighbor);

    if (termIndex !== undefined) {
      mask |= 1 << termIndex;
    }

    const depth = state.path.length + 1;
    const stateKey = `${neighbor}|${mask}`;
    const seenState = search.seen.get(stateKey);

    if (terms.length === 2) {
      if (
        seenState?.depth < depth ||
        (
          seenState?.depth === depth &&
          seenState.count >= 20
        )
      ) {
        continue;
      }

      if (seenState?.depth === depth) {
        seenState.count++;
      } else {
        search.seen.set(stateKey, {
          depth,
          count: 1
        });
      }
    } else {
      if (seenState) {
        continue;
      }

      search.seen.set(stateKey, {
        depth,
        count: 1
      });
    }

    search.queue.push({
      current: neighbor,
      path: [
        ...state.path,
        neighbor
      ],
      mask
    });
  }

  if (
    !search.currentState &&
    search.queueIndex >= search.queue.length
  ) {
    search.done = true;
  }
}


export default function Home() {
  const [text, setText] = useState(`The cat sat on the mat.

The cat ate the fish.

The cat sat on the rug.`);
  const [customStopwords, setCustomStopwords] = useState('');

  const [result, setResult] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [visualMode, setVisualMode] = useState(true)
  const [showEdges, setShowEdges] = useState(false)
  const [showNeighbours, setShowNeighbours] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const pathTerms = [...new Set(
    searchTerm
      .split(',')
      .map(term => term.trim().toLowerCase())
      .filter(Boolean)
  )];
  const pathQueryKey = JSON.stringify(pathTerms);
  const [pathSearch, setPathSearch] = useState({
    result: null,
    key: '',
    terms: [],
    paths: [],
    indexed: 0,
    total: 0,
    status: 'idle',
    error: null
  });

  const [minWeight, setMinWeight] = useState(1);


  const [fullNodes, setFullNodes] = useState([]);

  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [copied, setCopied] = useState(false);

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const [highlightTop10, setHighlightTop10] = useState(false);
  // ------------------------------------------------------------
  // BUILD ASSOCIATION NETWORK
  // ------------------------------------------------------------

  // const stopwords = [
  //   'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'so', 'because',
  //   'of', 'to', 'in', 'on', 'at', 'for', 'from', 'with', 'by', 'about',
  //   'as', 'into', 'through', 'during', 'before', 'after', 'between',
  //   'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  //   'have', 'has', 'had', 'do', 'does', 'did',
  //   'i', 'me', 'my', 'mine', 'myself',
  //   'you', 'your', 'yours', 'yourself',
  //   'he', 'him', 'his', 'himself',
  //   'she', 'her', 'hers', 'herself',
  //   'it', 'its', 'itself',
  //   'we', 'us', 'our', 'ours', 'ourselves',
  //   'they', 'them', 'their', 'theirs', 'themselves',
  //   'this', 'that', 'these', 'those'
  // ];
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

    const indexedSentences = sentences.slice(
      0,
      INITIAL_INDEX_SENTENCE_LIMIT
    );

    const sentenceWords = indexedSentences.map(sentence => {

      return tokenizeSentence(
        sentence,
        stopwordSet
      );

    });


    // --------------------------------------------------
    // 3. INITIAL INDEX WORD FREQUENCY
    // --------------------------------------------------
    // Count occurrences in the initially indexed sentences.
    //
    // Search expands these counts across the full corpus.
    // --------------------------------------------------

    const wordFrequency = new Map();

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
      wordFrequency,
      sentences,
      indexedSentenceWords: sentenceWords,
      indexedSentenceCount: indexedSentences.length,
      stopwordSet
    });
  }
  // ------------------------------------------------------------
  // SEARCH / HIGHLIGHT
  // ------------------------------------------------------------

  const highlightedData = useMemo(() => {
    if (
      !result ||
      !deferredSearchTerm.trim()
    ) {
      return {
        nodes: fullNodes,
        edges: result?.edges || [],
        terms: [],
        paths: [],
        termSet: new Set(),
        connectedTermSet: new Set(),
        firstDegreeSet: new Set(),
        connectionWeightMap: new Map(),
        cooccurrences: [],
        maxConnWeight: 1,
        level1Set: new Set(),
        bridgeSet: new Set(),
        occurrence: 0,
        hasSearch: false
      };
    }

    const terms = deferredSearchTerm
      .split(',')
      .map(term => term.trim().toLowerCase())
      .filter(Boolean);

    const uniqueTerms = [...new Set(terms)];

    if (uniqueTerms.length === 0) {
      return {
        nodes: fullNodes,
        edges: result.edges,
        terms: [],
        paths: [],
        termSet: new Set(),
        connectedTermSet: new Set(),
        firstDegreeSet: new Set(),
        connectionWeightMap: new Map(),
        cooccurrences: [],
        maxConnWeight: 1,
        level1Set: new Set(),
        bridgeSet: new Set(),
        occurrence: 0,
        hasSearch: false
      };
    }

    const connectionWeightMap = new Map();
    const uniqueTermSet = new Set(uniqueTerms);
    const termFrequencies = new Map(
      uniqueTerms.map(term => [term, 0])
    );

    result.sentences.forEach((sentence, index) => {
      const words =
        index < result.indexedSentenceCount
          ? result.indexedSentenceWords[index]
          : tokenizeSentence(sentence, result.stopwordSet);
      const sentenceCounts = new Map();

      words.forEach(word => {
        sentenceCounts.set(
          word,
          (sentenceCounts.get(word) || 0) + 1
        );
      });

      const termsInSentence = uniqueTerms
        .map(term => [term, sentenceCounts.get(term) || 0])
        .filter(([, count]) => count > 0);

      termsInSentence.forEach(([term, count]) => {
        termFrequencies.set(
          term,
          termFrequencies.get(term) + count
        );
      });

      sentenceCounts.forEach((wordCount, word) => {
        if (uniqueTermSet.has(word)) return;

        termsInSentence.forEach(([term, termCount]) => {
          if (!connectionWeightMap.has(word)) {
            connectionWeightMap.set(word, new Map());
          }

          const connections = connectionWeightMap.get(word);
          connections.set(
            term,
            (connections.get(term) || 0) + termCount * wordCount
          );
        });
      });
    });

    const matchingTerms = new Set(
      uniqueTerms.filter(term => termFrequencies.get(term) > 0)
    );

    if (matchingTerms.size !== uniqueTerms.length) {
      return {
        nodes: [],
        edges: [],
        terms: uniqueTerms,
        paths: [],
        termSet: new Set(),
        connectedTermSet: new Set(),
        firstDegreeSet: new Set(),
        connectionWeightMap: new Map(),
        cooccurrences: [],
        maxConnWeight: 1,
        level1Set: new Set(),
        bridgeSet: new Set(),
        occurrence: 0,
        hasSearch: true
      };
    }

    const bridgeSet = new Set(
      [...connectionWeightMap.entries()]
        .filter(([, connections]) => {
          const connectedTerms = [...connections.keys()]
            .filter(term => matchingTerms.has(term));

          return connectedTerms.length >= 2;
        })
        .map(([word]) => word)
    );
    const firstDegreeSet = new Set(connectionWeightMap.keys());

    const connectedTermSet = new Set();

    bridgeSet.forEach(word => {
      const connections = connectionWeightMap.get(word);
      const connectedTerms = [...connections.keys()]
        .filter(term => matchingTerms.has(term));

      connectedTerms.forEach(term => {
        connectedTermSet.add(term);
      });
    });

    const cooccurrences = [...bridgeSet]
      .map(word => {
        const connections = connectionWeightMap.get(word);

        return {
          word,
          connections: uniqueTerms.map(term => ({
            term,
            weight: connections.get(term) || 0
          })),
          total: [...connections.values()]
            .reduce((sum, weight) => sum + weight, 0)
        };
      })
      .sort((a, b) => b.total - a.total);

    const maxConnWeight = cooccurrences
      .flatMap(item => item.connections.map(connection => connection.weight))
      .reduce((max, weight) => Math.max(max, weight), 1);

    const occurrence = [...matchingTerms].reduce(
      (total, term) =>
        total + termFrequencies.get(term),
      0
    );

    const visibleNodeIds = new Set([
      ...matchingTerms,
      ...bridgeSet,
      ...(showNeighbours ? firstDegreeSet : [])
    ]);

    const initialNodeMap = new Map(
      fullNodes.map(node => [node.id, node])
    );
    const visibleNodes = [...visibleNodeIds].map(id =>
      initialNodeMap.get(id) || {
        id,
        label: id,
        frequency: termFrequencies.get(id) || 0,
        x: GRAPH_PADDING + Math.random() * (GRAPH_WIDTH - GRAPH_PADDING * 2),
        y: GRAPH_PADDING + Math.random() * (GRAPH_HEIGHT - GRAPH_PADDING * 2)
      }
    );

    const bridgeEdges = [...bridgeSet].flatMap(word => {
      const connections = connectionWeightMap.get(word);

      return uniqueTerms
        .filter(term => connections.has(term))
        .map(term => ({
          source: term,
          target: word,
          weight: connections.get(term),
          strength: connections.get(term),
          type: 'bridge'
        }));
    });

    const neighbourEdges = showNeighbours
      ? [...firstDegreeSet]
        .filter(word => !bridgeSet.has(word))
        .flatMap(word => {
          const connections = connectionWeightMap.get(word);

          if (!connections) return [];

          return uniqueTerms
            .filter(term => connections.has(term))
            .map(term => ({
              source: term,
              target: word,
              weight: connections.get(term),
              strength: connections.get(term),
              type: 'sentence'
            }));
        })
      : [];

    const visibleEdges = [...bridgeEdges, ...neighbourEdges];

    return {
      nodes: visibleNodes,
      edges: visibleEdges,
      terms: uniqueTerms,
      termSet: matchingTerms,
      connectedTermSet,
      firstDegreeSet,
      connectionWeightMap,
      cooccurrences,
      maxConnWeight,
      level1Set: bridgeSet,
      bridgeSet,
      occurrence,
      hasSearch: true
    };
  }, [
    result,
    deferredSearchTerm,
    fullNodes,
    showNeighbours
  ]);

useEffect(() => {
  let cancelled = false;

  const terms = JSON.parse(pathQueryKey);
  const sentences = result?.sentences || [];

  setPathSearch({
    result,
    key: pathQueryKey,
    terms,
    paths: [],
    indexed: 0,
    total: sentences.length,
    status: result && terms.length >= 2 ? 'indexing' : 'idle',
    error: null
  });

  if (!result || terms.length < 2) {
    return () => {
      cancelled = true;
    };
  }

  const adjacency = new Map();

  let nextSentence = 0;
  let search = null;

  let bestPaths = [];
  let bestPathLength = null;

  const publish = (indexed, status, error = null) => {
    if (cancelled) return;

    setPathSearch({
      result,
      key: pathQueryKey,
      terms,
      paths: bestPaths,
      indexed,
      total: sentences.length,
      status,
      error
    });
  };

  const addSentenceToAdjacency = words => {
    const uniqueWords = [...new Set(words)];

    uniqueWords.forEach(word => {
      if (!adjacency.has(word)) {
        adjacency.set(word, new Set());
      }

      uniqueWords.forEach(other => {
        if (word !== other) {
          adjacency.get(word).add(other);
        }
      });
    });
  };

  const indexNextChunk = async () => {
    try {

      // --------------------------------------------------
      // INDEX NEXT 50 SENTENCES
      // --------------------------------------------------

      if (nextSentence < sentences.length) {
        const chunkEnd =
          Math.min(nextSentence + 50, sentences.length);

        for (; nextSentence < chunkEnd; nextSentence++) {
          const words =
            nextSentence < result.indexedSentenceCount
              ? result.indexedSentenceWords[nextSentence]
              : tokenizeSentence(
                  sentences[nextSentence],
                  result.stopwordSet
                );

          addSentenceToAdjacency(words);
        }
      }

      // --------------------------------------------------
      // FIRST: DIRECT SENTENCE CONNECTION
      //
      // If two terms occur in the same sentence,
      // that IS the shortest possible path.
      // --------------------------------------------------

      if (terms.length === 2 && bestPathLength === null) {
        const [a, b] = terms;

        for (
          let i = 0;
          i < nextSentence;
          i++
        ) {
          const words =
            i < result.indexedSentenceCount
              ? result.indexedSentenceWords[i]
              : tokenizeSentence(
                  sentences[i],
                  result.stopwordSet
                );

          const wordSet = new Set(words);

          if (
            wordSet.has(a) &&
            wordSet.has(b)
          ) {
            bestPaths = [[a, b]];
            bestPathLength = 2;
            break;
          }
        }
      }

      // --------------------------------------------------
      // GENERAL PATH SEARCH
      // --------------------------------------------------

      if (
        bestPathLength === null ||
        terms.length > 2
      ) {
        if (!search) {
          search = createPathSearch(terms);
        }

        advancePathSearch(
          search,
          adjacency,
          terms
        );

        if (search.paths.length > 0) {
          const candidateLength =
            search.paths[0].length;

          if (
            bestPathLength === null ||
            candidateLength < bestPathLength
          ) {
            bestPathLength = candidateLength;
            bestPaths = search.paths;
          } else if (
            candidateLength === bestPathLength
          ) {
            const knownPaths = new Set(
              bestPaths.map(path =>
                path.join('\u0000')
              )
            );

            search.paths.forEach(path => {
              const pathKey =
                path.join('\u0000');

              if (
                !knownPaths.has(pathKey) &&
                bestPaths.length < 20
              ) {
                knownPaths.add(pathKey);

                bestPaths = [
                  ...bestPaths,
                  path
                ];
              }
            });
          }
        }
      }

      // --------------------------------------------------
      // COMPLETE?
      // --------------------------------------------------

      const directTwoTermPath =
        terms.length === 2 &&
        bestPathLength !== null;

      const complete =
        nextSentence >= sentences.length &&
        (
          directTwoTermPath ||
          !search ||
          search.done
        );

      publish(
        nextSentence,
        complete
          ? 'complete'
          : 'indexing'
      );

      if (!complete && !cancelled) {
        await new Promise(resolve =>
          setTimeout(resolve, 0)
        );

        if (!cancelled) {
          indexNextChunk();
        }
      }

    } catch (error) {
      console.error(
        'Path indexing failed:',
        error
      );

      publish(
        nextSentence,
        'error',
        error.message
      );
    }
  };

  indexNextChunk();

  return () => {
    cancelled = true;
  };

}, [result, pathQueryKey]);

  const activePathSearch =
    pathSearch.result === result && pathSearch.key === pathQueryKey
      ? pathSearch
      : null;

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
      lines = highlightedData.cooccurrences
        .map(({ word, connections }) =>
          `${word} → ${connections
            .map(({ term, weight }) => `${term} (${weight})`)
            .join(', ')}`
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
            <input
              type="checkbox"
              checked={visualMode}
              onChange={() => setVisualMode(value => !value)}
            />
            <label>Visual </label>
            <input
              type="checkbox"
              checked={showEdges}
              onChange={() => setShowEdges(value => !value)}
            />
            <label>
              Edges

            </label>
            <input
              type="checkbox"
              checked={showNeighbours}
              onChange={() => setShowNeighbours(value => !value)}
            />
            <label>Neighbours</label>

            {/*result && (
              <button
                onClick={copyAssociations}
              >
                {copied
                  ? 'copied!'
                  : 'copy associations'}
              </button>
            )*/}
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
                placeholder="Search terms, comma separated..."
              />
              <div
                style={{
                  color: '#777',
                  fontSize: '12px',
                  margin: '0 0 10px',
                  fontFamily: 'monospace'
                }}
              >
                Initial graph indexes the first {INITIAL_INDEX_SENTENCE_LIMIT} sentences.
                Searching expands connections across the full text.
              </div>

              {/* ZOOM */}

              {visualMode && <div
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
              </div>}

              {/* SVG CONTAINER */}

              {visualMode && <div
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
                              ? 0.15 +
                              (edge.weight /
                                maxWeight) *
                              0.6
                              : isConnected
                                ? 0.15 +
                                connRatio * 0.25
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

                              {showEdges && <text
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
                              </text>}
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

                        const nodeConnections =
                          highlightedData.hasSearch
                            ? highlightedData.connectionWeightMap.get(node.id)
                            : undefined;

                        const connWeight =
                          nodeConnections
                            ? [...nodeConnections.values()]
                              .reduce((total, weight) => total + weight, 0)
                            : undefined;

                        const isConnected =
                          connWeight !== undefined ||
                          highlightedData.connectedTermSet?.has(node.id);

                        const isFirstDegree =
                          highlightedData.hasSearch &&
                          highlightedData.firstDegreeSet.has(node.id);

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
                                ? 0.5
                                : isFirstDegree
                                  ? 0.25
                                  : 0.05;

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
                                  : isFirstDegree
                                    ? '#999'
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
                              strokeWidth={isTop10 ? 1 : 0}
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
                                    : '9.5'
                              }
                              fontFamily="monospace"
                              fontWeight={
                                isCenter || isTop10
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
              </div>}

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

              {pathTerms.length >= 2 && (
                <div
                  style={{
                    marginTop: '24px',
                    fontFamily: 'monospace'
                  }}
                >
                  <h3
                    style={{
                      color: '#aaa',
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}
                  >
                    Paths ({activePathSearch?.paths.length || 0})
                  </h3>

                  <div style={{ color: '#aaa', marginBottom: '8px' }}>
                    Connecting: {pathTerms.map(term => term.toUpperCase()).join(' → ')}
                  </div>

                  {activePathSearch?.paths.map((path, index) => (
                    <div
                      key={index}
                      style={{
                        color: '#888',
                        fontSize: '13px',
                        marginBottom: '6px'
                      }}
                    >
                      {path.join(' → ')}
                    </div>
                  ))}

                  <div style={{ color: '#777', fontSize: '12px' }}>
                    {!result
                      ? 'Build the network to start path indexing.'
                      : activePathSearch?.status === 'error'
                        ? `Path indexing failed: ${activePathSearch.error}`
                        : activePathSearch?.status === 'complete'
                          ? activePathSearch.paths.length > 0
                            ? `Indexed ${activePathSearch.total} / ${activePathSearch.total} sentences.`
                            : `No path found after indexing ${activePathSearch.total} sentences.`
                          : `Indexing: ${activePathSearch?.indexed || 0} / ${activePathSearch?.total || result.sentences.length} sentences`}
                  </div>
                </div>
              )}

              {highlightedData.hasSearch && (
                <div
                  style={{
                    marginTop: '20px',
                    fontFamily: 'monospace'
                  }}
                >
                  <h3
                    style={{
                      color: '#aaa',
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}
                  >
                    {`Connected words (${highlightedData.cooccurrences.length})`}
                  </h3>

                  {highlightedData.cooccurrences.length > 0 ? (
                    <div
                      style={{
                        overflowX: 'auto'
                      }}
                    >
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '13px'
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom: '1px solid #333'
                            }}
                          >
                            <th
                              style={{
                                textAlign: 'left',
                                padding: '8px 12px',
                                color: '#666',
                                fontWeight: 'normal'
                              }}
                            >
                              Connected word
                            </th>

                            {highlightedData.terms.map(term => (
                              <th
                                key={term}
                                style={{
                                  textAlign: 'right',
                                  padding: '8px 12px',
                                  color: '#666',
                                  fontWeight: 'normal'
                                }}
                              >
                                {term}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {highlightedData.cooccurrences.map(item => (
                            <tr
                              key={item.word}
                              style={{
                                borderBottom: '1px solid #1a1a1a',
                                cursor: 'pointer'
                              }}
                              onClick={() =>
                                setSearchTerm(current => {
                                  const existing = current
                                    .split(',')
                                    .map(term => term.trim())
                                    .filter(Boolean);

                                  if (existing.includes(item.word)) {
                                    return current;
                                  }

                                  return [...existing, item.word].join(', ');
                                })
                              }
                            >
                              <td
                                style={{
                                  padding: '8px 12px',
                                  color: '#c8c8c8'
                                }}
                              >
                                {item.word}
                              </td>

                              {item.connections.map(connection => (
                                <td
                                  key={connection.term}
                                  style={{
                                    padding: '8px 12px',
                                    color: '#888',
                                    textAlign: 'right'
                                  }}
                                >
                                  {connection.weight}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ color: '#777' }}>
                      No words connect to all searched terms.
                    </div>
                  )}
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
                  and nodes connected to every searched term
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}