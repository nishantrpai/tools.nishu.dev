import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function HelveticaBlob() {
  const [image, setImage] = useState(null)
  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 })
  const [blobSize, setBlobSize] = useState(50)
  const [text, setText] = useState('helvetica')
  const [blobColor, setBlobColor] = useState('#1877F2') // Facebook blue
  const [coordinates, setCoordinates] = useState('')
  const [rotation, setRotation] = useState(0)
  const blobRef = useRef(null)
  const containerRef = useRef(null)
  const [numPoints, setNumPoints] = useState(8)
  const [offset, setOffset] = useState(25)
  const [complexity, setComplexity] = useState(1)
  const [borderWidth, setBorderWidth] = useState(3)
  const helveticaFont = '/fonts/helvetica-bold.ttf'

  const generateBlobCoordinates = () => {
    const random = (min, max) => Math.floor(min + Math.random() * (max - min))
    const remain = (n) => 100 - n

    let r = []
    for (let i = 0; i < numPoints; i++) {
      // Add sine wave variation based on complexity
      const angle = (i / numPoints) * Math.PI * 2
      const baseRadius = random(offset, remain(offset))
      const variation = Math.sin(angle * complexity) * 20
      let n = Math.max(0, Math.min(100, baseRadius + variation))
      r.push(n)
    }

    let coordinates = ''
    for(let i = 0; i < numPoints/2; i++) {
      coordinates += `${r[i]}% `
    }
    coordinates += '/ '
    for(let i = numPoints - 1; i >= numPoints/2; i--) {
      coordinates += `${r[i]}% `
    }
    console.log(coordinates)
    setCoordinates(coordinates)
    setRotation(prev => prev + 40)
  }

  const hexToRgb = (hex) => {
    const [r, g, b] = hex.match(/\w{2}/g).map(x => parseInt(x, 16))
    return { r, g, b }
  }

  useEffect(() => {
    generateBlobCoordinates()
  }, [numPoints, complexity])

  const handleDownload = async () => {
    if (!containerRef.current) return
    
    const canvas = await html2canvas(containerRef.current)
    const link = document.createElement('a')
    link.download = 'helvetica-blob.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <>
      <Head>
        <title>Helvetica Blob</title>
        <meta name="description" content="Add Helvetica blobs to images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Helvetica Blob</h1>
        <h2 className={styles.description}>Add Helvetica blobs to your images</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, margin: '0 auto' }}>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => setImage(e.target.result)
                reader.readAsDataURL(file)
              }
            }}
          />

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text"
              style={{ padding: '5px 10px' }}
            />
            
            <input
              type="color"
              value={blobColor}
              onChange={(e) => setBlobColor(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>Number of Points</span>
            <input 
              type="range" 
              min="3" 
              max="10" 
              value={numPoints} 
              onChange={(e) => setNumPoints(Number(e.target.value))} 
            />
            <span>{numPoints}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>Shape Complexity</span>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              step="0.5"
              value={complexity} 
              onChange={(e) => setComplexity(Number(e.target.value))} 
            />
            <span>{complexity}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>Blob Size</span>
            <input 
              type="range" 
              min="50" 
              max="500" 
              value={blobSize} 
              onChange={(e) => setBlobSize(Number(e.target.value))} 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>Blob X</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={blobPosition.x} 
              onChange={(e) => setBlobPosition({ ...blobPosition, x: Number(e.target.value) })} 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>Blob Y</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={blobPosition.y} 
              onChange={(e) => setBlobPosition({ ...blobPosition, y: Number(e.target.value) })} 
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>Border Width</span>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={borderWidth} 
              onChange={(e) => setBorderWidth(Number(e.target.value))} 
            />
          </div>

          <button onClick={generateBlobCoordinates}>Generate New Blob Shape</button>

          {image && (
            <>
              <div 
                ref={containerRef}
                style={{ 
                  position: 'relative',
                  width: '100%',
                  border: '1px solid #333',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={image}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
                <div
                  ref={blobRef}
                  style={{
                    position: 'absolute',
                    left: `${blobPosition.x}%`,
                    top: `${blobPosition.y}%`,
                    width: `${blobSize}px`,
                    height: `${blobSize}px`,
                    backgroundColor: `rgba(${hexToRgb(blobColor).r}, ${hexToRgb(blobColor).g}, ${hexToRgb(blobColor).b}, 0.25)`,
                    // background: 'rgba(255, 232, 31, 0.25)',
                    border: `${borderWidth}px solid ${blobColor}`,
                    borderRadius: coordinates,
                    transform: `rotate(${rotation}deg)`,
                    transition: 'border-radius 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <style jsx>{`
                    @font-face {
                      font-family: 'Helvetica';
                      src: url('/fonts/helvetica-bold.ttf') format('truetype');
                    }
                  `}</style>
                  <span style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    position: 'absolute',
                    top: '100%',
                    width: 'max-content',
                    textAlign: 'center',
                    marginTop: '10px',
                    background: blobColor,
                    color: '#000',
                    padding: '5px 10px',
                    borderRadius: 5
                  }}>
                    {text}
                  </span>
                </div>
              </div>

              <button onClick={handleDownload}>
                Download Image
              </button>
            </>
          )}
        </div>
      </main>
    </>
  )
}
