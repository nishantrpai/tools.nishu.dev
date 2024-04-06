// input and start a simple timer
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Timer() {

  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isStopped, setIsStopped] = useState(false)

  useEffect(() => {
    let interval

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isActive, isPaused])

  return (
    <div className={styles.container}>
      <Head>
        <title>Timer</title>
        <meta name="description" content="Simple timer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{
          textAlign: 'center',
        }}>
<h1 className={styles.title}>
          Timer
        </h1>
        <span className={styles.description}>
          Set a timer for your tasks.
        </span>

        </div>
        
        <div style={{
          width: '100%',
          cursor: 'pointer',
          fontSize: '10rem',
          textAlign: 'center'
        }}>
          <div>
            <h2>{time}</h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px'
            }}>
              {!isActive && !isPaused ? (
                <button onClick={() => setIsActive(true)}>Start</button>
              ) : (
                <button onClick={() => setIsPaused(!isPaused)}>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
              <button onClick={() => {
                setIsActive(false)
                setTime(0)
              }}>Stop</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
