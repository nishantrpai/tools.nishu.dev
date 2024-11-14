import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function DitherFilter() {
  const [image, setImage] = useState(null)
  const [threshold, setThreshold] = useState(128)
  const [matrixSize, setMatrixSize] = useState(2)
  const [isColorMode, setIsColorMode] = useState(false)
  const [ditherType, setDitherType] = useState('ordered')
  const [blockType, setBlockType] = useState('pixel')

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, threshold, matrixSize, isColorMode, ditherType, blockType])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.drawImage(image, 0, 0, image.width, image.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    switch (ditherType) {
      case 'ordered':
        applyOrderedDithering(data, canvas.width, canvas.height)
        break
      case 'gradient':
        applyGradientDithering(data, canvas.width, canvas.height)
        break
      case 'diamond':
        applyDiamondDithering(data, canvas.width, canvas.height)
        break
    }

    context.putImageData(imageData, 0, 0)

    if (blockType !== 'pixel') {
      replacePixelsWithBlocks(context, canvas.width, canvas.height)
    }
  }

  const applyOrderedDithering = (data, width, height) => {
    const matrix = createBayerMatrix(matrixSize)
    const matrixDim = Math.pow(2, matrixSize)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4

        const mx = x % matrixDim
        const my = y % matrixDim
        const matrixValue = matrix[my][mx] / (matrixDim * matrixDim)

        if (isColorMode) {
          for (let c = 0; c < 3; c++) {
            data[i + c] = data[i + c] < (threshold * matrixValue) ? 0 : 255
          }
        } else {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          const color = avg < (threshold * matrixValue) ? 0 : 255

          data[i] = color
          data[i + 1] = color
          data[i + 2] = color
        }
      }
    }
  }

  const applyGradientDithering = (data, width, height) => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4

        if (isColorMode) {
          for (let c = 0; c < 3; c++) {
            const oldColor = data[i + c]
            const newColor = oldColor < threshold ? 0 : 255
            data[i + c] = newColor
            const error = oldColor - newColor

            if (x < width - 1) data[i + 4 + c] += error * 7 / 16
            if (y < height - 1) {
              if (x > 0) data[i + width * 4 - 4 + c] += error * 3 / 16
              data[i + width * 4 + c] += error * 5 / 16
              if (x < width - 1) data[i + width * 4 + 4 + c] += error * 1 / 16
            }
          }
        } else {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          const newColor = avg < threshold ? 0 : 255
          const error = avg - newColor

          data[i] = data[i + 1] = data[i + 2] = newColor

          if (x < width - 1) {
            data[i + 4] += error * 7 / 16
            data[i + 5] += error * 7 / 16
            data[i + 6] += error * 7 / 16
          }
          if (y < height - 1) {
            if (x > 0) {
              data[i + width * 4 - 4] += error * 3 / 16
              data[i + width * 4 - 3] += error * 3 / 16
              data[i + width * 4 - 2] += error * 3 / 16
            }
            data[i + width * 4] += error * 5 / 16
            data[i + width * 4 + 1] += error * 5 / 16
            data[i + width * 4 + 2] += error * 5 / 16
            if (x < width - 1) {
              data[i + width * 4 + 4] += error * 1 / 16
              data[i + width * 4 + 5] += error * 1 / 16
              data[i + width * 4 + 6] += error * 1 / 16
            }
          }
        }
      }
    }
  }

  const applyDiamondDithering = (data, width, height) => {
    const matrix = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5]
    ]
    const matrixSize = 4

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const mx = x % matrixSize
        const my = y % matrixSize
        const matrixValue = matrix[my][mx] / 16

        if (isColorMode) {
          for (let c = 0; c < 3; c++) {
            data[i + c] = data[i + c] < (threshold * matrixValue) ? 0 : 255
          }
        } else {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          const color = avg < (threshold * matrixValue) ? 0 : 255

          data[i] = color
          data[i + 1] = color
          data[i + 2] = color
        }
      }
    }
  }

  const createBayerMatrix = (n) => {
    if (n === 1) {
      return [[0, 2], [3, 1]]
    }

    const size = Math.pow(2, n)
    const matrix = Array(size).fill().map(() => Array(size).fill(0))
    const prevMatrix = createBayerMatrix(n - 1)
    const prevSize = Math.pow(2, n - 1)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = Math.floor(y / 2)
        const j = Math.floor(x / 2)
        if (y % 2 === 0 && x % 2 === 0) {
          matrix[y][x] = 4 * prevMatrix[i][j]
        } else if (y % 2 === 0 && x % 2 === 1) {
          matrix[y][x] = 4 * prevMatrix[i][j] + 2
        } else if (y % 2 === 1 && x % 2 === 0) {
          matrix[y][x] = 4 * prevMatrix[i][j] + 3
        } else {
          matrix[y][x] = 4 * prevMatrix[i][j] + 1
        }
      }
    }

    return matrix
  }

  const replacePixelsWithBlocks = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data
    const blocks = ['▀', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▉', '▊', '▋', '▌', '▍', '▎', '▏', '▐', '░', '▒', '▓', '▔', '▕', '▖', '▗', '▘', '▙', '▚', '▛', '▜', '▝', '▞', '▟']

    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)
    context.fillStyle = 'black'
    context.font = '10px monospace'

    for (let y = 0; y < height; y += 10) {
      for (let x = 0; x < width; x += 10) {
        const i = (y * width + x) * 4
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const blockIndex = Math.floor(brightness / 256 * blocks.length)
        context.fillText(blocks[blockIndex], x, y + 10)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Dither Filter</title>
        <meta name="description" content="Ordered, Gradient, and Diamond Dithering Filter with Block Characters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Dither Filter</h1>
        <h2 className={styles.description}>Transform your images using ordered, gradient, or diamond dithering with block characters</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            id="canvas"
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => {
                setImage(img)
              }
            }
            reader.readAsDataURL(file)
          }} />

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="threshold">Threshold: </label>
            <input
              type="range"
              id="threshold"
              min="0"
              max="255"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <input type="number" value={threshold} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setThreshold(Number(e.target.value))} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="matrixSize">Matrix Size: </label>
            <input
              type="range"
              id="matrixSize"
              min="1"
              max="4"
              value={matrixSize}
              onChange={(e) => setMatrixSize(Number(e.target.value))}
            />
            <input type="number" value={matrixSize} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setMatrixSize(Number(e.target.value))} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="colorMode">Color Mode: </label>
            <input
              type="checkbox"
              id="colorMode"
              checked={isColorMode}
              onChange={(e) => setIsColorMode(e.target.checked)}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="ditherType">Dither Type: </label>
            <select
              id="ditherType"
              value={ditherType}
              onChange={(e) => setDitherType(e.target.value)}
              style={{ background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5 }}
            >
              <option value="ordered">Ordered</option>
              <option value="gradient">Gradient</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="blockType">Block Type: </label>
            <select
              id="blockType"
              value={blockType}
              onChange={(e) => setBlockType(e.target.value)}
              style={{ background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5 }}
            >
              <option value="pixel">Pixel</option>
              <option value="block">Block Characters</option>
            </select>
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const context = canvas.getContext('2d')

            // Store current image data
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

            // Fill background with black
            context.fillStyle = '#000000'
            context.fillRect(0, 0, canvas.width, canvas.height)

            // Draw original image data back on top
            context.putImageData(imageData, 0, 0)

            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'dither_filter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
