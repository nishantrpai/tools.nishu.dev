import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [color, setColor] = useState('#c72929')
  const [cellColor, setCellColor] = useState('')
  const [colorGrid, setColorGrid] = useState([])

  useEffect(() => {
    generateColorGrid(color)
  }, [color])

  const generateColorGrid = (baseColor) => {
    const grid = []
    const complementaryColor = getComplementaryColor(baseColor)
    for (let i = 0; i < 10; i++) {
      const row = []
      for (let j = 0; j < 10; j++) {
        const mixRatio = j / 9  // 0 to 1
        row.push(mixColors(baseColor, complementaryColor, mixRatio))
      }
      grid.push(row)
    }
    setColorGrid(grid)
  }

  const getComplementaryColor = (hex) => {
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl[0] = (hsl[0] + 0.5) % 1  // Add 0.5 to hue (180 degrees)
    const complementaryRgb = hslToRgb(hsl[0], hsl[1], hsl[2])
    return rgbToHex(complementaryRgb[0], complementaryRgb[1], complementaryRgb[2])
  }

  const mixColors = (color1, color2, ratio) => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio)
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio)
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)
    return rgbToHex(r, g, b)
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return [h, s, l]
  }

  const hslToRgb = (h, s, l) => {
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // alert(`Copied ${text} to clipboard!`)
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const downloadImage = () => {
      const gridElement = document.getElementById('color-grid')
      html2canvas(gridElement, {
        scale: 2,
        backgroundColor: '#000000',
      }).then((canvas) => {
        const a = document.createElement('a')
        a.href = canvas.toDataURL()
        a.download = 'complementary-color-grid.png'
        a.click()
      })
  }
  return (
    <>
      <Head>
        <title>Complementary Color Grid Generator</title>
        <meta name="description" content="Generate a 10x10 complementary color grid from a base color" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Complementary Color Grid Generator</h1>
        <h2 className={styles.description}>Select a color to generate a 10x10 complementary color grid</h2>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <div id="color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 50px)', gap: '0px' }}>
          {colorGrid.map((row, i) => 
            row.map((cellColor, j) => 
              <div 
                key={`${i}-${j}`} 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: cellColor,
                  cursor: 'pointer'
                }} 
                onClick={() => {
                  copyToClipboard(cellColor)
                  setCellColor(cellColor) 
                }}
              />
            )
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, justifyContent: 'space-between', marginTop: '20px' }}>
          <span>Selected Color: {cellColor}</span>
          <button onClick={downloadImage}>Download</button>
        </div>
      </main>
    </>
  )
}
