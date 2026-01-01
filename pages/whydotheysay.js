// awareness mapping tool
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')

  const openInChatGPT = () => {
    if (!text.trim()) return
    
    const prompt = `You are an expert in awareness mapping, user psychology, and narrative reasoning.

I will give you ONE question, post, or short piece of text from a person.

Your job is to:
1. Infer the real situation the person is in
2. Reconstruct the continuous story that led them to ask this
3. Identify their likely awareness level
4. Build a full Awareness Mapping Table using these stages:
   - Unaware
   - Problem Aware
   - Solution Aware
   - Method / Product Aware
   - Most Aware

IMPORTANT CONSTRAINTS:
- Do NOT ask clarifying questions
- Make the story continuous (each stage must naturally lead to the next)
- Clearly describe triggers, emotions, and belief shifts at each stage
- Base everything strictly on what can be reasonably inferred from the source
- Match the language style of the person (casual vs technical, beginner vs advanced)

OUTPUT FORMAT:
1. Briefly list the signals inferred from the source
2. Write a short paragraph describing the implied situation
3. Present a table with columns:
   - Awareness Level
   - Story: Where They Are / How They Got There
   - Types of Posts They Make + Types of google search queries they would make

SOURCE TO ANALYZE:
"${text}"`
    
    const encodedPrompt = encodeURIComponent(prompt)
    const url = `https://chatgpt.com/?q=${encodedPrompt}`
    window.open(url, '_blank')
  }

  return (
    <>
      <Head>
        <title>Why Map</title>
        <meta name="description" content="Map awareness levels from user text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Why Map
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Map awareness levels from user questions or posts</span>


        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the question, post, or text here"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical'
          }}
        />

        <button onClick={openInChatGPT} className={styles.button}>
          Open in ChatGPT
        </button>
      </main>
    </>
  )
}