import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [replacedText, setReplacedText] = useState('')
  const [replacement, setReplacement] = useState(',')
  const [loading, setLoading] = useState(false)

  const replaceEmDash = async () => {
    setLoading(true)
    const prompt = `"${text}" replace em dashes (—) with "${replacement}". Just return the final text without explanations.`
    const res = await fetch(`/api/gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setReplacedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Clean GPT Text | Em Dash Remover</title>
        <meta name="description" content="Clean up AI-generated text by removing those pesky em dashes that GPT loves to add" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Clean GPT Text
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Remove those pesky em dashes (—) that GPT keeps adding to every response. Make your AI-generated text look more natural.
        </span>

        <textarea
          rows={5}
          cols={50}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text with em dashes (—)"
        />

        <button onClick={replaceEmDash} className={styles.button}>
          {loading ? 'Replacing...' : 'Replace'}
        </button>

        {replacedText && (
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace', 
            textAlign: 'left', 
            padding: '10px', 
            border: '1px solid #333', 
            borderRadius: '5px',
            background: '#000', 
            width: '100%', 
            height: 'max-content',
            lineHeight: 1.5,
            marginTop: '20px'
          }}>
            {replacedText}
          </div>
        )}
      </main>
    </>
  )
}