import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function ComicSans() {
  const [text, setText] = useState('')
  const [wallpaper, setWallpaper] = useState(null)
  const [fontSize, setFontSize] = useState(48)
  const [bgType, setBgType] = useState('solid') // solid or gradient
  const [bgColor1, setBgColor1] = useState('#ffffff')
  const [bgColor2, setBgColor2] = useState('#ffffff')
  const [fontColor, setFontColor] = useState('#000000')
  const [gradientAngle, setGradientAngle] = useState(45)

  useEffect(() => {
    if (!text) return

    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    // Set background
    if (bgType === 'solid') {
      ctx.fillStyle = bgColor1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      const gradient = ctx.createLinearGradient(
        0, 0,
        Math.cos(gradientAngle * Math.PI / 180) * canvas.width,
        Math.sin(gradientAngle * Math.PI / 180) * canvas.height
      )
      gradient.addColorStop(0, bgColor1)
      gradient.addColorStop(1, bgColor2)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Configure text
    ctx.font = `${fontSize}px Comic Sans MS`
    ctx.fillStyle = fontColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Break text into lines
    const words = text.split(' ')
    let lines = []
    let currentLine = ''

    words.forEach(word => {
      const testLine = currentLine + word + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > 700) {
        lines.push(currentLine)
        currentLine = word + ' '
      } else {
        currentLine = testLine
      }
    })
    lines.push(currentLine)

    // Draw text lines centered
    const lineHeight = 60
    const totalHeight = lines.length * lineHeight
    const startY = (canvas.height - totalHeight) / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width/2, startY + (i * lineHeight))
    })

    setWallpaper(canvas.toDataURL('image/png'))
  }, [text, bgType, bgColor1, bgColor2, gradientAngle, fontSize, fontColor])

  return (
    <>
      <Head>
        <title>Comic Sans Wallpaper</title>
        <meta name="description" content="Generate Comic Sans wallpapers from text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Comic Sans Wallpaper</h1>
        <h2 className={styles.description}>Generate wallpapers with Comic Sans text</h2>
        <div style={{ width: '100%', maxWidth: 800, marginBottom: 20, alignItems: 'flex-start', gap: 10, display: 'flex', flexDirection: 'column' }}>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Enter your text" 
          style={{ 
            width: '100%', 
            height: '200px', 
            padding: '10px', 
            border: '1px solid #333', 
            outline: 'none', 
            marginBottom: '20px',
            fontSize: 16,
            color: '#fff',
            borderRadius: 10 
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Font Color</span>
          <input 
            type="color" 
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{ marginRight: 10 }}
          />
        </div>
       
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Font Size: {fontSize}</span>
          <input
            type="range"
          min="16"
          max="200"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: 100 }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <span>Background Type</span>
          <select 
            value={bgType} 
            onChange={(e) => setBgType(e.target.value)}
            style={{
              padding: '5px 10px',
              marginRight: 10,
              borderRadius: 5
            }}
          >
            <option value="solid">Solid Color</option>
            <option value="gradient">Gradient</option>
          </select>

          <input 
            type="color" 
            value={bgColor1}
            onChange={(e) => setBgColor1(e.target.value)}
            style={{ marginRight: 10 }}
          />

          {bgType === 'gradient' && (
            <>
              <input 
                type="color" 
                value={bgColor2}
                onChange={(e) => setBgColor2(e.target.value)}
                style={{ marginRight: 10 }}
              />
              <input
                type="range"
                min="0"
                max="360"
                value={gradientAngle}
                onChange={(e) => setGradientAngle(Number(e.target.value))}
                style={{ width: 100 }}
              />
              <span>{gradientAngle}°</span>
            </>
          )}
        </div>
        </div>

        {wallpaper && (
          <div style={{ marginTop: 20 }}>
            <img 
              src={wallpaper} 
              alt="Generated wallpaper"
              style={{ 
                width: '100%', 
                maxWidth: 800,
                borderRadius: 10 
              }} 
            />
            <button 
              onClick={() => {
                const a = document.createElement('a')
                a.href = wallpaper
                a.download = 'comic-sans-wallpaper.png'
                a.click()
              }}
              style={{ marginTop: 20 }}
            >
              Download Wallpaper
            </button>
          </div>
        )}
      </main>
    </>
  )
}
