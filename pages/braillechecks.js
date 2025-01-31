import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'

const BRAILLE_MAP = {
  'a': [1, 0, 0, 0, 0, 0], 'b': [1, 1, 0, 0, 0, 0],
  'c': [1, 0, 0, 1, 0, 0], 'd': [1, 0, 0, 1, 1, 0],
  'e': [1, 0, 0, 0, 1, 0], 'f': [1, 1, 0, 1, 0, 0],
  'g': [1, 1, 0, 1, 1, 0], 'h': [1, 1, 0, 0, 1, 0],
  'i': [0, 1, 0, 1, 0, 0], 'j': [0, 1, 0, 1, 1, 0],
  'k': [1, 0, 1, 0, 0, 0], 'l': [1, 1, 1, 0, 0, 0],
  'm': [1, 0, 1, 1, 0, 0], 'n': [1, 0, 1, 1, 1, 0],
  'o': [1, 0, 1, 0, 1, 0], 'p': [1, 1, 1, 1, 0, 0],
  'q': [1, 1, 1, 1, 1, 0], 'r': [1, 1, 1, 0, 1, 0],
  's': [0, 1, 1, 1, 0, 0], 't': [0, 1, 1, 1, 1, 0],
  'u': [1, 0, 1, 0, 0, 1], 'v': [1, 1, 1, 0, 0, 1],
  'w': [0, 1, 0, 1, 1, 1], 'x': [1, 0, 1, 1, 0, 1],
  'y': [1, 0, 1, 1, 1, 1], 'z': [1, 0, 1, 0, 1, 1],
  ' ': [0, 0, 0, 0, 0, 0]
}

export default function Home() {
  const [text, setText] = useState('')
  const [outputSVG, setOutputSVG] = useState('')
  const [scale, setScale] = useState(1)
  const [offsetX, setOffsetX] = useState(100)
  const [offsetY, setOffsetY] = useState(100)
  const [fillColor, setFillColor] = useState('#ffffff')
  const [emptyColor, setEmptyColor] = useState('#333333')
  const [backgroundColor, setBackgroundColor] = useState('#000000')

  const generateChecks = () => {
    let svgContent = `
    <svg viewBox="0 0 680 680" fill="${backgroundColor}"
    style="background-color: ${backgroundColor};"
    xmlns="http://www.w3.org/2000/svg">
      <defs>
      <path id="check" fill-rule="evenodd" d="M21.36 9.886A3.933 3.933 0 0 0 18 8c-1.423 0-2.67.755-3.36 1.887a3.935 3.935 0 0 0-4.753 4.753A3.933 3.933 0 0 0 8 18c0 1.423.755 2.669 1.886 3.36a3.935 3.935 0 0 0 4.753 4.753 3.933 3.933 0 0 0 4.863 1.59 3.953 3.953 0 0 0 1.858-1.589 3.935 3.935 0 0 0 4.753-4.754A3.933 3.933 0 0 0 28 18a3.933 3.933 0 0 0-1.887-3.36 3.934 3.934 0 0 0-1.042-3.711 3.934 3.934 0 0 0-3.71-1.043Zm-3.958 11.713 4.562-6.844c.566-.846-.751-1.724-1.316-.878l-4.026 6.043-1.371-1.368c-.717-.722-1.836.396-1.116 1.116l2.17 2.15a.788.788 0 0 0 1.097-.22Z"/>
      </defs>
    `

    let xOffset = offsetX
    let yOffset = offsetY

    text.toLowerCase().split('').forEach((char, i) => {
      if (char === '\n') {
        xOffset = offsetX
        yOffset += 200 * scale
      }
      // if char is '' just add offset, don't draw anything
      if (char === '') {
        xOffset += 100 * scale
      }
      if (BRAILLE_MAP[char]) {
        BRAILLE_MAP[char].forEach((dot, index) => {
          const x = xOffset + (index % 2) * 40 * scale
          const y = yOffset + Math.floor(index / 2) * 40 * scale
          const color = dot === 1 ? fillColor : emptyColor
          svgContent += `<use href="#check" transform="scale(${scale})" x="${x / scale}" y="${y / scale}" fill="${color}"/>`
        })
        xOffset += 100 * scale
      }
    })

    svgContent += '</svg>'
    setOutputSVG(`data:image/svg+xml,${encodeURIComponent(svgContent)}`)
  }

  useEffect(() => {
    generateChecks()
  }, [text, scale, offsetX, offsetY, fillColor, emptyColor, backgroundColor])

  return (
    <>
      <Head>
        <title>Text to Braille Checks</title>
        <meta name="description" content="Convert text to Braille Checks" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Text to Braille Checks</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            border: '1px solid #333',
            color: '#fff',
            backgroundColor: '#000',
            borderRadius: '5px',
          }}
        />

        <div style={{ marginBottom: '20px', display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div>
            <label>Scale: {scale.toFixed(1)}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>X Offset: {offsetX}px</label>
            <input
              type="range"
              min="0"
              max="300"
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Y Offset: {offsetY}px</label>
            <input
              type="range"
              min="0"
              max="300"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>

            <div>
              <label>Fill Color:</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label>Empty Color:</label>
            <input
              type="color"
              value={emptyColor}
              onChange={(e) => setEmptyColor(e.target.value)}
            />
          </div>
          <div>
            <label>Background Color:</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>

        </div>

        {outputSVG && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <img src={outputSVG} alt="Braille Checks" style={{ width: '100%' , border: '1px solid #333'}} />
            <button onClick={() => navigator.clipboard.writeText(outputSVG)}>Copy SVG</button>
            {/* download 4x png */}
            <button onClick={() => {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              const img = new Image()
              img.onload = () => {
                const upscale = 16
                canvas.width = img.width * upscale
                canvas.height = img.height * upscale
                // draw black background
                ctx.drawImage(img, 0, 0, img.width * upscale, img.height * upscale)
                const dataURL = canvas.toDataURL('image/png')
                const a = document.createElement('a')
                a.href = dataURL
                a.download = 'braille-checks.png'
                a.click()
              }
              img.src = outputSVG
            }}>Download PNG</button>
          </div>
        )}

      </main>
    </>
  )
}
