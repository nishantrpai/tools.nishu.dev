import Head from 'next/head';
import { useState, useMemo, useRef } from 'react';

const GRAPH_WIDTH = 1000;
const GRAPH_HEIGHT = 1000;
const GRAPH_PADDING = 40;
const MIN_NODE_DISTANCE = 34;

function softmax(values) {
  if (!values.length) return [];

  const max = Math.max(...values);
  const exps = values.map(v => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);

  return exps.map(v => v / sum);
}
function isAbbrev(s, abbrev){
	/*Checks if string s is an abbreviation (With periods)*/
	var single_abbrv = abbrev || ["a.m","p.m","etc","vol","inc","jr","dr","tex","co","prof","rev","revd","hon","v.s","ie",
		"eg","et al","st","ph.d","capt","mr","mrs","ms"];
	/*Follows the simple abbreviation patterns*/
	if(single_abbrv.includes(s.toLowerCase()) || single_abbrv.includes(s.toLowerCase().substring(0,s.length-1))){
		return true;
	}
	
	/*Possibly an abbreviation like U.S. or D.C, check if it contains periods with less than 2 letters between each period*/
	if( s.endsWith(".") )
		s = s.substring(0,s.length-1);
	s = s.split(".");
	return s.length > 1 && s.filter(function(x){return x.length <= 2;}).length > 0;
}

