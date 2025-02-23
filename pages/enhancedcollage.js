import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'

export default function EnhancedCollage() {
  const [images, setImages] = useState([])
  const [gap, setGap] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [imgBackground, setImgBackground] = useState('#ddd')
  // positions for interactive repositioning; keys will be `${rowIndex}-${colIndex}`
  const [positions, setPositions] = useState({})
  const [selectedLayout, setSelectedLayout] = useState({ layoutName: 'basic', index: 0 })
  const canvasRefs = useRef({})

  // Add new collage options (feel free to add as many "nishus" as you like)
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
    Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.src = e.target.result
          }
          reader.readAsDataURL(file)
        })
      })
    ).then(loadedImages => {
      setImages(loadedImages)
      // initialize positions for each image container to {x:0, y:0}
      const newPositions = {}
      loadedImages.forEach((_, i) => {
        newPositions[i] = { x: 0, y: 0 }
      })
      setPositions(newPositions)
    })
  }

  const drawImageToCanvas = (canvas, img, width, height, offset = { x: 0, y: 0 }) => {
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
    let drawX = offset.x
    let drawY = offset.y

    if (imgRatio > canvasRatio) {
      drawWidth = height * imgRatio
      drawX += -(drawWidth - width) / 2
    } else {
      drawHeight = width / imgRatio
      drawY += -(drawHeight - height) / 2
    }
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
  }

  // Render a grid cell with a draggable canvas for repositioning the drawn image
  const renderDraggableCell = (img, cellWidth, cellHeight, key) => {
    return (
      <Draggable key={key}>
        <div style={{
          width: cellWidth,
          height: cellHeight,
          backgroundColor: imgBackground,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <canvas
            ref={el => {
              if (el && img) {
                canvasRefs.current[key] = el
                // Always draw using the default offset
                drawImageToCanvas(el, img, cellWidth, cellHeight, { x: 0, y: 0 })
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        </div>
      </Draggable>
    )
  }

  // Render grid for a given layout
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

    let cellCounter = 0
    return (
      <div style={gridStyle}>
        {layout.flat().map((cell) => {
          // Calculate dimensions based on cell definition
          const [colSpan, rowSpan] = cell.split('x').map(Number)
          const cellWidth = (500 - (layout[0].length - 1) * gap) / layout[0].length * colSpan
          const cellHeight = cellWidth * (rowSpan / colSpan)
          const img = images[cellCounter]
          const key = `${cellCounter}`
          cellCounter++
          return (
            <div key={key} style={{
              gridColumn: `span ${colSpan}`,
              gridRow: `span ${rowSpan}`,
              aspectRatio: `${colSpan}/${rowSpan}`,
            }}>
              {img && renderDraggableCell(img, cellWidth, cellHeight, key)}
            </div>
          )
        })}
      </div>
    )
  }

  // Export high-quality collage canvas (using higher base width)
  const downloadCollage = (layoutName, index) => {
    const layout = layouts[layoutName][index]
    const totalColumns = layout[0].length
    const totalRows = layout.length
    const baseWidth = 4000 // increased base width for export quality
    const cellSize = baseWidth / Math.max(totalColumns, totalRows)

    const canvasWidth = cellSize * totalColumns + (totalColumns - 1) * gap
    const canvasHeight = cellSize * totalRows + (totalRows - 1) * gap

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvasWidth
    exportCanvas.height = canvasHeight
    const ctx = exportCanvas.getContext('2d')

    // Draw base background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    let yOffset = 0
    layout.forEach((row) => {
      let xOffset = 0
      row.forEach((cell) => {
        const [colSpan, rowSpan] = cell.split('x').map(Number)
        const cellWidth = cellSize * colSpan
        const cellHeight = cellSize * rowSpan
        const imageIndex = yOffset === 0 ? xOffset / (cellSize + gap) : null
        // Compute image index based on flatness (row-major order)
        const flatIndex = layout.slice(0, layout.indexOf(row)).reduce((acc, cur) => acc + cur.length, 0) + row.indexOf(cell)
        const img = images[flatIndex]

        if (img) {
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
    link.download = `collage-${layoutName}-${index + 1}.png`
    link.href = exportCanvas.toDataURL('image/png', 1.0)
    link.click()
  }

  return (
    <>
      <Head>
        <title>Enhanced Collage Maker</title>
        <meta name="description" content="Create interactive and high-quality collages" />
      </Head>
      <main style={{ maxWidth: '1500px', margin: '0 auto' }}>
        <h1>Enhanced Collage Maker</h1>
        <div>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Gap (px): </label>
          <input
            type="number"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            min="0"
            max="50"
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Background Color: </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Image Background Color: </label>
          <input
            type="color"
            value={imgBackground}
            onChange={(e) => setImgBackground(e.target.value)}
          />
        </div>

        {/* Main Preview Canvas */}
        <div style={{ margin: '20px 0' }}>
          {renderGrid(layouts[selectedLayout.layoutName][selectedLayout.index])}
        </div>

        {/* Layout Mockup Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {Object.entries(layouts).map(([layoutName, options]) => (
            options.map((layout, idx) => (
              <button
                key={`${layoutName}-${idx}`}
                onClick={() => setSelectedLayout({ layoutName, index: idx })}
                style={{
                  padding: '10px',
                  border: selectedLayout.layoutName === layoutName && selectedLayout.index === idx ? '2px solid #fff' : '1px solid #333',
                  backgroundColor: '#000',
                  cursor: 'pointer'
                }}
              >
                {layoutName} {idx + 1}
              </button>
            ))
          ))}
        </div>

        {/* Download Button */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => downloadCollage(selectedLayout.layoutName, selectedLayout.index)}>
            Download High-Quality Collage
          </button>
        </div>
      </main>
    </>
  )
}
