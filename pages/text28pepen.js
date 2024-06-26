// text to 8pepen generator
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


  const getDataURI = (svg) => {
    // svg text to data uri
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send an array of 2 values, 1st value is the background and 2nd value is the svg pattern for e.g this format: ["#000", "<defs><pattern patternUnits='userSpaceOnUse' width="10" height="10"></pattern></defs>"] (pattern won't ever be empty).
    Pattern will never be empty, it will always have a pattern tag with some content inside it.
    Pattern will never have image or external link, it will always have some svg tags inside it.
    Background and pattern will never be same color.
    Pattern will have a width and height > 0.
    Patterns can have gradients. Background can have gradients.
    Patterns can't render invisible or be empty tags.
    Patterns can be animated or static, it can have multiple shapes or a single shape.
    Together with the background and pattern it will create a beautiful svg that matches the text.
    The id of pattern will be "pattern" at all times.
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
    setLoading(false)
  }

  let opepenSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" xml:space="preserve" style="background:${bg}">${pattern}<g fill="url(#pattern)"><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 350)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 350)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 350)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 450)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 450)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 450)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 450)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 550)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 550)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 550)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 550)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 750)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 750)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 750)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 750)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 250)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 250)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 250)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 350)"/><rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 250)"/></g></svg>`

  return (
    <>
      <Head>
        <title>Text to 8pepen</title>
        <meta name="description" content="Convert text to 8pepen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to 8pepen
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to 8pepen
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate 8pepen"
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
          <img src={getDataURI(opepenSVG)} alt="8pepen" style={{ width: '100%',  borderRadius: 10 }} />
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
              a.download = '8pepen.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download 8pepen
          </button>
        </div>
      </main>
    </>
  )
}
