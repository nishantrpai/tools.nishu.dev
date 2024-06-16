// text to Apepen generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [bg, setBg] = useState('#000')
  const [pattern, setPattern] = useState('')
  const [colors, setColors] = useState(['#fff', '#fff'])
  const [loading, setLoading] = useState(false)
  const [opepenSVG, setOpepenSVG] = useState(`<svg width="300" height="290" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg"><!--Outer large rectangle-->  <rect x="40" y="20" width="120" height="120" fill="#fff" stroke="black" stroke-width="4" id="dark"/><!--ears-->  <rect x="10" y="50" width="30" height="60" fill="#fff" stroke="black" stroke-width="4" id="dark"/>  <rect x="20" y="60" width="20" height="40" fill="none" stroke="black" stroke-width="4" id="light"/>  <rect x="160" y="50" width="30" height="60" fill="none" stroke="black" stroke-width="4" id="dark"/>  <rect x="160" y="60" width="20" height="40" fill="none" stroke="black" stroke-width="4" id="light"/><!--eyelid-->  <rect x="40" y="50" width="120" height="60" fill="none" stroke="black" stroke-width="4" id="light"/><!--eyes-->  <rect x="40" y="50" width="60" height="60" fill="none" stroke="black" stroke-width="4"/><!--eye ball-->  <rect x="40" y="100" width="60" height="10" fill="#fff" stroke="black" stroke-width="4"/>  <rect x="100" y="100" width="60" height="10" fill="#fff" stroke="black" stroke-width="4"/><!--iris-->  <rect x="125" y="100" width="20" height="10" fill="#000" stroke="black" stroke-width="4"/>  <rect x="65" y="100" width="20" height="10" fill="#000" stroke="black" stroke-width="4"/><!--mouth-->  <rect x="40" y="110" width="120" height="15" fill="none" stroke="black" stroke-width="4" id="light"/>  <rect x="40" y="125" width="120" height="15" fill="none" stroke="black" stroke-width="4" id="light"/><!--body-->  <rect x="40" y="165" width="120" height="40" fill="none" stroke="black" stroke-width="4" id="dark"/>  <rect x="60" y="180" width="80" height="40" fill="none" stroke="black" stroke-width="4" id="light"/></svg>`)


  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send a json array of 2 hex color values, 1st value is the background and second value is for the foreground for e.g., for 2 values it would be ["#000","#fff"].
    Values should be valid hex color codes and should be in double quotes.
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
    setColors([arr[0] || '#000', arr[1] || ''])
    setLoading(false)
  }


  const getDarkColor = (hex) => {
    // darken by 60% and return hex
    let color = hex;
    
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.round(r * 0.6);
    g = Math.round(g * 0.6);
    b = Math.round(b * 0.6);

    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }


  useEffect(() => {
    let tmp = opepenSVG;

    console.log('colors', colors)
    // replace colors in svg
    let svgDom = new DOMParser().parseFromString(tmp, 'image/svg+xml');
    // select svg elemen 
    let svg = svgDom.querySelector('svg');
    // set background color
    svg.setAttribute('style', `background: ${colors[0]}`);
    // select all rects
    let rects = svgDom.querySelectorAll('rect');
    // set colors
    rects.forEach((rect, i) => {
      // get id of rect
      if (rect.id === 'dark') {
        rect.setAttribute('fill', getDarkColor(colors[1]));
      }
      if (rect.id === 'light') {
        rect.setAttribute('fill', colors[1]);
      }
    })

    // set svg
    setOpepenSVG(svgDom.documentElement.outerHTML);
  }, [colors])

  return (
    <>
      <Head>
        <title>Text to Apepen</title>
        <meta name="description" content="Convert text to Apepen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Apepen
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to Apepen
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate Apepen"
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
          <img src={getDataURI(opepenSVG)} alt="Apepen" style={{ width: 500, height: 500, borderRadius: 10 }} />
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
              a.download = 'Apepen.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download Apepen
          </button>
        </div>
      </main>
    </>
  )
}
