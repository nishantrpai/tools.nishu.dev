import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const HalfCombine = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [percentage, setPercentage] = useState(50)
  const [horizontal, setHorizontal] = useState(true)
  const [leftText, setLeftText] = useState('')
  const [rightText, setRightText] = useState('')
  const [leftFontSize, setLeftFontSize] = useState(20)
  const [rightFontSize, setRightFontSize] = useState(20)
  const [leftFontFamily, setLeftFontFamily] = useState('Arial')
  const [rightFontFamily, setRightFontFamily] = useState('Arial')
  const [leftTextColor, setLeftTextColor] = useState('#ffffff')
  const [rightTextColor, setRightTextColor] = useState('#ffffff')
  const [leftFontWeight, setLeftFontWeight] = useState('normal')
  const [rightFontWeight, setRightFontWeight] = useState('normal')
  const [leftFontStyle, setLeftFontStyle] = useState('normal')
  const [rightFontStyle, setRightFontStyle] = useState('normal')
  const [leftTextDecoration, setLeftTextDecoration] = useState('none')
  const [rightTextDecoration, setRightTextDecoration] = useState('none')
  const [leftOffsetX, setLeftOffsetX] = useState(0)
  const [leftOffsetY, setLeftOffsetY] = useState(0)
  const [rightOffsetX, setRightOffsetX] = useState(0)
  const [rightOffsetY, setRightOffsetY] = useState(0)
  const [leftImageOffsetX, setLeftImageOffsetX] = useState(0)
  const [leftImageOffsetY, setLeftImageOffsetY] = useState(0)
  const [rightImageOffsetX, setRightImageOffsetX] = useState(0)
  const [rightImageOffsetY, setRightImageOffsetY] = useState(0)

  const handleImage1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage1(image)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImage2 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage2(image)
      }
    }
    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `half-combined-image-${new Date().getTime()}.png`
    a.click()
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  useEffect(() => {
    if (image1 && image2) {
      if(!canvas || !ctx) return

      if( horizontal ) {
        // Use the maximum height, but crop images to fit without squeezing
        const targetHeight = Math.max(image1.height, image2.height)
        
        // Calculate widths based on percentage split
        const totalWidth = 800 // Fixed total width for better control
        const width1 = totalWidth * (percentage / 100)
        const width2 = totalWidth * (1 - (percentage / 100))
        
        canvas.width = totalWidth
        canvas.height = targetHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Calculate crop dimensions for image1
        const image1Scale = Math.max(width1 / image1.width, targetHeight / image1.height)
        const scaledImage1Width = image1.width * image1Scale
        const scaledImage1Height = image1.height * image1Scale
        
        // Calculate crop area for image1 (center crop)
        const cropX1 = Math.max(0, (scaledImage1Width - width1) / 2 / image1Scale)
        const cropY1 = Math.max(0, (scaledImage1Height - targetHeight) / 2 / image1Scale)
        const cropWidth1 = Math.min(image1.width, width1 / image1Scale)
        const cropHeight1 = Math.min(image1.height, targetHeight / image1Scale)
        
        // Calculate crop dimensions for image2
        const image2Scale = Math.max(width2 / image2.width, targetHeight / image2.height)
        const scaledImage2Width = image2.width * image2Scale
        const scaledImage2Height = image2.height * image2Scale
        
        // Calculate crop area for image2 (center crop)
        const cropX2 = Math.max(0, (scaledImage2Width - width2) / 2 / image2Scale)
        const cropY2 = Math.max(0, (scaledImage2Height - targetHeight) / 2 / image2Scale)
        const cropWidth2 = Math.min(image2.width, width2 / image2Scale)
        const cropHeight2 = Math.min(image2.height, targetHeight / image2Scale)
        
        // Draw images with cropping and offsets
        ctx.drawImage(
          image1, 
          cropX1, cropY1, cropWidth1, cropHeight1,
          leftImageOffsetX, leftImageOffsetY, width1, targetHeight
        )
        ctx.drawImage(
          image2, 
          cropX2, cropY2, cropWidth2, cropHeight2,
          width1 + rightImageOffsetX, rightImageOffsetY, width2, targetHeight
        )
        
        // Draw text
        if (leftText) {
          ctx.font = `${leftFontStyle} ${leftFontWeight} ${leftFontSize}px ${leftFontFamily}`
          ctx.fillStyle = leftTextColor
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const leftCenterX = width1 / 2 + leftOffsetX
          const leftCenterY = targetHeight / 2 + leftOffsetY
          ctx.fillText(leftText, leftCenterX, leftCenterY)
          
          // Apply text decoration (underline/strikethrough) if needed
          if (leftTextDecoration !== 'none') {
            const textMetrics = ctx.measureText(leftText)
            const textWidth = textMetrics.width
            ctx.strokeStyle = leftTextColor
            ctx.lineWidth = Math.max(1, leftFontSize / 15)
            
            if (leftTextDecoration === 'underline') {
              const underlineY = leftCenterY + leftFontSize * 0.15
              ctx.beginPath()
              ctx.moveTo(leftCenterX - textWidth / 2, underlineY)
              ctx.lineTo(leftCenterX + textWidth / 2, underlineY)
              ctx.stroke()
            } else if (leftTextDecoration === 'line-through') {
              const strikeY = leftCenterY - leftFontSize * 0.1
              ctx.beginPath()
              ctx.moveTo(leftCenterX - textWidth / 2, strikeY)
              ctx.lineTo(leftCenterX + textWidth / 2, strikeY)
              ctx.stroke()
            }
          }
        }
        
        if (rightText) {
          ctx.font = `${rightFontStyle} ${rightFontWeight} ${rightFontSize}px ${rightFontFamily}`
          ctx.fillStyle = rightTextColor
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const rightCenterX = width1 + (width2 / 2) + rightOffsetX
          const rightCenterY = targetHeight / 2 + rightOffsetY
          ctx.fillText(rightText, rightCenterX, rightCenterY)
          
          // Apply text decoration (underline/strikethrough) if needed
          if (rightTextDecoration !== 'none') {
            const textMetrics = ctx.measureText(rightText)
            const textWidth = textMetrics.width
            ctx.strokeStyle = rightTextColor
            ctx.lineWidth = Math.max(1, rightFontSize / 15)
            
            if (rightTextDecoration === 'underline') {
              const underlineY = rightCenterY + rightFontSize * 0.15
              ctx.beginPath()
              ctx.moveTo(rightCenterX - textWidth / 2, underlineY)
              ctx.lineTo(rightCenterX + textWidth / 2, underlineY)
              ctx.stroke()
            } else if (rightTextDecoration === 'line-through') {
              const strikeY = rightCenterY - rightFontSize * 0.1
              ctx.beginPath()
              ctx.moveTo(rightCenterX - textWidth / 2, strikeY)
              ctx.lineTo(rightCenterX + textWidth / 2, strikeY)
              ctx.stroke()
            }
          }
        }
      } else {
        // Use the maximum width, but crop images to fit without squeezing
        const targetWidth = Math.max(image1.width, image2.width)
        
        // Calculate heights based on percentage split
        const totalHeight = 600 // Fixed total height for better control
        const height1 = totalHeight * (percentage / 100)
        const height2 = totalHeight * (1 - (percentage / 100))
        
        canvas.width = targetWidth
        canvas.height = totalHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Calculate crop dimensions for image1
        const image1Scale = Math.max(targetWidth / image1.width, height1 / image1.height)
        const scaledImage1Width = image1.width * image1Scale
        const scaledImage1Height = image1.height * image1Scale
        
        // Calculate crop area for image1 (center crop)
        const cropX1 = Math.max(0, (scaledImage1Width - targetWidth) / 2 / image1Scale)
        const cropY1 = Math.max(0, (scaledImage1Height - height1) / 2 / image1Scale)
        const cropWidth1 = Math.min(image1.width, targetWidth / image1Scale)
        const cropHeight1 = Math.min(image1.height, height1 / image1Scale)
        
        // Calculate crop dimensions for image2
        const image2Scale = Math.max(targetWidth / image2.width, height2 / image2.height)
        const scaledImage2Width = image2.width * image2Scale
        const scaledImage2Height = image2.height * image2Scale
        
        // Calculate crop area for image2 (center crop)
        const cropX2 = Math.max(0, (scaledImage2Width - targetWidth) / 2 / image2Scale)
        const cropY2 = Math.max(0, (scaledImage2Height - height2) / 2 / image2Scale)
        const cropWidth2 = Math.min(image2.width, targetWidth / image2Scale)
        const cropHeight2 = Math.min(image2.height, height2 / image2Scale)
        
        // Draw images with cropping and offsets
        ctx.drawImage(
          image1, 
          cropX1, cropY1, cropWidth1, cropHeight1,
          leftImageOffsetX, leftImageOffsetY, targetWidth, height1
        )
        ctx.drawImage(
          image2, 
          cropX2, cropY2, cropWidth2, cropHeight2,
          rightImageOffsetX, height1 + rightImageOffsetY, targetWidth, height2
        )
        
        // Draw text
        if (leftText) {
          ctx.font = `${leftFontStyle} ${leftFontWeight} ${leftFontSize}px ${leftFontFamily}`
          ctx.fillStyle = leftTextColor
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const leftCenterX = targetWidth / 2 + leftOffsetX
          const leftCenterY = height1 / 2 + leftOffsetY
          ctx.fillText(leftText, leftCenterX, leftCenterY)
          
          // Apply text decoration (underline/strikethrough) if needed
          if (leftTextDecoration !== 'none') {
            const textMetrics = ctx.measureText(leftText)
            const textWidth = textMetrics.width
            ctx.strokeStyle = leftTextColor
            ctx.lineWidth = Math.max(1, leftFontSize / 15)
            
            if (leftTextDecoration === 'underline') {
              const underlineY = leftCenterY + leftFontSize * 0.15
              ctx.beginPath()
              ctx.moveTo(leftCenterX - textWidth / 2, underlineY)
              ctx.lineTo(leftCenterX + textWidth / 2, underlineY)
              ctx.stroke()
            } else if (leftTextDecoration === 'line-through') {
              const strikeY = leftCenterY - leftFontSize * 0.1
              ctx.beginPath()
              ctx.moveTo(leftCenterX - textWidth / 2, strikeY)
              ctx.lineTo(leftCenterX + textWidth / 2, strikeY)
              ctx.stroke()
            }
          }
        }
        
        if (rightText) {
          ctx.font = `${rightFontStyle} ${rightFontWeight} ${rightFontSize}px ${rightFontFamily}`
          ctx.fillStyle = rightTextColor
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const rightCenterX = targetWidth / 2 + rightOffsetX
          const rightCenterY = height1 + (height2 / 2) + rightOffsetY
          ctx.fillText(rightText, rightCenterX, rightCenterY)
          
          // Apply text decoration (underline/strikethrough) if needed
          if (rightTextDecoration !== 'none') {
            const textMetrics = ctx.measureText(rightText)
            const textWidth = textMetrics.width
            ctx.strokeStyle = rightTextColor
            ctx.lineWidth = Math.max(1, rightFontSize / 15)
            
            if (rightTextDecoration === 'underline') {
              const underlineY = rightCenterY + rightFontSize * 0.15
              ctx.beginPath()
              ctx.moveTo(rightCenterX - textWidth / 2, underlineY)
              ctx.lineTo(rightCenterX + textWidth / 2, underlineY)
              ctx.stroke()
            } else if (rightTextDecoration === 'line-through') {
              const strikeY = rightCenterY - rightFontSize * 0.1
              ctx.beginPath()
              ctx.moveTo(rightCenterX - textWidth / 2, strikeY)
              ctx.lineTo(rightCenterX + textWidth / 2, strikeY)
              ctx.stroke()
            }
          }
        }
      }
    }
  }, [image1, image2, percentage, horizontal, leftText, rightText, leftFontSize, rightFontSize, leftFontFamily, rightFontFamily, leftTextColor, rightTextColor, leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY, leftImageOffsetX, leftImageOffsetY, rightImageOffsetX, rightImageOffsetY])

  return (
    <>
      <Head>
        <title>Combine two parts of an image</title>
        <meta name="description" content="Combine two parts of images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Combine two parts of an image
        </h1>

        <p className={styles.description}>
          Combine two parts of images
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <input type="checkbox" checked={horizontal} onChange={(e) => setHorizontal(e.target.checked)} />
              <label>Horizontal</label>
            </div>
            <label>Percentage:</label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              style={{ width: '100px', margin: '10px 0', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
            />

            <canvas id="canvas" width={500} height={500} style={{width: '100%'}}></canvas>

            {/* Left Image + Text Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #333', padding: '15px', borderRadius: '5px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Left Image + Text Controls</h3>
              
              <label>Left Image:</label>
              <input type="file" onChange={handleImage1} />
              
              <h4 style={{ margin: '10px 0 5px 0' }}>Image Position</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Offset X:</label>
                <input
                  type="number"
                  value={leftImageOffsetX}
                  onChange={(e) => setLeftImageOffsetX(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Offset Y:</label>
                <input
                  type="number"
                  value={leftImageOffsetY}
                  onChange={(e) => setLeftImageOffsetY(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
              
              <h4 style={{ margin: '10px 0 5px 0' }}>Text Settings</h4>
              <label>Left Text:</label>
              <input
                type="text"
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                placeholder="Enter left text"
                style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
              />
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font Size:</label>
                <input
                  type="number"
                  value={leftFontSize}
                  onChange={(e) => setLeftFontSize(e.target.value)}
                  min="8"
                  max="100"
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font:</label>
                <select
                  value={leftFontFamily}
                  onChange={(e) => setLeftFontFamily(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times">Times</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Impact">Impact</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Arial Black">Arial Black</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Text Color:</label>
                <input
                  type="color"
                  value={leftTextColor}
                  onChange={(e) => setLeftTextColor(e.target.value)}
                  style={{ width: '50px', height: '30px' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font Weight:</label>
                <select
                  value={leftFontWeight}
                  onChange={(e) => setLeftFontWeight(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Lighter</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font Style:</label>
                <select
                  value={leftFontStyle}
                  onChange={(e) => setLeftFontStyle(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="oblique">Oblique</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Text Decoration:</label>
                <select
                  value={leftTextDecoration}
                  onChange={(e) => setLeftTextDecoration(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Strike Through</option>
                </select>
              </div>
              
              <h4 style={{ margin: '10px 0 5px 0' }}>Text Position</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Offset X:</label>
                <input
                  type="number"
                  value={leftOffsetX}
                  onChange={(e) => setLeftOffsetX(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Offset Y:</label>
                <input
                  type="number"
                  value={leftOffsetY}
                  onChange={(e) => setLeftOffsetY(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
            </div>
            
            {/* Right Image + Text Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #333', padding: '15px', borderRadius: '5px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Right Image + Text Controls</h3>
              
              <label>Right Image:</label>
              <input type="file" onChange={handleImage2} />
              
              <h4 style={{ margin: '10px 0 5px 0' }}>Image Position</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Offset X:</label>
                <input
                  type="number"
                  value={rightImageOffsetX}
                  onChange={(e) => setRightImageOffsetX(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Offset Y:</label>
                <input
                  type="number"
                  value={rightImageOffsetY}
                  onChange={(e) => setRightImageOffsetY(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
              
              <h4 style={{ margin: '10px 0 5px 0' }}>Text Settings</h4>
              <label>Right Text:</label>
              <input
                type="text"
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                placeholder="Enter right text"
                style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
              />
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font Size:</label>
                <input
                  type="number"
                  value={rightFontSize}
                  onChange={(e) => setRightFontSize(e.target.value)}
                  min="8"
                  max="100"
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font:</label>
                <select
                  value={rightFontFamily}
                  onChange={(e) => setRightFontFamily(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times">Times</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Impact">Impact</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Arial Black">Arial Black</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Text Color:</label>
                <input
                  type="color"
                  value={rightTextColor}
                  onChange={(e) => setRightTextColor(e.target.value)}
                  style={{ width: '50px', height: '30px' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font Weight:</label>
                <select
                  value={rightFontWeight}
                  onChange={(e) => setRightFontWeight(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Lighter</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Font Style:</label>
                <select
                  value={rightFontStyle}
                  onChange={(e) => setRightFontStyle(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="oblique">Oblique</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Text Decoration:</label>
                <select
                  value={rightTextDecoration}
                  onChange={(e) => setRightTextDecoration(e.target.value)}
                  style={{ background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5, color: 'white' }}
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Strike Through</option>
                </select>
              </div>
              
              <h4 style={{ margin: '10px 0 5px 0' }}>Text Position</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>Offset X:</label>
                <input
                  type="number"
                  value={rightOffsetX}
                  onChange={(e) => setRightOffsetX(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Offset Y:</label>
                <input
                  type="number"
                  value={rightOffsetY}
                  onChange={(e) => setRightOffsetY(parseInt(e.target.value) || 0)}
                  style={{ width: '80px', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
            </div>
            
            <button style={{  }} onClick={downloadImage}>Download</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default HalfCombine