import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function MatrixEffect() {
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(10)
  const [matrixColor, setMatrixColor] = useState('#00FF00') // Matrix green
  const [speed, setSpeed] = useState(50)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (text) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = 800 // Set a default width
      canvas.height = 800 // Set a default height
      startMatrixEffect(ctx, canvas.width, canvas.height)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [text, fontSize, matrixColor, speed])

  const startMatrixEffect = (ctx, width, height) => {
    const columns = Math.floor(width / fontSize)
    const drops = new Array(columns).fill(1)
    const chars = text.split('')

    const matrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = matrixColor
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationRef.current = setTimeout(() => requestAnimationFrame(matrix), speed)
    }

    matrix()
  }

  return (
    <>
      <Head>
        <title>Matrix Effect</title>
        <meta name="description" content="Create matrix-like effect from text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Matrix Effect</h1>
        <h2 className={styles.description}>Turn your text into a matrix-like animation</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here"
          rows={4}
          style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}
        />
        <div>
          <label>Font Size: {fontSize}px</label>
          <input 
            type="range" 
            min={5} 
            max={40} 
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))} 
          />
        </div>
        <div>
          <label>Matrix Color:</label>
          <input 
            type="color" 
            value={matrixColor}
            onChange={(e) => setMatrixColor(e.target.value)} 
          />
        </div>
        <div>
          <label>Animation Speed: {speed}ms</label>
          <input 
            type="range" 
            min={10} 
            max={200} 
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))} 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas 
            ref={canvasRef}
            style={{ width: '100%' }}
            width={800}
            height={800}
          />
        </div>
        <button onClick={() => {
          const canvas = canvasRef.current
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'matrix_effect.png'
          a.click()
        }}>Download Image</button>
      </main>
    </>
  )
}