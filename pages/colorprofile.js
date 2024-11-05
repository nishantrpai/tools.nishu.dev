// simple tool for getting color profile of any hex
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function ColorProfile() {
  const [color, setColor] = useState('#000000')
  const [loading, setLoading] = useState(false)
  const [hex, setHex] = useState('')
  const [rgb, setRgb] = useState('')
  const [hsl, setHsl] = useState('')
  const [cmyk, setCmyk] = useState('')

  const isLightColor = (hex) => {
    const rgb = parseInt(hex.replace('#', ''), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return luma > 200
  }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
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

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  const hexToCmyk = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255

    let k = 1 - Math.max(r, g, b)
    let c = (1 - r - k) / (1 - k)
    let m = (1 - g - k) / (1 - k)
    let y = (1 - b - k) / (1 - k)

    return `cmyk(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(y * 100)}, ${Math.round(k * 100)})`
  }

  const getColorProfile = () => {
    setLoading(true)
    setHex(color)
    setRgb(hexToRgb(color))
    setHsl(hexToHsl(color))
    setCmyk(hexToCmyk(color))
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Color Profile</title>
        <meta name="description" content="Get color profile of any color" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          Color Profile
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Get color profile of any color
        </span>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter hex color"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />
        <button onClick={getColorProfile} className={styles.button}>
          {loading ? 'Loading...' : 'Get Color Profile'}
        </button>
        {hex && (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', padding: '1px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5 }}>
            <div style={{
              background: rgb,
              height: '520px',
              width: '100%',
              borderRadius: 10,
              position: 'relative',
            }} id="color-square">
              <div style={{
                bottom: 10,
                position: 'absolute',
                padding: 10,
                color: isLightColor(hex) ? '#000' : '#fff',
                display: 'flex',
                flexDirection: 'column',
                textTransform: 'uppercase',
              }}>
                <span style={{ fontWeight: 'bold', fontSize: 24 }}>{hex}</span>
                <span style={{ fontSize: 12, opacity: '0.75' }}> {rgb}</span>
                <span style={{ fontSize: 12, opacity: '0.75' }}> {hsl}</span>
                <span style={{ fontSize: 12, opacity: '0.75' }}> {cmyk}</span>
              </div>
            </div>
          </div>
        )}
        {/* download */}
        {hex && (
          <button onClick={() => {
            html2canvas(document.getElementById('color-square'), {
              backgroundColor: 'transparent'
            }).then(function (canvas) {
              var a = document.createElement('a');
              a.href = canvas.toDataURL("image/png");
              a.download = 'color.png';
              a.click();
            });
          }} className={styles.button}>
            Download Color Profile
          </button>)}
      </main>
    </>
  )
}
