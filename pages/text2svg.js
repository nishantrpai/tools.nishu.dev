// text to svg generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `"given the prompt: ${text}", generate svg text based on the text, will be used as image source. Keep it minimal and focus on keeping it beautiful. For some cases like spheres, you can create the illusion of 3d, similar for cubes, etc. Keep it isometric and minimal. Don't create any other shapes or text. All 3d elements should be filled with minimal colors. Shouldn't look out of place when used as an image source. Keep all images at 480x480px. Don't fill with #000 as the background is #000. Don't generate half shapes or shapes that are cut off. For 3d it should be isometric views as much as possible unless asked in the text, not inner view. Elements should be in the center. Size shouldn't be too big or too small. Keep it minimal and beautiful."`
    const res = await fetch(`/api/gpt?prompt='${prompt}'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Text to SVG</title>
        <meta name="description" content="Convert text to svg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to SVG
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to SVG
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the type of gradient you want to generate"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5}}>
            <div style={{
              border: '1px solid #333',
              background: '#000',
              borderRadius: 10,
              marginBottom: '10px',
            }}>
            <img src={getDataURI(sensationalizedText)} />
            </div>
            {sensationalizedText}
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => {
            // download svg
            const svg = sensationalizedText
            const blob = new Blob([svg], {type: 'image/svg+xml'})
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'gradient.svg'
            a.click()
          }} className={styles.button}>
            Download SVG
            </button>
          </div>
      </main>
    </>
  )
}
