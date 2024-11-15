import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function Img2Palette() {
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)
  const [colorCounts, setColorCounts] = useState({})

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    setCanvas(canvas)
    setContext(context)
  }, [])

  // add copy paste functionality
  useEffect(() => {
    window.addEventListener('paste', async (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
              canvas.width = img.width
              canvas.height = img.height
              context.clearRect(0, 0, canvas.width, canvas.height)
              context.drawImage(img, 0, 0)
              setImage(img)
              analyzeColors()
            }
          }
          reader.readAsDataURL(blob)
        }
      }
    })
  }, [canvas, context])

  const handleImage = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
        setImage(img)
        analyzeColors()
      }
    }
    reader.readAsDataURL(file)
  }

  const analyzeColors = () => {
    if (!context) return
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data
    const colors = {}

    // Sample every pixel
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i]
      const g = imageData[i + 1] 
      const b = imageData[i + 2]
      const rgb = `rgb(${r},${g},${b})`
      
      if (colors[rgb]) {
        colors[rgb]++
      } else {
        colors[rgb] = 1
      }
    }

    // Helper function to calculate color difference
    const colorDifference = (color1, color2) => {
      const [r1, g1, b1] = color1.match(/\d+/g).map(Number)
      const [r2, g2, b2] = color2.match(/\d+/g).map(Number)
      return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    }

    // Filter colors that appear more than 2000 times
    let filteredColors = Object.entries(colors)
      .filter(([_, count]) => count > 100)
      .sort((a, b) => b[1] - a[1])

    // Remove similar colors (within 50 difference)
    const uniqueColors = []
    for (const [color, count] of filteredColors) {
      if (!uniqueColors.some(([c, _]) => colorDifference(c, color) < 10)) {
        uniqueColors.push([color, count])
      }
    }

    // Convert back to object
    const filtered = uniqueColors.reduce((obj, [color, count]) => {
      obj[color] = count
      return obj
    }, {})

    setColorCounts(filtered)
  }

  const rgbToHex = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g)
    return '#' + [r, g, b].map(x => {
      const hex = parseInt(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image to Palette</title>
        <meta name="description" content="Convert image to color palette" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Image to Palette
        </h1>
        <h2 className={styles.description}>
          Extract top 10 unique colors from an image
        </h2>

        <input type="file" onChange={handleImage} />
        
        <div id="palette-card" style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #333',
          borderRadius: '10px',
        }}>
          <canvas
            id="canvas"
            style={{
              border: '1px solid #0e0e0e',
              width: '100%',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            flexFlow: 'row wrap',
            justifyContent: 'flex-start'
          }}>
            {Object.entries(colorCounts).map(([color, count], index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '69px',
                  height: '69px',
                  backgroundColor: color,
                  borderRadius: '5px',
                  border: '1px solid #333'
                }} />
                <span style={{
                  fontSize: '12px',
                  color: '#888',
                  marginTop: '5px'
                }}>
                  {rgbToHex(color)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button style={{
          marginTop: '20px'
        }} onClick={() => {
          const paletteCard = document.getElementById('palette-card')
          html2canvas(paletteCard, {
            backgroundColor: '#000'
          }).then((canvas) => {
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'palette.png'
            a.click()
          })
        }}>
          Download Palette
        </button>
      </main>
    </div>
  )
}
