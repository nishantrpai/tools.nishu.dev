import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const HalfCombine = () => {
  const [images, setImages] = useState([])
  const [percentages, setPercentages] = useState([])
  const [offsets, setOffsets] = useState([])
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [horizontal, setHorizontal] = useState(true)
  const [order, setOrder] = useState([])

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    const newImages = []
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          newImages.push(image)
          if (newImages.length === files.length) {
            setImages(newImages)
            setPercentages(new Array(files.length).fill(100 / files.length))
            setOffsets(new Array(files.length).fill({ offsetX: 0, offsetY: 0 }))
            setOrder(new Array(files.length).fill().map((_, i) => i))
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const downloadImage = () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `combined-image-${new Date().getTime()}.png`
    a.click()
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      if (!canvas || !ctx) return

      const sortedImages = order.map(index => images[index])
      const sortedPercentages = order.map(index => percentages[index])
      const sortedOffsets = order.map(index => offsets[index])

      if (horizontal) {
        const maxHeight = Math.max(...sortedImages.map(img => img.height))
        const totalWidth = sortedImages.reduce((sum, img, index) => sum + img.width * (sortedPercentages[index] / 100), 0)
        canvas.width = totalWidth
        canvas.height = maxHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let xOffset = 0
        sortedImages.forEach((image, index) => {
          const width = image.width * (sortedPercentages[index] / 100)
          ctx.drawImage(image, sortedOffsets[index].offsetX, sortedOffsets[index].offsetY, width, maxHeight, xOffset, 0, width, maxHeight)
          xOffset += width
        })
      } else {
        const maxWidth = Math.max(...sortedImages.map(img => img.width))
        const totalHeight = sortedImages.reduce((sum, img, index) => sum + img.height * (sortedPercentages[index] / 100), 0)
        canvas.width = maxWidth
        canvas.height = totalHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let yOffset = 0
        sortedImages.forEach((image, index) => {
          const height = image.height * (sortedPercentages[index] / 100)
          ctx.drawImage(image, sortedOffsets[index].offsetX, sortedOffsets[index].offsetY, maxWidth, height, 0, yOffset, maxWidth, height)
          yOffset += height
        })
      }
    }
  }, [images, percentages, offsets, horizontal, order])

  return (
    <>
      <Head>
        <title>Combine multiple parts of images</title>
        <meta name="description" content="Combine multiple parts of images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Combine multiple parts of images
        </h1>

        <p className={styles.description}>
          Combine multiple parts of images
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%' }}>
        <canvas id="canvas" width={500} height={500} style={{ width: '100%' }}></canvas>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="file" multiple onChange={handleImages} />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <input type="checkbox" checked={horizontal} onChange={(e) => setHorizontal(e.target.checked)} />
              <label>Horizontal</label>
            </div>
            {images.map((_, index) => (
              <div key={index} style={{display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid #333', paddingBottom: 10}}>
                <label>Order for image {index + 1}:</label>
                <input
                  type="number"
                  value={order[index]}
                  onChange={(e) => {
                    const newOrder = [...order]
                    newOrder[index] = parseInt(e.target.value)
                    setOrder(newOrder)
                  }}
                  min="0"
                  max={images.length - 1}
                  style={{ width: '100px', margin: '10px 0', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Percentage for image {index + 1}:</label>
                <input
                  type="number"
                  value={percentages[index]}
                  onChange={(e) => {
                    const newPercentages = [...percentages]
                    newPercentages[index] = e.target.value
                    setPercentages(newPercentages)
                  }}
                  min="0"
                  max="100"
                  style={{ width: '100px', margin: '10px 0', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Offset X for image {index + 1}:</label>
                <input
                  type="range"
                  min="-1600"
                  max="1600"
                  value={offsets[index].offsetX}
                  onChange={(e) => {
                    const newOffsets = [...offsets]
                    newOffsets[index] = { ...newOffsets[index], offsetX: e.target.value }
                    setOffsets(newOffsets)
                  }}
                  style={{ width: '100px', margin: '10px 0', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
                <label>Offset Y for image {index + 1}:</label>
                <input
                  type="range"
                  min="-1600"
                  max="1600"
                  value={offsets[index].offsetY}
                  onChange={(e) => {
                    const newOffsets = [...offsets]
                    newOffsets[index] = { ...newOffsets[index], offsetY: e.target.value }
                    setOffsets(newOffsets)
                  }}
                  style={{ width: '100px', margin: '10px 0', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
                />
              </div>
            ))}
            <button onClick={downloadImage}>Download</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default HalfCombine