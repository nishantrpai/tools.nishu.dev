import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function ShakeFilter() {
  const [image, setImage] = useState(null)
  const [redIntensity, setRedIntensity] = useState(164)
  const [filterThreshold, setFilterThreshold] = useState(50)
  const [selectedAreaOnly, setSelectedAreaOnly] = useState(false)
  const [unselectedArea, setUnselectedArea] = useState(false)
  const [selectionRect, setSelectionRect] = useState({ x: 50, y: 50, width: 200, height: 200 })
  const [reverseFilter, setReverseFilter] = useState(false)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragType = useRef(null) // 'move' or 'resize'
  const resizeHandle = useRef(null) // 'nw', 'ne', 'sw', 'se'
  
  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, redIntensity, filterThreshold, selectedAreaOnly, selectionRect, reverseFilter])

  const applyFilter = (hideSelection = false) => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    // Draw a black rectangle as background
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4
        
        // Determine whether to apply the filter based on mode:
        // When selectedAreaOnly is true:
        //   - if unselectedArea is true, apply filter on pixels not inside the rectangle.
        //   - otherwise, only apply filter on pixels inside the rectangle.
        // When selectedAreaOnly is false, apply filter everywhere.
        const shouldApply = selectedAreaOnly
          ? (unselectedArea
              ? !(x >= selectionRect.x &&
                  x <= selectionRect.x + selectionRect.width &&
                  y >= selectionRect.y &&
                  y <= selectionRect.y + selectionRect.height)
              : (x >= selectionRect.x &&
                  x <= selectionRect.x + selectionRect.width &&
                  y >= selectionRect.y &&
                  y <= selectionRect.y + selectionRect.height))
          : true

        if (shouldApply) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          if ((reverseFilter && avg <= filterThreshold) || (!reverseFilter && avg > filterThreshold)) {
            data[i] = redIntensity // Red channel
            data[i + 1] = 5 // Green channel
            data[i + 2] = 24 // Blue channel
            data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
          }
        }
      }
    }
    context.putImageData(imageData, 0, 0)

    // Draw selection rectangle if needed
    if (selectedAreaOnly && !hideSelection) {
      context.strokeStyle = 'white'
      context.lineWidth = 2
      context.strokeRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height)
      
      // Draw resize handles
      const handles = [
        { x: selectionRect.x, y: selectionRect.y }, // nw
        { x: selectionRect.x + selectionRect.width, y: selectionRect.y }, // ne
        { x: selectionRect.x, y: selectionRect.y + selectionRect.height }, // sw
        { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height } // se
      ]
      
      handles.forEach(handle => {
        context.fillStyle = 'white'
        context.fillRect(handle.x - 4, handle.y - 4, 8, 8)
      })
    }
  }

  const handleMouseDown = (e) => {
    if (!selectedAreaOnly || !image) return
    
    const canvas = document.getElementById('canvas')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // Check if clicking on resize handles
    const handles = [
      { type: 'nw', x: selectionRect.x, y: selectionRect.y },
      { type: 'ne', x: selectionRect.x + selectionRect.width, y: selectionRect.y },
      { type: 'sw', x: selectionRect.x, y: selectionRect.y + selectionRect.height },
      { type: 'se', x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height }
    ]

    for (const handle of handles) {
      if (Math.abs(x - handle.x) < 10 && Math.abs(y - handle.y) < 10) {
        isDragging.current = true
        dragType.current = 'resize'
        resizeHandle.current = handle.type
        dragStart.current = { x, y }
        return
      }
    }

    // Check if clicking inside selection rectangle
    if (x >= selectionRect.x && x <= selectionRect.x + selectionRect.width &&
        y >= selectionRect.y && y <= selectionRect.y + selectionRect.height) {
      isDragging.current = true
      dragType.current = 'move'
      dragStart.current = { x: x - selectionRect.x, y: y - selectionRect.y }
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current || !selectedAreaOnly || !image) return

    const canvas = document.getElementById('canvas')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    if (dragType.current === 'move') {
      setSelectionRect(prev => ({
        ...prev,
        x: Math.max(0, Math.min(x - dragStart.current.x, canvas.width - prev.width)),
        y: Math.max(0, Math.min(y - dragStart.current.y, canvas.height - prev.height))
      }))
    } else if (dragType.current === 'resize') {
      const newRect = { ...selectionRect }
      
      if (resizeHandle.current.includes('n')) {
        newRect.height = newRect.height - (y - newRect.y)
        newRect.y = y
      }
      if (resizeHandle.current.includes('s')) {
        newRect.height = y - newRect.y
      }
      if (resizeHandle.current.includes('w')) {
        newRect.width = newRect.width - (x - newRect.x)
        newRect.x = x
      }
      if (resizeHandle.current.includes('e')) {
        newRect.width = x - newRect.x
      }

      setSelectionRect(newRect)
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  return (
    <>
      <Head>
        <title>Shake Filter</title>
        <meta name="description" content="Shake Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '100%',
      }}>
        <h1>Shake Filter</h1>
        <h2 className={styles.description}>Add shake filter on any image</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas 
            id="canvas" 
            style={{ width: '100%', maxWidth: 500, height: 'auto', cursor: selectedAreaOnly ? 'crosshair' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setImage(img)
              setSelectionRect({ x: 50, y: 50, width: 200, height: 200 })
            }
          }
          reader.readAsDataURL(file)
        }} />
        <div style={{ marginTop: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={selectedAreaOnly}
              onChange={(e) => setSelectedAreaOnly(e.target.checked)}
            />
            Apply to selected area only
          </label>
        </div>
        {selectedAreaOnly ? <div style={{marginTop: '20px'}}>
          <label>
            <input
              type="checkbox"
              checked={unselectedArea}
              onChange={(e) => setUnselectedArea(e.target.checked)}
            />
            Apply to unselected area 
          </label>
        </div> : null}
        <div style={{ marginTop: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={reverseFilter}
              onChange={(e) => setReverseFilter(e.target.checked)}
            />
            Reverse filter (apply to lower colors)
          </label>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="redIntensity">Red Intensity: </label>
          <input
            type="range"
            id="redIntensity"
            min="0"
            max="255"
            value={redIntensity}
            onChange={(e) => setRedIntensity(Number(e.target.value))}
          />
          <span>{redIntensity}</span>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="filterThreshold">Filter Threshold: </label>
          <input
            type="range"
            id="filterThreshold"
            min="0"
            max="255"
            value={filterThreshold}
            onChange={(e) => setFilterThreshold(Number(e.target.value))}
          />
          <span>{filterThreshold}</span>
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          // Apply filter without selection rectangle
          applyFilter(true)
          
          const canvas = document.getElementById('canvas')
          const tempCanvas = document.createElement('canvas')
          const tempContext = tempCanvas.getContext('2d')
          tempCanvas.width = canvas.width
          tempCanvas.height = canvas.height
          
          // Draw black background
          tempContext.fillStyle = 'black'
          tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
          
          // Draw the filtered image on top
          tempContext.drawImage(canvas, 0, 0)
          
          const a = document.createElement('a')
          a.href = tempCanvas.toDataURL('image/png')
          a.download = 'shake_filter.png'
          a.click()
          
          // Reapply filter with selection rectangle
          applyFilter()
        }}>Download</button>
      </main>
    </>
  )
}
