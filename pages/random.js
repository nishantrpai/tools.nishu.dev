// generate random number between user input ranges from and to
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Random() {
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(100)
  const [randomNumber, setRandomNumber] = useState(0)

  const generateRandomNumber = () => {
    const random = Math.abs(Math.floor(Math.random() * (to - from + 1) + from))
    setRandomNumber(random)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Random Number Generator</title>
        <meta name="description" content="Generate a random number between two ranges" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1 className={styles.title}>
          Random Number Generator
        </h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'center'
        }}>
          <input type="number" value={from} onChange={(e) => setFrom(e.target.value)} style={{
            outline: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
          }} />
          <input type="number" value={to} onChange={(e) => setTo(e.target.value)} style={{
            outline: 'none',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
          }} />
          <button onClick={generateRandomNumber}>Generate Random Number</button>
          <h2>{randomNumber}</h2>
        </div>
      </main>
    </div>
  )
}
