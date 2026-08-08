// text to 8bit generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'


export default function Home() {
  const [currentColor, setCurrentColor] = useState('#000')
  const [grid, setGrid] = useState({ rows: 8, cols: 8 })

  const GRID_OPTIONS = [
    { label: '8×8', rows: 8, cols: 8 },
    { label: '11×11', rows: 11, cols: 11 },
    { label: '13×11', rows: 11, cols: 13 },
    { label: '15×15', rows: 15, cols: 15 },
  ]




  const drawPixels = (rows, cols) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rectWidth = canvas.width / cols;
    const rectHeight = canvas.height / rows;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(j * rectWidth, i * rectHeight, rectWidth + 1, rectHeight + 1);
      }
    }
  }

  const startDrawing = event => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const { rows, cols } = grid;
    const rectWidth = canvas.width / cols;
    const rectHeight = canvas.height / rows;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const i = Math.floor(y / rectHeight);
    const j = Math.floor(x / rectWidth);
    // fill the color
    ctx.fillStyle = currentColor;
    ctx.fillRect(j * rectWidth, i * rectHeight, rectWidth + 1, rectHeight + 1);
  }

  useEffect(() => {
    drawPixels(grid.rows, grid.cols)
  }, [grid])

  const downloadCanvas = (size) => {
    const canvas = document.getElementById('canvas');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d');
    
    // Draw the original canvas content scaled to the new size
    ctx.imageSmoothingEnabled = false; // Keep pixel art sharp
    ctx.drawImage(canvas, 0, 0, size, size);
    
    const dataURL = tempCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `8bit-${size}x${size}.png`;
    a.click();
  }



  return (
    <>
      <Head>
        <title>8bit Canvas</title>
        <meta name="description" content="Draw 8bit pixel art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to 8bit
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Draw 8bit pixel art
        </span>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          {GRID_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => setGrid({ rows: opt.rows, cols: opt.cols })}
              className={styles.button}
              style={{ opacity: grid.rows === opt.rows && grid.cols === opt.cols ? 1 : 0.4 }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5 }}>
          {/* {zorbitSvg()} */}
          <canvas id="canvas" width="500" height="500"
            onMouseDown={startDrawing}
          ></canvas>
          <SketchPicker color={currentColor} onChangeComplete={(color) => {
            setCurrentColor(color.hex)
          }} styles={{
            margin: '0 auto',
          
          }}/>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: 20 }}>

          <button onClick={() => downloadCanvas(500)} className={styles.button}>
            Download (500x500)
          </button>

          <button onClick={() => downloadCanvas(1024)} className={styles.button}>
            Download (1024x1024)
          </button>

          <button onClick={() => downloadCanvas(2048)} className={styles.button}>
            Download (2048x2048)
          </button>
        </div>
      </main>
    </>
  )
}
