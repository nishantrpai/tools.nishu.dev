// Extract terms from a list of sentences using descending n-gram cover
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

// Default stopwords
const defaultStopwords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'her', 'us', 'them', 'it', 'i', 'you', 'he', 'she', 'we', 'they', 'how', 'what', 'when', 'where', 'why', 'which', 'who', 'whom'];
const stopwordSet = new Set(defaultStopwords.map(w => w.toLowerCase()));

/**
 * Preprocess a question: lowercase, remove punctuation, tokenize, remove stopwords
 */
function preprocessQuestion(question, removeStopwords = true) {
    const tokens = question
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
        .split(/\s+/)              // Split on whitespace
        .filter(word => word.length > 0);  // Remove empty strings

    if (removeStopwords) {
        return tokens.filter(word => !stopwordSet.has(word));
    }

    return tokens;
}

/**
 * Extract all n-grams of length n from a token array
 */
function extractNgrams(tokens, n) {
    const ngrams = [];
    for (let i = 0; i <= tokens.length - n; i++) {
        const ngram = tokens.slice(i, i + n).join(' ');
        ngrams.push(ngram);
    }
    return ngrams;
}

/**
 * Check if an n-gram should be filtered out based on content quality
 */
function shouldFilterNgram(ngram, minContentWords = 1, stopwordsRemoved = true) {
    const words = ngram.split(' ');

    // If stopwords were already removed, we mainly check for length and quality
    if (stopwordsRemoved) {
        // Filter out very short words or numbers-only n-grams
        if (words.some(word => word.length < 2)) return true;
        if (words.every(word => /^\d+$/.test(word))) return true;

        // Filter out n-grams with too few meaningful words
        if (words.length < minContentWords) return true;

        return false;
    }

    // Original filtering if stopwords weren't removed
    const contentWords = words.filter(word => !stopwordSet.has(word));

    // Filter out if all words are stopwords
    if (contentWords.length === 0) return true;

    // Filter out if too few content words
    if (contentWords.length < minContentWords) return true;

    // Filter out very common question patterns
    const commonPatterns = [
        /^(how|what|when|where|why|which|who)\s+(do|does|did|is|are|was|were|can|could|should|would)/,
        /^(do|does|did|is|are|was|were|can|could|should|would)\s+(you|i|we|they)/,
        /^(i|you|we|they)\s+(am|is|are|was|were|have|has|had|do|does|did)/
    ];

    return commonPatterns.some(pattern => pattern.test(ngram));
}

/**
 * Main descending n-gram coverage algorithm
 */
function descendingNgramCover(sentences, maxN = 10, minSentenceCount = 2, minContentWords = 1, removeStopwords = true) {
    // Preprocess all sentences - remove stopwords by default for cleaner n-grams
    const processedSentences = sentences.map(s => preprocessQuestion(s, removeStopwords));

    // Track coverage
    const covered = new Set();
    const anchors = [];
    const anchorToCoverage = new Map();

    // Descend from maxN to 2 (skip 1-grams)
    for (let n = Math.max(maxN, 2); n >= 2; n--) {
        if (covered.size === sentences.length) {
            break;
        }

        // Build n-gram candidates from uncovered sentences only
        const ngramMap = new Map();

        for (let i = 0; i < processedSentences.length; i++) {
            if (covered.has(i)) continue; // Skip already covered sentences

            const tokens = processedSentences[i];
            if (tokens.length < n) continue; // Skip if sentence too short

            const ngrams = extractNgrams(tokens, n);

            for (const ngram of ngrams) {
                // Apply filters
                if (shouldFilterNgram(ngram, minContentWords, removeStopwords)) continue;

                if (!ngramMap.has(ngram)) {
                    ngramMap.set(ngram, new Set());
                }
                ngramMap.get(ngram).add(i);
            }
        }

        // Filter by minimum sentence count
        const candidateNgrams = Array.from(ngramMap.entries())
            .filter(([ngram, sentenceSet]) => sentenceSet.size >= minSentenceCount)
            .map(([ngram, sentenceSet]) => ({
                ngram,
                sentenceIndices: Array.from(sentenceSet),
                uncoveredCount: Array.from(sentenceSet).filter(i => !covered.has(i)).length
            }))
            .filter(item => item.uncoveredCount > 0)  // Only consider ngrams that cover uncovered sentences
            .sort((a, b) => b.uncoveredCount - a.uncoveredCount);  // Sort by coverage descending

        // Greedily select the best n-grams at this level
        for (const candidate of candidateNgrams) {
            const uncoveredSentences = candidate.sentenceIndices.filter(i => !covered.has(i));

            if (uncoveredSentences.length === 0) continue;  // No new coverage

            // Add this n-gram as an anchor
            anchors.push({
                ngram: candidate.ngram,
                ngramLength: n,
                sentenceIndices: candidate.sentenceIndices,
                newlyCovered: uncoveredSentences
            });

            anchorToCoverage.set(candidate.ngram, candidate.sentenceIndices);

            // Mark sentences as covered
            uncoveredSentences.forEach(i => covered.add(i));

            // Check if we've covered everything
            if (covered.size === sentences.length) {
                break;
            }
        }

        if (covered.size === sentences.length) break;
    }

    return {
        anchors,
        coverage: anchorToCoverage,
        totalCovered: covered.size,
        totalSentences: sentences.length
    };
}

