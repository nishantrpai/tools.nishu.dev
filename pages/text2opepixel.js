// text to opepixel
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [bg, setBg] = useState('#000')
  const [pattern, setPattern] = useState('')
  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState(['#fff', '#00A400', '#FE0100'])
  const [opepenSVG, setOpepenSVG] = useState(`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">  <defs>    <style>      .cls-1, .cls-2, .cls-3, .cls-4, .cls-5 {        stroke-width: 0px;      }</style>  </defs>  <rect class="cls-1" width="1000" height="1000"/>  <g>    <path class="cls-2" d="m500,437.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>    <path class="cls-2" d="m750,437.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>    <g>      <g>        <path class="cls-3" d="m375,312.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-4" d="m500,312.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-5" d="m375,437.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>      </g>      <g>        <path class="cls-3" d="m625,312.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-4" d="m750,312.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-5" d="m625,437.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>      </g>      <g>        <path class="cls-3" d="m375,562.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-4" d="m500,562.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-3" d="m625,562.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-4" d="m750,562.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-5" d="m375,687.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-2" d="m500,687.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-5" d="m625,687.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-2" d="m750,687.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>      </g>      <g>        <path class="cls-5" d="m375,937.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-2" d="m500,937.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-5" d="m625,937.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84h0c0-33.77,27.37-61.14,61.14-61.14h1.36c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>        <path class="cls-2" d="m750,937.5c0,17.26-7,32.89-18.31,44.19-11.62,11.62-27.78,18.69-45.59,18.3-34.19-.75-61.1-29.64-61.1-63.84v-61.05c0-.05.04-.1.1-.1h62.4c17.25,0,32.87,6.99,44.19,18.3,11.31,11.31,18.31,26.94,18.31,44.2Z"/>      </g>    </g>  </g></svg>`)


  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send a json array of only 2 hex color values, 1st value is the background and second value is for the foreground for e.g., for 2 values it would be ["#000","#fff"].
    You can also use gradients for background.
    No prefixes or objects only values.
    Don't send incomplete or incorrect data or empty values for the pattern.
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
    let arr = JSON.parse(data.response || '[]')
    setBg(arr[0] || '#000')
    setPattern(arr[1] || '')
    setColors([arr[0] || '#fff', arr[1] || '#00A400'])
    setLoading(false)
  }

  useEffect(() => {
    let tmpSvg = opepenSVG;
    tmpSvg = new DOMParser().parseFromString(tmpSvg, 'image/svg+xml');
    let svg = tmpSvg.documentElement;
    console.log(colors);
    svg.setAttribute('style', `background:${colors[0]}`);
    svg.querySelector('.cls-1').setAttribute('fill', colors[0]);
    Array.from(svg.querySelectorAll('.cls-2')).forEach((el) => el.setAttribute('fill', colors[1]));
    Array.from(svg.querySelectorAll('.cls-2')).forEach((el) => el.style.fill = colors[1]);
    Array.from(svg.querySelectorAll('.cls-3')).forEach((el) => el.setAttribute('fill', colors[1]));
    Array.from(svg.querySelectorAll('.cls-3')).forEach((el) => el.style.fill = colors[1]);
    Array.from(svg.querySelectorAll('.cls-4')).forEach((el) => el.setAttribute('fill', colors[1]));
    Array.from(svg.querySelectorAll('.cls-4')).forEach((el) => el.style.fill = colors[1]);
    Array.from(svg.querySelectorAll('.cls-5')).forEach((el) => el.setAttribute('fill', colors[1]));
    Array.from(svg.querySelectorAll('.cls-5')).forEach((el) => el.style.fill = colors[1]);
    
    setOpepenSVG(svg.outerHTML);
  },[colors])


  return (
    <>
      <Head>
        <title>Text to Opepixel</title>
        <meta name="description" content="Convert text to Opepixel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Opepixel
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to Opepixel
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate Opepixel"
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
          <img src={getDataURI(opepenSVG)} alt="Opepixel" style={{ width: 500, height: 500, borderRadius: 10 }} />
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
            const svg = opepenSVG;
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
              a.download = 'Opepixel.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download Opepixel
          </button>
        </div>
      </main>
    </>
  )
}
