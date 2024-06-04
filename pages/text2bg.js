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
    let prompt = `"given the prompt: ${text}", generate svg text that matches prompt. It will be used as background pattern. Keep it beautiful and clean. Use minimal colors. For some cases like spheres, you can create the illusion of 3d by using gradients and differnt opacity etc, similar for cubes, etc. For some cases you maye need to apply varying opacity to create the shape. Don't add any other text or html tags. SVG should be 480x480px. All renders should be symmetrical and not have any text or html tags. Transparent background. Don't render other shapes or objects. Don't fragment the elements, or disjointed or disconnected elements. Keep it simple and beautiful. Strokes shouldn't be black as the background is black. Don't add backticks or other characters, only the svg text.\n\n`
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Text to Bg Pattern</title>
        <meta name="description" content="Convert text to svg pattern" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Bg pattern
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to Bg pattern
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the type of svg you want to generate"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            fontSize: 20,
            background: '#000',
            borderRadius: 10,
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5 }}>
            <div style={{
              height: 480,
              width: 480,
              margin: 'auto',
              marginBottom: 20,
              border: '1px solid #333',
              backgroundColor: '#000',
              backgroundImage: `url(${getDataURI(sensationalizedText)})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '50px 50px',
              borderRadius: 10,
              marginBottom: '10px',
            }} id="bg-pattern">
            </div>
            <span style={{
              display: 'flex',
              maxWidth: 480,
              margin: '20px auto',
              marginTop: 20,
              border: '1px solid #333',
              borderRadius: 10,
              padding: 20
            }}>
              {sensationalizedText}
            </span>
          </div>
        )}
        <div style={{ marginTop: '20px', display: 'flex', gap: 20 }}>
          <button onClick={() => {
            // download svg
            // create canvas
            const canvas = document.createElement('canvas')
            canvas.width = 500
            canvas.height = 500
            const ctx = canvas.getContext('2d')
            // add border radius 10

            const img = new Image()
            img.src = getDataURI(sensationalizedText)
            // with repeat pattern and background size 50x50
            img.onload = () => {
              for (let x = 0; x < 480; x += 50) {
                for (let y = 0; y < 480; y += 50) {
                  ctx.drawImage(img, x, y, 50, 50)
                }
              }
              const a = document.createElement('a')
              a.href = canvas.toDataURL('image/png')
              a.download = 'pattern.png'
              a.click()
            }
            
            // remove canvas
          }} className={styles.button}>
            Download Image
          </button>

          <button onClick={() => {
            // download svg
            const svg = sensationalizedText
            const blob = new Blob([svg], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'pattern.svg'
            a.click()
          }} className={styles.button}>
            Download Pattern
          </button>
        </div>
      </main>
    </>
  )
}
