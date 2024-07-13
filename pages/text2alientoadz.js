// text to alien toadz generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [bg, setBg] = useState('#000')
  const [pattern, setPattern] = useState('#fff')
  const [loading, setLoading] = useState(false)


  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send an array of 2 values, 1st value is the background and 2nd value is the hex color for the foreground.
    Only send array, don't send any other data like "Example: ["#000", "#fff"]".
    Together with the background and foreground it will create a beautiful svg that matches the text.
    Don't send incomplete or incorrect data or empty values.
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
    setPattern(arr[1] || '#fff')
    setLoading(false)
  }

  let opepenSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1600" height="1600">
  <path d="M0 0 C528 0 1056 0 1600 0 C1600 528 1600 1056 1600 1600 C1072 1600 544 1600 0 1600 C0 1072 0 544 0 0 Z " fill="${bg}" transform="translate(0,0)"/>
  <path d="M0 0 C280.5 0 561 0 850 0 C850 33 850 66 850 100 C833.5 100 817 100 800 100 C800 83.5 800 67 800 50 C734 50 668 50 600 50 C600 83 600 116 600 150 C699 150 798 150 900 150 C900 166.5 900 183 900 200 C916.5 200 933 200 950 200 C950 216.5 950 233 950 250 C917 250 884 250 850 250 C850 233.5 850 217 850 200 C833.5 200 817 200 800 200 C800 216.5 800 233 800 250 C783.5 250 767 250 750 250 C750 233.5 750 217 750 200 C733.5 200 717 200 700 200 C700 216.5 700 233 700 250 C683.5 250 667 250 650 250 C650 233.5 650 217 650 200 C633.5 200 617 200 600 200 C600 216.5 600 233 600 250 C583.5 250 567 250 550 250 C550 233.5 550 217 550 200 C533.5 200 517 200 500 200 C500 216.5 500 233 500 250 C483.5 250 467 250 450 250 C450 233.5 450 217 450 200 C433.5 200 417 200 400 200 C400 216.5 400 233 400 250 C383.5 250 367 250 350 250 C350 233.5 350 217 350 200 C333.5 200 317 200 300 200 C300 216.5 300 233 300 250 C283.5 250 267 250 250 250 C250 233.5 250 217 250 200 C233.5 200 217 200 200 200 C200 216.5 200 233 200 250 C183.5 250 167 250 150 250 C150 233.5 150 217 150 200 C133.5 200 117 200 100 200 C100 216.5 100 233 100 250 C83.5 250 67 250 50 250 C50 233.5 50 217 50 200 C17 200 -16 200 -50 200 C-50 183.5 -50 167 -50 150 C49 150 148 150 250 150 C250 133.5 250 117 250 100 C233.5 100 217 100 200 100 C200 83.5 200 67 200 50 C134 50 68 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(400,500)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 16.5 50 33 50 50 C132.5 50 215 50 300 50 C300 33.5 300 17 300 0 C316.5 0 333 0 350 0 C350 16.5 350 33 350 50 C432.5 50 515 50 600 50 C600 33.5 600 17 600 0 C616.5 0 633 0 650 0 C650 16.5 650 33 650 50 C699.5 50 749 50 800 50 C800 66.5 800 83 800 100 C536 100 272 100 0 100 C0 116.5 0 133 0 150 C66 150 132 150 200 150 C200 166.5 200 183 200 200 C216.5 200 233 200 250 200 C250 216.5 250 233 250 250 C151 250 52 250 -50 250 C-50 283 -50 316 -50 350 C-83 350 -116 350 -150 350 C-150 267.5 -150 185 -150 100 C-133.5 100 -117 100 -100 100 C-100 83.5 -100 67 -100 50 C-67 50 -34 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" opacity="0.95" transform="translate(400,400)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 16.5 50 33 50 50 C83 50 116 50 150 50 C150 33.5 150 17 150 0 C166.5 0 183 0 200 0 C200 16.5 200 33 200 50 C216.5 50 233 50 250 50 C250 33.5 250 17 250 0 C266.5 0 283 0 300 0 C300 16.5 300 33 300 50 C316.5 50 333 50 350 50 C350 33.5 350 17 350 0 C366.5 0 383 0 400 0 C400 16.5 400 33 400 50 C416.5 50 433 50 450 50 C450 33.5 450 17 450 0 C466.5 0 483 0 500 0 C500 16.5 500 33 500 50 C516.5 50 533 50 550 50 C550 33.5 550 17 550 0 C566.5 0 583 0 600 0 C600 16.5 600 33 600 50 C616.5 50 633 50 650 50 C650 33.5 650 17 650 0 C666.5 0 683 0 700 0 C700 16.5 700 33 700 50 C716.5 50 733 50 750 50 C750 33.5 750 17 750 0 C766.5 0 783 0 800 0 C800 16.5 800 33 800 50 C816.5 50 833 50 850 50 C850 33.5 850 17 850 0 C866.5 0 883 0 900 0 C900 16.5 900 33 900 50 C916.5 50 933 50 950 50 C950 33.5 950 17 950 0 C983 0 1016 0 1050 0 C1050 16.5 1050 33 1050 50 C1033.5 50 1017 50 1000 50 C1000 66.5 1000 83 1000 100 C670 100 340 100 0 100 C0 67 0 34 0 0 Z " fill="${pattern}" transform="translate(300,800)"/>
  <path d="M0 0 C33 0 66 0 100 0 C100 16.5 100 33 100 50 C116.5 50 133 50 150 50 C150 66.5 150 83 150 100 C133.5 100 117 100 100 100 C100 116.5 100 133 100 150 C83.5 150 67 150 50 150 C50 166.5 50 183 50 200 C33.5 200 17 200 0 200 C0 216.5 0 233 0 250 C66 250 132 250 200 250 C200 266.5 200 283 200 300 C35 300 -130 300 -300 300 C-300 267 -300 234 -300 200 C-217.5 200 -135 200 -50 200 C-50 183.5 -50 167 -50 150 C-33.5 150 -17 150 0 150 C0 100.5 0 51 0 0 Z " fill="${pattern}" transform="translate(1250,950)"/>
  <path d="M0 0 C99 0 198 0 300 0 C300 33 300 66 300 100 C135 100 -30 100 -200 100 C-200 83.5 -200 67 -200 50 C-134 50 -68 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(300,1150)"/>
  <path d="M0 0 C66 0 132 0 200 0 C200 16.5 200 33 200 50 C216.5 50 233 50 250 50 C250 66.5 250 83 250 100 C167.5 100 85 100 0 100 C0 67 0 34 0 0 Z " fill="${bg}" transform="translate(700,550)"/>
  <path d="M0 0 C66 0 132 0 200 0 C200 16.5 200 33 200 50 C216.5 50 233 50 250 50 C250 66.5 250 83 250 100 C167.5 100 85 100 0 100 C0 67 0 34 0 0 Z " fill="${bg}" transform="translate(400,550)"/>
  <path d="M0 0 C33 0 66 0 100 0 C100 66 100 132 100 200 C83.5 200 67 200 50 200 C50 183.5 50 167 50 150 C33.5 150 17 150 0 150 C0 133.5 0 117 0 100 C-16.5 100 -33 100 -50 100 C-50 83.5 -50 67 -50 50 C-33.5 50 -17 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(200,950)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 82.5 50 165 50 250 C66.5 250 83 250 100 250 C100 266.5 100 283 100 300 C67 300 34 300 0 300 C0 201 0 102 0 0 Z " fill="${pattern}" transform="translate(800,950)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 99 50 198 50 300 C17 300 -16 300 -50 300 C-50 283.5 -50 267 -50 250 C-33.5 250 -17 250 0 250 C0 167.5 0 85 0 0 Z " fill="${pattern}" transform="translate(700,950)"/>
  <path d="M0 0 C99 0 198 0 300 0 C300 16.5 300 33 300 50 C201 50 102 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(900,1050)"/>
  <path d="M0 0 C99 0 198 0 300 0 C300 16.5 300 33 300 50 C201 50 102 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(350,1050)"/>
  <path d="M0 0 C99 0 198 0 300 0 C300 16.5 300 33 300 50 C201 50 102 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(900,950)"/>
  <path d="M0 0 C99 0 198 0 300 0 C300 16.5 300 33 300 50 C201 50 102 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(350,950)"/>
  <path d="M0 0 C49.5 0 99 0 150 0 C150 33 150 66 150 100 C133.5 100 117 100 100 100 C100 83.5 100 67 100 50 C67 50 34 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(900,250)"/>
  <path d="M0 0 C49.5 0 99 0 150 0 C150 33 150 66 150 100 C133.5 100 117 100 100 100 C100 83.5 100 67 100 50 C67 50 34 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(600,250)"/>
  <path d="M0 0 C49.5 0 99 0 150 0 C150 33 150 66 150 100 C133.5 100 117 100 100 100 C100 83.5 100 67 100 50 C67 50 34 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(300,250)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 33 50 66 50 100 C33.5 100 17 100 0 100 C0 67 0 34 0 0 Z " fill="${bg}" transform="translate(300,600)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 16.5 50 33 50 50 C33.5 50 17 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(1000,400)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 16.5 50 33 50 50 C33.5 50 17 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(700,400)"/>
  <path d="M0 0 C16.5 0 33 0 50 0 C50 16.5 50 33 50 50 C33.5 50 17 50 0 50 C0 33.5 0 17 0 0 Z " fill="${pattern}" transform="translate(400,400)"/>
</svg>
`

  return (
    <>
      <Head>
        <title>Text to alien toadz</title>
        <meta name="description" content="Convert text to alien toadz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to alien toadz
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to alien toadz
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate alien toadz"
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
          <img src={getDataURI(opepenSVG)} alt="alien toadz" style={{ width: '100%',  borderRadius: 10 }} />
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
              a.download = 'alien_toadz.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download alien toadz
          </button>
        </div>
      </main>
    </>
  )
}
