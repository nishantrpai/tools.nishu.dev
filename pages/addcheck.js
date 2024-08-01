import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function AddCheck() {
  // add check to any image

  const check = '/check.svg'
  const [renderMode, setRenderMode] = useState('frame')
  const [image, setImage] = useState(null)

  useEffect(() => {
    console.log('image', image)
    const img = image
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    // draw black rectangle
    canvas.width = img.width
    canvas.height = img.height
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    // draw 50% smaller image in the middle of the canvas
    // if frame mode, draw image in the middle of the canvas, else fill the canvas with the image
    if (renderMode === 'museum') {
      context.drawImage(img, canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2)
    } else {
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    // context.drawImage(img, canvas.width / 4, canvas.height / 4 + 30, canvas.width / 2, canvas.height / 2)
    // draw check a lil above the image to the right
    const checkImg = new Image()
    checkImg.src = check
    checkImg.onload = () => {
      context.drawImage(checkImg, (canvas.width / 4 + img.width / 2) - 20
        , canvas.height / 4 - 60, 40, 40)
    }


  }, [image, renderMode])

  const onFileChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Head>
        <title>Add check</title>
        <meta name="description" content="Add check to any image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Add check
        </h1>
        <h2 className={styles.description}>
          Add check to any image
        </h2>
        <canvas id="canvas" width="800" height="800" style={{
          border: '1px solid #333',
          borderRadius: '5px',
          width: '100%',
        }}>

        </canvas>
        <input type="file" id="file" onChange={onFileChange} />
        {/* frame mode or museum mode radio button */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <input type="radio" id="frame" name="mode" value="frame" checked={renderMode === 'frame'} onChange={() => setRenderMode('frame')} />
            <label htmlFor="frame">Frame</label>

          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <input type="radio" id="museum" name="mode" value="museum" checked={renderMode === 'museum'} onChange={() => setRenderMode('museum')} />
            <label htmlFor="museum">Museum</label>

          </div>
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL()
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `check-${Date.now()}.png`
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}