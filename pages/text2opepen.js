// text to opepen generator
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
    analytics('text2opepen', { text })
    setLoading(true)
    let prompt = `Given the prompt:${text}.\n\n
    I have a svg, want to fill it with colors and patterns.
    Send an array of 2 values, 1st value is the background and 2nd value is the svg pattern for e.g this format: ["#000", "<defs><pattern></pattern></defs>"] (pattern won't ever be empty).
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

  let opepenSVG = `<svg class="border rounded-md aspect-auto border-white/10" viewBox="0 -500 1000 2031" style="background:${bg}" fill="none" width="400" height="400" xmlns="http://www.w3.org/2000/svg">${pattern}<g fill="url(#pattern)"><path class="cursor-pointer" d="M.363.156h254.774C395.844.156 509.91 114.222 509.91 254.93c0 140.707-114.066 254.773-254.773 254.773C114.429 509.703.363 395.637.363 254.93z"/><rect class="cursor-pointer" x="511.211" y=".156" width="508.254" height="508.254" rx="254.127"/><path class="cursor-pointer" d="M.363 510.449H1024.28v255.98c0 141.374-114.603 255.981-255.977 255.981h-511.96C114.969 1022.41.363 907.803.363 766.429zm0 1020.001H1019.46c0-139.55-113.13-252.68-252.68-252.68H253.04C113.491 1277.77.363 1390.9.363 1530.45"/><path class="cursor-pointer" d="M.363 1530.45h254.422v-252.68C115.236 1277.77.363 1390.9.363 1530.45m1016.937 0H762.875v-252.68c139.55 0 254.425 113.13 254.425 252.68M509.906 255.303c0 33.507-6.59 66.685-19.393 97.641a255.2 255.2 0 0 1-55.228 82.775 254.7 254.7 0 0 1-82.653 55.309 254.44 254.44 0 0 1-194.994 0 254.7 254.7 0 0 1-82.654-55.309 255.2 255.2 0 0 1-55.227-82.775A255.5 255.5 0 0 1 .363 255.303z"/><path class="cursor-pointer" d="M509.91 255.303c0 33.507-6.562 66.685-19.311 97.641a255.2 255.2 0 0 1-54.994 82.775 253.6 253.6 0 0 1-82.304 55.309 252.4 252.4 0 0 1-97.084 19.422V255.303zm507.39 0c0 33.507-6.55 66.685-19.265 97.641s-31.355 59.083-54.852 82.775-51.391 42.487-82.091 55.309a251.2 251.2 0 0 1-96.834 19.422c-33.23 0-66.134-6.599-96.834-19.422-30.7-12.822-58.595-31.616-82.092-55.309s-42.135-51.819-54.852-82.775a257 257 0 0 1-19.261-97.641z"/><path class="cursor-pointer" d="M1019.48 255.303c0 33.507-6.59 66.685-19.39 97.641a255.2 255.2 0 0 1-55.234 82.775 254.8 254.8 0 0 1-82.657 55.309 254.5 254.5 0 0 1-97.502 19.422V255.303z"/><path class="cursor-pointer" d="M255.137 510.449h510.195v511.961H255.137z"/></g></svg>`

  return (
    <>
      <Head>
        <title>Text to Opepen</title>
        <meta name="description" content="Convert text to opepen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to Opepen
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to opepen
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text to generate opepen"
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
          <img src={getDataURI(opepenSVG)} alt="Opepen" style={{ width: '100%',  borderRadius: 10 }} />
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
              a.download = 'opepen.png';
              a.click();
            }
            
          }} className={styles.button}>
            Download Opepen
          </button>
        </div>
      </main>
    </>
  )
}
