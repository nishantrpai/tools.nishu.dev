import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Svg2Png() {
  const [svgCode, setSvgCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSvgChange = (e) => {
    setSvgCode(e.target.value)
  }

  const downloadSvgAsPng = () => {
    const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}`;
    const img = new Image();
    img.src = svgDataUri;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 'image/png');
    };
  }

  return (
    <>
      <Head>
        <title>SVG to PNG Downloader</title>
        <meta name="description" content="Download SVG as PNG" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          SVG to PNG Downloader
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Paste your SVG code and download it as PNG.</span>

        <textarea
          value={svgCode}
          onChange={handleSvgChange}
          placeholder="Paste your SVG code here"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            height: '200px',
          }}
        />

        <button onClick={downloadSvgAsPng} className={styles.button}>
          {loading ? 'Downloading...' : 'Download as PNG'}
        </button>
      </main>
    </>
  )
}
