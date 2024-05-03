// a radial timer for say 60 seconds (will be user input) and interval (also userinput) and at every interval till that time, it will beep
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [time, setTime] = useState(60);
  const [interval, setIntervalTime] = useState(10);
  const [beep, setBeep] = useState(false);
  const [timer, setTimer] = useState(null);
  const [count, setCount] = useState(0);

  const startTimer = () => {
    console.log('start timer');
    setTimer(setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000));
  }

  const stopTimer = () => {
    console.log('stop timer', typeof timer);
    clearInterval(timer);
    setTimer(null);
  }

  useEffect(() => {
    if (timer) {
      console.log('timer started', count, time);
      if (count % interval === 0 && count !== 0) {
        setBeep(true);
        setTimeout(() => {
          setBeep(false);
        }, 1000);
      }
      if (count === time) {
        stopTimer();
      }
    }
  }, [count, timer])

  return (
    <div className={styles.container}>
      <Head>
        <title>Interval Timer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Interval Timer
        </h1>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{
            // make circular div with border radius
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '2px solid #333',
          }}>
            {timer && <h1>{count}</h1>}
            {!timer && <input type="number" style={{
              display: 'flex',
              borderRadius: '5px',
              border: '1px solid transparent',
              padding: '0px',
              borderRadius: '5px',
              background: 'transparent',
              width: '100px',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: '30px',
              outline: 'none',
            }} value={time} onChange={(e) => setTime(parseInt(e.target.value))} />}
          </div>
          <div>
            <h2 style={{
              textAlign: 'center'
            }}>Interval</h2>
            <input type="number" style={{
              display: 'flex',
              borderRadius: '5px',
              border: '1px solid #333',
              marginTop: '20px',
              padding: '5px 10px',
              width: '100%'
            }} value={interval} onChange={(e) => setIntervalTime(parseInt(e.target.value))} />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '20px'
            }}
          >
            {!timer && <button style={{margin: 'auto'}} onClick={startTimer}>Start</button>}
            {timer && <button style={{margin: 'auto'}} onClick={stopTimer}>Stop</button>}
          </div>
        </div>
        {beep && <audio src="/beep.mp3" autoPlay />}
      </main>

    </div>
  )
}