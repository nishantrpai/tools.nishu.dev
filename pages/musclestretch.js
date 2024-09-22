// enter a muscle and gpt gives you stretches for that muscle
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function MuscleStretches() {
  const [muscle, setMuscle] = useState('')
  const [stretches, setStretches] = useState('')

  const generateStretches = async () => {
    setStretches('Loading...')
    const response = await fetch(`/api/gpt?prompt=Give me a bullet list of stretches for ${muscle}. Don't add any prefixes, just list the stretches.`)
    const data = await response.json()
    setStretches(data.response);
  }

  return (
    <div>
      <Head>
        <title>Muscle Stretches Generator</title>
        <meta name="description" content="Generate stretches for a specific muscle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1 className={styles.title}>
          Muscle Stretches Generator
        </h1>
        <h2 className={styles.description}>Enter a muscle name and get stretches for that muscle</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'center'
        }}>
          <input type="text" value={muscle} onChange={(e) => setMuscle(e.target.value)} style={{
            outline: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #333',
            fontSize: '25px'
          }} 
            placeholder='Enter a muscle name like hamstrings, quadriceps, etc.'
          />
          <button onClick={generateStretches}>Generate Stretches</button>
          <pre style={{
            width: '100%',
            minWidth: '500px',
            maxWidth: '500px',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            border: '1px solid #333',
            borderRadius: '5px',
            padding: '10px',
            fontSize: '25px'
          }}>{stretches}</pre>
        </div>
      </main>
    </div>
  )
}
