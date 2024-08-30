import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [excuse, setExcuse] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  
  const unexcuse = async () => {
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='"${excuse}" Respond with "BULLSHIT." followed by 10 numbered, concise, and specific action items to overcome this excuse. Each item should start with "DO" and be no longer than 6 words. List each on a new line.'`)
    const data = await res.json()
    setResponse(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Unexcuse</title>
        <meta name="description" content="Turn your excuses into action" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Unexcuse Yourself
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Turn your excuses into action</span>

        <input
          type="text"
          value={excuse}
          onChange={(e) => setExcuse(e.target.value)}
          placeholder="Enter your excuse"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={unexcuse} className={styles.button}>
          {loading ? 'Processing...' : 'Unexcuse'}
        </button>

        {response && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, fontSize: 20,  background: '#000', width: '100%', lineHeight: 1.5}}>
            {response}
          </div>
        )}
      </main>
    </>
  )
}
