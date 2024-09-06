// add tiny dino punk hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react';

export default function TinyDinoPunkHat() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.8)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)
  const canvasRef = useRef(null)

  const dinoHat1 = '/dinohat_1.png'
  const dinoHat2 = '/dinohat_2.png'
  const dinoHat3 = '/dinohat_3.png'
  const dinoHat4 = '/dinohat_4.png'

  useEffect(() => {
    // draw image on canvas
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const hat = new Image()
      if (hatType === 0)
        hat.src = dinoHat1
      else if (hatType === 1)
        hat.src = dinoHat2
      else if (hatType === 2)
        hat.src = dinoHat3
      else if (hatType === 3)
        hat.src = dinoHat4

      hat.crossOrigin = 'anonymous'

      hat.onload = () => {
        console.log('hat', hat)
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
        context.closePath()
      }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType])

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
        <title>Tiny Dino Punk Hat</title>
        <meta name="description" content="Tiny Dino Punk Hat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Tiny Dino Punk Hat
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add tiny dino punk hat on any image
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
        <div style={{ display: 'flex', gap: 20, margin: '20px 0' }}>
          <canvas ref={canvasRef} id="canvas" width="800" height="800" style={{
            border: '1px solid #333',
            borderRadius: 10,
            maxHeight: 500,
            height: 'auto',
            flexBasis: '95%'
          }}></canvas>

          <div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'space-between' }}>
              <div style={{
                width: 100,
                height: 100,
                border: hatType === 0 ? '2px solid #333' : '2px solid #111',
                borderRadius: 10,
                padding: 10
              }}>
                <img src={dinoHat1} alt="Dino Hat 1" style={{
                  height: 'auto', width: 70,
                  margin: 'auto',
                  marginTop: 20,
                }} onClick={() => setHatType(0)} />
              </div>
            </div>
            <div style={{
              width: 100,
              height: 100,
              border: hatType === 1 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={dinoHat2} alt="Dino Hat 2" style={{
                width: '80%', height: 'auto',
                margin: 'auto',
                marginTop: 30,
                marginLeft: 10
              }} onClick={() => setHatType(1)} />
            </div>
            <div style={{
              width: 100,
              height: 100,
              border: hatType === 2 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={dinoHat3} alt="Dino Hat 3" style={{
                width: 100, height: 'auto',
                marginTop: 20,
              }} onClick={() => setHatType(2)} />
            </div>
            <div style={{
              width: 100,
              height: 100,
              border: hatType === 3 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={dinoHat4} alt="Dino Hat 4" style={{
                width: 100, height: 'auto',
                marginTop: 20,
              }} onClick={() => setHatType(3)} />
            </div>
          </div>
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
        </div>

        <button onClick={() => {
          const canvas = canvasRef.current
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `tiny-dino-punk-hat-${Date.now()}.png`
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