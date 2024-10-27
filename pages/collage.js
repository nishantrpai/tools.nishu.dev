import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function Collage() {
  const [images, setImages] = useState([])
  const [gap, setGap] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [imgBackground, setImgBackground] = useState('#ddd')
  const canvasRefs = useRef({})

  const layouts = {
    basic: [
      [["1x1", "1x1"], ["1x1", "1x1"]],
      [["1x1", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1", "1x1"]],
      [["1x1", "1x1"]],
      [["1x1"], ["1x1"]],
      [["1x1"], ["1x1"], ["1x1"], ["1x1"]],
      [["1x1", "1x1", "1x1"], ["1x1", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1", "1x1"], ["1x1", "1x1", "1x1", "1x1"]],
      [["2x1", "2x1"], ["1x1", "1x1"]],
      [["2x1", "2x1"], ["1x1"]]
    ],
    one_big_photo: [
      [["2x2", "1x1", "1x1"], ["1x1", "1x1", "1x1"]],
      [["1x1", "2x2", "1x1"], ["1x1", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1"], ["1x1", "2x2", "1x1"]],
      [["1x1", "2x1", "1x1"], ["1x1", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1"], ["1x1", "1x1", "2x2"]],
      [["1x1", "1x1", "1x1"], ["2x2", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1"], ["1x1", "1x1", "2x2"]],
      [["1x1", "2x1", "1x1"], ["1x1", "1x1", "1x1"], ["1x1", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1", "2x2"], ["1x1", "1x1", "1x1", "1x1"]],
      [["1x1", "1x1", "1x1", "1x1"], ["1x1", "1x1", "1x1", "2x2"]]
    ],
    jigsaw: [
      [["2x2", "1x1"], ["1x1", "1x1"]],
      [["1x1", "1x1", "1x1"], ["1x1", "1x1", "2x2"]],
      [["1x1", "2x1", "1x1"], ["1x1", "1x1", "1x1"], ["1x1"]],
      [["1x1", "1x1", "1x1"], ["1x1", "2x2", "1x1"]],
      [["2x2", "1x1"], ["1x1", "1x1"], ["1x1", "1x1"]],
      [["2x2", "1x1", "1x1"], ["1x1", "1x1", "1x1"]],
      [["2x2", "1x1", "1x1"], ["1x1", "1x1", "2x2"]],
      [["1x1", "2x2", "1x1"], ["1x1", "1x1", "1x1"], ["1x1"]]
    ]
  }

    const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      })
    })).then(loadedImages => {
      setImages(loadedImages)
    })
  }

  const drawImageToCanvas = (canvas, img, width, height) => {
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = imgBackground
    ctx.fillRect(0, 0, width, height)
    // Calculate dimensions to maintain aspect ratio and cover
    const imgRatio = img.width / img.height
    const canvasRatio = width / height
    let drawWidth = width
    let drawHeight = height
    let offsetX = 0
    let offsetY = 0

    if (imgRatio > canvasRatio) {
      drawWidth = height * imgRatio
      offsetX = -(drawWidth - width) / 2
    } else {
      drawHeight = width / imgRatio
      offsetY = -(drawHeight - height) / 2
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }

  const renderGrid = (layout) => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${layout[0].length}, 1fr)`,
      gap: `${gap}px`,
      width: '100%',
      maxWidth: '500px',
      margin: '20px auto',
      backgroundColor: backgroundColor,
    }

    return (
      <div style={gridStyle}>
        {layout.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const [width, height] = cell.split('x').map(Number)
            const cellWidth = (500 - (layout[0].length - 1) * gap) / layout[0].length * width
            const cellHeight = cellWidth * (height / width)
            const imageIndex = rowIndex * row.length + colIndex

            return (
              <div key={`${rowIndex}-${colIndex}`} style={{
                gridColumn: `span ${width}`,
                gridRow: `span ${height}`,
                aspectRatio: `${width}/${height}`,
                backgroundColor: imgBackground,
                overflow: 'hidden'
              }}>
                {images[imageIndex] && 
                  <canvas
                    ref={el => {
                      if (el) {
                        canvasRefs.current[`${rowIndex}-${colIndex}`] = el
                        drawImageToCanvas(el, images[imageIndex], cellWidth, cellHeight)
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                  />
                }
              </div>
            )
          })
        )}
      </div>
    )
  }
  const downloadCollage = (layout, index) => {
    const layoutArray = layouts[layout][index]
    const totalColumns = layoutArray[0].length
    const totalRows = layoutArray.length
    const baseWidth = 2000 // Increased base width for better quality
    const cellSize = baseWidth / Math.max(totalColumns, totalRows)
    
    const canvasWidth = cellSize * totalColumns + (totalColumns - 1) * gap
    const canvasHeight = cellSize * totalRows + (totalRows - 1) * gap

    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d')

    // Fill background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let yOffset = 0
    layoutArray.forEach((row, rowIndex) => {
      let xOffset = 0
      row.forEach((cell, colIndex) => {
        const [width, height] = cell.split('x').map(Number)
        const cellWidth = cellSize * width
        const cellHeight = cellSize * height
        const imageIndex = rowIndex * row.length + colIndex

        if (images[imageIndex]) {
          const img = images[imageIndex]
          const imgRatio = img.width / img.height
          const cellRatio = cellWidth / cellHeight
          let drawWidth = cellWidth
          let drawHeight = cellHeight
          let imgOffsetX = 0
          let imgOffsetY = 0

          if (imgRatio > cellRatio) {
            drawHeight = cellWidth / imgRatio
            imgOffsetY = (cellHeight - drawHeight) / 2
          } else {
            drawWidth = cellHeight * imgRatio
            imgOffsetX = (cellWidth - drawWidth) / 2
          }

          ctx.fillStyle = imgBackground
          ctx.fillRect(xOffset, yOffset, cellWidth, cellHeight)
          ctx.drawImage(img, xOffset + imgOffsetX, yOffset + imgOffsetY, drawWidth, drawHeight)
        }

        xOffset += cellWidth + gap
      })
      yOffset += cellSize + gap
    })

    const link = document.createElement('a')
    link.download = `collage-${layout}-${index + 1}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  return (
    <>
      <Head>
        <title>Collage Maker</title>
        <meta name="description" content="Create a collage from your images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '1500px',
      }}>
        <h1>Collage Maker</h1>
        <h2 className={styles.description}>Upload your images</h2>
        <div>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>
        <div>
          <label htmlFor="gap">Gap between images (px): </label>
          <input
            type="number"
            id="gap"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            min="0"
            max="20"
          />
        </div>
        <div>
          <label htmlFor="backgroundColor">Background Color: </label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="imgBackground">Image Background Color: </label>
          <input
            type="color"
            id="imgBackground"
            value={imgBackground}
            onChange={(e) => setImgBackground(e.target.value)}
          />
        </div>

        {Object.entries(layouts).map(([layoutName, layoutOptions]) => (
          <div key={layoutName}>
            <h2>{layoutName.charAt(0).toUpperCase() + layoutName.slice(1)} Layouts</h2>
            {layoutOptions.map((layout, index) => (
              <div key={index}>
                <div id={`grid-${layoutName}-${index}`}>
                  {renderGrid(layout)}
                </div>
                <button 
                  onClick={() => downloadCollage(layoutName, index)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        ))}
      </main>
    </>
  )
}
