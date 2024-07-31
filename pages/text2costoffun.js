// text to opepen generator
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
    Send an array of 2 values, 1st value is the background and 2nd value is the svg pattern for e.g this format: ["#000", "<defs><pattern></pattern></defs>"] (pattern won't ever be empty).
    Pattern will never be empty, it will always have a pattern tag with some content inside it.
    Pattern will never have image or external link, it will always have some svg tags inside it.
    Background and pattern will never be same color or empty.
    Pattern will have a width and height > 0.
    Patterns can be gradients. Background can be a gradient.
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

  let opepenSVG = `<svg class="border rounded-md aspect-auto border-white/10" viewBox="0 -500 1000 2031" style="background:${bg}" fill="none" width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  ${pattern}
  <g fill="url(#pattern)">
    <path class="cursor-pointer" d="M 0.363 0.156 H 255.402 C 348.418 10.434 383.844 18.184 470.28 96.802 C 521.119 173.172 516.691 217.455 522.226 260.63 c 0 70.354 6.643 158.31 -93.962 241.504 C 322.955 517.468 254.773 509.703 254.773 509.703 C 72.759 515.254 0.363 395.637 0.363 254.93 z"/>
    <rect class="cursor-pointer" x="511.211" y=".156" width="508.254" height="508.254" rx="254.127"/>
    <g transform="translate(-12,-55)">
      <path transform="scale(1.1) rotate(1)" class="cursor-pointer" d="M 2.477 513.133 A 0 20 1 1 0 985.41 490.674 L 972.403 747.792 L 955.912 820.821 L 77.21 976.302
"/>
    </g>
  </g>
</svg>
`

  return (
    <>
      <Head>
        <title>Text to cost of fun</title>
        <meta name="description" content="Convert text to cost of fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to cost of fun
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to cost of fun
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate cost of fun"
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
          <img src={getDataURI(opepenSVG)} alt="Opepen" style={{ width: '100%', borderRadius: 10 }} />
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
              a.download = 'costoffun.png';
              a.click();
            }

          }} className={styles.button}>
            Download
          </button>
        </div>
      </main>
    </>
  )
}
