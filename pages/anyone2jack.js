import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function ReplaceFace() {
  const [image, setImage] = useState(null)
  const [jackImage, setJackImage] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 })
  const [facemesh, setFacemesh] = useState(null)

  useEffect(() => {
    const loadFacemesh = async () => {
      if (typeof window !== 'undefined') {
        // load mediapipe facemesh from cdn
        const { FaceMesh } = await import('@mediapipe/face_mesh')
        const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils')

        const faceMesh = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        })

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        setFacemesh({ instance: faceMesh, drawConnectors, drawLandmarks })

        // preload jack's image
        const jackImg = new Image()
        jackImg.src = '/jackbutche.jpeg'
        jackImg.onload = () => setJackImage(jackImg)

        console.log('Facemesh loaded', faceMesh)
      }
    }
    loadFacemesh()
  }, [])

  const detectAndReplaceFace = async () => {
    console.log('Detecting and replacing face')
    if (!image || !facemesh || !jackImage) return

    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    // draw the original image
    console.log('Drawing image')
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    // create an offscreen video element for processing
    const video = document.createElement('video')
    video.srcObject = canvas.captureStream()
    video.play()

    // process the image
    facemesh.instance.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          const xs = landmarks.map((lm) => lm.x * canvasSize.width)
          const ys = landmarks.map((lm) => lm.y * canvasSize.height)

          const minX = Math.min(...xs)
          const maxX = Math.max(...xs)
          const minY = Math.min(...ys)
          const maxY = Math.max(...ys)

          const faceWidth = maxX - minX
          const faceHeight = maxY - minY

          // overlay jack's face
          context.save()
          context.translate(minX, minY)
          context.drawImage(
            jackImage,
            0,
            0,
            jackImage.width,
            jackImage.height,
            0,
            0,
            faceWidth,
            faceHeight
          )
          context.restore()
        })
      }
    })

    facemesh.instance.send({ image: canvas })
  }

  return (
    <>
      <Head>
        <title>Replace Face</title>
        <meta name="description" content="Replace a face in an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>Replace Face</h1>
        <span style={{ width: '100%', textAlign: 'center', color: '#666', fontSize: '14px' }}>
          Detect face landmarks and replace with jack butcher's face
        </span>

        {/* upload photo */}
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => setImage(img)
            }
            reader.readAsDataURL(file)
          }}
        />
        <canvas
          id="canvas"
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            width: '100%',
            height: 'auto',
            margin: '20px 0',
          }}
        ></canvas>

        <button onClick={detectAndReplaceFace} style={{ marginTop: 20 }}>
          Replace Face
        </button>

        <button
          onClick={() => {
            const canvas = document.getElementById('canvas')
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = `replaced-face-${Date.now()}.png`
            a.click()
          }}
          style={{ marginTop: 20 }}
        >
          Download Image
        </button>
      </main>
    </>
  )
}
