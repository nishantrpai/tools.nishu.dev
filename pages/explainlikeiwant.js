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
    const res = await fetch(`/api/gpt?prompt='text: "${text}"\n\explain in ${newComplexity} sentence structures with more nuance as complexity increases'`)
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
        <title>Explain Like I Want To</title>
        <meta name="description" content="Explain this to me in a way that suits my complexity level" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Explain Like I Want To
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Explain this to me in a way that suits my complexity level
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
          min="1"
          max="30"
          step="1"
          value={complexity}
          onChange={handleComplexityChange}
          style={{ width: '100%', margin: '20px 0' }}
        />
        <span>Complexity: {complexity}</span>

        <button onClick={() => explain(complexity)} className={styles.button}>
          {loading ? 'Explaining...' : 'Explain'}
        </button>

        {explanation && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', lineHeight: 1.5, color: '#fff', fontSize: 20, borderRadius: 10}}>
            {explanation}
          </div>
        )}
      </main>
    </>
  )
}