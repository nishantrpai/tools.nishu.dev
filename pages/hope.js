import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function PosterizeFilter() {
  const [image, setImage] = useState(null)

  const PALETTE = [
    '#6d919b', // grayish blue
    '#d72424', // red
    '#dedad0', // beige
    '#002c4a', // dark blue
    '#add8e6', // light blue
    '#ff0000', // bright red
    '#f5f5dc', // beige
    '#00008b', // dark blue
  ]

  const findClosestColor = (r, g, b) => {
    return PALETTE.reduce((closest, color) => {
      const [cr, cg, cb] = [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)
      ]
      
      const distance = Math.sqrt(
        Math.pow(r - cr, 2) + 
        Math.pow(g - cg, 2) + 
        Math.pow(b - cb, 2)
      )
      
      return distance < closest.distance ? { color: [cr, cg, cb], distance } : closest
    }, { color: [0, 0, 0], distance: Infinity }).color
  }

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    context.drawImage(image, 0, 0, image.width, image.height)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = findClosestColor(data[i], data[i + 1], data[i + 2])
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }

    context.putImageData(imageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Poster Filter</title>
        <meta name="description" content="Poster Style Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Poster Filter</h1>
        <h2 className={styles.description}>Transform your image into poster style</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            id="canvas"
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => {
                setImage(img)
              }
            }
            reader.readAsDataURL(file)
          }} />


          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'poster_filter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
