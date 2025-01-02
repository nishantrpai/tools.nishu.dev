// add higher hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherHat() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.8)
  const [color, setColor] = useState('#35EB43')
  const [heading, setHeading] = useState('HIGHER')
  const [headingColor, setHeadingColor] = useState('#ffffff')
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)

  const higherHat = '/higherscanner.svg'

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

      hat.onload = () => {
        // Fetch the SVG content
        fetch(hat.src)
          .then(response => response.text())
          .then(svgContent => {
            // Create a temporary container
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

            // Update the SVG elements
            const bgElements = svgDoc.querySelectorAll('.bg');
            const borderElements = svgDoc.querySelectorAll('.border');
            const headingElement = svgDoc.querySelector('.heading');
            const textElements = svgDoc.querySelectorAll('.text');
            const textRect = svgDoc.querySelector('.text-rect');

            if (bgElements.length) {
              bgElements.forEach(bgElement => {
                console.log(bgElement)
                bgElement.style.fill = color;
              });
            }
            if (borderElements.length) {
              borderElements.forEach(borderElement => {
                borderElement.style.stroke = color;
              });
            }
            if (headingElement) {
              headingElement.textContent = heading;
            }

            if (textElements.length) {
              textElements.forEach(textElement => {
                textElement.style.fill = headingColor;
                textElement.textContent = heading;
                textRect.setAttribute('width', heading.length * 9);
              });
            }

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
      };


    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType, color, heading, headingColor])

  return (
    <>
      <Head>
        <title>Text Frames</title>
        <meta name="description" content="Text Frames" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '20px 0',
      }}>
        <h1 className={styles.title}>
          Text Frames
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add text frames on any image
        </span>

        {/* upload photo */}
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(38)
              setOffsetY(60)
              setScale(0.8)
              setOffsetTheta(0)
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <div style={{ display: 'flex', gap: 20, flexDirection: 'row', width: '100%' }}>
          <canvas id="canvas" width="800" height="800" style={{
            border: '1px solid #333',
            borderRadius: 10,
            width: '100%',
            height: 'auto',
            margin: '20px 0'
          }}></canvas>
          <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
            <label>
              Color
            </label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <label>
              Heading
            </label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} />
            <label>
              Heading Color
            </label>
            <input type="color" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} />
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
            <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = `textframe-${Date.now()}.png`
            a.click()
          }} style={{
            marginTop: 20
          }}>
            Download Image
          </button>
          </div>

        </div>
        
      </main>
    </>
  )
}