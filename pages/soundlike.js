// debug what your message sounds like
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
    let prompt = `What does this message: ${text} sound like? Respond in first person, present tense. Don't prescribe anything, only describe what you feel. Don't try to spin it positively or negatively, just describe it as it is.`
    const res = await fetch(`/api/gpt?prompt=${prompt}`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>What does your message sound like?</title>
        <meta name="description" content="What does your message sound like?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title} style={{ width: '100%', textAlign: 'center'}}>
          What does your message sound like to others?
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
          What does your message sound like to others?
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
            padding: '10px',
            borderRadius: 10,
            outline: 'none',
            fontSize: 16
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 16}}>
            {sensationalizedText}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 20, color: '#777', fontSize: 12 }}>
          If you want to reframe your message, try the <a href="/reframe" style={{ color: '#fff', textDecoration: 'underline'}} target='_blank'> reframe tool</a>
        </div>
      </main>
    </>
  )
}
