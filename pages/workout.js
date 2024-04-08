// enter a muscle and gpt gives you a workout for that muscle
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Workout() {
  const [muscle, setMuscle] = useState('')
  const [workout, setWorkout] = useState('')

  const generateWorkout = async () => {
    setWorkout('Loading...')
    const response = await fetch(`/api/gpt?prompt=Can you give me a list of workouts for ${muscle}. Don't add any prefixes just tell the workout.`)
    const data = await response.json()
    setWorkout(data.response);
  }

  return (
    <div>
      <Head>
        <title>Workout Generator</title>
        <meta name="description" content="Generate a workout based on a muscle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1 className={styles.title}>
          Workout Generator
        </h1>
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
          }} 
            placeholder='Enter a muscle name like biceps, triceps, etc.'
          />
          <button onClick={generateWorkout}>Generate Workout</button>
          <pre style={{
            width: '100%',
            minWidth: '500px',
            maxWidth: '500px',
            whiteSpace: 'pre-wrap',
            textAlign: 'left'
          }}>{workout}</pre>
        </div>
      </main>
    </div>
  )
}
