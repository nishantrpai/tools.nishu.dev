import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import JSZip from 'jszip'

export default function ResizeImages() {
  const [photos, setPhotos] = useState([])
  const [targetWidth, setTargetWidth] = useState(500)
  const [targetHeight, setTargetHeight] = useState(500)
  const [resizedPhotos, setResizedPhotos] = useState([])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos(files)
    resizeImages(files)
  }

  const resizeImages = async (files) => {
    const resized = await Promise.all(files.map(async (file) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = targetWidth
          canvas.height = targetHeight
          const ctx = canvas.getContext('2d')
          
          // Fill with transparent background
          ctx.fillStyle = 'rgba(0,0,0,0)'
          ctx.fillRect(0, 0, targetWidth, targetHeight)
          
          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(targetWidth / img.width, targetHeight / img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          
          // Center the image
          const x = (targetWidth - scaledWidth) / 2
          const y = (targetHeight - scaledHeight) / 2
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          
          resolve({
            original: {
              url,
              width: img.width,
              height: img.height
            },
            resized: {
              url: canvas.toDataURL(),
              width: targetWidth,
              height: targetHeight
            }
          })
        }
        img.src = url
      })
    }))
    
    setResizedPhotos(resized)
  }

  const handleDimensionChange = () => {
    if (photos.length) {
      resizeImages(photos)
    }
  }
  useEffect(() => {
    handleDimensionChange()
  }, [targetWidth, targetHeight]) 

  return (
    <div className={styles.container}>
      <Head>
        <title>Bulk Resize Images</title>
        <meta name="description" content="Bulk resize images to specific dimensions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bulk Resize Images
        </h1>

        <p style={{
          color: '#888',
          fontSize: '16px',
          margin: '20px 0',
          width: '100%',
          textAlign: 'center'
        }}>
          Bulk resize multiple images to the same dimensions with transparent background
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '20px',
          width: '100%'
        }}>
          <div>
            <label style={{
              marginBottom: '10px',
              fontSize: '16px',
              display: 'flex',
              color: '#888',
            }}>Choose your images</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          <div style={{
            display: 'flex',
            gap: '10px'
          }}>
            <div>
              <label style={{color: '#888'}}>Width</label>
              <input 
                type="number" 
                value={targetWidth} 
                onChange={(e) => {
                  setTargetWidth(Number(e.target.value))
                }}
                style={{
                  fontSize: '16px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #333',
                  width: '100px'
                }}
              />
            </div>
            <div>
              <label style={{color: '#888'}}>Height</label>
              <input 
                type="number"
                value={targetHeight}
                onChange={(e) => {
                  setTargetHeight(Number(e.target.value))
                }}
                style={{
                  fontSize: '16px',
                  padding: '5px',
                  borderRadius: '5px', 
                  border: '1px solid #333',
                  width: '100px'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '100px'
          }}>
            <div style={{flex: 1}}>
              <h3 style={{width: '100%', textAlign: 'center', marginBottom: '20px'}}>Original Images</h3>
              {resizedPhotos.map((photo, i) => (
                <div key={i} style={{marginBottom: '20px'}}>
                  <img src={photo.original.url} style={{maxWidth: '100%', border: '1px solid #333'}} />
                  <p style={{color: '#888', textAlign: 'center'}}>
                    {photo.original.width} x {photo.original.height}
                  </p>
                </div>
              ))}
            </div>
            
            <div style={{flex: 1}}>
              <h3 style={{width: '100%', textAlign: 'center', marginBottom: '20px'}}>Resized Images</h3>
              {resizedPhotos.map((photo, i) => (
                <div key={i} style={{marginBottom: '20px'}}>
                  <img src={photo.resized.url} style={{maxWidth: '100%', border: '1px solid #333'}} />
                  <p style={{color: '#888', textAlign: 'center'}}>
                    {photo.resized.width} x {photo.resized.height}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}