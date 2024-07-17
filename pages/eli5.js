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
    const res = await fetch(`/api/gpt?prompt='text: "${text}"\n\eli5'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>ELI5</title>
        <meta name="description" content="Explain this to me like I'm five" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          ELI5
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Explain this to me like I'm five
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

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Explaining...' : 'Explain'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', lineHeight: 1.5, color: '#fff', fontSize: 20, borderRadius: 10}}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
