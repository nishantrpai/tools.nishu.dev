// user will input text and we'll check https://openai-openai-detector.hf.space/?encode(text) to see if it's gpt or not
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function IsItGPT() {
  const [text, setText] = useState('')
  const [isGPT, setIsGPT] = useState(null)

  useEffect(() => {
    if (text) {
      setIsGPT(null)
      fetch(`https://openai-openai-detector.hf.space/?${encodeURIComponent(text)}`)
        .then((res) => res.json())
        .then((data) => {
          setIsGPT(data.fake_probability)
        })
    }
  }, [text])

  return (
    <div className={styles.container}>
      <Head>
        <title>Is it GPT?</title>
        <meta name="description" content="Is it GPT?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Is it GPT?</h1>

        <p className={styles.description}>
          Type something and we'll check if it's GPT or not. <br/> Might not be 100% accurate.
        </p>

        <textarea
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            height: '200px',
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#000',
            border: '1px solid #333',
            borderRadius: '5px',
            color: '#fff',
            outline: 'none',
          }}
          className={styles.input}
        />


        {isGPT !== null ? (
          <p className={styles.result} style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
            textDecoration: 'underline',
            // underline color
            textDecorationColor: isGPT > 0.5 ? 'red' : 'green',
          }}>
            {/* show % */}
            {isGPT > 0.5
              ? `GPT`
              : `NOT GPT`}
          </p>
        ) :
          <p className={styles.result} style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
          }}>
            {/* show % */}
            Loading...
          </p>

        }
      </main>
    </div>
  )
}