// infer metaphysics from physics
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [reframedText, setReframedText] = useState('')
  const [direction, setDirection] = useState('')
  const [loading, setLoading] = useState(false)

  const handleText = (e) => {
    setText(e.target.value)
  }

  const handleDirection = (e) => {
    setDirection(e.target.value)
  }

  const reframeText = () => {
    setLoading(true)
    fetch(`/api/gpt?prompt="Given this physics statement ${text} and reframe it in a metaphysical way. No quotes. First sentence will be physics and then metaphysical interpretation."`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setReframedText(data.response)
        setLoading(false)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Physics to Metaphysics</title>
        <meta name="description" content="Infer metaphysics from physics corpus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Physics to Metaphysics
        </h1>

        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>
          Infer metaphysics from physics corpus
        </p>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text"
              style={{
                width: '100%',
                border: '1px solid #333',
                background: '#000',
                padding: '10px',
                borderRadius: 10,
                outline: 'none',
                fontSize: 16
              }}
            />
            <button onClick={reframeText} style={{
              margin: 'auto'
            }}>
              {loading ? 'Infering...' : 'Infer'}
            </button>
            {reframedText ? <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 16 }}>
              {reframedText}
            </div> : null}
          </div>
        </div>
      </main>
    </div>
  )
}
