// add "BIG THINGS..." on left image and "HAVE SMALL BEGINNINGS" on right image
import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function BigThings() {
  const [leftImage, setLeftImage] = useState(null)
  const [rightImage, setRightImage] = useState(null)
  const [leftOffsetX, setLeftOffsetX] = useState(0)
  const [leftOffsetY, setLeftOffsetY] = useState(0)
  const [leftScale, setLeftScale] = useState(1)
  const [leftCropX, setLeftCropX] = useState(0)
  const [leftCropY, setLeftCropY] = useState(0)
  const [leftZoom, setLeftZoom] = useState(1)
  const [rightOffsetX, setRightOffsetX] = useState(0)
  const [rightOffsetY, setRightOffsetY] = useState(0)
  const [rightScale, setRightScale] = useState(1)
  const [rightCropX, setRightCropX] = useState(0)
  const [rightCropY, setRightCropY] = useState(0)
  const [rightZoom, setRightZoom] = useState(1)
  const [svgScale, setSvgScale] = useState(1)
  
  // Text customization states
  const [leftText, setLeftText] = useState('BIG THINGS...')
  const [rightText, setRightText] = useState('HAVE SMALL BEGINNINGS')
  const [leftTextColor, setLeftTextColor] = useState('#ffffff')
  const [rightTextColor, setRightTextColor] = useState('#ffffff')
  const [leftFontSize, setLeftFontSize] = useState(48)
  const [rightFontSize, setRightFontSize] = useState(32)
  const [leftTextOffsetY, setLeftTextOffsetY] = useState(20)
  const [rightTextOffsetY, setRightTextOffsetY] = useState(20)
  
  // Image dimension controls
  const [leftImageHeight, setLeftImageHeight] = useState(600)
  const [rightImageHeight, setRightImageHeight] = useState(600)

  const bigThingsSvg = '/bigthings.svg'
  const smallBeginningsSvg = '/smallbeginnings.svg'

  const canvasWidth = 800
  const canvasHeight = 600  // Fixed canvas height
  const imageWidth = canvasWidth / 2

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    
    // High DPI support for crisp text
    const devicePixelRatio = window.devicePixelRatio || 1
    const displayWidth = canvasWidth
    const displayHeight = canvasHeight
    
    canvas.width = displayWidth * devicePixelRatio
    canvas.height = displayHeight * devicePixelRatio
    canvas.style.width = displayWidth + 'px'
    canvas.style.height = displayHeight + 'px'
    
    context.scale(devicePixelRatio, devicePixelRatio)
    context.clearRect(0, 0, displayWidth, displayHeight)
    
    // Enable text smoothing
    context.textRenderingOptimization = 'optimizeQuality'
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    // Draw left image with proper aspect ratio preservation
    if (leftImage) {
      context.save()
      
      // Calculate the scale needed to fill the target area
      const targetAspect = imageWidth / leftImageHeight
      const imageAspect = leftImage.width / leftImage.height
      
      let drawWidth, drawHeight, drawX, drawY
      
      if (imageAspect > targetAspect) {
        // Image is wider - fit by height
        drawHeight = leftImageHeight
        drawWidth = drawHeight * imageAspect
        drawX = leftOffsetX + (imageWidth - drawWidth) / 2
        drawY = leftOffsetY
      } else {
        // Image is taller - fit by width
        drawWidth = imageWidth
        drawHeight = drawWidth / imageAspect
        drawX = leftOffsetX
        drawY = leftOffsetY + (leftImageHeight - drawHeight) / 2
      }
      
      // Apply zoom and crop
      const croppedWidth = leftImage.width / leftZoom
      const croppedHeight = leftImage.height / leftZoom
      const sourceX = Math.max(0, Math.min(leftImage.width - croppedWidth, leftCropX + (leftImage.width - croppedWidth) / 2))
      const sourceY = Math.max(0, Math.min(leftImage.height - croppedHeight, leftCropY + (leftImage.height - croppedHeight) / 2))
      
      context.drawImage(
        leftImage,
        sourceX, sourceY, croppedWidth, croppedHeight,
        drawX, drawY, drawWidth, drawHeight
      )
      context.restore()
    }

    // Draw right image with proper aspect ratio preservation
    if (rightImage) {
      context.save()
      
      // Calculate the scale needed to fill the target area
      const targetAspect = imageWidth / rightImageHeight
      const imageAspect = rightImage.width / rightImage.height
      
      let drawWidth, drawHeight, drawX, drawY
      
      if (imageAspect > targetAspect) {
        // Image is wider - fit by height
        drawHeight = rightImageHeight
        drawWidth = drawHeight * imageAspect
        drawX = imageWidth + rightOffsetX + (imageWidth - drawWidth) / 2
        drawY = rightOffsetY
      } else {
        // Image is taller - fit by width
        drawWidth = imageWidth
        drawHeight = drawWidth / imageAspect
        drawX = imageWidth + rightOffsetX
        drawY = rightOffsetY + (rightImageHeight - drawHeight) / 2
      }
      
      // Apply zoom and crop
      const croppedWidth = rightImage.width / rightZoom
      const croppedHeight = rightImage.height / rightZoom
      const sourceX = Math.max(0, Math.min(rightImage.width - croppedWidth, rightCropX + (rightImage.width - croppedWidth) / 2))
      const sourceY = Math.max(0, Math.min(rightImage.height - croppedHeight, rightCropY + (rightImage.height - croppedHeight) / 2))
      
      context.drawImage(
        rightImage,
        sourceX, sourceY, croppedWidth, croppedHeight,
        drawX, drawY, drawWidth, drawHeight
      )
      context.restore()
    }

    // Draw crisp text on left image
    if (leftImage && leftText) {
      context.save()
      context.font = `bold ${leftFontSize}px Helvetica, Arial, sans-serif`
      context.fillStyle = leftTextColor
      context.textAlign = 'center'
      context.textBaseline = 'bottom'
      
      const textX = imageWidth / 2
      const textY = canvasHeight - leftTextOffsetY
      
      context.fillText(leftText, textX, textY)
      context.restore()
    }

    // Draw crisp text on right image
    if (rightImage && rightText) {
      context.save()
      context.font = `bold ${rightFontSize}px Helvetica, Arial, sans-serif`
      context.fillStyle = rightTextColor
      context.textAlign = 'center'
      context.textBaseline = 'bottom'
      
      const textX = imageWidth + (imageWidth / 2)
      const textY = canvasHeight - rightTextOffsetY
      
      context.fillText(rightText, textX, textY)
      context.restore()
    }

  }, [leftImage, rightImage, leftOffsetX, leftOffsetY, leftScale, leftCropX, leftCropY, leftZoom,
      rightOffsetX, rightOffsetY, rightScale, rightCropX, rightCropY, rightZoom, svgScale,
      leftText, rightText, leftTextColor, rightTextColor, leftFontSize, rightFontSize,
      leftTextOffsetY, rightTextOffsetY, leftImageHeight, rightImageHeight])

  const handleLeftImage = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        setLeftOffsetX(0)
        setLeftOffsetY(0)
        setLeftScale(1)
        setLeftCropX(0)
        setLeftCropY(0)
        setLeftZoom(1)
        setLeftImage(img)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRightImage = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        setRightOffsetX(0)
        setRightOffsetY(0)
        setRightScale(1)
        setRightCropX(0)
        setRightCropY(0)
        setRightZoom(1)
        setRightImage(img)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Head>
        <title>Big Things</title>
        <meta name="description" content="Add motivational text to two images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          Big Things
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add "BIG THINGS..." and "HAVE SMALL BEGINNINGS" to your images
        </span>

        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
          <div>
            <label>Left Image (BIG THINGS...):</label>
            <input type="file" accept="image/*" onChange={handleLeftImage} />
          </div>
          <div>
            <label>Right Image (HAVE SMALL BEGINNINGS):</label>
            <input type="file" accept="image/*" onChange={handleRightImage} />
          </div>
        </div>

        <canvas id="canvas" width={canvasWidth} height={canvasHeight} style={{
          border: '1px solid #333',
        }}></canvas>

        <div style={{ display: 'flex', gap: '40px', width: '100%', maxWidth: '1000px' }}>
          {/* Left Image Controls */}
          <div style={{ flex: 1, border: '1px solid #333', padding: '15px', borderRadius: '5px' }}>
            <h3>Left Image Controls</h3>
            
            <label>Offset X:</label>
            <input type="range" min={-imageWidth} max={imageWidth} value={leftOffsetX} onChange={(e) => setLeftOffsetX(parseInt(e.target.value))} />
            <input type="number" value={leftOffsetX} onChange={(e) => setLeftOffsetX(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Offset Y:</label>
            <input type="range" min={-leftImageHeight} max={leftImageHeight} value={leftOffsetY} onChange={(e) => setLeftOffsetY(parseInt(e.target.value))} />
            <input type="number" value={leftOffsetY} onChange={(e) => setLeftOffsetY(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Image Height:</label>
            <input type="range" min={200} max={1200} value={leftImageHeight} onChange={(e) => setLeftImageHeight(parseInt(e.target.value))} />
            <input type="number" value={leftImageHeight} onChange={(e) => setLeftImageHeight(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Crop X:</label>
            <input type="range" min={leftImage ? -leftImage.width/2 : -400} max={leftImage ? leftImage.width/2 : 400} value={leftCropX} onChange={(e) => setLeftCropX(parseInt(e.target.value))} />
            <input type="number" value={leftCropX} onChange={(e) => setLeftCropX(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Crop Y:</label>
            <input type="range" min={leftImage ? -leftImage.height/2 : -400} max={leftImage ? leftImage.height/2 : 400} value={leftCropY} onChange={(e) => setLeftCropY(parseInt(e.target.value))} />
            <input type="number" value={leftCropY} onChange={(e) => setLeftCropY(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Zoom:</label>
            <input type="range" min={0.1} max={3} step={0.1} value={leftZoom} onChange={(e) => setLeftZoom(parseFloat(e.target.value))} />
            <input type="number" step={0.1} value={leftZoom} onChange={(e) => setLeftZoom(parseFloat(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
          </div>

          {/* Right Image Controls */}
          <div style={{ flex: 1, border: '1px solid #333', padding: '15px', borderRadius: '5px' }}>
            <h3>Right Image Controls</h3>
            
            <label>Offset X:</label>
            <input type="range" min={-imageWidth} max={imageWidth} value={rightOffsetX} onChange={(e) => setRightOffsetX(parseInt(e.target.value))} />
            <input type="number" value={rightOffsetX} onChange={(e) => setRightOffsetX(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Offset Y:</label>
            <input type="range" min={-rightImageHeight} max={rightImageHeight} value={rightOffsetY} onChange={(e) => setRightOffsetY(parseInt(e.target.value))} />
            <input type="number" value={rightOffsetY} onChange={(e) => setRightOffsetY(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Image Height:</label>
            <input type="range" min={200} max={1200} value={rightImageHeight} onChange={(e) => setRightImageHeight(parseInt(e.target.value))} />
            <input type="number" value={rightImageHeight} onChange={(e) => setRightImageHeight(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Crop X:</label>
            <input type="range" min={rightImage ? -rightImage.width/2 : -400} max={rightImage ? rightImage.width/2 : 400} value={rightCropX} onChange={(e) => setRightCropX(parseInt(e.target.value))} />
            <input type="number" value={rightCropX} onChange={(e) => setRightCropX(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Crop Y:</label>
            <input type="range" min={rightImage ? -rightImage.height/2 : -400} max={rightImage ? rightImage.height/2 : 400} value={rightCropY} onChange={(e) => setRightCropY(parseInt(e.target.value))} />
            <input type="number" value={rightCropY} onChange={(e) => setRightCropY(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Zoom:</label>
            <input type="range" min={0.1} max={3} step={0.1} value={rightZoom} onChange={(e) => setRightZoom(parseFloat(e.target.value))} />
            <input type="number" step={0.1} value={rightZoom} onChange={(e) => setRightZoom(parseFloat(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
          </div>
        </div>

        {/* Text Customization Controls */}
        <div style={{ display: 'flex', gap: '40px', width: '100%', maxWidth: '1000px', margin: '20px 0' }}>
          {/* Left Text Controls */}
          <div style={{ flex: 1, border: '1px solid #333', padding: '15px', borderRadius: '5px' }}>
            <h3>Left Text Controls</h3>
            
            <label>Text:</label>
            <input 
              type="text" 
              value={leftText} 
              onChange={(e) => setLeftText(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '5px', 
                margin: '5px 0 15px 0',
                background: '#000',
                border: '1px solid #333',
                borderRadius: '5px',
                color: 'white'
              }} 
            />
            
            <label>Text Color:</label>
            <input 
              type="color" 
              value={leftTextColor} 
              onChange={(e) => setLeftTextColor(e.target.value)} 
              style={{ width: '50px', height: '30px', margin: '5px 0 15px 10px' }}
            />
            
            <label>Font Size:</label>
            <input type="range" min={12} max={100} value={leftFontSize} onChange={(e) => setLeftFontSize(parseInt(e.target.value))} />
            <input type="number" value={leftFontSize} onChange={(e) => setLeftFontSize(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Text Position (from bottom):</label>
            <input type="range" min={10} max={200} value={leftTextOffsetY} onChange={(e) => setLeftTextOffsetY(parseInt(e.target.value))} />
            <input type="number" value={leftTextOffsetY} onChange={(e) => setLeftTextOffsetY(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
          </div>

          {/* Right Text Controls */}
          <div style={{ flex: 1, border: '1px solid #333', padding: '15px', borderRadius: '5px' }}>
            <h3>Right Text Controls</h3>
            
            <label>Text:</label>
            <input 
              type="text" 
              value={rightText} 
              onChange={(e) => setRightText(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '5px', 
                margin: '5px 0 15px 0',
                background: '#000',
                border: '1px solid #333',
                borderRadius: '5px',
                color: 'white'
              }} 
            />
            
            <label>Text Color:</label>
            <input 
              type="color" 
              value={rightTextColor} 
              onChange={(e) => setRightTextColor(e.target.value)} 
              style={{ width: '50px', height: '30px', margin: '5px 0 15px 10px' }}
            />
            
            <label>Font Size:</label>
            <input type="range" min={12} max={100} value={rightFontSize} onChange={(e) => setRightFontSize(parseInt(e.target.value))} />
            <input type="number" value={rightFontSize} onChange={(e) => setRightFontSize(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
            
            <label>Text Position (from bottom):</label>
            <input type="range" min={10} max={200} value={rightTextOffsetY} onChange={(e) => setRightTextOffsetY(parseInt(e.target.value))} />
            <input type="number" value={rightTextOffsetY} onChange={(e) => setRightTextOffsetY(parseInt(e.target.value))} style={{ width: '80px', marginLeft: '10px' }} />
          </div>
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `bigthings-${Date.now()}.png`
          a.click()
        }}>
          Download Image
        </button>
      </main>
    </>
  )
}
