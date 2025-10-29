// generate similar search queries
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [similarQueries, setSimilarQueries] = useState('')
  const [loading, setLoading] = useState(false)
  
  const generateSimilar = async () => {
    // make api call to /api/gpt?prompt
    if (!text || text.trim().length === 0) return
    setLoading(true)
    const prompt = `Generate 15 alternative search query phrases for: "${text}". Each phrase should maintain the same intent but use different wording. Return only newline-separated phrases (no punctuation, no full sentences, no questions). Use concise keyword phrases people might type into a search box, e.g. for "is there a shopify app" -> "best shopify app for", "shopify app that", "find shopify app for", "shopify integration for". Do not include numbering or extra explanation or additional jargon.`
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })
    const data = await res.json()
    setSimilarQueries(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Similar Search Queries</title>
        <meta name="description" content="Generate similar search queries for your input" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Similar Search Queries
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Get different ways people might search for the same thing</span>


        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your search query (e.g. is there a shopify app)"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical'
          }}
        />

        <button onClick={generateSimilar} className={styles.button}>
          {loading ? 'Generating...' : 'Generate Similar Queries'}
        </button>

        {similarQueries && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#333', width: '100%', lineHeight: 1.5}}>
            {similarQueries}
          </div>
        )}
      </main>
    </>
  )
}
