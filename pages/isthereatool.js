// search for tools that do what you need
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='List all tools "${text}". Give bullet list, prefer online tools. If online tools also provide links.'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Is there a tool that</title>
        <meta name="description" content="Search for tools that do what you need" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Is there a tool that
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Search for tools that do what you need
        </span>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I need a tool that..."
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Searching...' : 'Search'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#333', width: '100%', lineHeight: 1.5}}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
