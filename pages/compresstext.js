// compress text to be very precise and concise, regardless of accuracy
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
    const res = await fetch(`/api/gpt?prompt='"${text}" list variations of this that are precise and concise, less wordy. Don't use quotes. Keep readability grade as low as possible.'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Compress Text</title>
        <meta name="description" content="Compress your text to be precise and concise" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Compress your text
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Make your text precise and concise</span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Compressing...' : 'Compress'}
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
