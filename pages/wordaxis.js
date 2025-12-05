import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function ExplainLikeIWant() {
  const [text, setText] = useState('')
  const [complexity, setComplexity] = useState(1)
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const complexityTimeoutRef = useRef(null)

  const explain = async (newComplexity) => {
    setLoading(true)
    setExplanation('loading...')
    console.log(`word: "${text}".Give a word that is ${newComplexity}x superlative more that of the given word. More about the idea than actual fact. Negative x would indicate opposite.  Only reply with a list of words.`);
      const res = await fetch('/api/gpt', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `word: "${text}". More about the idea than actual fact. Negative value for e.g., -100x would indicate opposite. Positive value for e.g., 100x would indicate superlative. Only reply with a * list of words. Give a list of words that is value:${newComplexity}x superlative/opposite more that of the given word.`,
          model: 'gpt-4o-mini',
        })
      })
  
    const data = await res.json()
    setExplanation(data.response)
    setLoading(false)
  }


  const handleComplexityChange = (e) => {
    const newComplexity = e.target.value
    setComplexity(newComplexity)
    if (complexityTimeoutRef.current) {
      clearTimeout(complexityTimeoutRef.current)
    }
    complexityTimeoutRef.current = setTimeout(() => {
      explain(newComplexity)
    }, 500)
  }

  return (
    <>
      <Head>
        <title>Word Axis</title>
        <meta name="description" content="Get words based on axis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Word Axis
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Gets words based on axis
        </span>

        <textarea
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          style={{
            width: '100%',
            border: '1px solid #333',
            height: '200px',
            padding: '10px',
            outline: 'none',
            borderRadius: '10px',
            fontSize: '16px',
          }}
        />

        <input
          type="range"
          min="-30"
          max="30"
          step="1"
          value={complexity}
          onChange={handleComplexityChange}
          style={{ width: '100%', margin: '20px 0' }}
        />
        <span>Times: {complexity}</span>

        <button onClick={() => explain(complexity)} className={styles.button}>
          {loading ? 'Getting...' : 'Get'}
        </button>
        {/* add copy button  */}
        <button onClick={() => {
          navigator.clipboard.writeText(explanation);
          alert('Explanation copied to clipboard');
        }}>
          Copy
        </button>

        {explanation && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', lineHeight: 1.5, color: '#fff', fontSize: 20, borderRadius: 10 }}>
            {explanation}
          </div>
        )}
      </main>
    </>
  )
}