import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Pepe() {
  const [img, setImg] = useState(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const pepeShades = [
    // dark light pepe shades
    '#294f14', '#67984C', '#7AA357', '#8CB162', '#9EBF6D', '#B0CD78', '#C2DB83', '#D4E98E', '#E6F799',
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

  const fillPepeColor = (x, y, currentPepeShade) => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    // pick the pixel that mouse is clicking
    let currentPixelColor = canvas.getContext('2d').getImageData(x, y, 1, 1).data
    let rgb = [currentPixelColor[0], currentPixelColor[1], currentPixelColor[2]]
    let pepeColor = hexToRGB(currentPepeShade)

    // find all neighboring pixels that have the same color as the clicked pixel and fill them with the new color
    let stack = [[x, y]]
    let visited = new Set()
    while (stack.length > 0) {
      let [x, y] = stack.pop()
      let index = (y * canvas.width + x) * 4
      if (visited.has(index)) continue
      visited.add(index)
      if (colorDistance([data[index], data[index + 1], data[index + 2]], rgb) < 50) {
        data[index] = pepeColor[0]
        data[index + 1] = pepeColor[1]
        data[index + 2] = pepeColor[2]
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

    const handleCanvasClick = (event) => {
      const x = event.clientX - canvas.offsetLeft
      const y = event.clientY - canvas.offsetTop
      setX(x)
      setY(y)
      // get pepe shade from the hidden span
      const hiddenShade = document.getElementById('pepeShadeSpan').textContent
      fillPepeColor(x, y, hiddenShade)
    }

    canvas.addEventListener('click', handleCanvasClick)

    // cleanup event listener when component unmounts or image changes
    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
    }
  }, [img]) // only reset the canvas if the image changes

  return (
    <>
      <Head>
        <title>Pepe</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Add pepe color to an image and save it" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Pepe
        </h1>
        <h2 className={styles.description}>
          Add pepe color to an image and save it
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
          {pepeShades.map((shade, index) => (
            <button key={index} style={{ backgroundColor: shade, color: 'white', width: '20px', height: '20px' }} 
                    onClick={() => document.getElementById('pepeShadeSpan').textContent = shade}>
            </button>
          ))}
        </div>

        {/* hidden span to hold the color */}
        <span id="pepeShadeSpan" style={{ visibility: 'hidden' }}>#294f14</span>

        {/* reset */}
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const context = canvas.getContext('2d')
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0)
        }}>
          Reset
        </button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = 'pepe.png'
          a.click()
        }}>
          Save Pepe
        </button>
      </main>
    </>
  )
}
