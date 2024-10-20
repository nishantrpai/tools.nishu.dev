import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function DiamondFilter() {
  const [img, setImg] = useState(null)
  const [diamondTexture, setDiamondTexture] = useState(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    // Load the diamond texture
    const texture = new Image()
    texture.src = '/diamondfilter.jpg'
    texture.onload = () => setDiamondTexture(texture)
  }, [])

  const fillWithDiamondTexture = (x, y) => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    
    // Pick the pixel that mouse is clicking
    let currentPixelColor = context.getImageData(x, y, 1, 1).data
    let rgb = [currentPixelColor[0], currentPixelColor[1], currentPixelColor[2]]

    // Create a pattern from the diamond texture
    let pattern = context.createPattern(diamondTexture, 'repeat')

    // Find all neighboring pixels that have the same color as the clicked pixel and fill them with the diamond texture
    let stack = [[x, y]]
    let visited = new Set()
    while (stack.length > 0) {
      let [x, y] = stack.pop()
      let index = (y * canvas.width + x) * 4
      if (visited.has(index)) continue
      visited.add(index)
      if (colorDistance([data[index], data[index + 1], data[index + 2]], rgb) < 50) {
        context.fillStyle = pattern
        context.fillRect(x, y, 1, 1)
        stack.push([x - 1, y])
        stack.push([x + 1, y])
        stack.push([x, y - 1])
        stack.push([x, y + 1])
      }
    }
  }

  const colorDistance = (c1, c2) => {
    return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2)
  }

  useEffect(() => {
    if (!img || !diamondTexture) return
    const canvas = document.getElementById('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)

    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setX(x)
      setY(y)
      fillWithDiamondTexture(x, y)
    }

    canvas.addEventListener('click', handleCanvasClick)

    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
    }
  }, [img, diamondTexture])

  return (
    <>
      <Head>
        <title>Diamond Filter</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Add diamond texture to an image and save it" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Diamond Filter
        </h1>
        <h2 className={styles.description}>
          Add diamond texture to an image and save it
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
        <canvas id="canvas" style={{ border: '1px solid #333', borderRadius: '10px' }}></canvas>

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
          a.download = 'diamond_filter.png'
          a.click()
        }}>
          Save Image
        </button>
      </main>
    </>
  )
}
