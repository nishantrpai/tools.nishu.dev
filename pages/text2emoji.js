// convert text to emoji
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
    const res = await fetch(`/api/gpt`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: `"${text}" list different variations to convey this text as combinations of emojis. only provide the numbered list no prefix text or suffix text.'`,
        model: 'gpt-3.5-turbo'
      })
    })
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Text 2 Emoji</title>
        <meta name="description" content="Convert text to emoji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text 2 Emoji
        </h1>
        <span className={styles.description}>
          Convert your text to emoji
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          style={{
            width: '100%',
            border: '1px solid #333',
            background: '#000',
            borderRadius: 10,
            color: '#fff',
            padding: '10px',
            outline: 'none',
            fontSize: 20
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Compressing...' : 'Compress'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, fontSize: 50, background: '#000', width: '100%', lineHeight: 1.5}}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
