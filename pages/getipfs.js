// convert ipfs:// link to ipfs gateway link
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiExternalLink } from "react-icons/fi";


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)

  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    let url = text
    if (url.startsWith('ipfs://')) {
      url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }
    setSensationalizedText(url)
    setLoading(false)
  }


  return (
    <>
      <Head>
        <title>
          Get IPFS Link
        </title>
        <meta name="description" content="Get IPFS link" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Get IPFS Link
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Get browser viewable IPFS link
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your ipfs link"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Getting...' : 'Get'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '0px', background: '#000', width: '100%', lineHeight: 1.5, fontSize: 20 }}>



            <a href={sensationalizedText} target="_blank" style={{ display: 'block', textDecoration: 'underline', justifyContent: 'space-between', margin: 'auto', width: '100%', textAlign: 'center' }}>
              <FiExternalLink style={{  fontSize: 16, marginRight: 10}} />
              {/* limit text length */}
              <span style={{ flexBasis: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sensationalizedText.length > 30 ? `${sensationalizedText.substring(0, 30)}...` : sensationalizedText}
              </span>
            </a>

            {/* add copy button */}

          </div>
        )}
         <button onClick={() => {
              navigator.clipboard.writeText(sensationalizedText)
            }} className={styles.button} style={{marginTop: 15}}>
              Copy
            </button>

      </main>
    </>
  )
}
