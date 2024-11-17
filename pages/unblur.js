import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function BlurArea() {
  const [image, setImage] = useState(null)
  const [blurAmount, setBlurAmount] = useState(5)
  const [selectedArea, setSelectedArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedAreaOnly, setSelectedAreaOnly] = useState(true)
  const canvasRef = useRef(null)
  const startPosRef = useRef({ x: 0, y: 0 })

  const applyBlur = (ctx, img, forDownload = false) => {
    const width = img.width
    const height = img.height

    if (selectedAreaOnly) {
      // First draw the blurred version
      ctx.filter = `blur(${blurAmount}px)`
      ctx.drawImage(img, 0, 0)
      ctx.filter = 'none'

      // Then draw the unblurred selected area
      const { x, y, width: selWidth, height: selHeight } = selectedArea
      ctx.drawImage(img, x, y, selWidth, selHeight, x, y, selWidth, selHeight)
    } else {
      // If no area is selected, blur the entire image
      ctx.filter = `blur(${blurAmount}px)`
      ctx.drawImage(img, 0, 0)
      ctx.filter = 'none'
    }
  }

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        applyBlur(ctx, img)
      }
    }
  }, [image, blurAmount, selectedArea, selectedAreaOnly])

  const handleMouseDown = (e) => {
    if (!image || !selectedAreaOnly) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    startPosRef.current = { x, y }
    setIsSelecting(true)
  }

  const handleMouseMove = (e) => {
    if (!isSelecting || !selectedAreaOnly) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setSelectedArea({
      x: Math.min(x, startPosRef.current.x),
      y: Math.min(y, startPosRef.current.y),
      width: Math.abs(x - startPosRef.current.x),
      height: Math.abs(y - startPosRef.current.y)
    })
    console.log('selected area', selectedArea)
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  return (
    <>
      <Head>
        <title>Unblur</title>
        <meta name="description" content="Unblur out specific area from image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Unblur</h1>
        <h2 className={styles.description}>Select area to keep unblurred, rest will be blurred</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <div>
          <label>Blur Amount: {blurAmount}</label>
          <input type="range" min={0} max={20} value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))} />
        </div>
        <canvas 
          ref={canvasRef}
          style={{  height: 'auto', cursor: selectedAreaOnly ? 'crosshair' : 'default' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <button onClick={() => {
          setImage(null)
          setSelectedArea({ x: 0, y: 0, width: 0, height: 0 })
        }}>Clear</button>
        <button onClick={() => {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.src = URL.createObjectURL(image)
          img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            applyBlur(ctx, img, true)
            const a = document.createElement('a')
            a.href = canvas.toDataURL()
            a.download = 'blur_area.png'
            a.click()
            // Redraw the canvas with the selection rectangle
            applyBlur(ctx, img)
          }
        }}>Download</button>
      </main>
    </>
  )
}