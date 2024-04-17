// the user will input how many reps they want to do and tool tool will count down from that number to 1 using window speech synthesis
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Repaloud() {
  const [reps, setReps] = useState(0)
  const [count, setCount] = useState(0)
  const [counting, setCounting] = useState(false)
  const [speech, setSpeech] = useState(null)
  
  useEffect(() => {
    if (!counting) return
    if (count === 0) {
      setCounting(false)
      return
    }
    const msg = new SpeechSynthesisUtterance(count)
    window.speechSynthesis.speak(msg)
      
    msg.onend = () => {
      setTimeout(() => {
        setCount(count - 1)
      }, 1000)
    }
  }, [counting, count])

  const start = () => {
    setCount(reps)
    setCounting(true)
  }

  return (
    <>
      <Head>
        <title>Repaloud</title>
        <meta name="description" content="Repaloud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Repaloud
          </h1>
          <p>Enter the number of reps you want to do</p>
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} style={{ 
            padding: '10px',
            fontSize: '10rem',
            width: '500px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #000',
            backgroundColor: '#222',
          }} />
          <button onClick={start}>Start</button>
        </main>
      </div>
    </>
  )
}
