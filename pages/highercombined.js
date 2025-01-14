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
        default: false,
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
    apply: (image) => {
      // apply filter function
      if (!image) return;
      const reverseFilter = document.querySelector('#reverseFilter')?.checked;
      const greenIntensity = parseInt(document.querySelector('#greenIntensity')?.value || 0, 10);
      const filterThreshold = parseInt(document.querySelector('#filterThreshold')?.value || 0, 10);

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
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          if ((reverseFilter && avg <= filterThreshold) || (!reverseFilter && avg > filterThreshold)) {
            data[i] = 84 // Red channel
            data[i + 1] = greenIntensity // Green channel
            data[i + 2] = 86 // Blue channel
            data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
          }
        }
      }
      context.putImageData(imageData, 0, 0)
    }
  },
  {
    id: 'higheritalic',
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
        default: 0,
        min: -360,
        max: 360,
      },
    ],
    apply: (image) => {
      // apply hat function
      const offsetX = parseInt(document.querySelector('#offsetX')?.value || 0, 10);
      const offsetY = parseInt(document.querySelector('#offsetY')?.value || 0, 10);
      const scale = parseFloat(document.querySelector('#scale')?.value || 1);
      const offsetTheta = parseInt(document.querySelector('#offsetTheta')?.value || 0, 10);
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      canvas.width = image.width
      canvas.height = image.height
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      if (image) {
        const hat = new Image()
        hat.onload = () => {
          context.translate(offsetX, offsetY)
          context.rotate(offsetTheta * Math.PI / 180)
          context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
          context.resetTransform()
        }
        hat.src = '/higheritalic.svg'
      }
  
    }
  },
  // Add more tools here
]

export default function HigherCombined() {
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [activeTool, setActiveTool] = useState('filter')
  const [history, setHistory] = useState([])
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragType = useRef(null) // 'move' or 'resize'
  const resizeHandle = useRef(null) // 'nw', 'ne', 'sw', 'se'

  const higherHat = '/higheritalic.svg'

  // useEffect(() => {
  //   if (image) {
  //     applyFilter()
  //     if (activeTool === 'hat') {
  //       applyHat()
  //     }
  //   }
  // }, [image, greenIntensity, filterThreshold, selectedAreaOnly, selectionRect, reverseFilter, offsetX, offsetY, scale, offsetTheta, hatType, activeTool])


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
                  checked={eval(setting.default)}
                  onChange={(e) => { tool.apply(image) }}
                  style={{ marginRight: 10 }}
                />
                {setting.label}
              </label>
            </div>
          )
        case 'range':
          return (
            <div key={setting.id} style={{ marginTop: '20px' }}>
              <label htmlFor={setting.state}>{setting.label}: </label>
              <input
                type="range"
                id={setting.state}
                min={setting.min}
                max={setting.max}
                step={setting.step || 1}
                defaultValue={setting.default || 0}
                onChange={(e) => {
                  document.querySelector(`#${setting.state}`).value = e.target.value
                  tool.apply(image)
                }
                }
              />
            </div>
          )
        default:
          return null
      }
    })
  }

  useEffect(() => {
    // if canvas is not empty setImage to the canvas
    if (document.getElementById('canvas').toDataURL() !== '') {
      const img = new Image()
      img.src = document.getElementById('canvas').toDataURL()
      setImage(img)
    }
  }, [activeTool])

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
            style={{ width: '100%', maxWidth: 500, height: 'auto', }}
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
              setImgWidth(img.width)
              setImgHeight(img.height)
              let canvas = document.getElementById('canvas')
              canvas.width = img.width
              canvas.height = img.height
              let context = canvas.getContext('2d')
              context.clearRect(0, 0, canvas.width, canvas.height)
              let drawimg = new Image()
              drawimg.onload = () => {
                console.log('drawing image')
                context.drawImage(img, 0, 0)
              }
              drawimg.src = reader.result
              // saveHistory()
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