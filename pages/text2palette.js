import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function TextToPalette() {
  const [text, setText] = useState('')
  const [palette, setPalette] = useState([])
  const [loading, setLoading] = useState(false)
  const paletteRef = useRef(null)

  const generatePalette = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `given a prompt: ${text}, generate a color palette that can be used for a design. Provide exactly 5 colors in hex format (e.g., #RRGGBB). Keep it minimal and focus on creating a harmonious palette.`,
        model: 'gpt-4o-mini'
      })
    })
    const data = await res.json()
    const colors = data.response.match(/#[0-9A-Fa-f]{6}/g) || []
    // remove duplicates
    const uniqueColors = [...new Set(colors)] 
    setPalette(uniqueColors)
    setLoading(false)
  }

  const downloadPalette = async () => {
    if (paletteRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = 1000
      canvas.height = 1000
      const ctx = canvas.getContext('2d')

      // Set black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw color squares
      const squareSize = 180
      const gap = 20
      const startX = (canvas.width - (squareSize * 5 + gap * 4)) / 2
      const startY = (canvas.height - squareSize) / 2

      palette.forEach((color, index) => {
        ctx.fillStyle = color
        ctx.fillRect(startX + (squareSize + gap) * index, startY, squareSize, squareSize)
        // add text
        ctx.fillStyle = '#fff'
        ctx.font = '16px Arial'
        ctx.fillText(color, startX + (squareSize + gap) * index, startY + squareSize + 40)
      })

      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const url = URL.createObjectURL(blob)

      // Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = 'color-palette.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)
    }
  }

  return (
    <>
      <Head>
        <title>Text to Palette</title>
        <meta name="description" content="Suggest a color palette for your prompt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Palette
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Suggest a color palette for your prompt
        </span>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the type of palette you want to generate"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={generatePalette} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {palette.length > 0 && (
          <div ref={paletteRef} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5}}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
              padding: '10px',
              borderRadius: 10,
            }}>
              {palette.map((color, index) => (
                <div key={index} style={{
                  background: color,
                  height: '86px',
                  width: '86px',
                  borderRadius: '5px',
                }}></div>
              ))}
            </div>
            {palette.join(', ')}
          </div>
        )}

        {palette.length > 0 && (
          <button onClick={downloadPalette} className={styles.button} style={{ marginTop: '20px' }}>
            Download Palette
          </button>
        )}
      </main>
    </>
  )
}
