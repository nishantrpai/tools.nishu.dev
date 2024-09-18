import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function SecondThirdOrderEffects() {
  const [event, setEvent] = useState('')
  const [effects, setEffects] = useState('')
  const [loading, setLoading] = useState(false)
  
  const generateEffects = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Given that "${event}" becomes true, list the potential 2nd and 3rd order effects. Be specific and detailed, no point in vague. Format the response as a numbered list, separating 2nd and 3rd order effects.`,
        model: 'gpt-3.5-turbo'
      })
    })
    const data = await res.json()
    setEffects(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>2nd/3rd Order Effects</title>
        <meta name="description" content="Explore 2nd and 3rd order effects of an event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          2nd/3rd Order Effects
        </h1>
        <p className={styles.description}>
          Enter an event and explore its potential 2nd and 3rd order effects
        </p>

        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="Enter an event"
          className={styles.input}
        />

        <button onClick={generateEffects} className={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Effects'}
        </button>

        {effects && (
          <div style={{
            maxWidth: 500,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'monospace',
            textAlign: 'left',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: 10,
            background: '#000',
            width: '100%',
            lineHeight: 1.5,
            overflowY: 'auto'
          }}>
            <h2>Potential Effects:</h2>
            {effects}
          </div>
        )}
      </main>
    </>
  )
}
