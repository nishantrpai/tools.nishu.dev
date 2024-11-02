import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function MobileGradientWallpaper() {
  const [prompt, setPrompt] = useState('')
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(false)

  const generateGradient = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Given the prompt: "${prompt}", suggest 3 colors that would make a beautiful gradient wallpaper. The colors should flow well together and match the mood/theme. Provide exactly 3 colors in hex format (e.g., #RRGGBB). Response should be in format: {"colors": ["#123456", "#789ABC", "#DEF012"]}`
      })
    })
    const data = await res.json()
    const colorData = JSON.parse(data.response)
    setColors(colorData.colors)
    setLoading(false)
  }

  const downloadWallpaper = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080  // Standard mobile wallpaper width
    canvas.height = 1920 // Standard mobile wallpaper height
    const ctx = canvas.getContext('2d')

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color)
    })

    // Fill with gradient
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Download
    const link = document.createElement('a')
    link.download = 'gradient-wallpaper.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <>
      <Head>
        <title>Mobile Gradient Wallpaper</title>
        <meta name="description" content="Create beautiful gradient wallpapers for mobile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Mobile Gradient Wallpaper
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Generate beautiful gradient wallpapers from text prompts
        </span>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the mood or theme you want (e.g., sunset at beach, cosmic nebula)"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            marginBottom: '20px',
            background: 'none',
            color: '#fff',
            outline: 'none'
          }}
        />

        <button 
          onClick={generateGradient}
          style={{
            marginBottom: '20px',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {colors.length > 0 && (
          <div style={{
            width: '100%',
            maxWidth: '400px',
            aspectRatio: '9/16',
            background: `linear-gradient(${colors.join(', ')})`,
            borderRadius: '20px',
            marginBottom: '20px'
          }} />
        )}

        {colors.length > 0 && (
          <button
            onClick={downloadWallpaper}
            style={{
              padding: '10px 20px',
              background: '#333',
              border: 'none',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Download Wallpaper
          </button>
        )}
      </main>
    </>
  )
}
