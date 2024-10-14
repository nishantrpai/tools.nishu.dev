import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

export default function Text2Logo() {
  const [text, setText] = useState('')
  const [logoSvg, setLogoSvg] = useState('')
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const svgRef = useRef(null)
  
  const getDataURI = (svg) => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const generateLogo = async () => {
    setLoading(true)
    let prompt = `Generate a minimal, beautiful SVG logo based on the text: "${text}". The logo should be simple, symmetrical, and not contain any text or HTML tags. Use gradients or varying opacity to create depth if needed. The SVG should be 480x480px with a transparent background. Don't add any additional shapes or objects. Ensure all elements are connected and not fragmented. Use appropriate colors that will work well on both light and dark backgrounds. Only provide the SVG code as a string, no backticks or other characters.`
    
    if (logoSvg) {
      prompt = `Modify the existing SVG logo: ${logoSvg}. Add or replace elements based on the text: "${text}". Maintain the overall structure and style of the existing logo while incorporating new elements that represent the text. Ensure the modifications are seamless and the result looks cohesive. Only provide the SVG code as a string, no explanations or other text.`
    }
    
    try {
      const res = await fetch(`/api/gpt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4o' })
      })
      const data = await res.json()
      setLogoSvg(data.response)
    } catch (error) {
      console.error("Error generating logo:", error)
    } finally {
      setLoading(false)
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

    zip.file('logo.svg', logoSvg)

    const content = await zip.generateAsync({type: 'blob'})
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'favicon-set.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
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

  const downloadSvg = () => {
    const blob = new Blob([logoSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logo.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const addElementToSvg = (elementType) => {
    if (svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg')
      if (svgElement) {
        const newElement = document.createElementNS("http://www.w3.org/2000/svg", elementType)
        newElement.setAttribute('x', '10')
        newElement.setAttribute('y', '10')
        newElement.setAttribute('width', '50')
        newElement.setAttribute('height', '50')
        newElement.setAttribute('fill', 'red')
        svgElement.appendChild(newElement)
        setLogoSvg(svgRef.current.innerHTML)
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Text to Logo</title>
        <meta name="description" content="Convert text to logo and generate favicon set" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Text to Logo</h1>
        <p style={{color: '#888', fontSize: '16px', margin: '20px 0', width: '100%', textAlign: 'center'}}>
          Generate a logo from text, paste an existing SVG, or edit and download as a favicon set
        </p>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for your logo"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginBottom: '20px'
          }}
        />

        <button onClick={generateLogo} className={styles.button} disabled={loading}>
          {loading ? 'Generating...' : logoSvg ? 'Modify Logo' : 'Generate Logo'}
        </button>

        <p style={{color: '#888', fontSize: '14px', margin: '10px 0'}}>
          Or paste your SVG logo below:
        </p>

        <textarea
          value={logoSvg}
          onChange={handleSvgEdit}
          onPaste={handleSvgPaste}
          placeholder="Paste your SVG logo here"
          style={{
            width: '100%',
            height: '100px',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginBottom: '20px'
          }}
        />

        {logoSvg && (
          <div style={{marginTop: '20px', width: '100%'}}>
            <div style={{
              border: '1px solid #333',
              background: '#fff',
              borderRadius: 10,
              padding: '20px',
              marginBottom: '20px',
            }}>
              <div ref={svgRef} dangerouslySetInnerHTML={{__html: logoSvg}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
              <button onClick={downloadSvg} className={styles.button}>
                Download SVG
              </button>
              <button onClick={downloadFaviconSet} className={styles.button}>
                Download Favicon Set
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
