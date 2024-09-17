// write some details about where you want to be and there'll be a button to imagine it for you in 3rd person
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [imaginedText, setImaginedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const imagine = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='"${text}" imagine this scenario in 3rd person for me for e.g., "You are doing...". Don't use quotes. Keep readability grade as low as possible.'`)
    const data = await res.json()
    setImaginedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Imagine</title>
        <meta name="description" content="Imagine your scenario in 3rd person" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Imagine your scenario
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Write some details about where you want to be and imagine it in 3rd person</span>


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

        <button onClick={imagine} className={styles.button}>
          {loading ? 'Imagining...' : 'Imagine'}
        </button>

        {imaginedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#333', width: '100%', lineHeight: 1.5}}>
            {imaginedText}
          </div>
        )}
      </main>
    </>
  )
}
