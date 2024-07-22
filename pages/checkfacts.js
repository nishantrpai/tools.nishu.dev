// input the year of high school graduation and check what facts are outdated or need to be updated since
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('2010')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='"${text}" list facts and concepts that are outdated or need to be updated since this year that I should know about, that were taught in high school. Limit information to what I learnt in school. Keep readability grade as low as possible. For e.g., "Before 2010, the world was flat and now it is round." List all such facts that are outdated or need to be updated since the year mentioned. Only things that have changed since graduating.'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Check Facts</title>
        <meta name="description" content="Check facts that are outdated or need to be updated since your high school graduation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Check Facts
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Input the year of high school graduation and check what facts are outdated
        </span>


        <input
          type="number"
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
          {loading ? 'Checking...' : 'Check'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', lineHeight: 1.5, borderRadius: 10, fontSize: 16}}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
