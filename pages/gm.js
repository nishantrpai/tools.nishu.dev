import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function GMSpeechBubble() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.8)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [bubbleType, setBubbleType] = useState(0)
  const canvasRef = useRef(null)

  const gmBubbles = [
    '/gm1.webp',
    '/gm2.webp',
    '/gm3.webp',
    '/gm4.webp',
    '/gm5.webp'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const bubble = new Image()
      bubble.src = gmBubbles[bubbleType]
      bubble.crossOrigin = 'anonymous'

      bubble.onload = () => {
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(bubble, offsetX, offsetY, bubble.width * scale, bubble.height * scale)
        context.closePath()
      }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, bubbleType])

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            setOffsetX(38);
            setOffsetY(60);
            setScale(0.8);
            setOffsetTheta(0);
            setImgWidth(img.width);
            setImgHeight(img.height);
            setImage(img);
          };
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <>
      <Head>
        <title>GM Speech Bubble</title>
        <meta name="description" content="GM Speech Bubble" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          GM Speech Bubble
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add GM speech bubble on any image
        </span>

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
        <div style={{ display: 'flex', gap: 20, margin: '20px 0', flexWrap: 'wrap' }}>
          <canvas ref={canvasRef} id="canvas" width="500" height="500" style={{
            border: '1px solid #333',
            borderRadius: 10,
            maxHeight: 500,
            height: 'auto',
            flexBasis: '95%',
            width: '100%'
          }}></canvas>

          <div style={{display: 'flex', gap: 10}}>
            {gmBubbles.map((bubble, index) => (
              <div key={index} style={{
                width: 75,
                height: 70,
                border: bubbleType === index ? '2px solid #333' : '2px solid #111',
                borderRadius: 10,
                padding: 10
              }}>
                <img src={bubble} alt={`GM Bubble ${index + 1}`} style={{
                  height: 'auto', width: 50,
                  margin: 'auto',
                }} onClick={() => setBubbleType(index)} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <label>
              Offset X
            </label>
            <input type="range" min={-(imgWidth * 1.5)} max={(imgWidth * 1.5)} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
            <input type="number" value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
            <label>
              Offset Y
            </label>
            <input type="range" min={-(imgHeight * 1.5)} max={(imgHeight * 1.5)} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
            <input type="number" value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
            <label>
              Scale
            </label>
            <input type="range" min={0} max={10} step={0.0001} value={scale} onChange={(e) => setScale(e.target.value)} />
            <input type="number" value={scale} onChange={(e) => setScale(e.target.value)} />
            <label>
              Rotate
            </label>
            <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
            <input type="number" value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
            <button
            id="save"
             onClick={() => {
              if (document.getElementById('canvas').toDataURL() !== '') {
                const img = new Image()
                img.src = document.getElementById('canvas').toDataURL()
                setImage(img)
              }
              document.getElementById('save').innerText = 'Saved...'
              setTimeout(() => {
                document.getElementById('save').innerText = 'Save'
              }, 2000)
            }}>Save</button>

            <button onClick={() => {
              const canvas = canvasRef.current
              const dataURL = canvas.toDataURL('image/png')
              const a = document.createElement('a')
              a.href = dataURL
              a.download = `gm-speech-bubble-${Date.now()}.png`
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
