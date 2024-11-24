import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function CustomTexture() {
  const [img, setImg] = useState(null)
  const [customTexture, setCustomTexture] = useState(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const canvasRef = useRef(null)

  const fillWithCustomTexture = (x, y) => {
    if (!canvasRef.current || !customTexture) return
    let canvas = canvasRef.current
    let context = canvas.getContext('2d')
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    
    // Pick the pixel that mouse is clicking
    let currentPixelColor = context.getImageData(x, y, 1, 1).data
    let rgb = [currentPixelColor[0], currentPixelColor[1], currentPixelColor[2]]

    // Create a pattern from the custom texture
    let pattern = context.createPattern(customTexture, 'repeat')
    context.fillStyle = pattern

    // Find all neighboring pixels that have the same color as the clicked pixel and fill them with the custom texture
    let stack = [[x, y]]
    let visited = new Set()
    while (stack.length > 0) {
      let [x, y] = stack.pop()
      let index = (y * canvas.width + x) * 4
      if (visited.has(index) || x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue
      visited.add(index)
      if (colorDistance([data[index], data[index + 1], data[index + 2]], rgb) < 50) {
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
    if (!img || !customTexture || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)

    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor(event.clientX - rect.left)
      const y = Math.floor(event.clientY - rect.top)
      setX(x)
      setY(y)
      fillWithCustomTexture(x, y)
    }

    canvas.addEventListener('click', handleCanvasClick)

    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
    }
  }, [img, customTexture])

  const loadImage = (file, setImageFunction) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        setImageFunction(img)
        if (setImageFunction === setImg && canvasRef.current) {
          const canvas = canvasRef.current
          canvas.width = img.width
          canvas.height = img.height
          const context = canvas.getContext('2d')
          context.drawImage(img, 0, 0)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Head>
        <title>Custom Texture Filter</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Click the area you want to fill with custom texture" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Custom Texture Filter
        </h1>
        <h2 className={styles.description}>
          Click the area you want to fill with custom texture
        </h2>
        <div>
          <label htmlFor="imageUpload">Upload Image: </label>
          <input 
            id="imageUpload"
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0]
              loadImage(file, setImg)
            }} 
          />
        </div>
        <div>
          <label htmlFor="textureUpload">Upload Texture: </label>
          <input 
            id="textureUpload"
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0]
              loadImage(file, setCustomTexture)
            }} 
          />
        </div>
        <canvas ref={canvasRef} style={{ border: '1px solid #333', borderRadius: '10px' }}></canvas>

        <button onClick={() => {
          if (img && canvasRef.current) {
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(img, 0, 0)
          }
        }}>
          Reset
        </button>
        <button onClick={() => {
          if (canvasRef.current) {
            const canvas = canvasRef.current
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'custom_texture_filter.png'
            a.click()
          }
        }}>
          Save Image
        </button>
      </main>
    </>
  )
}
