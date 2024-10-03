import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function ExplainLikeIWant() {
  const [text, setText] = useState('')
  const [age, setAge] = useState(1)
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const ageTimeoutRef = useRef(null)
  
  const explain = async (newAge) => {
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='text: "${text}"\n\explain like i want to a ${newAge} year old with context and understanding of their age'`)
    const data = await res.json()
    setExplanation(data.response)
    setLoading(false)
  }


  const handleAgeChange = (e) => {
    const newAge = e.target.value
    setAge(newAge)
    if (ageTimeoutRef.current) {
      clearTimeout(ageTimeoutRef.current)
    }
    ageTimeoutRef.current = setTimeout(() => {
      explain(newAge)
    }, 500)
  }

  return (
    <>
      <Head>
        <title>Explain Like I Want To</title>
        <meta name="description" content="Explain this to me in a way that suits my age" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Explain Like I Want To
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Explain this to me in a way that suits my age
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
          value={age}
          onChange={handleAgeChange}
          style={{ width: '100%', margin: '20px 0' }}
        />
        <span>Age: {age}</span>

        <button onClick={() => explain(age)} className={styles.button}>
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