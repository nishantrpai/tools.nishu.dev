import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'

export default function VisualizeValue() {
  const [description, setDescription] = useState('')
  const [imageSvg, setImageSvg] = useState('')
  const [loading, setLoading] = useState(false)
  const svgRef = useRef(null)
  
  const getDataURI = (svg) => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const generateImage = async () => {
    setLoading(true)
    const prompt = `Generate a minimal, beautiful SVG image in visualizevalue style that explains the following complex system: "${description}". The image should be simple, symmetrical, and not contain any text or HTML tags. Use gradients or varying opacity to create depth if needed, but limit colors to grayscale (white is allowed, but very graciously). The SVG should be 480x480px with a black background visualizevalue style. Don't add any additional shapes or objects. Ensure all elements are connected and not fragmented. Only provide the SVG code, starting with <svg> and ending with </svg>, without any additional characters or tags. Just svg string without any html/xml tags or code blocks.`
    
    try {
      const res = await fetch(`/api/gpt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gemini-1.5-flash' })
      })
      const data = await res.json()
      // Remove any ```svg or ``` tags from the response
      // remove xml codeblocks as we well
      const cleanedResponse = data.response.replace(/^```svg\s+|```|<\?xml[\s\S]+?\?>|<!DOCTYPE[\s\S]+?>/g, '')
      setImageSvg(cleanedResponse)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadSvg = () => {
    const blob = new Blob([imageSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'image.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPNG = async () => {
    if (imageSvg) {
      const dataUri = getDataURI(imageSvg)
      const img = new Image()
      img.src = dataUri
      await new Promise((resolve) => { img.onload = resolve })

      const canvas = document.createElement('canvas')
      canvas.width = 960
      canvas.height = 960

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 960, 960)

      const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const url = URL.createObjectURL(pngBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'image.png'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const downloadPromptAndImage = async () => {
    const prompt = `${description}`;
    const combinedSvg = `
      <svg width="960" height="1000" xmlns="http://www.w3.org/2000/svg">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Helvetica, Arial, sans-serif; font-size: 48px; text-align: center; padding: 20px; background: white;">
            <strong>${prompt}</strong>
          </div>
        </foreignObject>
        <g transform="translate(0, 90) scale(2)">
          ${imageSvg}
        </g>
      </svg>
    `;
    const dataUri = `data:image/svg+xml,${encodeURIComponent(combinedSvg)}`;
    const img = new Image();
    img.src = dataUri;
    await new Promise((resolve) => { img.onload = resolve });

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 960, 1000);

    const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const url = URL.createObjectURL(pngBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt_and_image.png';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Visualize Value</title>
        <meta name="description" content="Explain complex systems through simple images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Visualize Value</h1>
        <p style={{color: '#888', fontSize: '16px', margin: '20px 0', width: '100%', textAlign: 'center'}}>
          Generate a simple image that explains a complex system
        </p>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description of the complex system"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginBottom: '20px',
            fontSize: '32px'
          }}
        />

        <button onClick={generateImage} className={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>

        {imageSvg && (
          <div style={{marginTop: '20px', width: '100%'}}>
            <div style={{
              border: '1px solid #333',
              background: '#000',
              borderRadius: 10,
              padding: '20px',
              marginBottom: '20px',
            }}>
              <div ref={svgRef} dangerouslySetInnerHTML={{__html: imageSvg}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
              <button onClick={downloadSvg} className={styles.button}>
                Download SVG
              </button>
              <button onClick={downloadPNG} className={styles.button}>
                Download PNG
              </button>
              <button onClick={downloadPromptAndImage} className={styles.button}>
                Download Prompt and Image
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
