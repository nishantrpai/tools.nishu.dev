// extract fear-bearing sentences from transcripts
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [sentences, setSentences] = useState([])
  const [fears, setfears] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')

  // Regex patterns for different fear categories with labels
  const fearPatterns = [
    {
      label: 'Explicit Fear',
      regex: /\b(i|we|he|she|they)\s+(fear|fearful|dread|worry|worry about|am afraid|are afraid|is afraid|feel anxious|feel nervous|panic)\b/i,
      description: 'Direct expression of fear or anxiety'
    },

    {
      label: 'Threat Perception',
      regex: /\b(danger|dangerous|threat|threatening|risk|risky|unsafe|vulnerable|exposed|at stake)\b/i,
      description: 'Perception of danger, threat, or vulnerability'
    },

    {
      label: 'Anticipated Negative Outcome',
      regex: /\b(what if|worst case|worst-case|something will go wrong|something bad will happen|end badly|go badly)\b/i,
      description: 'Anticipation of a feared outcome'
    },

    {
      label: 'Catastrophizing',
      regex: /\b(disaster|disastrous|ruined|destroyed|everything will|my life will|it'll be the end|end of the world|lose everything)\b/i,
      description: 'Exaggerated or catastrophic interpretation of possible outcomes'
    },

    {
      label: 'Avoidance',
      regex: /\b(avoid|avoiding|stay away|keep away|don't want to|won't go|can't face|can't deal with|hesitate|back out)\b/i,
      description: 'Avoidance or withdrawal from a feared situation'
    },

    {
      label: 'Uncertainty / Lack of Control',
      regex: /\b(i|we|he|she|they)\s+(don't know|can't know|have no idea|can't predict|can't control|have no control)\b/i,
      description: 'Fear associated with uncertainty or lack of control'
    },

    {
      label: 'Anticipatory Fear',
      regex: /\b(i'm worried|i'm scared|i'm nervous|i'm anxious|i'm dreading|i'm concerned|i'm afraid)\s+(about|that|of|to)\b/i,
      description: 'Fear arising from an anticipated situation'
    },

    {
      label: 'Loss / Consequence Fear',
      regex: /\b(lose|losing|failure|fail|rejected|rejection|fired|abandoned|betrayed|hurt|embarrassed|humiliated|judged)\b/i,
      description: 'Fear centered on loss, failure, rejection, or social consequences'
    },

    {
      label: 'Social Fear',
      regex: /\b(people will think|they'll think|everyone will think|judge me|make fun of me|look stupid|look foolish|embarrass myself)\b/i,
      description: 'Fear of social judgment or humiliation'
    },

    {
      label: 'Fear Prediction',
      regex: /\b(will|won't|might|could|may)\s+(fail|break|collapse|go wrong|hurt|reject|leave|fire|betray|happen)\b/i,
      description: 'Future prediction involving a feared outcome'
    }
  ];


  const extractfearWithReason = (sentence, index, allSentences) => {
    for (const pattern of fearPatterns) {
      if (pattern.regex.test(sentence)) {
        // Get context: 2 sentences before and after
        const contextBefore = allSentences.slice(Math.max(0, index - 2), index)
        const contextAfter = allSentences.slice(index + 1, Math.min(allSentences.length, index + 3))

        return {
          sentence: sentence.trim(),
          label: pattern.label,
          description: pattern.description,
          contextBefore,
          contextAfter
        }
      }
    }
    return null
  }

  const breakIntoSentences = () => {
    // Split by sentence delimiters (., !, ?)
    const sentenceArray = text
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0)
    setSentences(sentenceArray)

    // Extract fear-bearing sentences with reasons and context
    const extractedfears = sentenceArray
      .map((sentence, index) => extractfearWithReason(sentence, index, sentenceArray))
      .filter(fear => fear !== null)
    setfears(extractedfears)
    setFilterCategory('all')
  }

  const filteredfears = filterCategory === 'all'
    ? fears
    : fears.filter(fear => fear.label === filterCategory)

  const uniqueCategories = [...new Set(fears.map(b => b.label))]

  return (
    <>
      <Head>
        <title>Transcript Breaker</title>
        <meta name="description" content="Break transcripts into sentences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Extract fears
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Break transcripts into sentences and extract fear-bearing statements</span>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your transcript here..."
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            minHeight: '200px',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical',
          }}
        />

        <button onClick={breakIntoSentences} className={styles.button}>
          Extract fears
        </button>

        {sentences.length > 0 && (
          <>

            {fears.length > 0 && (
              <div>
                <h2>fears ({filteredfears.length})</h2>

                <div style={{ marginBottom: '20px' }}>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      backgroundColor: '#222',
                      color: '#ccc',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <ol style={{ lineHeight: 2, paddingLeft: '20px', fontSize: '14px' }}>
                  {filteredfears.map((fear, idx) => (
                    <li key={idx} style={{ marginBottom: '20px', color: '#fff', fontSize: 12 }}>
                      {fear.contextBefore.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontStyle: 'italic', borderLeft: '2px solid #555', paddingLeft: '8px' }}>
                          {fear.contextBefore.map((ctx, i) => (
                            <div key={i}>{ctx.trim()}</div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontWeight: '500', fontSize: 12, backgroundColor: '#2a2a2a', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        {fear.sentence}
                      </div>

                      {fear.contextAfter.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontStyle: 'italic', borderLeft: '2px solid #555', paddingLeft: '8px' }}>
                          {fear.contextAfter.map((ctx, i) => (
                            <div key={i}>{ctx.trim()}</div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px' }}>
                        <span style={{ backgroundColor: '#333', color: '#888', padding: '2px 6px', borderRadius: '3px', fontWeight: '600' }}>
                          {fear.label}
                        </span>
                        <span style={{ marginLeft: '8px', color: '#ccc' }}>— {fear.description}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
