// input text to generate qr code that can be copied to clipboard
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function QRCodeGenerator() {
  const [text, setText] = useState('')
  const [qr, setQr] = useState('')
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text).then((url) => {
        setQr(url)
      })
    }
  }, [text])

  return (
    <>
      <Head>
        <title>QR Code Generator</title>
        <meta name="description" content="Generate QR code for any text." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>QR Code Generator</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '12px'
        }}>
          Generate QR code for any text. Enter the text and see the magic happen.
        </span>
        <input
          placeholder="Enter the text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            border: 'none',
            background: '#333',
            outline: 'none',
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
          }}
        />
        <br />
        <br />
        {qr &&
          <img
            src={qr}
            alt="QR Code"
            style={{
              display: 'block',
              margin: '0 auto',
              width: '200px',
              height: '200px',
              borderRadius: '5px',
              border: '1px solid #333'
            }}
          />}
        <br />
        <br />
        {qr && <button onClick={() => {
          // copy image to clipboard
          QRCode.toCanvas(text, { errorCorrectionLevel: 'H' }, (err, canvas) => {
            if (err) throw err
            canvas.toBlob((blob) => {
              navigator.clipboard.write([
                new ClipboardItem({
                  'image/png': blob
                })
              ]).then(() => {
                setCopy(true)
                setTimeout(() => {
                  setCopy(false)
                }, 3000)
              })
            })
          })
          setCopy(true)
        }
        }>Copy QR Code</button>}
        {copy && <p>Copied to clipboard</p>}
      </main>
    </>
  )
}