function extractsentences(body_text, abbrev, divider){
	var sentences = [];
	var start = 0;
	divider = divider || [".","?","!"];
	
	for(var i=0;i<body_text.length;i++){
		/*Check if it's an end of a sentence*/
		var temp = body_text.slice(start,Math.min(body_text.length-1,i+1)).split(" "); 

		if( 
			divider.includes(body_text[i]) &&    /*Check for end of sentence punctuation*/
			/*Check for spaces/special chars that make sure it's the end of an sentence*/
			( body_text[i+1] == " " || body_text[i+1] == '"' || i >= body_text.length - 1 || body_text[i+1] == "[" ) &&
			/*Check that it's really the end and not an abbreviation*/
			!isAbbrev( temp[temp.length-1], abbrev ) 
		){
			sentences.push( body_text.slice(start,Math.min(body_text.length,i+1)) );
			start = i+1;
		}
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
  const [text, setText] = useState('');
  const [customStopwords, setCustomStopwords] = useState('');

  const [result, setResult] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [minWeight, setMinWeight] = useState(1);

  const [fullNodes, setFullNodes] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [copied, setCopied] = useState(false);

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

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

    // ----------------------------------------------------------
    // 1. Split text into sentences
    // ----------------------------------------------------------

    const sentences = extractsentences(text)

    // ----------------------------------------------------------
    // 2. Tokenize each sentence
    //
    // Each sentence becomes a collection of words.
    //
    // IMPORTANT:
    // A word appearing multiple times inside one sentence
    // only participates once for that sentence.
    // ----------------------------------------------------------

    // Count every occurrence of every word in the original text.
    // This is separate from sentence-level associations, which only
    // count a word once per sentence.
    const wordFrequency = new Map();

    const sentenceWords = sentences.map(sentence => {
      const words = tokenizeSentence(
        sentence,
        stopwordSet
      );

      for (const word of words) {
        wordFrequency.set(
          word,
          (wordFrequency.get(word) || 0) + 1
        );
      }

      return [...new Set(words)];
    });

    // ----------------------------------------------------------
    // 3. Build association grid
    //
    // Every pair of words appearing in the SAME SENTENCE
    // gets +1.
    //
    // Example:
    //
    // "cat sat mat"
    //
    // cat -> sat = 1
    // cat -> mat = 1
    // sat -> cat = 1
    // sat -> mat = 1
    // mat -> cat = 1
    // mat -> sat = 1
    // ----------------------------------------------------------

    const associationGrid = new Map();

    const ensureWord = word => {
      if (!associationGrid.has(word)) {
        associationGrid.set(word, new Map());
      }
    };

    for (const words of sentenceWords) {
      for (const wordA of words) {
        ensureWord(wordA);

        for (const wordB of words) {
          if (wordA === wordB) continue;

          ensureWord(wordB);

          const row = associationGrid.get(wordA);

          row.set(
            wordB,
            (row.get(wordB) || 0) + 1
          );
        }
      }
    }

    // ----------------------------------------------------------
    // 4. Convert association grid into graph edges
    //
    // Raw count:
    //
    //   weight = number of sentences containing both words
    //
    // Softmax:
    //
    //   strength = P(target | source)
    //
    // ----------------------------------------------------------

    const edgeMap = new Map();

    for (const [source, connections] of associationGrid) {
      const targets = Array.from(
        connections.keys()
      );

      if (!targets.length) continue;

      const counts = targets.map(
        target => connections.get(target)
      );

      const probabilities = softmax(counts);

      const probabilityMap = new Map(
        targets.map((target, index) => [
          target,
          probabilities[index]
        ])
      );

      for (const [target, weight] of connections) {
        const key = [source, target]
          .sort()
          .join('||');

        // The grid is symmetric, so only one visual
        // edge is needed.
        if (!edgeMap.has(key)) {
          edgeMap.set(key, {
            source,
            target,

            // Raw association count
            weight,

            // P(target | source)
            strength:
              probabilityMap.get(target) || 0,

            type: 'sentence'
          });
        }
      }
    }

    const edges = Array.from(
      edgeMap.values()
    );

    // ----------------------------------------------------------
    // 5. Create nodes
    // ----------------------------------------------------------

    const nodesList = Array.from(
      new Set(
        edges.flatMap(edge => [
          edge.source,
          edge.target
        ])
      )
    );

    const simNodes = nodesList.map(id => ({
      id,

      x:
        Math.random() *
          (GRAPH_WIDTH - GRAPH_PADDING * 2) +
        GRAPH_PADDING,

      y:
        Math.random() *
          (GRAPH_HEIGHT - GRAPH_PADDING * 2) +
        GRAPH_PADDING,

      vx: 0,
      vy: 0
    }));

    const nodeById = new Map(
      simNodes.map(node => [
        node.id,
        node
      ])
    );

    // ----------------------------------------------------------
    // 6. Force simulation
    // ----------------------------------------------------------

    for (let iteration = 0; iteration < 200; iteration++) {
      const alpha = Math.max(
        0.008,
        1 - iteration / 140
      );

      // --------------------------------------------------------
      // Repulsion
      // --------------------------------------------------------

      for (
        let i = 0;
        i < simNodes.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < simNodes.length;
          j++
        ) {
          const a = simNodes[i];
          const b = simNodes[j];

          const dx = b.x - a.x || 0.1;
          const dy = b.y - a.y || 0.1;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          const force =
            (7600 / (distance * distance)) *
            alpha;

          a.vx -=
            (dx / distance) * force;

          a.vy -=
            (dy / distance) * force;

          b.vx +=
            (dx / distance) * force;

          b.vy +=
            (dy / distance) * force;
        }
      }

      // --------------------------------------------------------
      // Edge attraction
      //
      // Stronger softmax association =
      // stronger attraction.
      // --------------------------------------------------------

      for (const edge of edges) {
        const a = nodeById.get(edge.source);
        const b = nodeById.get(edge.target);

        if (!a || !b) continue;

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const distance =
          Math.sqrt(dx * dx + dy * dy) || 1;

        const strength = Math.max(
          0.05,
          edge.strength || 0
        );

        const targetDistance =
          175 - strength * 75;

        const force =
          (distance - targetDistance) *
          (0.035 + strength * 0.035) *
          alpha;

        a.vx +=
          (dx / distance) * force;

        a.vy +=
          (dy / distance) * force;

        b.vx -=
          (dx / distance) * force;

        b.vy -=
          (dy / distance) * force;
      }

      // --------------------------------------------------------
      // Center pull
      // --------------------------------------------------------

      for (const node of simNodes) {
        node.vx +=
          (GRAPH_WIDTH / 2 - node.x) *
          0.0035 *
          alpha;

        node.vy +=
          (GRAPH_HEIGHT / 2 - node.y) *
          0.0035 *
          alpha;
      }

      // --------------------------------------------------------
      // Update positions
      // --------------------------------------------------------

      for (const node of simNodes) {
        node.vx *= 0.8;
        node.vy *= 0.8;

        node.x = Math.max(
          GRAPH_PADDING / 2,
          Math.min(
            GRAPH_WIDTH - GRAPH_PADDING / 2,
            node.x + node.vx
          )
        );

        node.y = Math.max(
          GRAPH_PADDING / 2,
          Math.min(
            GRAPH_HEIGHT - GRAPH_PADDING / 2,
            node.y + node.vy
          )
        );
      }
    }

    // ----------------------------------------------------------
    // 7. Normalize positions
    // ----------------------------------------------------------

    if (simNodes.length > 1) {
      const xs = simNodes.map(
        node => node.x
      );

      const ys = simNodes.map(
        node => node.y
      );

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);

      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const spanX = Math.max(
        1,
        maxX - minX
      );

      const spanY = Math.max(
        1,
        maxY - minY
      );

      const targetWidth =
        GRAPH_WIDTH -
        GRAPH_PADDING * 2;

      const targetHeight =
        GRAPH_HEIGHT -
        GRAPH_PADDING * 2;

      for (const node of simNodes) {
        node.x =
          GRAPH_PADDING +
          ((node.x - minX) / spanX) *
            targetWidth;

        node.y =
          GRAPH_PADDING +
          ((node.y - minY) / spanY) *
            targetHeight;
      }

      // --------------------------------------------------------
      // High-degree nodes closer to center
      // --------------------------------------------------------

      const degreeMap = new Map(
        simNodes.map(node => [
          node.id,
          0
        ])
      );

      for (const edge of edges) {
        degreeMap.set(
          edge.source,
          (degreeMap.get(edge.source) || 0) + 1
        );

        degreeMap.set(
          edge.target,
          (degreeMap.get(edge.target) || 0) + 1
        );
      }

      const degrees =
        Array.from(
          degreeMap.values()
        );

      const maxDegree =
        Math.max(...degrees);

      const minDegree =
        Math.min(...degrees);

      const centerX =
        GRAPH_WIDTH / 2;

      const centerY =
        GRAPH_HEIGHT / 2;

      const maxRadius =
        Math.min(
          GRAPH_WIDTH,
          GRAPH_HEIGHT
        ) / 2 -
        GRAPH_PADDING;

      for (const node of simNodes) {
        const degree =
          degreeMap.get(node.id) || 0;

        const normalizedDegree =
          maxDegree > minDegree
            ? (degree - minDegree) /
              (maxDegree - minDegree)
            : 0.5;

        const radius =
          maxRadius *
          (1 - normalizedDegree * 0.85);

        const angle =
          Math.atan2(
            node.y - centerY,
            node.x - centerX
          );

        node.x = Math.max(
          GRAPH_PADDING,
          Math.min(
            GRAPH_WIDTH - GRAPH_PADDING,
            centerX +
              Math.cos(angle) * radius
          )
        );

        node.y = Math.max(
          GRAPH_PADDING,
          Math.min(
            GRAPH_HEIGHT - GRAPH_PADDING,
            centerY +
              Math.sin(angle) * radius
          )
        );
      }

      separateOverlappingNodes(
        simNodes,
        MIN_NODE_DISTANCE
      );
    }

    // ----------------------------------------------------------
    // 8. Store result
    // ----------------------------------------------------------

    setFullNodes(simNodes);

    setResult({
      nodes: simNodes,
      edges,
      associationGrid,
      wordFrequency
    });

    setSearchTerm('');
    setZoom(1);
    setPan({
      x: 0,
      y: 0
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
      Math.max(
        ...Array.from(
          connectionWeightMap.values()
        ),
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
    searchTerm,
    fullNodes
  ]);

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
              style={{
                padding: '8px 14px',
                background: '#fff',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Build Network
            </button>

            {result && (
              <button
                onClick={copyAssociations}
                style={{
                  padding: '8px 14px',
                  background: '#222',
                  color: '#fff',
                  border: '1px solid #444',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                {copied
                  ? 'copied!'
                  : 'copy associations'}
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
                  style={{
                    padding:
                      '6px 14px',
                    background:
                      '#222',
                    border:
                      '1px solid #444',
                    color: '#fff',
                    cursor:
                      'pointer',
                    fontFamily:
                      'monospace',
                    fontSize:
                      '16px'
                  }}
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
                  style={{
                    padding:
                      '6px 14px',
                    background:
                      '#222',
                    border:
                      '1px solid #444',
                    color: '#fff',
                    cursor:
                      'pointer',
                    fontFamily:
                      'monospace',
                    fontSize:
                      '16px'
                  }}
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
                  style={{
                    padding:
                      '6px 14px',
                    background:
                      '#222',
                    border:
                      '1px solid #444',
                    color: '#aaa',
                    cursor:
                      'pointer',
                    fontFamily:
                      'monospace',
                    fontSize:
                      '13px'
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
                        Math.max(
                          ...visibleEdges.map(
                            edge =>
                              edge.weight
                          ),
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

                              <text
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
                                fill="#666"
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
                              </text>
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

                      const connRatio =
                        isConnected
                          ? connWeight /
                            highlightedData.maxConnWeight
                          : 0;

                      const radius =
                        isCenter
                          ? 22
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
                        !highlightedData.hasSearch
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
                            stroke="transparent"
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
                                : isConnected
                                  ? '11'
                                  : '9.5'
                            }
                            fontFamily="monospace"
                            fontWeight={
                              isCenter ||
                              isConnected
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