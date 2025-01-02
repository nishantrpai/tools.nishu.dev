// add higher hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherHat() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(104)
  const [scale, setScale] = useState(2.4)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)

  const higherHat = '/higheritalic.svg'

  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const hat = new Image()
      if (hatType === 0)
        hat.src = higherHat
      else if (hatType === 1)
        hat.src = higherHat2
      else if (hatType === 2)
        hat.src = higherHat3

      fetch(hat.src)
      .then(response => response.text())
      .then(svgContent => {
        // Create a temporary container
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

        // Update the SVG elements
        // update the parent svg element width 
        const svg = svgDoc.querySelector('svg');
        svg.setAttribute('width', '500');
        svg.setAttribute('viewBox', '-10 -50 250 150');
        const text = svgDoc.querySelector('text');
        text.textContent = "die";
        // text-decoration line through 
        text.setAttribute('text-decoration', 'line-through');

        // Convert back to data URL
        const serializer = new XMLSerializer();
        const updatedSvgString = serializer.serializeToString(svgDoc);
        const updatedHat = new Image();
        updatedHat.src = 'data:image/svg+xml;base64,' + btoa(updatedSvgString);

        updatedHat.onload = () => {
          context.translate(offsetX, offsetY);
          context.rotate(offsetTheta * Math.PI / 180);
          context.drawImage(updatedHat, offsetX, offsetY, updatedHat.width * scale, updatedHat.height * scale);
          context.closePath();
        };
      });
}
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType])

  return (
    <>
      <Head>
        <title>Don't Die</title>
        <meta name="description" content="Don't Die" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Don't Die
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add Don't Die on any image
        </span>

        {/* upload photo */}
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(0)
              setOffsetY(104)
              setScale(2.4)
              setOffsetTheta(0)
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" width="800" height="800" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <label>
            Offset X
          </label>
          <input type="range" min={-(imgWidth * 1.5)} max={(imgWidth * 1.5)} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-(imgHeight * 1.5)} max={(imgHeight * 1.5)} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.01} value={scale} onChange={(e) => setScale(e.target.value)} />
          <label>
            Rotate
          </label>
          <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `dontdie-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
      </main>
    </>
  )
}