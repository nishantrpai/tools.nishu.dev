import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

export default function BackgroundColor() {
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#0000')
  const [opacity, setOpacity] = useState(1)
  const canvasRef = useRef(null)
  
  // Predefined color palette
  const colorPalette = [
    '#ffffff', // White
    '#000000', // Black
    '#FF5733', // Red-orange
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F3FF33', // Yellow
    '#FF33F3', // Magenta
    '#33FFF3', // Cyan
    '#808080', // Gray
    '#FFA500', // Orange
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const context = canvas.getContext('2d')
    
    // change cnanvas size to match image width, height
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
    } else {
      canvas.width = 600
      canvas.height = 600
    }

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background color
    context.fillStyle = backgroundColor
    context.globalAlpha = 1.0 // Always full opacity for background
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw image if it exists
    if (image) {
      // Reset alpha for the image
      context.globalAlpha = opacity
      
      // Center the image on canvas
      const x = (canvas.width - imgWidth) / 2
      const y = (canvas.height - imgHeight) / 2
      
      context.drawImage(image, x, y, imgWidth, imgHeight)
    }
  }, [image, imgWidth, imgHeight, backgroundColor, opacity])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        // Set a maximum size while maintaining aspect ratio
        const maxDimension = 500
        let width = img.width
        let height = img.height
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }
        
        setImgWidth(width)
        setImgHeight(height)
        
        // Set canvas size based on image
        const canvas = canvasRef.current
        canvas.width = Math.max(width + 100, 600) // Add padding around image
        canvas.height = Math.max(height + 100, 400)
        
        setImage(img)
      }
    }
    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `image-with-bg-${Date.now()}.png`
    a.click()
  }

  return (
    <>
      <Head>
        <title>Background Color Tool</title>
        <meta name="description" content="Change background color for transparent images" />
      </Head>
      
      <main>
        <h1>Background Color Tool</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Upload an image with transparency to preview it against different background colors
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="file" 
            accept="image/png, image/gif" 
            onChange={handleImageUpload} 
            style={{ marginBottom: '10px' }}
          />
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          style={{ 
            border: '1px solid #333', 
            borderRadius: '8px',
            marginBottom: '20px',
            width: '100%',
          }}
        />

        <div style={{ 
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: '10px',
            width: '100%'
          }}>
            <label style={{ marginRight: '10px', minWidth: '120px' }}>Background Color:</label>
            <input 
              type="color" 
              value={backgroundColor} 
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{ marginRight: '10px', width: '50px', height: '30px' }}
            />
            <input 
              type="text" 
              value={backgroundColor} 
              onChange={(e) => setBackgroundColor(e.target.value)} 
              style={{ width: '80px' }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: '10px',
            width: '100%'
          }}>
            <label style={{ marginRight: '10px', minWidth: '120px' }}>Image Opacity:</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={opacity} 
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              style={{ marginRight: '10px', width: '200px' }}
            />
            <span>{opacity.toFixed(2)}</span>
          </div>
        </div>
        
        
        <div style={{ marginBottom: '20px', gap: 10, display: 'flex', flexDirection: 'column' }}>
          <label>Color Palette</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', border: '1px solid #333', background: '#222', padding: '10px', borderRadius: '8px', width: '100%' }}>
            {colorPalette.map((color, index) => (
              <div 
                key={index}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: color,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setBackgroundColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
        
        
        <button 
          onClick={downloadImage}
        >
          Download Image
        </button>
      </main>
    </>
  )
}
