import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import JSZip from 'jszip'

export default function FontLogo() {
  // Canvas and text controls
  const [backgroundColor, setBackgroundColor] = useState('#0000')
  const [text, setText] = useState('LOGO')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontUrl, setFontUrl] = useState('')
  const [fontLoaded, setFontLoaded] = useState(false)
  const [textColor, setTextColor] = useState('#ffffff')
  const [textSize, setTextSize] = useState(60)
  const [textOffsetX, setTextOffsetX] = useState(0)
  const [textOffsetY, setTextOffsetY] = useState(0)
  const [textWidth, setTextWidth] = useState(400)
  const [fontWeight, setFontWeight] = useState(400)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderlined, setIsUnderlined] = useState(false)
  
  // Canvas and image state
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState(512)
  
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

  // Load Google font from URL
  const loadGoogleFont = (url) => {
    try {
      // Extract font family from URL
      const urlObj = new URL(url)
      const familyParam = urlObj.searchParams.get('family')
      
      if (!familyParam) {
        console.error('Invalid Google font URL')
        return
      }
      
      // Extract just the font name (remove weight/style parameters)
      const fontName = familyParam.split(':')[0].replace(/\+/g, ' ')
      
      // Create link element for the font
      const link = document.createElement('link')
      link.href = url
      link.rel = 'stylesheet'
      
      // When font is loaded, update state
      link.onload = () => {
        setFontFamily(fontName)
        setFontLoaded(true)
      }
      
      // Add to document head
      document.head.appendChild(link)
    } catch (err) {
      console.error('Error loading Google font:', err)
    }
  }

  // Handle Google Font URL input
  const handleFontUrlInput = () => {
    if (fontUrl) {
      loadGoogleFont(fontUrl)
    }
  }

  // Draw canvas when parameters change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Skip if we don't have text
    if (!text) return
    
    // Set text properties
    ctx.fillStyle = textColor
    const fontStyle = isItalic ? 'italic' : 'normal'
    ctx.font = `${fontStyle} ${fontWeight} ${textSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const x = canvas.width / 2 + textOffsetX
    const y = canvas.height / 2 + textOffsetY
    
    // Calculate width for wrapping if needed
    if (textWidth < canvas.width) {
      drawWrappedText(ctx, text, x, y, textWidth)
    } else {
      ctx.fillText(text, x, y)
      
      // Add underline if enabled
      if (isUnderlined) {
        const textMetrics = ctx.measureText(text)
        const textWidth = textMetrics.width
        const underlineY = y + textSize * 0.15
        drawUnderline(ctx, x - textWidth / 2, underlineY, textWidth, textColor)
      }
    }
  }, [backgroundColor, text, fontFamily, textColor, textSize, 
      textOffsetX, textOffsetY, textWidth, fontWeight, isItalic, isUnderlined, fontLoaded])

  // Function to draw an underline
  function drawUnderline(ctx, x, y, width, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(1, textSize / 20) // Scale underline with font size
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.stroke()
  }

  // Function to handle word wrapping and line breaks
  function drawWrappedText(ctx, text, x, y, maxWidth) {
    const textLines = text.split('\n')
    const lineHeight = textSize * 1.2
    let lines = []
    
    // Process each line from the text input
    textLines.forEach(textLine => {
      const words = textLine.split(' ')
      let line = ''
      
      // Build lines based on word wrapping
      for (let i = 0; i < words.length; i++) {
        const testLine = line + (line ? ' ' : '') + words[i]
        const metrics = ctx.measureText(testLine)
        
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line)
          line = words[i]
        } else {
          line = testLine
        }
      }
      
      // Add the last line from this paragraph
      if (line) {
        lines.push(line)
      }
    })
    
    // If no lines were created, ensure we have at least one empty line
    if (lines.length === 0) {
      lines.push('')
    }
    
    // Draw each line
    const totalHeight = lines.length * lineHeight
    const startY = y - (totalHeight / 2) + (lineHeight / 2)
    
    for (let i = 0; i < lines.length; i++) {
      const lineY = startY + i * lineHeight
      ctx.fillText(lines[i], x, lineY)
      
      // Add underline if enabled
      if (isUnderlined) {
        const lineWidth = ctx.measureText(lines[i]).width
        const underlineY = lineY + textSize * 0.15
        drawUnderline(ctx, x - lineWidth / 2, underlineY, lineWidth, textColor)
      }
    }
  }

  // Download the logo as PNG
  const downloadLogo = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `logo-${Date.now()}.png`
    a.click()
  }

  // Create PNG from canvas at specific size
  const createPNG = async (size) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    // Create temporary canvas at desired size
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = size
    tempCanvas.height = size
    const ctx = tempCanvas.getContext('2d')
    
    // Draw the original canvas scaled to the new size
    ctx.drawImage(canvas, 0, 0, size, size)
    
    // Return as blob
    return new Promise(resolve => {
      tempCanvas.toBlob(blob => resolve(blob), 'image/png')
    })
  }

  // Download favicon set
  const downloadFaviconSet = async () => {
    // Favicon sizes
    const sizes = [16, 32, 48, 57, 72, 96, 120, 128, 144, 152, 195, 228]
    
    // Create a zip file
    const zip = new JSZip()
    const folder = zip.folder('favicons')
    
    // Generate all favicon sizes
    for (const size of sizes) {
      const blob = await createPNG(size)
      folder.file(`favicon-${size}x${size}.png`, blob)
    }
    
    // Create an ICO file for the 16x16 favicon
    const ico16 = await createPNG(16)
    folder.file('favicon.ico', ico16)
    
    // Generate manifest.json
    const manifest = {
      name: text || 'Logo',
      short_name: text || 'Logo',
      icons: sizes.map(size => ({
        src: `/favicons/favicon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png'
      }))
    }
    folder.file('manifest.json', JSON.stringify(manifest, null, 2))
    
    // Generate HTML code snippet
    const htmlSnippet = `
<!-- Favicon code -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon-48x48.png">
<link rel="icon" type="image/x-icon" href="/favicons/favicon.ico">
<link rel="apple-touch-icon" sizes="57x57" href="/favicons/favicon-57x57.png">
<link rel="apple-touch-icon" sizes="72x72" href="/favicons/favicon-72x72.png">
<link rel="apple-touch-icon" sizes="120x120" href="/favicons/favicon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="/favicons/favicon-144x144.png">
<link rel="manifest" href="/favicons/manifest.json">
`
    folder.file('favicon-html.txt', htmlSnippet.trim())
    
    // Download the zip file
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'favicons.zip'
    link.click()
  }

  return (
    <>
      <Head>
        <title>Font Logo Creator</title>
        <meta name="description" content="Create logos with custom fonts and export favicon sets" />
      </Head>
      
      <main>
        <h1>Font Logo Creator</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Create logos with custom Google fonts and generate favicon sets
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Canvas Preview */}
            <canvas 
              ref={canvasRef} 
              width={canvasSize} 
              height={canvasSize} 
              style={{ 
                border: '1px solid #333',
                borderRadius: '8px',
                width: '100%',
                height: 'auto',
                background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQYYABJgYGBgYWBlQWEMUAIwAAbWAA3cqJ80IAAAAASUVORK5CYII=")'
              }}
            />

            {/* Font URL Input */}
            <div>
              <label htmlFor="fontUrl" style={{ display: 'block', marginBottom: '5px' }}>
                Google Font URL:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                  id="fontUrl"
                  type="text"
                  value={fontUrl}
                  onChange={(e) => setFontUrl(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
                  style={{ 
                    flex: 1, 
                    padding: '8px',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    marginRight: '10px'
                  }}
                />
                <button
                  onClick={handleFontUrlInput}
                >
                  Load Font
                </button>
              </div>
              <p style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                Get a Google Font URL from <a href="https://fonts.google.com/" target="_blank" rel="noreferrer">fonts.google.com</a>
              </p>
            </div>

            {/* Download Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={downloadLogo}
              >
                Download Logo
              </button>
              <button
                onClick={downloadFaviconSet}
              >
                Download Favicon Set
              </button>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Text Input */}
            <div>
              <label htmlFor="logoText" style={{ display: 'block', marginBottom: '5px' }}>
                Logo Text:
              </label>
              <textarea
                id="logoText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Enter your logo text here"
              />
            </div>
            
            {/* Background Color */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Background Color:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={{ width: '50px', height: '30px' }}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={{ width: '80px', padding: '5px' }}
                />
              </div>
            </div>
            
            {/* Text Color */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Text Color:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '50px', height: '30px' }}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '80px', padding: '5px' }}
                />
              </div>
            </div>
            
            {/* Text Size */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Text Size: {textSize}px
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={textSize}
                onChange={(e) => setTextSize(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Font Weight */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Font Weight:
              </label>
              <select 
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                style={{ padding: '8px', width: '100%', borderRadius: '4px' }}
              >
                <option value="100">Thin (100)</option>
                <option value="200">Extra Light (200)</option>
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>
            
            {/* Text Width (for wrapping) */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Text Width: <span>{textWidth}px</span>
              </label>
              <input
                type="range"
                min="50"
                max={canvasSize}
                value={textWidth}
                onChange={(e) => setTextWidth(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Text Styling */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Text Styling:
              </label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button 
                  onClick={() => setFontWeight(fontWeight === 700 ? 400 : 700)}
                  style={{ 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  B
                </button>
                <button 
                  onClick={() => setIsItalic(!isItalic)}
                  style={{ 
                    fontStyle: 'italic',
                  }}
                >
                  I
                </button>
                <button 
                  onClick={() => setIsUnderlined(!isUnderlined)}
                  style={{ 
                    textDecoration: 'underline',
                  }}
                >
                  U
                </button>
              </div>
            </div>
            
            {/* Position Offset */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  X Offset: {textOffsetX}px
                </label>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={textOffsetX}
                  onChange={(e) => setTextOffsetX(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Y Offset: {textOffsetY}px
                </label>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={textOffsetY}
                  onChange={(e) => setTextOffsetY(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            {/* Color Palette */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Color Palette:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {colorPalette.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: color,
                      border: '1px solid #333',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setBackgroundColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
