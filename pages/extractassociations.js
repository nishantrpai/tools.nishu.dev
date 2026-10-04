import Head from 'next/head';
import { useState, useMemo, useRef, useDeferredValue, useEffect } from 'react';

const GRAPH_WIDTH = 1000;
const GRAPH_HEIGHT = 1000;
const GRAPH_PADDING = 40;
const MIN_NODE_DISTANCE = 34;
const INITIAL_INDEX_SENTENCE_LIMIT = 200;

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
function highlightSearchTerms(sentence, terms) {
  if (!sentence || !terms?.length) return sentence;

  const escapedTerms = terms
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!escapedTerms.length) return sentence;

  const regex = new RegExp(
    `\\b(${escapedTerms.join('|')})\\b`,
    'gi'
  );

  return sentence.split(regex).map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        style={{
          background: '#333',
          color: '#fff',
          padding: '1px 2px',
          borderRadius: '2px'
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function highlightConnectionTerms(sentence, terms) {
  if (!sentence || !terms?.length) return sentence;

  const escapedTerms = terms
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!escapedTerms.length) return sentence;

  const regex = new RegExp(
    `\\b(${escapedTerms.join('|')})\\b`,
    'gi'
  );

  return sentence.split(regex).map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        style={{
          background: '#fff',
          color: '#000',
          padding: '1px 2px',
          borderRadius: '2px'
        }}
      >
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}


export default function Home() {
  const [text, setText] = useState(`The cat sat on the mat.

The cat ate the fish.

The cat sat on the rug.`);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [customStopwords, setCustomStopwords] = useState('');

  const [result, setResult] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [animationTarget, setAnimationTarget] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [contextResults, setContextResults] = useState([]);
  const [selectedContext, setSelectedContext] = useState(null);
  const [highlightedContext, setHighlightedContext] = useState(null);
  const [visualMode, setVisualMode] = useState(true)
  const [showEdges, setShowEdges] = useState(true)
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const [minWeight, setMinWeight] = useState(1);


  const [fullNodes, setFullNodes] = useState([]);

  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [copied, setCopied] = useState(false);

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const pdfInputRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const [highlightTop10, setHighlightTop10] = useState(false);

  async function handlePdfUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setIsExtractingPdf(true);
    setPdfError('');

    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF text extraction is unavailable. Please reload the page and try again.');
      }

      const pdf = await window.pdfjsLib.getDocument({
        data: await file.arrayBuffer()
      }).promise;
      let extractedText = '';

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        const items = content.items;
        let pageText = '';

        for (let i = 0; i < items.length; i++) {
          const current = items[i];

          if (!current.str) continue;

          if (i === 0) {
            pageText = current.str;
            continue;
          }

          const previous = items[i - 1];

          const previousX = previous.transform[4];
          const previousY = previous.transform[5];
          const currentX = current.transform[4];
          const currentY = current.transform[5];

          if (Math.abs(currentY - previousY) > 2) {
            pageText += '\n';
          } else {
            const gap =
              currentX - (previousX + previous.width);

            if (
              gap > 1 &&
              !pageText.endsWith(' ') &&
              !current.str.startsWith(' ')
            ) {
              pageText += ' ';
            }
          }

          pageText += current.str;
        }

        extractedText += pageText.trim() + '\n';
      }

      setText(extractedText.replace(/\s+/g, ' '));
    } catch (error) {
      console.error('Failed to extract text from PDF:', error);
      setPdfError(error.message || 'Could not extract text from this PDF.');
    } finally {
      setIsExtractingPdf(false);
    }
  }

  // ------------------------------------------------------------
  // BUILD ASSOCIATION NETWORK
  // ------------------------------------------------------------

  let stopwords = [];
  const connectedstopwords = [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "if",
    "then",
    "so",
    "because",
    "of",
    "to",
    "in",
    "on",
    "at",
    "for",
    "from",
    "with",
    "by",
    "about",
    "as",
    "into",
    "through",
    "during",
    "before",
    "after",
    "between",
    "is",
    "am",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "i",
    "me",
    "my",
    "mine",
    "myself",
    "you",
    "your",
    "yours",
    "yourself",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "we",
    "us",
    "our",
    "ours",
    "ourselves",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "this",
    "that",
    "these",
    "those"
  ]
  stopwords = connectedstopwords
  
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
        termSet: new Set(),
        connectionWeightMap: new Map(),
        cooccurrences: [],
        maxConnWeight: 1,
        level1Set: new Set(),
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
        termSet: new Set(),
        connectionWeightMap: new Map(),
        cooccurrences: [],
        maxConnWeight: 1,
        level1Set: new Set(),
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
        termSet: new Set(),
        connectionWeightMap: new Map(),
        cooccurrences: [],
        maxConnWeight: 1,
        level1Set: new Set(),
        occurrence: 0,
        hasSearch: true
      };
    }

    const level1Set = new Set(
      [...connectionWeightMap.entries()]
        .filter(([, connections]) =>
          connections.size === matchingTerms.size
        )
        .map(([word]) => word)
    );

    const cooccurrences = [...level1Set]
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
      ...level1Set
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

    const visibleEdges = cooccurrences.flatMap(item =>
      item.connections.map(({ term, weight }) => ({
        source: term,
        target: item.word,
        weight,
        strength: weight,
        type: 'sentence'
      }))
    );

    return {
      nodes: visibleNodes,
      edges: visibleEdges,
      terms: uniqueTerms,
      termSet: matchingTerms,
      connectionWeightMap,
      cooccurrences,
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

  const tableCooccurrences = highlightedData.cooccurrences.filter(
    ({ word }) => !connectedstopwords.includes(word)
  );

  useEffect(() => {
    setAnimationTarget(null);
    setShowContext(false);
    setContextResults([]);
    setSelectedContext(null);
    setHighlightedContext(null);

    return () => {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    };
  }, [deferredSearchTerm]);

  const stopExploreAnimation = () => {
    clearInterval(animationIntervalRef.current);
    animationIntervalRef.current = null;
    setAnimationTarget(null);
  };

  const animateAssociations = () => {
    if (!highlightedData.hasSearch) return;

    if (animationIntervalRef.current !== null) {
      stopExploreAnimation();
      return;
    }

    const sequence = [
      ...highlightedData.terms.map(term => ({
        type: 'term',
        term
      })),
      ...[...highlightedData.level1Set].map(word => ({
        type: 'word',
        word
      }))
    ];

    if (sequence.length === 0) return;

    clearInterval(animationIntervalRef.current);
    let index = 0;
    setAnimationTarget(sequence[index]);

    animationIntervalRef.current = setInterval(() => {
      index++;

      if (index >= sequence.length) {
        stopExploreAnimation();
        return;
      }

      setAnimationTarget(sequence[index]);
    }, 250);
  };

  const exploreContext = () => {
    if (!result || !highlightedData.hasSearch) return;

    const terms = highlightedData.terms;
    const commonWords = [...highlightedData.level1Set];
    const evidence = [];

    result.sentences.forEach((sentence, index) => {
      const words =
        index < result.indexedSentenceCount
          ? result.indexedSentenceWords[index]
          : tokenizeSentence(sentence, result.stopwordSet);
      const sentenceWordSet = new Set(words);
      const matchedTerms = terms.filter(term =>
        sentenceWordSet.has(term)
      );

      if (matchedTerms.length === 0) return;

      const connections = matchedTerms
        .map(term => ({
          term,
          words: commonWords.filter(word =>
            sentenceWordSet.has(word) &&
            highlightedData.connectionWeightMap.get(word)?.has(term)
          )
        }))
        .filter(connection => connection.words.length > 0);

      if (connections.length === 0) return;

      evidence.push({
        index,
        matchedTerms,
        connections
      });
    });

    const contexts = [];

    evidence.forEach(item => {
      const start = Math.max(0, item.index - 1);
      const end = Math.min(result.sentences.length - 1, item.index + 1);
      const previousContext = contexts[contexts.length - 1];

      if (previousContext && start <= previousContext.end) {
        previousContext.end = Math.max(previousContext.end, end);
        previousContext.evidence.push(item);
      } else {
        contexts.push({
          start,
          end,
          evidence: [item]
        });
      }
    });

    setContextResults(contexts);
    setSelectedContext(null);
    setHighlightedContext(null);
    setShowContext(true);
  };

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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js"></script>
      </Head>


      <main
        style={{
          padding: '20px',
          background: '#000',
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

          <div style={{ marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              disabled={isExtractingPdf}
            >
              {isExtractingPdf ? 'Extracting PDF...' : 'Upload PDF'}
            </button>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              style={{ display: 'none' }}
            />
            {pdfError && (
              <span role="alert" style={{ color: '#ff6b6b', marginLeft: '10px' }}>
                {pdfError}
              </span>
            )}
          </div>

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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px' }}>
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
                <div style={{display: 'flex', gap: 10, alignItems: 'baseline'}}>

                <button
                  type="button"
                  onClick={animateAssociations}
                  disabled={!highlightedData.hasSearch}
                >
                  {animationIntervalRef.current !== null ? 'Stop' : 'Explore'}
                </button>
                <button
                  type="button"
                  onClick={exploreContext}
                  style={{ marginBottom: '12px' }}
                >
                  Context
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHighlightedContext(null);
                    setSelectedContext(null);
                  }}
                  disabled={!highlightedContext}
                >
                  Clear Highlights
                </button>
                  </div>
              </div>
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

              <div className={`graphContextLayout${showContext ? ' withContext' : ''}`}>
                <div className="graphPane">
              {visualMode && <div
                style={{
                  width: '100%',
                  height: '82vh',
                  position: 'relative',
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

                          const isAnimationEdge =
                            animationTarget?.type === 'term'
                              ? edge.source === animationTarget.term ||
                              edge.target === animationTarget.term
                              : animationTarget?.type === 'word'
                                ? edge.source === animationTarget.word ||
                                edge.target === animationTarget.word
                                : false;

                          const strokeOpacity =
                            animationTarget
                              ? isAnimationEdge ? 0.9 : 0.03
                              : !highlightedData.hasSearch
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
                            animationTarget
                              ? isAnimationEdge ? 1.5 : 0.2
                              : !highlightedData.hasSearch
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

                        const isAnimatingNode =
                          animationTarget?.type === 'term'
                            ? node.id === animationTarget.term
                            : animationTarget?.type === 'word'
                              ? node.id === animationTarget.word
                              : false;

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
                          animationTarget
                            ? isAnimatingNode ? 1 : 0.25
                            : !highlightedData.hasSearch
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
                          isAnimatingNode
                            ? '#fff'
                            : isTop10
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
                                isAnimatingNode
                                  ? '18'
                                  : isCenter
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
                {animationTarget && (
                  <div
                    aria-live="polite"
                    style={{
                      position: 'absolute',
                      right: '24px',
                      top: '24px',
                      maxWidth: 'calc(100% - 48px)',
                      overflow: 'hidden',
                      color: '#fff',
                      fontSize: 'clamp(36px, 8vw, 96px)',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      lineHeight: 1,
                      textAlign: 'right',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textShadow: '0 2px 16px #000, 0 0 8px #000',
                      pointerEvents: 'none'
                    }}
                  >
                    {animationTarget.type === 'term'
                      ? animationTarget.term
                      : animationTarget.word}
                  </div>
                )}
              </div>}
                </div>

              {showContext && (
                <div
                  className="contextPane"
                  style={{
                    fontFamily: 'monospace'
                  }}
                >
                  <h3
                    style={{
                      color: '#aaa',
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}
                  >
                    Context for{' '}
                    <strong style={{ color: '#fff' }}>
                      {highlightedData.terms.join(', ')}
                    </strong>
                  </h3>

                  {contextResults.length > 0 ? (
                    contextResults.map(context => (
                      <div
                        key={context.start}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          stopExploreAnimation();
                          setSelectedContext(context);
                          const terms = context.evidence.flatMap(evidence =>
                            evidence.connections.flatMap(connection => [
                              connection.term,
                              ...connection.words
                            ])
                          );
                          setHighlightedContext({
                            contextStart: context.start,
                            terms: [...new Set(terms)]
                          });
                        }}
                        onKeyDown={event => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            stopExploreAnimation();
                            setSelectedContext(context);
                            const terms = context.evidence.flatMap(evidence =>
                              evidence.connections.flatMap(connection => [
                                connection.term,
                                ...connection.words
                              ])
                            );
                            setHighlightedContext({
                              contextStart: context.start,
                              terms: [...new Set(terms)]
                            });
                          }
                        }}
                        style={{
                          marginBottom: '12px',
                          padding: '12px',
                          border: selectedContext?.start === context.start
                            ? '1px solid #666'
                            : '1px solid #222',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {Array.from(
                          { length: context.end - context.start + 1 },
                          (_, offset) => context.start + offset
                        ).map(sentenceIndex => {
                          const sentenceEvidence = context.evidence.find(
                            item => item.index === sentenceIndex
                          );

                          return (
                            <div
                              key={sentenceIndex}
                              style={{
                                color: sentenceEvidence ? '#888' : '#555',
                                marginBottom: '6px',
                                lineHeight: 1.6
                              }}
                            >
                              {highlightedContext?.contextStart === context.start
                                ? highlightConnectionTerms(
                                    result.sentences[sentenceIndex],
                                    highlightedContext.terms
                                  )
                                : highlightSearchTerms(
                                    result.sentences[sentenceIndex],
                                    highlightedData.terms
                                  )}
                              {sentenceEvidence && (
                                <div
                                  style={{
                                    color: '#777',
                                    marginTop: '4px',
                                    fontSize: '12px'
                                  }}
                                >
                                  {sentenceEvidence.connections.map(connection => (
                                    <div key={connection.term}>
                                      Supports {connection.term} → {connection.words.join(', ')}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#777' }}>
                      No sentences directly support the connections between these search terms and common words.
                    </div>
                  )}

                  {selectedContext && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#111',
                        border: '1px solid #333',
                        borderRadius: '4px'
                      }}
                    >
                      <div
                        style={{
                          color: '#aaa',
                          fontSize: '13px',
                          marginBottom: '8px'
                        }}
                      >
                        Connections in selected context
                      </div>
                      {selectedContext.evidence.map(evidence => (
                        <div
                          key={evidence.index}
                          style={{
                            marginTop: '8px',
                            color: '#ddd'
                          }}
                        >
                          <div style={{ color: '#777', marginBottom: '4px' }}>
                            {highlightSearchTerms(
                              result.sentences[evidence.index],
                              highlightedData.terms
                            )}
                          </div>
                          {evidence.connections.map(connection => (
                            <div key={connection.term}>
                              <strong style={{ color: '#fff' }}>
                                {connection.term}
                              </strong>
                              {' → '}
                              {connection.words.join(', ')}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
                <style jsx>{`
                  .graphContextLayout {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    width: 100%;
                  }

                  .graphPane {
                    flex: 1 1 100%;
                    min-width: 0;
                  }

                  .withContext .graphPane {
                    flex: 7 1 0;
                  }

                  .contextPane {
                    flex: 3 1 0;
                    min-width: 0;
                    max-height: 82vh;
                    overflow-y: auto;
                  }

                  @media (max-width: 768px) {
                    .graphContextLayout {
                      flex-direction: column;
                    }

                    .graphPane,
                    .withContext .graphPane,
                    .contextPane {
                      width: 100%;
                      flex: 1 1 auto;
                    }

                    .contextPane {
                      max-height: none;
                    }
                  }
                `}</style>
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
                    {`Connected words (${tableCooccurrences.length})`}
                  </h3>

                  {tableCooccurrences.length > 0 ? (
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
                          {tableCooccurrences.map(item => (
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