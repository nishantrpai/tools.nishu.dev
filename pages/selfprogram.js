// Mood Music for Activities
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [activity, setActivity] = useState('')
  const [musicSuggestions, setMusicSuggestions] = useState('')
  const [loading, setLoading] = useState(false)
  
  const getSuggestions = async () => {
    if (!activity.trim()) return
    setLoading(true)
    const prompt = `Suggest music, songs, and movie scenes for "${activity}"  trigger the mood, get mind, heart, and soul involved. Fit the mood, occasion, and energy level of the activity. Only provide a list of suggestions without any additional commentary.`
    const res = await fetch(`/api/gpt?prompt=${encodeURIComponent(prompt)}`)
    const data = await res.json()
    setMusicSuggestions(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Mood Music</title>
        <meta name="description" content="Get music suggestions to trigger the mood for any activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Mood Music for Activities
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Enter an activity to get music suggestions that put you in the mood, involving mind, heart, and soul.
        </span>

        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="e.g., going to the gym"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginBottom: '10px', 
            fontSize: 20
          }}
        />

        <button onClick={getSuggestions} className={styles.button} disabled={loading}>
          {loading ? 'Getting suggestions...' : 'Get Music Suggestions'}
        </button>

        {musicSuggestions && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', lineHeight: 1.5, marginTop: '20px', fontSize: 20, borderRadius: 10}}>
            {musicSuggestions}
          </div>
        )}
      </main>
    </>
  )
}