// search for tools that do what you need
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { tools }  from './index'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    // for each tool url append tools.nishu.dev
    let myTools = tools.map(tool => tool.url ? `tools.nishu.dev/${tool.url}` : '')
    myTools = myTools.filter(tool => tool.url !== '')
    myTools = JSON.stringify(myTools)
    const res = await fetch(`/api/gpt?prompt='\n\nList all tools that do "${text}". \n\nGive bullet list, prefer online tools. Here are some tools I built ${myTools}. If you find any tool from my tools that does "${text}", add it to the list. Don't change the urls. \n\n'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Is there a tool that</title>
        <meta name="description" content="Search for tools that do what you need" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Is there a tool that
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Search for tools that do what you need
        </span>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I need a tool that..."
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Searching...' : 'Search'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#333', width: '100%', lineHeight: 1.5}}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
