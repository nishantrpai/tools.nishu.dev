// get a list of things people say when they are in different situations
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [situation, setSituation] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const generateList = async () => {
    if (!situation.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/gpt?prompt=List 10 things people say when ${situation}. Make it a bulleted list.`)
      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      setResponse('Error generating list. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Things People Say When</title>
        <meta name="description" content="Get a list of things people say in different situations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Things People Say When
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Enter a situation to get a list of things people might say</span>

        <input
          type="text"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="e.g., they win the lottery"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginBottom: '10px'
          }}
        />

        <button onClick={generateList} className={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate List'}
        </button>

        {response && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, background: '#000', width: '100%', lineHeight: 1.5, marginTop: '20px'}}>
            {response}
          </div>
        )}
      </main>
    </>
  )
}
