// text to Chonks generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import {analytics} from '@/utils/analytics'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [bg, setBg] = useState('#000')
  const [pattern, setPattern] = useState('')
  const [loading, setLoading] = useState(false)


  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    // analytics('text2Chonks', { text })
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send an array of 2 values, 1st value is the background and 2nd value is the foreground color for e.g. ["#000", "#fff"].
    Pattern or background will never be #000 or #fff.
    Pattern will never be empty, it will always have a pattern tag with some content inside it.
    Pattern will never have image or external link, it will always have some svg tags inside it.
    Background and pattern will never be same color.
    Pattern will have a width and height > 0.
    Patterns can be gradients. Background can be a gradient.
    Patterns can be animated or static, it can have multiple shapes or a single shape.
    Together with the background and pattern it will create a beautiful svg that matches the text.
    The id of pattern will be "pattern" at all times.
    Don't send incomplete or incorrect data or empty values for the pattern.
    Only respond in array, no prefix or suffix.
    Keep it minimal.`;
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        prompt,
        model: 'gpt-3.5-turbo'
      })
    })
    const data = await res.json()
    setSensationalizedText(data.response)
    let arr = JSON.parse(data.response || '[]')
    setBg(arr[0] || '#000')
    setPattern(arr[1] || '')
    setLoading(false)
  }

  let ChonksSVG = `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" viewBox="0 0 30 30" fill="none" style="max-width:100vw;max-height:100vh;width:100%;background:${bg}">
  <style>
    #main rect{width:1px;height:1px}
  </style>
  <rect style="width:30px;height:30px;background:${bg}"/>
  ${pattern}
  <g id="main" style="scale:100%;transform:translate(0,0)">
    <g id="Body" fill="${pattern}">
      <path fill="${pattern}" d="M11 9h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-8 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-9 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M11 9h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-8 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-9 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M9 12h1v1H9z"/>
      <path fill="${pattern}" d="M10 12h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="#fff" d="M12 12h1v1h-1z"/>
      <path fill="#000" d="M13 12h1v1h-1z"/>
      <path fill="${pattern}" d="M14 12h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="#fff" d="M17 12h1v1h-1z"/>
      <path fill="#000" d="M18 12h1v1h-1z"/>
      <path fill="${pattern}" d="M19 12h1v1h-1z"/>
      <path fill="${pattern}" d="M9 13h1v1H9z"/>
      <path fill="${pattern}" d="M10 13h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="#fff" d="M12 13h1v1h-1z"/>
      <path fill="#000" d="M13 13h1v1h-1z"/>
      <path fill="${pattern}" d="M14 13h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="#fff" d="M17 13h1v1h-1z"/>
      <path fill="#000" d="M18 13h1v1h-1z"/>
      <path fill="${pattern}" d="M19 13h1v1h-1zm-9 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-8 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M11 16h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M10 17h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-9 1h1v1H9zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M12 18h1v1h-1z"/>
      <path fill="${pattern}" d="M13 18h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M16 18h1v1h-1z"/>
      <path fill="${pattern}" d="M17 18h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zM9 19h1v1H9z"/>
      <path fill="${pattern}" d="M10 19h1v1h-1z"/>
      <path fill="${pattern}" d="M11 19h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M18 19h1v1h-1z"/>
      <path fill="${pattern}" d="M19 19h1v1h-1zM9 20h1v1H9z"/>
      <path fill="${pattern}" d="M10 20h1v1h-1z"/>
      <path fill="${pattern}" d="M11 20h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1z"/>
      <path fill="${pattern}" d="M18 20h1v1h-1z"/>
      <path fill="${pattern}" d="M19 20h1v1h-1zm-8 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-6 1h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-6 1h1v1h-1zm1 0h1v1h-1zm4 0h1v1h-1zm1 0h1v1h-1z"/>

    </g>
  </g>
</svg>
`

  return (
    <>
      <Head>
        <title>Text to Chonks</title>
        <meta name="description" content="Convert text to Chonks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Chonks
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to Chonks
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate Chonks"
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
          <img src={getDataURI(ChonksSVG)} alt="Chonks" style={{ width: '100%',  borderRadius: 10 }} />
           {/* <span style={{
              display: 'flex',
              maxWidth: 500,
              margin: '20px auto',
              marginTop: 20,
              border: '1px solid #333',
              borderRadius: 10,
              padding: 20,
              flexWrap: 'wrap',
              overflow: 'auto',
            }}>
              {sensationalizedText}
            </span>  */}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: 20 }}>

          <button onClick={() => {
            // download svg
            const svg = ChonksSVG;
            // download svg as png 1000x1000
            const canvas = document.createElement('canvas');
            canvas.width = 1000;
            canvas.height = 1000;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = getDataURI(svg);
            img.onload = () => {
              ctx.drawImage(img, 0, 0, 1000, 1000);
              const a = document.createElement('a');
              a.href = canvas.toDataURL('image/png');
              a.download = 'Chonks.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download Chonks
          </button>
        </div>
      </main>
    </>
  )
}
