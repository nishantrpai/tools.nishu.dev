// reframe a sentence, will have two inputs: one for text and one for the reframing direction 
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [reframedText, setReframedText] = useState('')
  const [direction, setDirection] = useState('')

  const handleText = (e) => {
    setText(e.target.value)
  }

  const handleDirection = (e) => {
    setDirection(e.target.value)
  }

  const reframeText = () => {
    fetch(`/api/gpt?prompt="Given the text: ${text}, reframe it in a ${direction} way. No quotes"`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setReframedText(data.response)
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Reframe</title>
        <meta name="description" content="Reframe a sentence" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Reframe
        </h1>

        <p className={styles.description} style={{width: '100%', textAlign: 'center'}}>
          Reframe a sentence
        </p>

        <div style={{width: '100%'}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%'}}>
            <input style={{ border: '1px solid #333', background: '#000', padding: '5px 10px', outline: 'none'}} type="text" placeholder="Enter text" value={text} onChange={handleText} />
            <input style={{ border: '1px solid #333', background: '#000', padding: '5px 10px', outline: 'none'}} type="text" placeholder="Enter direction" value={direction} onChange={handleDirection} />
            <button onClick={reframeText}>Reframe</button>
            <p>{reframedText}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
