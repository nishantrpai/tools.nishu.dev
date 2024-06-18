// text to scapepe generator
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
  const [opepenSVG, setOpepenSVG] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 -36 70 100" style="background:#fff">  <rect width="72" height="24" fill="#00A400" id="face"/>  <rect x="3" y="4" width="32" height="8" fill="#fff"/>  <rect x="37" y="4" width="32" height="8" fill="#fff"/>  <rect x="20" y="4" width="15" height="8" fill="#000"/>  <rect x="54" y="4" width="15" height="8" fill="#000"/>  <rect x="0" y="15" width="72" id="lips" height="6" fill="#FE0100"/>  <rect x="3" y="17.5" width="66" height="1" fill="#000"/></svg>`)


  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send a json array of 3 hex color values, 1st value is the background and second value is for the face and third value is for the lips for e.g., for 3 values it would be ["#000","#fff","#000"].
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
    setColors([arr[0] || '#fff', arr[1] || '#00A400', arr[2] || '#FE0100'])
    setLoading(false)
  }

  useEffect(() => {
    let tmpSvg = opepenSVG;
    tmpSvg = new DOMParser().parseFromString(tmpSvg, 'image/svg+xml');
    let svg = tmpSvg.documentElement;
    svg.setAttribute('style', `background:${colors[0]}`);
    svg.querySelector('#face').setAttribute('fill', colors[1]);
    svg.querySelector('#lips').setAttribute('fill', colors[2]);
    setOpepenSVG(svg.outerHTML);
  },[colors])


  return (
    <>
      <Head>
        <title>Text to Scapepe</title>
        <meta name="description" content="Convert text to Scapepe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Scapepe
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to Scapepe
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate Scapepe"
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
          <img src={getDataURI(opepenSVG)} alt="Scapepe" style={{ width: 500, height: 500, borderRadius: 10 }} />
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
              a.download = 'Scapepe.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download Scapepe
          </button>
        </div>
      </main>
    </>
  )
}
