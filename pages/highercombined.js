import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { FaFilter, FaHatWizard, FaUndo } from 'react-icons/fa'

const tools = [
  {
    id: 'filter',
    name: 'Higher Filter',
    icon: FaFilter,
    settings: [
      {
        type: 'checkbox',
        label: 'Reverse filter (apply to lower colors)',
        state: 'reverseFilter',
      },
      {
        type: 'range',
        label: 'Green Intensity',
        state: 'greenIntensity',
        min: 0,
        max: 255,
      },
      {
        type: 'range',
        label: 'Filter Threshold',
        state: 'filterThreshold',
        min: 0,
        max: 255,
      },
    ],
  },
  {
    id: 'hat',
    name: 'Higher Italic',
    icon: FaHatWizard,
    settings: [
      {
        type: 'range',
        label: 'Offset X',
        state: 'offsetX',
        min: -1500,
        max: 1500,
      },
      {
        type: 'range',
        label: 'Offset Y',
        state: 'offsetY',
        min: -1500,
        max: 1500,
      },
      {
        type: 'range',
        label: 'Scale',
        state: 'scale',
        min: 0,
        max: 10,
        step: 0.01,
      },
      {
        type: 'range',
        label: 'Rotate',
        state: 'offsetTheta',
        min: -360,
        max: 360,
      },
    ],
  },
  // Add more tools here
]

export default function HigherCombined() {
  const [image, setImage] = useState(null)
  const [greenIntensity, setGreenIntensity] = useState(139)
  const [filterThreshold, setFilterThreshold] = useState(50)
  const [selectedAreaOnly, setSelectedAreaOnly] = useState(false)
  const [selectionRect, setSelectionRect] = useState({ x: 50, y: 50, width: 200, height: 200 })
  const [reverseFilter, setReverseFilter] = useState(false)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(104)
  const [scale, setScale] = useState(2.4)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)
  const [activeTool, setActiveTool] = useState('filter')
  const [history, setHistory] = useState([])
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragType = useRef(null) // 'move' or 'resize'
  const resizeHandle = useRef(null) // 'nw', 'ne', 'sw', 'se'

  const higherHat = '/higheritalic.svg'

  useEffect(() => {
    if (image) {
      applyFilter()
      if (activeTool === 'hat') {
        applyHat()
      }
    }
  }, [image, greenIntensity, filterThreshold, selectedAreaOnly, selectionRect, reverseFilter, offsetX, offsetY, scale, offsetTheta, hatType, activeTool])

  const applyFilter = (hideSelection = false) => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    if(history.length === 0) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    }
    // Draw a black rectangle as background
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4

        const isInSelectedArea = selectedAreaOnly ?
          x >= selectionRect.x &&
          x <= selectionRect.x + selectionRect.width &&
          y >= selectionRect.y &&
          y <= selectionRect.y + selectionRect.height :
          true

        if (isInSelectedArea) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          if ((reverseFilter && avg <= filterThreshold) || (!reverseFilter && avg > filterThreshold)) {
            data[i] = 84 // Red channel
            data[i + 1] = greenIntensity // Green channel
            data[i + 2] = 86 // Blue channel
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

  const applyHat = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (image) {
      const hat = new Image()
      if (hatType === 0)
        hat.src = higherHat
      else if (hatType === 1)
        hat.src = higherHat2
      else if (hatType === 2)
        hat.src = higherHat3

      hat.onload = () => {
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
        context.resetTransform()
        saveHistory()
      }
    }
  }

  const saveHistory = () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL()
    setHistory(prevHistory => [...prevHistory, dataURL])
  }

  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1]
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const img = new Image()
      img.src = lastState
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
        setHistory(prevHistory => prevHistory.slice(0, -1))
      }
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

  const renderSettings = () => {
    const tool = tools.find(t => t.id === activeTool)
    if (!tool) return null

    return tool.settings.map(setting => {
      switch (setting.type) {
        case 'checkbox':
          return (
            <div key={setting.state} style={{ marginTop: '20px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={eval(setting.state)}
                  onChange={(e) => eval(`set${setting.state.charAt(0).toUpperCase() + setting.state.slice(1)}(e.target.checked)`)}
                  style={{ marginRight: 10 }}
                />
                {setting.label}
              </label>
            </div>
          )
        case 'range':
          return (
            <div key={setting.state} style={{ marginTop: '20px' }}>
              <label htmlFor={setting.state}>{setting.label}: </label>
              <input
                type="range"
                id={setting.state}
                min={setting.min}
                max={setting.max}
                step={setting.step || 1}
                value={eval(setting.state)}
                onChange={(e) => eval(`set${setting.state.charAt(0).toUpperCase() + setting.state.slice(1)}(Number(e.target.value))`)}
              />
              <input type="number" value={eval(setting.state)} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => eval(`set${setting.state.charAt(0).toUpperCase() + setting.state.slice(1)}(Number(e.target.value))`)} />
            </div>
          )
        default:
          return null
      }
    })
  }

  return (
    <>
      <Head>
        <title>Higher Combined</title>
        <meta name="description" content="Higher Combined" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Higher Combined</h1>
        <h2 className={styles.description}>Apply both higher filter and higher hat on any image</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
          {tools.map(tool => (
            <button key={tool.id} onClick={() => setActiveTool(tool.id)}>
              <tool.icon /> {tool.name}
            </button>
          ))}
          <button onClick={undo}>
            <FaUndo /> Undo
          </button>
        </div>
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
              setImgWidth(img.width)
              setImgHeight(img.height)
              saveHistory()
            }
          }
          reader.readAsDataURL(file)
        }} />
        {renderSettings()}
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          // Apply filter without selection rectangle
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
          a.download = 'higher_combined.png'
          a.click()

          // // Reapply filter with selection rectangle
          // applyFilter()
          // if (activeTool === 'hat') {
          //   applyHat()
          // }
        }}>Download</button>
      </main>
    </>
  )
}