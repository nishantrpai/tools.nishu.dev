// normal text to sensationalize clickbait engagement text
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt="List all possible variations of word:${text} that are paradoxical (atleast 10, should include the word). If the word is focus It would be in this format: 'The distractions will continue until focus improves.'. Format is "X will continue until Y ...". Don't repeat the prompt in the variations. Use the text in the sentence,don't use synonyms or antonyms, it should be paradoxical exactly the format of the example."`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Paradox</title>
        <meta name="description" content="Generate paradox for a topic" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Generate paradox for a topic
        </h1>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          style={{
            width: '100%',
            border: '1px solid #333',
            backgroundColor: '#000',
            padding: '10px',
            outline: 'none',
            fontSize: 16,
            borderRadius: 10,
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '20px', fontSize: 20, border: '1px solid #333', background: '#000', borderRadius: 20, width: '100%', lineHeight: 1.5}}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
