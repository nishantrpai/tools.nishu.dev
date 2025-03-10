import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function NFTQRCode() {
  const [image, setImage] = useState(null)
  const [mintLink, setMintLink] = useState('')
  const [qrPosition, setQrPosition] = useState('top-left') // top-left, top-right, bottom-left, bottom-right
  const [qrColor, setQrColor] = useState('#000000')
  const [qrOpacity, setQrOpacity] = useState(0.8) // 0-1
  const [qrSize, setQrSize] = useState(100) // px
  
  // New state for text customization
  const [qrText, setQrText] = useState('')
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif')
  const [fontSize, setFontSize] = useState(16)
  const [fontColor, setFontColor] = useState('#000000')
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [textShadow, setTextShadow] = useState(false)
  const [shadowColor, setShadowColor] = useState('#000000')
  const [shadowBlur, setShadowBlur] = useState(2)
  const [shadowOffsetX, setShadowOffsetX] = useState(1)
  const [shadowOffsetY, setShadowOffsetY] = useState(1)
  const [customFonts, setCustomFonts] = useState([])
  const [selectedCustomFont, setSelectedCustomFont] = useState(null)

  useEffect(() => {
    if (image && mintLink) {
      renderImageWithQR()
    }
  }, [image, mintLink, qrPosition, qrColor, qrOpacity, qrSize, qrText, fontFamily, 
      fontSize, fontColor, letterSpacing, textShadow, shadowColor, shadowBlur, 
      shadowOffsetX, shadowOffsetY, selectedCustomFont])

  // Custom font handling
  const handleFontUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const fontName = file.name.split('.')[0];
      const fontUrl = e.target.result;
      
      // Create and load the font
      const fontFace = new FontFace(fontName, `url(${fontUrl})`);
      
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        
        // Add to custom fonts array
        const newFont = {
          name: fontName,
          url: fontUrl
        };
        
        setCustomFonts(prev => [...prev, newFont]);
        setSelectedCustomFont(newFont);
        setFontFamily(fontName);
        
        // Re-render with new font
        renderImageWithQR();
      }).catch(err => {
        console.error("Font loading failed:", err);
        alert("Failed to load font. Please try another file.");
      });
    };
    
    reader.readAsDataURL(file);
  };

  const renderImageWithQR = async () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    
    // Load and draw the base image
    const img = new Image()
    img.src = URL.createObjectURL(image)
    img.onload = async () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw the original image
      ctx.drawImage(img, 0, 0)
      
      // Generate QR code on a separate canvas
      const qrCanvas = document.createElement('canvas')
      await QRCode.toCanvas(qrCanvas, mintLink, {
        width: qrSize,
        margin: 1,
        color: {
          dark: qrColor + Math.round(qrOpacity * 255).toString(16).padStart(2, '0'),
          light: '#FFFFFF00' // Transparent background
        }
      })
      
      // Calculate position for the QR code
      let x = 20, y = 20 // Default padding from edges
      
      switch (qrPosition) {
        case 'top-left':
          x = 20
          y = 20
          break
        case 'top-right':
          x = canvas.width - qrSize - 20
          y = 20
          break
        case 'bottom-left':
          x = 20
          y = canvas.height - qrSize - 20
          break
        case 'bottom-right':
          x = canvas.width - qrSize - 20
          y = canvas.height - qrSize - 20
          break
      }
      
      // Draw QR code onto main canvas
      ctx.drawImage(qrCanvas, x, y)
      
      // Add text below QR code if provided
      if (qrText) {
        ctx.textBaseline = 'top'
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = fontColor
        ctx.textAlign = 'center'
        
        // Apply letter spacing by drawing each character individually
        if (letterSpacing !== 0) {
          let offsetX = 0;
          const chars = qrText.split('');
          
          // Calculate text position based on QR code position
          const textX = x + qrSize / 2;
          const textY = y + qrSize + 10;
          
          // Apply text shadow if enabled
          if (textShadow) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
          }
          
          // Calculate total width for centering
          const totalWidth = chars.reduce((width, char) => {
            return width + ctx.measureText(char).width + letterSpacing;
          }, 0) - letterSpacing;
          
          // Starting position for left-aligned text that will be centered
          let startX = textX - totalWidth / 2;
          
          // Draw each character with spacing
          chars.forEach((char, i) => {
            ctx.fillText(char, startX + offsetX, textY);
            offsetX += ctx.measureText(char).width + letterSpacing;
          });
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else {
          // Calculate text position based on QR code position
          const textX = x + qrSize / 2;
          const textY = y + qrSize + 10;
          
          // Apply text shadow if enabled
          if (textShadow) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
          }
          
          // Draw text
          ctx.fillText(qrText, textX, textY);
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
      }
    }
  }

  const handleDownload = () => {
    const canvas = document.getElementById('canvas')
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'nft-with-qr.png'
    a.click()
  }

  return (
    <>
      <Head>
        <title>NFT QR Code Overlay</title>
        <meta name="description" content="Add QR code mint links to NFT images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>NFT QR Code Overlay</h1>
        <h2 className={styles.description}>Add mint links to your NFT images</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', margin: '0 auto' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Upload Image:</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Mint Link:</label>
            <input 
              type="url" 
              placeholder="https://..." 
              value={mintLink}
              onChange={(e) => setMintLink(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>QR Code Position:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(position => (
                <label key={position} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <input
                    type="radio"
                    name="position"
                    value={position}
                    checked={qrPosition === position}
                    onChange={(e) => setQrPosition(e.target.value)}
                  />
                  {position.replace('-', ' ')}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>QR Color:</label>
              <input 
                type="color" 
                value={qrColor} 
                onChange={(e) => setQrColor(e.target.value)}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Opacity: {qrOpacity}</label>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1" 
                value={qrOpacity} 
                onChange={(e) => setQrOpacity(parseFloat(e.target.value))} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Size: {qrSize}px</label>
              <input 
                type="range" 
                min="50" 
                max="300" 
                step="10" 
                value={qrSize} 
                onChange={(e) => setQrSize(parseInt(e.target.value))} 
              />
            </div>
          </div>
          
          {/* Text customization section */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
            <h3>Text Customization</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Text Below QR:</label>
              <input 
                type="text" 
                placeholder="Enter text..." 
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Font:</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  style={{ padding: '5px' }}
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Courier New, monospace">Courier New</option>
                  <option value="Impact, fantasy">Impact</option>
                  <option value="Comic Sans MS, cursive">Comic Sans MS</option>
                  {customFonts.map(font => (
                    <option key={font.name} value={font.name}>{font.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Upload Font:</label>
                <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Font Size: {fontSize}px</label>
                <input 
                  type="range" 
                  min="8" 
                  max="72" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Font Color:</label>
                <input 
                  type="color" 
                  value={fontColor} 
                  onChange={(e) => setFontColor(e.target.value)}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Letter Spacing: {letterSpacing}px</label>
                <input 
                  type="range" 
                  min="-2" 
                  max="20" 
                  value={letterSpacing} 
                  onChange={(e) => setLetterSpacing(parseInt(e.target.value))} 
                />
              </div>
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={textShadow}
                  onChange={(e) => setTextShadow(e.target.checked)}
                  style={{ marginRight: '5px' }}
                />
                Enable Text Shadow
              </label>
              
              {textShadow && (
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px', padding: '10px', borderRadius: '5px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Shadow Color:</label>
                    <input 
                      type="color" 
                      value={shadowColor} 
                      onChange={(e) => setShadowColor(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Blur: {shadowBlur}px</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={shadowBlur} 
                      onChange={(e) => setShadowBlur(parseInt(e.target.value))} 
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>X Offset: {shadowOffsetX}px</label>
                    <input 
                      type="range" 
                      min="-10" 
                      max="10" 
                      value={shadowOffsetX} 
                      onChange={(e) => setShadowOffsetX(parseInt(e.target.value))} 
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Y Offset: {shadowOffsetY}px</label>
                    <input 
                      type="range" 
                      min="-10" 
                      max="10" 
                      value={shadowOffsetY} 
                      onChange={(e) => setShadowOffsetY(parseInt(e.target.value))} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, margin: '20px auto' }}>
          {image && <canvas id="canvas" style={{ width: '100%', height: 'auto', border: '1px solid #ccc' }} />}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          {image && (
            <>
              <button onClick={() => setImage(null)}>Clear</button>
              <button onClick={handleDownload}>Download</button>
            </>
          )}
        </div>
      </main>
    </>
  )
}
