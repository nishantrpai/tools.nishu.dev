// combine two words to get a new word
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'


export default function Home() {
  const [text, setText] = useState('')
  const [word1, setWord1] = useState('')
  const [word2, setWord2] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [mixes, setMixes] = useState([])
  const [loading, setLoading] = useState(false)

  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let prompt = encodeURIComponent(`List all mixes of these two colors (hex) that are fun and minimal ${word1} and ${word2} as array (make it so I can JSON.parse) for e.g., [1,2,3] to get a new gradient as background-color for a div element. Keep it minimal and beautiful. Only respond in linear-gradient, radial-gradient, or conic-gradient. Don't add any other text or html tags.`)
    const res = await fetch(`/api/gpt?prompt=${prompt}`)
    const data = await res.json()
    setMixes(JSON.parse(data.response))
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Mix</title>
        <meta name="description" content="Mix two colors to get a gradient" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Mix colors
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Mix two colors to get a new gradient
        </span>

        <div style={{
          display: 'flex',
          gap: 10,
          width: '100%',
        }}>

          <input
            type="text"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
            placeholder="Enter word 1"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              borderRadius: 10,
            }}
          />
          <input
            type="text"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
            placeholder="Enter word 2"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              borderRadius: 10
            }}
          />
        </div>

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Mixing...' : 'Mix'}
        </button>

        {mixes.map((mix, id) => (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: 10,
          }}>
            <div style={{
              background: mix,
              height: '500px',
              width: '500px',
              borderRadius: 10,
            }} id={`gradient-square-${id}`}>

            </div>
            <span style={{
              fontFamily: 'monospace',
            }}>
            {mix}
            </span>
            <button onClick={() => {
              html2canvas(document.getElementById('gradient-square-' + id), {
                backgroundColor: 'transparent'
              }).then(function(canvas) {
                var a = document.createElement('a');
                a.href = canvas.toDataURL("image/png");
                a.download = 'gradient.png';
                a.click();
              });
            }
            } className={styles.button}>
              Download Gradient
            </button>
          </div>

        ))}
      </main>
    </>
  )
}
