import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { removeBackground } from '@imgly/background-removal'

export default function Regenerates() {
  const [img, setImg] = useState(null)
  const [fg, setFg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [offsetX, setOffsetX] = useState(-2)
  const [offsetY, setOffsetY] = useState(124)
  const [scale, setScale] = useState(0.5)

  const removeBg = async (imageSrc) => {
    try {
      setLoading(true)
      const blob = await removeBackground(imageSrc)
      const url = URL.createObjectURL(blob)
      setLoading(false)
      return url
    } catch (error) {
      console.error('Background removal failed:', error)
    }
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (fg) {
      const bg = new Image()
      bg.src = '/regenerates.jpg'
      bg.onload = () => {
        canvas.width = bg.width
        canvas.height = bg.height
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(bg, 0, 0, bg.width, bg.height)
        const image = new Image()
        image.src = fg
        image.onload = () => {
          context.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale)
          context.closePath()
        }
      }
    }
  }, [fg, offsetX, offsetY, scale])

  useEffect(() => {
    // first remove bg
    // draw regenerates.jpg on canvas then image with bg removed
    if (!img) return
    removeBg(img).then((fg) => {
      setFg(fg)
    })
  }, [img])

  return (
    <>
      <Head>
        <title>Regenerates</title>
        <meta name="description" content="Add regenerates bg on any image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Regenerate 
        </h1>
        <h2 className={styles.description}>
          Add regenerates bg on any image
        </h2>
        <canvas width={800} height={800} id="canvas" style={{ width: '100%', border: '1px solid #333', borderRadius: 10 }}></canvas>
        <span>
        {loading ? 'removing bg...' : 'Upload image'}
          </span>

        
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0]
            setImg(file)
          }}
        />
        <label>
          Offset X
          </label>
        <input
          type="range"
          min={-800}
          max={800}
          value={offsetX}
          onChange={(e) => setOffsetX(e.target.value)}
        />
        <label>
          Offset Y
          </label>
        <input
          type="range"
          min={-800}
          max={800}
          value={offsetY}
          onChange={(e) => setOffsetY(e.target.value)}
        />
        <label>
          Scale
          </label>
        <input
          type="range"
          min={0}
          max={100}
          step={0.01}
          value={scale}
          onChange={(e) => setScale(e.target.value)}
        />
        <button
          onClick={() => {
            // download canvas as image
            const canvas = document.getElementById('canvas')
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'regenerates.png'
            a.click()
          }}
        >
          Download
        </button>
      </main>
    </>
  )
}
