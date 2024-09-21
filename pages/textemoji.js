// generate text emoji like (╯°□°)╯︵ ┻━┻
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [emojiText, setEmojiText] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateEmoji = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Generate a list (don't include numbers or bullet points) of variations of text emoji for the text: "${text}". For example, (╯°□°)╯︵ ┻━┻ is for table flipping. Each emoji in the list should be clickable to copy, without numbers. Do not use normal emoji, only use text emoji like the one in the reference.`, 
        model: 'gpt-3.5-turbo'
      })
    })
    const data = await res.json()
    setEmojiText(data.response)
    setLoading(false)
  }

  const copyToClipboard = (emoji) => {
    // remove all numbers, bullet points, dot in numbers, and spaces from the emoji
    const cleanEmoji = emoji.replace(/\d/g, '').replace(/•/g, '').replace(/\s/g, '')
    navigator.clipboard.writeText(cleanEmoji)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Text Emoji</title>
        <meta name="description" content="Generate text emoji like (╯°□°)╯︵ ┻━┻" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Text Emoji</h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Generate text emoji like (╯°□°)╯︵ ┻━┻</span>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to emoji"
          rows={4}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#000',  color: '#fff', fontSize: 20 }}
        />
        
        <button onClick={generateEmoji} disabled={loading}>Generate Emoji</button>
        {loading && <p>Loading...</p>}
        {copied && <p>Copied to clipboard!</p>}
        {emojiText && (
          <div style={{ fontSize: '34px', marginTop: '20px', whiteSpace: 'pre-wrap', width: '100%' , border: '1px solid #333', padding: '10px', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {emojiText.split('\n').map((emoji, index) => (
              <p key={index} onClick={() => copyToClipboard(emoji)} style={{ cursor: 'pointer' }}>
                {emoji}
              </p>
            ))}
          </div>
          )}
      </main>
    </>
  )
} 