// text to 8bit generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { SketchPicker } from 'react-color'
import {analytics} from '@/utils/analytics'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('[]')
  const [bg, setBg] = useState('#000')
  const [pattern, setPattern] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000')
  const [coloredPixels, setColoredPixels] = useState([])




  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const drawPixels = () => {
    // on 500x500 canvas fill the pixels 500/8 = 62.5 with color
    const canvas = document.getElementById('canvas');
    let canvasWidth = canvas.width; 
    let canvasHeight = canvas.height;
    const ctx = canvas.getContext('2d');
    let colors = JSON.parse(sensationalizedText) || [];
    console.log(colors)
    let rows = 8;
    let cols = 8;
        const rectWidth = canvasWidth / cols;
    const rectHeight = canvasHeight / rows;
    let colorIndex = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.fillStyle = colors[colorIndex] || '#fff';
        ctx.fillRect(j * rectWidth, i * rectHeight, rectWidth + 1, rectHeight + 1);
        // ctx.strokeRect(j * rectWidth, i * rectHeight, rectWidth, rectHeight);
        colorIndex++;

      }
    }

  }

  const startDrawing = event => {
    // in the 8x8 grid, find the x,y and fill the current color
    const canvas = document.getElementById('canvas');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    const ctx = canvas.getContext('2d');
    let rows = 8;
    let cols = 8;
    const rectWidth = canvasWidth / cols;
    const rectHeight = canvasHeight / rows;
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
    drawPixels()
  }, [sensationalizedText])

  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    analytics('8bitcanvas', { text })
    setLoading(true)
    console.log(text)
    let prompt = `Given the prompt:${text}.\n\n
    I have a 8 x 8 grid of squares, fill it with valid hex to match the prompt from birds eye view.\n\n
    Only send 64 hex colors as an array.\n\n
    Keep it minimal.`;
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setSensationalizedText(data.response)
  
    setLoading(false)
  }


  return (
    <>
      <Head>
        <title>Text to 8bit</title>
        <meta name="description" content="Draw 8bit art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to 8bit
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to 8bit
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate background"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            fontSize: 20,
            background: '#000',
            borderRadius: 10,
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
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

          <button onClick={() => {
            // download canvas as image
            const canvas = document.getElementById('canvas');
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = '8bit.png';
            a.click();
            
          }} className={styles.button}>
            Download
          </button>
        </div>
      </main>
    </>
  )
}
