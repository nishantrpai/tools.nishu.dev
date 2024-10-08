// text to gradient generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='"given a prompt: ${text}", generate a gradient based on the text that can be used as background-color for a div element for e.g., linear-gradient or radial-gradient or conic-gradient. Don't add any other text or html tags. Keep it minimal and focus on keeping it beautiful.'`)
    const data = await res.json()
    setSensationalizedText(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Text to Zorb</title>
        <meta name="description" content="Convert text to zorb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Text to zorb
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Convert text to zorb
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the type of zorb you want to generate"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5}}>
            <div style={{
              background: sensationalizedText,
              height: '300px',
              width: '300px',
              borderRadius: '100%',
              margin: 'auto'
            }} id="gradient-square">
            </div>
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => {
            html2canvas(document.getElementById('gradient-square'), {
              backgroundColor: 'transparent'
            }).then(function(canvas) {
              var a = document.createElement('a');
              a.href = canvas.toDataURL("image/png");
              a.download = 'zorb.png';
              a.click();
            });
          }} className={styles.button}>
            Download zorb
            </button>
          </div>
      </main>
    </>
  )
}
