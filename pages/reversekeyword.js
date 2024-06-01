// reverse keyword lookup from metadata
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)

  const getMetadata = async (url) => {
    let proxy = 'https://cors-proxy-production-a6e6.up.railway.app/?url='
    let res = await fetch(`${proxy}${url}`)
    let html = await res.text()
    let parser = new DOMParser()
    let doc = parser.parseFromString(html, 'text/html')
    let title = doc.querySelector('title').innerText
    let meta = doc.querySelector('meta[name="description"]')
    let description = meta ? meta.getAttribute('content') : ''
    return { title, description }
  }

  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    // get meta description and title from website (text)
    // if text is not a website, return error message
    // regex check
    if (!text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
      setSensationalizedText('Please enter a valid website URL')
      setLoading(false)
      return
    }
    else {
      const { title, description } = await getMetadata(text)
      setTitle(title)
      setDescription(description)
      const res = await fetch(`/api/gpt?prompt="Given a website ${text}, here is the ${title} ${description} write all keywords that the website is trying to rank top for in search engines, could be long tail or short tail keywords."`)
      const data = await res.json()
      setSensationalizedText(data.response)
      setLoading(false)

    }
  }


  return (
    <>
      <Head>
        <title>Reverse Keyword Lookup</title>
        <meta name="description" content="Reverse keyword lookup from metadata" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Reverse Keyword Lookup
        </h1>
        <p className={styles.description}>
          Enter a website URL to get the keywords it is trying to rank for
        </p>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your website URL"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Checking...' : 'Check'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 500, marginLeft: 0, marginTop: 20 }}>
          <div style={{ display: 'flex', gap: '10px', fontSize: 16 }}>
            <b>Title: </b>{title}
          </div>
          <br />
          <div style={{ display: 'flex', gap: '10px', fontSize: 16 }}>
            <b>Description: </b>{description}
            <br />
          </div>
        </div>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', borderRadius: 10, padding: 20, fontSize: 16 }}>
            {sensationalizedText}
          </div>
        )}
      </main>
    </>
  )
}
