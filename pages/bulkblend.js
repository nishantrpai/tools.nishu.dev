// bulk blend a layer onto images in the browser
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [images, setImages] = useState([])
  const [opacity, setOpacity] = useState(1)
  const allBlends = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
  const [files, setFiles] = useState([])

  const handleImages = async (e) => {
    const fileList = e.target.files
    setFiles(Array.from(fileList))
    setImages([])
    if (!fileList) return
    for (let i = 0; i < fileList.length; i++) {
      const image = await loadImage(fileList[i])
      setImages(prevImages => [...prevImages, image])
    }
  }

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          resolve(image)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Get all unique combinations of images
  const getImageCombinations = () => {
    const combinations = []
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        combinations.push({
          img1: images[i],
          img2: images[j],
          name1: files[i].name,
          name2: files[j].name,
          index1: i,
          index2: j
        })
      }
    }
    return combinations
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }

  const downloadImage = (canvas) => {
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `blended-image-${Date.now()}.png`
    a.click()
  }

  const renderCanvas = (image1, image2, canvasId, blendMode) => {
    const canvas = document.getElementById(canvasId)
    const ctx = canvas.getContext('2d')
    canvas.width = image1.width
    canvas.height = image1.height
    ctx.globalAlpha = opacity
    ctx.globalCompositeOperation = blendMode
    const scaleFactor = canvas.width / image2.height
    const scaledWidth = image2.width * scaleFactor
    const center = (canvas.width - scaledWidth) / 2

    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(image2, center, 0, scaledWidth, canvas.height)
  }

  useEffect(() => {
    if (images.length >= 2) {
      const combinations = getImageCombinations()
      combinations.forEach((combo, i) => {
        allBlends.forEach((blend, k) => {
          const canvasId = `canvas-${i}-${k}`
          renderCanvas(combo.img1, combo.img2, canvasId, blend)
        })
      })
    }
  }, [images, opacity])

  return (
    <>
      <Head>
        <title>Bulk Blend Layer</title>
        <meta name="description" content="Bulk blend a layer onto images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{maxWidth: '100vw', padding: '0 1rem'}}>
        <h1 className={styles.title}>Blend Layer</h1>
        <p className={styles.description}>Select multiple images to see all possible blend combinations</p>

        <div className={styles.searchContainer}>
          <input type='file' onChange={handleImages} multiple />
          <input type='range' min='0' max='1' step='0.01' value={opacity} onChange={handleOpacity} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          maxWidth: '2400px',
          margin: '0 auto'
        }}>
          {images.length >= 2 && getImageCombinations().map((combo, i) => (
            allBlends.map((blend, k) => (
              <div key={`${i}-${k}`} style={{
                border: '1px solid #111',
                borderRadius: '4px',
                padding: '0.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '0.7rem'
              }}>
                <canvas 
                  id={`canvas-${i}-${k}`} 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }} 
                  onDoubleClick={(e) => downloadImage(e.target)}
                  title={`Double click to download`}
                />
                <div style={{
                  width: '100%',
                  marginTop: '0.25rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  <div style={{fontWeight: 'bold'}}>{blend}</div>
                  <div style={{color: '#666', fontSize: '0.65rem'}}>
                    {combo.name1.slice(0, 10)}... + {combo.name2.slice(0, 10)}...
                  </div>
                  <div style={{color: '#888', fontSize: '0.65rem'}}>
                    {Math.round(opacity * 100)}% opacity
                  </div>
                </div>
              </div>
            ))
          ))}
        </div>
      </main>
    </>
  )
}