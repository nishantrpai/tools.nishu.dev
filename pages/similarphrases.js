// similar phrases to your phrase use /gpt api 
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [phrase, setPhrase] = useState('')
  const [similarPhrases, setSimilarPhrases] = useState([])

  const handlePhrase = (e) => {
    setPhrase(e.target.value)
  }

  const fetchSimilarPhrases = () => {
    fetch(`/api/gpt?prompt="Make an array of of similar phrases to ${phrase}"`)
      .then(res => res.json())
      .then(data => {
        setSimilarPhrases(data.response)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Similar Phrases</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Similar Phrases
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
          <input type="text" value={phrase} onChange={handlePhrase} placeholder="Enter a phrase" />
          <button onClick={fetchSimilarPhrases}>Get Similar Phrases</button>
        </div>

        <p style={{ whiteSpace: 'pre-wrap' }}>{similarPhrases}</p>
      </main>
    </div>
  )
}