// combine two words to get a new word
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [word1, setWord1] = useState('')
  const [word2, setWord2] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)

  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='"List all variations of mixing these two words: ${word1} and ${word2} in fun and minimal way to get a new word."`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Mix</title>
        <meta name="description" content="Mix two words to get a new word" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Mix words
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Mix two words to get a new word
        </span>

        <div style={{
          display: 'flex',
          gap: 10,
          width: '100%',
        }}>

          <input
            type="text"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
            placeholder="Enter word 1"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              borderRadius: 10,
            }}
          />
          <input
            type="text"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
            placeholder="Enter word 2"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              borderRadius: 10
            }}
          />
        </div>

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Mixing...' : 'Mix'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5 }}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
