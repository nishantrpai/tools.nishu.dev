import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [spongebobTexts, setSpongebobTexts] = useState([])

  const convertToSpongebobText = (input) => {
    return input.split('').map(char => 
      Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase()
    ).join('')
  }

  const generateSpongebobTexts = () => {
    const variations = []
    for (let i = 0; i < 10; i++) {
      variations.push(convertToSpongebobText(text))
    }
    setSpongebobTexts(variations)
  }

  return (
    <>
      <Head>
        <title>Spongebob Text Generator</title>
        <meta name="description" content="Convert your text to Spongebob text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Spongebob Text Generator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Convert your text to Spongebob style</span>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={generateSpongebobTexts} className={styles.button}>
          Generate Spongebob Text
        </button>

        {spongebobTexts.length > 0 && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 32}}>
            {spongebobTexts.map((text, index) => (
              <div key={index}>{text}</div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
