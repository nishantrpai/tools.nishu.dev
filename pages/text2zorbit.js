// text to svg generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)


  const zorbitSvg = () => {

    useEffect(() => {
      let currentY = 1;
      let opacity = 1;
      let arr = JSON.parse(sensationalizedText || '[]')
      document.getElementById('zorbit').style.backgroundColor = arr[0] || '#000'

      document.getElementById('zorbit').querySelectorAll('rect').forEach((rect, i) => {
        if(currentY !== rect.y.baseVal.value) {
          currentY = rect.y.baseVal.value
          opacity = opacity - 0.015
        }
        rect.style.fill = arr[1] || '#fff'
        rect.style.opacity = opacity
      });
    }, [sensationalizedText])

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 40 40" id="zorbit" style={{ backgroundColor: '#333', borderRadius: 10 }}>
        <rect width="1" height="1" x="7" y="1" />
        <rect width="1" height="1" x="9" y="1" />
        <rect width="1" height="1" x="11" y="1" />
        <rect width="1" height="1" x="13" y="1" />
        <rect width="1" height="1" x="15" y="1" />
        <rect width="1" height="1" x="17" y="1" />
        <rect width="1" height="1" x="8" y="2" />
        <rect width="1" height="1" x="12" y="2" />
        <rect width="1" height="1" x="16" y="2" />
        <rect width="1" height="1" x="20" y="2" />
        <rect width="1" height="1" x="5" y="3" />
        <rect width="1" height="1" x="7" y="3" />
        <rect width="1" height="1" x="9" y="3" />
        <rect width="1" height="1" x="11" y="3" />
        <rect width="1" height="1" x="13" y="3" />
        <rect width="1" height="1" x="15" y="3" />
        <rect width="1" height="1" x="17" y="3" />
        <rect width="1" height="1" x="19" y="3" />
        <rect width="1" height="1" x="21" y="3" />
        <rect width="1" height="1" x="10" y="4" />
        <rect width="1" height="1" x="12" y="4" />
        <rect width="1" height="1" x="14" y="4" />
        <rect width="1" height="1" x="16" y="4" />
        <rect width="1" height="1" x="18" y="4" />
        <rect width="1" height="1" x="20" y="4" />
        <rect width="1" height="1" x="22" y="4" />
        <rect width="1" height="1" x="5" y="5" />
        <rect width="1" height="1" x="7" y="5" />
        <rect width="1" height="1" x="9" y="5" />
        <rect width="1" height="1" x="11" y="5" />
        <rect width="1" height="1" x="13" y="5" />
        <rect width="1" height="1" x="15" y="5" />
        <rect width="1" height="1" x="17" y="5" />
        <rect width="1" height="1" x="19" y="5" />
        <rect width="1" height="1" x="21" y="5" />
        <rect width="1" height="1" x="23" y="5" />
        <rect width="1" height="1" x="8" y="6" />
        <rect width="1" height="1" x="12" y="6" />
        <rect width="1" height="1" x="14" y="6" />
        <rect width="1" height="1" x="16" y="6" />
        <rect width="1" height="1" x="17" y="6" />
        <rect width="1" height="1" x="18" y="6" />
        <rect width="1" height="1" x="20" y="6" />
        <rect width="1" height="1" x="22" y="6" />
        <rect width="1" height="1" x="24" y="6" />
        <rect width="1" height="1" x="3" y="7" />
        <rect width="1" height="1" x="5" y="7" />
        <rect width="1" height="1" x="7" y="7" />
        <rect width="1" height="1" x="9" y="7" />
        <rect width="1" height="1" x="11" y="7" />
        <rect width="1" height="1" x="13" y="7" />
        <rect width="1" height="1" x="15" y="7" />
        <rect width="1" height="1" x="17" y="7" />
        <rect width="1" height="1" x="19" y="7" />
        <rect width="1" height="1" x="21" y="7" />
        <rect width="1" height="1" x="23" y="7" />
        <rect width="1" height="1" x="25" y="7" />
        <rect width="1" height="1" x="10" y="8" />
        <rect width="1" height="1" x="12" y="8" />
        <rect width="1" height="1" x="14" y="8" />
        <rect width="1" height="1" x="16" y="8" />
        <rect width="1" height="1" x="18" y="8" />
        <rect width="1" height="1" x="20" y="8" />
        <rect width="1" height="1" x="22" y="8" />
        <rect width="1" height="1" x="24" y="8" />
        <rect width="1" height="1" x="26" y="8" />
        <rect width="1" height="1" x="1" y="9" />
        <rect width="1" height="1" x="5" y="9" />
        <rect width="1" height="1" x="7" y="9" />
        <rect width="1" height="1" x="9" y="9" />
        <rect width="1" height="1" x="11" y="9" />
        <rect width="1" height="1" x="13" y="9" />
        <rect width="1" height="1" x="15" y="9" />
        <rect width="1" height="1" x="17" y="9" />
        <rect width="1" height="1" x="19" y="9" />
        <rect width="1" height="1" x="21" y="9" />
        <rect width="1" height="1" x="23" y="9" />
        <rect width="1" height="1" x="25" y="9" />
        <rect width="1" height="1" x="8" y="10" />
        <rect width="1" height="1" x="12" y="10" />
        <rect width="1" height="1" x="14" y="10" />
        <rect width="1" height="1" x="16" y="10" />
        <rect width="1" height="1" x="17" y="10" />
        <rect width="1" height="1" x="18" y="10" />
        <rect width="1" height="1" x="20" y="10" />
        <rect width="1" height="1" x="24" y="10" />
        <rect width="1" height="1" x="3" y="11" />
        <rect width="1" height="1" x="5" y="11" />
        <rect width="1" height="1" x="7" y="11" />
        <rect width="1" height="1" x="9" y="11" />
        <rect width="1" height="1" x="11" y="11" />
        <rect width="1" height="1" x="13" y="11" />
        <rect width="1" height="1" x="15" y="11" />
        <rect width="1" height="1" x="17" y="11" />
        <rect width="1" height="1" x="19" y="11" />
        <rect width="1" height="1" x="21" y="11" />
        <rect width="1" height="1" x="23" y="11" />
        <rect width="1" height="1" x="25" y="11" />
        <rect width="1" height="1" x="27" y="11" />
        <rect width="1" height="1" x="10" y="12" />
        <rect width="1" height="1" x="12" y="12" />
        <rect width="1" height="1" x="14" y="12" />
        <rect width="1" height="1" x="16" y="12" />
        <rect width="1" height="1" x="18" y="12" />
        <rect width="1" height="1" x="20" y="12" />
        <rect width="1" height="1" x="22" y="12" />
        <rect width="1" height="1" x="1" y="13" />
        <rect width="1" height="1" x="5" y="13" />
        <rect width="1" height="1" x="7" y="13" />
        <rect width="1" height="1" x="9" y="13" />
        <rect width="1" height="1" x="11" y="13" />
        <rect width="1" height="1" x="13" y="13" />
        <rect width="1" height="1" x="15" y="13" />
        <rect width="1" height="1" x="17" y="13" />
        <rect width="1" height="1" x="19" y="13" />
        <rect width="1" height="1" x="21" y="13" />
        <rect width="1" height="1" x="23" y="13" />
        <rect width="1" height="1" x="25" y="13" />
        <rect width="1" height="1" x="27" y="13" />
        <rect width="1" height="1" x="8" y="14" />
        <rect width="1" height="1" x="12" y="14" />
        <rect width="1" height="1" x="16" y="14" />
        <rect width="1" height="1" x="20" y="14" />
        <rect width="1" height="1" x="24" y="14" />
        <rect width="1" height="1" x="3" y="15" />
        <rect width="1" height="1" x="5" y="15" />
        <rect width="1" height="1" x="7" y="15" />
        <rect width="1" height="1" x="9" y="15" />
        <rect width="1" height="1" x="11" y="15" />
        <rect width="1" height="1" x="13" y="15" />
        <rect width="1" height="1" x="15" y="15" />
        <rect width="1" height="1" x="17" y="15" />
        <rect width="1" height="1" x="19" y="15" />
        <rect width="1" height="1" x="21" y="15" />
        <rect width="1" height="1" x="23" y="15" />
        <rect width="1" height="1" x="25" y="15" />
        <rect width="1" height="1" x="27" y="15" />
        <rect width="1" height="1" x="14" y="16" />
        <rect width="1" height="1" x="18" y="16" />
        <rect width="1" height="1" x="22" y="16" />
        <rect width="1" height="1" x="1" y="17" />
        <rect width="1" height="1" x="5" y="17" />
        <rect width="1" height="1" x="9" y="17" />
        <rect width="1" height="1" x="11" y="17" />
        <rect width="1" height="1" x="13" y="17" />
        <rect width="1" height="1" x="15" y="17" />
        <rect width="1" height="1" x="17" y="17" />
        <rect width="1" height="1" x="19" y="17" />
        <rect width="1" height="1" x="21" y="17" />
        <rect width="1" height="1" x="23" y="17" />
        <rect width="1" height="1" x="25" y="17" />
        <rect width="1" height="1" x="27" y="17" />
        <rect width="1" height="1" x="12" y="18" />
        <rect width="1" height="1" x="16" y="18" />
        <rect width="1" height="1" x="20" y="18" />
        <rect width="1" height="1" x="7" y="19" />
        <rect width="1" height="1" x="9" y="19" />
        <rect width="1" height="1" x="11" y="19" />
        <rect width="1" height="1" x="13" y="19" />
        <rect width="1" height="1" x="15" y="19" />
        <rect width="1" height="1" x="17" y="19" />
        <rect width="1" height="1" x="19" y="19" />
        <rect width="1" height="1" x="21" y="19" />
        <rect width="1" height="1" x="23" y="19" />
        <rect width="1" height="1" x="25" y="19" />
        <rect width="1" height="1" x="27" y="19" />
        <rect width="1" height="1" x="5" y="21" />
        <rect width="1" height="1" x="9" y="21" />
        <rect width="1" height="1" x="13" y="21" />
        <rect width="1" height="1" x="15" y="21" />
        <rect width="1" height="1" x="17" y="21" />
        <rect width="1" height="1" x="19" y="21" />
        <rect width="1" height="1" x="21" y="21" />
        <rect width="1" height="1" x="25" y="21" />
        <rect width="1" height="1" x="11" y="23" />
        <rect width="1" height="1" x="13" y="23" />
        <rect width="1" height="1" x="15" y="23" />
        <rect width="1" height="1" x="17" y="23" />
        <rect width="1" height="1" x="19" y="23" />
        <rect width="1" height="1" x="21" y="23" />
        <rect width="1" height="1" x="23" y="23" />
        <rect width="1" height="1" x="9" y="25" />
        <rect width="1" height="1" x="13" y="25" />
        <rect width="1" height="1" x="17" y="25" />
        <rect width="1" height="1" x="21" y="25" />
      </svg>

    )
  }
  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `given the prompt:${text}.
    I have a svg, want to paint with colors from the prompt text.
    Send an array of colors, for e.g., ["#000", "#fff", "#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff"]. 
    There will be 2 colors, one for the background and one for the foreground. Don't send incomplete or incorrect data.
    Keep it minimal. Prefer darker colors for the background and lighter colors for the foreground.
    \n`;
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
        <title>Text to Zorbit</title>
        <meta name="description" content="Convert text to zorbit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Zorbit
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to zorbit
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the type of svg you want to generate"
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
          {zorbitSvg()}
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
            </span> */}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: 20 }}>

          <button onClick={() => {
            // download svg
            const svg = document.getElementById('zorbit').outerHTML;
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
              a.download = 'zorbit.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download Zorbit
          </button>
        </div>
      </main>
    </>
  )
}
