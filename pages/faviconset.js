import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'
import JSZip from 'jszip'

export default function FaviconSet() {
  const [logoSvg, setLogoSvg] = useState('')
  const svgRef = useRef(null)
  
  const getDataURI = (svg) => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const handleSvgEdit = (e) => {
    setLogoSvg(e.target.value)
  }

  const handleSvgPaste = (e) => {
    const pastedText = e.clipboardData.getData('text')
    if (pastedText.trim().startsWith('<svg') && pastedText.trim().endsWith('</svg>')) {
      e.preventDefault()
      setLogoSvg(pastedText.trim())
      if (svgRef.current) {
        svgRef.current.innerHTML = pastedText.trim()
      }
    }
  }

  const downloadFaviconSet = async () => {
    if (!logoSvg) return

    const zip = new JSZip()
    const sizes = [16, 32, 48, 64, 128, 256]

    for (let size of sizes) {
      const img = new Image()
      img.src = getDataURI(logoSvg)
      await new Promise((resolve) => { img.onload = resolve })

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)

      const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      zip.file(`favicon-${size}x${size}.png`, pngBlob)
    }

    // Add SVG to the zip
    zip.file('logo.svg', logoSvg)

    // Generate favicon.ico for the root directory
    const img = new Image()
    img.src = getDataURI(logoSvg)
    await new Promise((resolve) => { img.onload = resolve })

    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, 32, 32)

    const icoBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    zip.file(`favicon.ico`, icoBlob)

    // Add HTML code snippet for favicon
    const htmlCode = `<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" href="/favicon.ico">`
    
    zip.file('favicon-html.txt', htmlCode)

    const content = await zip.generateAsync({type: 'blob'})
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'favicon-set.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSvg = () => {
    const blob = new Blob([logoSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logo.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPNG = async (size = 512) => {
    if (logoSvg) {
      const dataUri = getDataURI(logoSvg)
      const img = new Image()
      img.src = dataUri
      await new Promise((resolve) => { img.onload = resolve })

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)

      const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const url = URL.createObjectURL(pngBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logo-${size}x${size}.png`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>SVG to Favicon Set</title>
        <meta name="description" content="Convert SVG to favicon set" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SVG to Favicon Set</h1>
        <p style={{color: '#888', fontSize: '16px', margin: '20px 0', width: '100%', textAlign: 'center'}}>
          Paste your SVG logo and convert it to a complete favicon set
        </p>

        <div style={{width: '100%', marginBottom: '20px'}}>
          <textarea
            value={logoSvg}
            onChange={handleSvgEdit}
            onPaste={handleSvgPaste}
            placeholder="Paste your SVG logo here"
            style={{
              width: '100%',
              height: '150px',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              marginBottom: '20px',
              fontFamily: 'monospace'
            }}
          />
        </div>

        {logoSvg && (
          <div style={{marginTop: '20px', width: '100%'}}>
            <div style={{
              border: '1px solid #333',
              background: '#fff',
              borderRadius: 10,
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
              minHeight: '200px'
            }}>
              <div ref={svgRef} dangerouslySetInnerHTML={{__html: logoSvg}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
              <button onClick={downloadFaviconSet} className={styles.button}>
                Download Complete Favicon Set
              </button>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
                <button onClick={downloadSvg} className={styles.button}>
                  Download SVG
                </button>
                <button onClick={() => downloadPNG(512)} className={styles.button}>
                  Download PNG (512px)
                </button>
                <button onClick={() => downloadPNG(1024)} className={styles.button}>
                  Download PNG (1024px)
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{marginTop: '30px', padding: '20px', border: '1px solid #333', borderRadius: '5px', width: '100%'}}>
          <h2 style={{marginBottom: '10px'}}>About Favicon Sets</h2>
          <p style={{color: '#666', marginBottom: '10px'}}>
            A favicon set includes multiple sizes of your logo to ensure compatibility across different platforms:
          </p>
          <ul style={{color: '#666', marginLeft: '20px'}}>
            <li>16x16 - Classic favicon size for browser tabs</li>
            <li>32x32 - Higher resolution for Windows taskbar</li>
            <li>48x48 - For Windows site shortcuts</li>
            <li>64x64, 128x128, 256x256 - Higher resolutions for various platforms</li>
            <li>favicon.ico - The root favicon file</li>
          </ul>
          <p style={{color: '#666', marginTop: '10px'}}>
            The download includes an HTML snippet you can add to your website's &lt;head&gt; section.
          </p>
        </div>
      </main>
    </div>
  )
}