export default function Home() {
  const [text, setText] = useState('')
  const [summaryJSX, setSummaryJSX] = useState([])
  const [loading, setLoading] = useState(false)
  const [maxN, setMaxN] = useState(3)

  const extractTerms = async () => {
    setLoading(true)
    let questions = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    questions = Array.from(new Set(questions)) // Remove duplicates
    if (questions.length === 0) {
      setSummaryJSX([<p key="no-data" style={{margin: 0}}>No questions provided.</p>])
      setLoading(false)
      return
    }

    const result = descendingNgramCover(questions, maxN, 2, 1, true)

    const summaryElements = []

    summaryElements.push(<p key="header" style={{margin: 0}}>{`N-GRAM COVERAGE ANALYSIS - ${new Date().toLocaleString()}`}</p>)
    summaryElements.push(<p key="line" style={{margin: 0}}>{`${'='.repeat(60)}`}</p>)
    summaryElements.push(<p key="total" style={{margin: 0}}>{`Total Questions: ${result.totalSentences}`}</p>)
    summaryElements.push(<p key="anchors" style={{margin: 0}}>{`Total Anchors: ${result.anchors.length}`}</p>)
    summaryElements.push(<p key="coverage" style={{margin: 0}}>{`Coverage: ${result.totalCovered}/${result.totalSentences} (${((result.totalCovered / result.totalSentences) * 100).toFixed(1)}%)`}</p>)
    summaryElements.push(<p key="uncovered" style={{margin: 0}}>{`Uncovered: ${result.totalSentences - result.totalCovered}`}</p>)
    summaryElements.push(<p key="blank1" style={{margin: 0}}></p>)

    // Group by length
    const byLength = new Map()
    result.anchors.forEach(anchor => {
      if (!byLength.has(anchor.ngramLength)) {
        byLength.set(anchor.ngramLength, [])
      }
      byLength.get(anchor.ngramLength).push(anchor)
    })

    summaryElements.push(<p key="anchors-header" style={{margin: 0}}>ANCHORS BY LENGTH:</p>)
    summaryElements.push(<p key="blank2" style={{margin: 0}}></p>)

    const sortedLengths = Array.from(byLength.keys()).sort((a, b) => b - a)
    sortedLengths.forEach(length => {
      const anchors = byLength.get(length)
      const totalCoveredByLength = anchors.reduce((sum, anchor) => sum + anchor.sentenceIndices.length, 0)
      summaryElements.push(<p key={`length-${length}`} style={{marginTop: 20}}>{`${length}-word (${totalCoveredByLength} questions):`}</p>)
      anchors.forEach((anchor, i) => {
        summaryElements.push(<p key={`anchor-${length}-${i}`} style={{marginTop: 10}}>{`  ${i+1}. "${anchor.ngram}" (${anchor.sentenceIndices.length} questions)`}</p>)
        summaryElements.push(<p key={`blank-anchor-${length}-${i}`} style={{margin: 0}}></p>)
        anchor.sentenceIndices.forEach(idx => {
          const question = questions[idx]
          const parts = question.split(new RegExp(`(${anchor.ngram})`, 'gi'))
          const highlightedParts = parts.map((part, pidx) => 
            part.toLowerCase() === anchor.ngram.toLowerCase() ? 
              <span key={pidx} style={{backgroundColor: '#111', borderRadius: '5px', padding: '2px'}}>{part}</span> : 
              part
          )
          summaryElements.push(<p key={`question-${length}-${i}-${idx}`} style={{margin: 0, fontSize: 10, color: '#444'}}>{`    ${idx}: `}{highlightedParts}</p>)
        })
        summaryElements.push(<p key={`blank-after-${length}-${i}`} style={{margin: 0}}></p>)
      })
      summaryElements.push(<p key={`blank-length-${length}`} style={{margin: 0}}></p>)
    })

    if (result.totalCovered < result.totalSentences) {
      summaryElements.push(<p key="uncovered-header" style={{margin: 0}}>{`UNCOVERED QUESTIONS: (${result.totalSentences - result.totalCovered} questions)`}</p>)
      const covered = new Set()
      result.anchors.forEach(anchor => {
        anchor.sentenceIndices.forEach(i => covered.add(i))
      })
      for (let i = 0; i < questions.length; i++) {
        if (!covered.has(i)) {
          summaryElements.push(<p key={`uncovered-${i}`} style={{margin: 0, fontSize: 10, color: '#333', marginTop: 5}}>{`    ${i}: ${questions[i]}`}</p>)
        }
      }
    }

    setSummaryJSX(summaryElements)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Extract Terms</title>
        <meta name="description" content="Extract common terms from a list of questions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Extract Terms
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Find common phrases in your list of questions</span>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ color: '#777', fontSize: '14px' }}>
            Max n-gram length:
            <input
              type="number"
              value={maxN}
              onChange={(e) => setMaxN(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              style={{
                marginLeft: '5px',
                width: '60px',
                border: '1px solid #333',
                padding: '5px',
                outline: 'none'
              }}
            />
          </label>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your questions, one per line"
          style={{
            width: '100%',
            height: '200px',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            resize: 'vertical'
          }}
        />

        <button onClick={extractTerms} className={styles.button}>
          {loading ? 'Extracting...' : 'Extract Terms'}
        </button>

        {summaryJSX.length > 0 && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, background: '#000', width: '100%', lineHeight: 1.5}}>
            {summaryJSX}
          </div>
        )}
      </main>
    </>
  )
}