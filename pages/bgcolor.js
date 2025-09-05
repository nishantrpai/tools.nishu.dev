import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import JSZip from 'jszip'

export default function BackgroundColor() {
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#0000')
  const [opacity, setOpacity] = useState(1)
  const [selectedColors, setSelectedColors] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
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

  const toggleColorSelection = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `image-with-bg-${backgroundColor.replace('#', '')}-${Date.now()}.png`
    a.click()
  }
  
  const downloadBulk = async () => {
    if (!image || selectedColors.length === 0) return
    
    setIsGenerating(true)
    setProgress(0)
    
    const canvas = document.createElement('canvas')
    canvas.width = imgWidth
    canvas.height = imgHeight
    const context = canvas.getContext('2d')
    
    const zip = new JSZip()
    const folder = zip.folder("background-variations")
    
    for (let i = 0; i < selectedColors.length; i++) {
      // Update progress
      setProgress(Math.floor((i / selectedColors.length) * 100))
      
      const color = selectedColors[i]
      
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw background color
      context.fillStyle = color
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw image
      context.globalAlpha = opacity
      context.drawImage(image, 0, 0, imgWidth, imgHeight)
      
      // Get the image data
      const dataURL = canvas.toDataURL('image/png').split(',')[1]
      
      // Add to zip
      folder.file(`image-with-bg-${color.replace('#', '')}.png`, dataURL, {base64: true})
      
      // Small delay to allow UI updates
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    // Generate and download the zip file
    const content = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(content)
    link.download = "background-variations.zip"
    link.click()
    
    setIsGenerating(false)
    setProgress(100)
    
    // Reset progress after a short delay
    setTimeout(() => setProgress(0), 2000)
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
                  justifyContent: 'center',
                  border: backgroundColor === color ? '3px solid #fff' : 'none',
                }}
                onClick={() => setBackgroundColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px', gap: 10, display: 'flex', flexDirection: 'column' }}>
          <label>Bulk Download - Select Multiple Colors</label>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 10px 0' }}>
            Click to select multiple colors for bulk download
          </p>
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
                  justifyContent: 'center',
                  border: selectedColors.includes(color) ? '3px solid #fff' : 'none',
                  position: 'relative',
                }}
                onClick={() => toggleColorSelection(color)}
                title={color}
              >
                {selectedColors.includes(color) && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Custom color input for bulk selection */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginTop: '10px'
          }}>
            <input 
              type="color" 
              value="#ffffff"
              id="customColorPicker"
              style={{ width: '50px', height: '30px' }}
            />
            <button
              onClick={() => {
                const customColor = document.getElementById('customColorPicker').value;
                if (customColor && !selectedColors.includes(customColor)) {
                  toggleColorSelection(customColor);
                }
              }}
              style={{
                padding: '5px 10px',
                backgroundColor: '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Add Custom Color
            </button>
          </div>
          
          {selectedColors.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p>{selectedColors.length} color(s) selected for bulk download</p>
            </div>
          )}
        </div>
        
        {isGenerating && (
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <p>Generating images: {progress}% complete</p>
            <div style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#333',
              borderRadius: '5px',
              overflow: 'hidden',
              marginTop: '5px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#0070f3',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={downloadImage}          >
            Download Current Image
          </button>
          
          <button 
            onClick={downloadBulk}
            disabled={selectedColors.length === 0 || isGenerating || !image}
          >
            Download {selectedColors.length} Background Variations
          </button>
        </div>
      </main>
    </>
  )
}
