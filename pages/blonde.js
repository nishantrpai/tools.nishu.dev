import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function blonde() {
  const [img, setImg] = useState(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [undoStack, setUndoStack] = useState([])
  const [colorTolerance, setColorTolerance] = useState(20)
  const blondeShades = [
    // Dark to light blonde shades
    '#fbe7a1',
    '#e1cf90',
    '#c8b880',
    '#afa170'
  ]
    const colorDistance = (c1, c2) => {
    return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2)
  }

  const hexToRGB = (hex) => {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ]
  }

  const fillblondeColor = (x, y, currentblondeShade) => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    
    // Save current state for undo
    const currentState = context.getImageData(0, 0, canvas.width, canvas.height)
    setUndoStack(prev => [...prev, currentState])
    
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    // pick the pixel that mouse is clicking
    let currentPixelColor = canvas.getContext('2d').getImageData(x, y, 1, 1).data
    let rgb = [currentPixelColor[0], currentPixelColor[1], currentPixelColor[2]]
    let blondeColor = hexToRGB(currentblondeShade)

    // find all neighboring pixels that have the same color as the clicked pixel and fill them with the new color
    let stack = [[x, y]]
    let visited = new Set()
    while (stack.length > 0) {
      let [x, y] = stack.pop()
      let index = (y * canvas.width + x) * 4
      if (visited.has(index)) continue
      visited.add(index)
      if (colorDistance([data[index], data[index + 1], data[index + 2]], rgb) < colorTolerance) {
        data[index] = blondeColor[0]
        data[index + 1] = blondeColor[1]
        data[index + 2] = blondeColor[2]
        stack.push([x - 1, y])
        stack.push([x + 1, y])
        stack.push([x, y - 1])
        stack.push([x, y + 1])
      }
    }
    context.putImageData(imgData, 0, 0)
  }

  // reset the canvas when a new image is uploaded
  useEffect(() => {
    if (!img) return
    const canvas = document.getElementById('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)
    setUndoStack([])

    const handleCanvasClick = (event) => {
      const x = event.clientX - canvas.offsetLeft
      const y = event.clientY - canvas.offsetTop
      setX(x)
      setY(y)
      // get blonde shade from the hidden span
      const hiddenShade = document.getElementById('blondeShadeSpan').textContent
      fillblondeColor(x, y, hiddenShade)
    }

    canvas.addEventListener('click', handleCanvasClick)

    // cleanup event listener when component unmounts or image changes
    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
    }
  }, [img]) // only reset the canvas if the image changes

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const previousState = undoStack[undoStack.length - 1]
      context.putImageData(previousState, 0, 0)
      setUndoStack(prev => prev.slice(0, -1))
    }
  }

  return (
    <>
      <Head>
        <title>blonde</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Add blonde color to an image and save it" />
      </Head>
      <main>
        <h1 className={styles.title}>
          blonde
        </h1>
        <h2 className={styles.description}>
          Add blonde color to an image and save it
        </h2>
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
              setImg(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" style={{ border: '1px solid black' }}></canvas>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {blondeShades.map((shade, index) => (
            <button key={index} style={{ backgroundColor: shade, color: 'white', width: '20px', height: '20px' }} 
                    onClick={() => document.getElementById('blondeShadeSpan').textContent = shade}>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Color Tolerance: {colorTolerance}</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={colorTolerance}
            onChange={(e) => setColorTolerance(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </div>

        {/* hidden span to hold the color */}
        <span id="blondeShadeSpan" style={{ visibility: 'hidden' }}>#294f14</span>

        {/* reset */}
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const context = canvas.getContext('2d')
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0)
          setUndoStack([])
        }}>
          Reset
        </button>
        <button onClick={handleUndo} disabled={undoStack.length === 0}>
          Undo
        </button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = 'blonde.png'
          a.click()
        }}>
          Save blonde
        </button>
      </main>
    </>
  )
}
