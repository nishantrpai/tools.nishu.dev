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
    let prompt = `Generate an SVG based on the following specifications:

1. The SVG should have a black background with dimensions of 480x480.
2. Inside the SVG, there should be a main square with dimensions 240x240, positioned at coordinates (120, 120).
3. This main square should have a white border with a stroke width of 4.
4. Divide the main square into 6 or 10 smaller non-intersecting areas using horizontal and vertical lines. Ensure that:
   - The divisions create distinct subsquares or rectangles within the main square.
   - The lines will be around each division, not inside them or between them.
   - The divisions are primarily vertical, with fewer horizontal divisions.
   - Each smaller area should be filled with a unique color.
   - Lines should not go outside the boundaries of the main square.
   - Colors shouldn't spill outside the boundaries of the main square.
5. Ensure that no colors or lines spill outside the boundaries of the main square.
6. Output should be in SVG format.
7. Choose the colors of rectangles and lines to match ${text}.
8. 

Here's an example of how the SVG should look like, maintaining these constraints:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" style="background:#fff;transform: rotate(90deg)">
  
  <!-- Top left area -->
  <rect x="120" y="120" width="120" height="60" fill="#f00"/>
  
  <!-- Top right area -->
  <rect x="240" y="120" width="120" height="60" fill="#0f0"/>
  
  <!-- Middle left area -->
  <rect x="120" y="180" width="120" height="90" fill="#00f"/>
  
  <!-- Middle right area -->
  <rect x="240" y="180" width="120" height="90" fill="#ff0"/>
  
  <!-- Bottom left area -->
  <rect x="120" y="270" width="120" height="90" fill="#0ff"/>
  
  <!-- Bottom right area -->
  <rect x="240" y="270" width="120" height="60" fill="#f0f"/>
  
  <!-- Bottom far right area -->
  <rect x="240" y="330" width="120" height="30" fill="#fa0"/>
  
  <!-- Outer rectangle -->
  <rect x="120" y="120" width="240" height="240" fill="none" stroke="black" stroke-width="8"/>
  
  <!-- Horizontal lines -->
  <line x1="120" y1="180" x2="360" y2="180" stroke="black" stroke-width="8"/>
  <line x1="120" y1="270" x2="360" y2="270" stroke="black" stroke-width="8"/>
  <line x1="240" y1="330" x2="360" y2="330" stroke="black" stroke-width="8"/>
  
  <!-- Vertical lines -->
  <line x1="240" y1="120" x2="240" y2="360" stroke="black" stroke-width="8"/>
</svg>


Make sure to randomize the positions of the lines while maintaining the constraints.
`;
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
        <title>Text to Pepe</title>
        <meta name="description" content="Convert text to pepe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Pepe
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to Pepe
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the type of pepe you want to generate"
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
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5 }}>
            <div style={{
              border: '1px solid #333',
              background: '#000',
              borderRadius: 10,
              marginBottom: '10px',
            }}>
              <img src={getDataURI(sensationalizedText)} style={{
                borderRadius: 10
              }}/>
            </div>
            {sensationalizedText}
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => {
            // download svg
            const svg = sensationalizedText
            const blob = new Blob([svg], { type: 'image/svg+xml' })
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
