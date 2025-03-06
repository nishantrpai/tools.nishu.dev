import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import JSZip from 'jszip'

export default function BasicCollage() {
  const [photos, setPhotos] = useState([])
  const [canvasWidth, setCanvasWidth] = useState(1000)
  const [canvasHeight, setCanvasHeight] = useState(1000)
  const [cellsPerRow, setCellsPerRow] = useState(3)
  const [collageDataUrl, setCollageDataUrl] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [gridGap, setGridGap] = useState(0)
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos(files)
  }

  const downloadCollage = () => {
    if (!collageDataUrl) return
    
    const a = document.createElement('a')
    a.href = collageDataUrl
    a.download = 'collage.png'
    a.click()
  }

  const createCollage = async () => {
    if (!photos.length) return
    
    // Create main canvas for the collage
    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d')
    
    // Fill with selected background color
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Calculate cell dimensions with grid gap
    const availableWidth = canvasWidth - gridGap * (cellsPerRow - 1)
    const cellWidth = Math.floor(availableWidth / cellsPerRow)
    const cellHeight = cellWidth // Square cells for simplicity
    
    // Calculate total rows needed
    const totalRows = Math.ceil(photos.length / cellsPerRow)
    
    // Calculate full height needed for the grid with gaps
    const requiredHeight = cellHeight * totalRows + gridGap * (totalRows - 1)
    
    // Adjust canvas height if needed
    if (requiredHeight > canvasHeight) {
      canvas.height = requiredHeight
      // Re-fill the extended canvas with background color
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvasWidth, canvas.height)
    }
    
    // Load and draw each image
    const imagePromises = photos.map((file) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = URL.createObjectURL(file)
      })
    })
    
    const loadedImages = await Promise.all(imagePromises)
    
    loadedImages.forEach((img, index) => {
      const row = Math.floor(index / cellsPerRow)
      const col = index % cellsPerRow
      
      // Calculate position with grid gaps
      const x = col * (cellWidth + gridGap)
      const y = row * (cellHeight + gridGap)
      
      // Object-fit: cover equivalent for canvas
      // Determine which dimension needs to be cropped
      const widthRatio = cellWidth / img.width
      const heightRatio = cellHeight / img.height
      let sourceX, sourceY, sourceWidth, sourceHeight
      
      if (widthRatio > heightRatio) {
        // Width fits completely, height needs cropping
        sourceWidth = img.width
        sourceHeight = cellHeight / widthRatio
        sourceX = 0
        sourceY = (img.height - sourceHeight) / 2
        
        // Draw full width, cropped height
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, cellWidth, cellHeight)
      } else {
        // Height fits completely, width needs cropping
        sourceWidth = cellWidth / heightRatio
        sourceHeight = img.height
        sourceX = (img.width - sourceWidth) / 2
        sourceY = 0
        
        // Draw cropped width, full height
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, cellWidth, cellHeight)
      }
    })
    
    setCollageDataUrl(canvas.toDataURL())
  }
  
  useEffect(() => {
    if (photos.length > 0) {
      createCollage()
    }
  }, [photos, canvasWidth, canvasHeight, cellsPerRow, backgroundColor, gridGap])

  return (
    <div className={styles.container}>
      <Head>
        <title>Basic Image Collage</title>
        <meta name="description" content="Create a collage from multiple images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Basic Image Collage
        </h1>

        <p style={{
          color: '#888',
          fontSize: '16px',
          margin: '20px 0',
          width: '100%',
          textAlign: 'center'
        }}>
          Upload multiple images to create a collage grid
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
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{color: '#888'}}>Canvas Width</label>
              <input 
                type="number" 
                value={canvasWidth} 
                onChange={(e) => {
                  setCanvasWidth(Number(e.target.value))
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
              <label style={{color: '#888'}}>Canvas Height</label>
              <input 
                type="number"
                value={canvasHeight}
                onChange={(e) => {
                  setCanvasHeight(Number(e.target.value))
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
              <label style={{color: '#888'}}>Cells Per Row</label>
              <input 
                type="number"
                min="1"
                value={cellsPerRow}
                onChange={(e) => {
                  setCellsPerRow(Number(e.target.value))
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
              <label style={{color: '#888'}}>Grid Gap (px)</label>
              <input 
                type="number"
                min="0"
                value={gridGap}
                onChange={(e) => {
                  setGridGap(Number(e.target.value))
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
              <label style={{color: '#888'}}>Background Color</label>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <input 
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => {
                    setBackgroundColor(e.target.value)
                  }}
                  style={{
                    width: '50px',
                    height: '30px',
                    border: 'none',
                    padding: '0',
                    background: 'none'
                  }}
                />
                <input 
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => {
                    setBackgroundColor(e.target.value)
                  }}
                  style={{
                    fontSize: '16px',
                    padding: '5px',
                    borderRadius: '5px', 
                    border: '1px solid #333',
                    width: '80px'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
            width: '100%'
          }}>
            <h3>Collage Preview</h3>
            {collageDataUrl && (
              <div style={{
                marginTop: '10px',
                border: '1px solid #333',
                maxWidth: '100%',
                overflowX: 'auto'
              }}>
                <img 
                  src={collageDataUrl} 
                  style={{
                    maxWidth: '100%',
                    display: 'block'
                  }} 
                />
              </div>
            )}
            
            {!collageDataUrl && photos.length > 0 && (
              <p>Generating collage...</p>
            )}
            
            {!photos.length && (
              <p style={{color: '#888'}}>Upload images to generate a collage</p>
            )}
          </div>
        </div>
        
        <button 
          onClick={downloadCollage} 
          disabled={!collageDataUrl}
        >
          Download Collage
        </button>
      </main>
    </div>
  )
}