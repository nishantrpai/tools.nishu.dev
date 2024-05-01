// simple tool to swap faces in images
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'

export default function FaceSwap() {
  const [image, setImage] = useState(null)
  const [faceImage, setFaceImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [faceLoading, setFaceLoading] = useState(false)
  const [faceSwapLoading, setFaceSwapLoading] = useState(false)
  const [faceSwapImage, setFaceSwapImage] = useState(null)
  const [faceSwapError, setFaceSwapError] = useState(null)

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true)
      const MODEL_URL = '/models'
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      await faceapi.loadFaceRecognitionModel(MODEL_URL);
      console.log('models loaded')
        setLoading(false)
    }

    loadModels()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      setImage(e.target.result)
    }

    reader.readAsDataURL(file)
  }

  const handleFaceImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      setFaceImage(e.target.result)
    }

    reader.readAsDataURL(file)
  }

  const detectFace = async () => {
    // draw bounding box around face
    console.log('detecting face')
    setFaceLoading(true)
    try {
      const img = await faceapi.fetchImage(image)
      console.log('image fetched', img)
      const result = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      const displaySize = { width: img.width, height: img.height }
      const resizedResults = faceapi.resizeResults(result, displaySize)
      console.log('result', result)
      const canvas = faceapi.createCanvasFromMedia(img)
      faceapi.draw.drawDetections(canvas, resizedResults)
      faceapi.draw.drawLandmarks(canvas, resizedResults)
      document.body.append(canvas)
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleSwapFaces = async () => {
    setFaceSwapLoading(true)
    setFaceSwapError(null)
    try {
      const img = await faceapi.fetchImage(image)
      const faceImg = await faceapi.fetchImage(faceImage)
      const face = await faceapi.detectSingleFace(faceImg).withFaceLandmarks().withFaceDescriptor()
      const result = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      const faceMatcher = new faceapi.FaceMatcher(face)
      const bestMatch = faceMatcher.findBestMatch(result.descriptor)
      const canvas = faceapi.createCanvasFromMedia(img)
      faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result))
      faceapi.draw.drawLandmarks(canvas, faceapi.resizeResults(result))
      const faceCanvas = faceapi.createCanvasFromMedia(faceImg)
      faceapi.draw.drawDetections(faceCanvas, faceapi.resizeResults(face))
      faceapi.draw.drawLandmarks(faceCanvas, faceapi.resizeResults(face))
      const faceSwap = await faceapi.swapFaces(faceCanvas, canvas, [face], [result])
      console.log(faceSwap.toDataURL())
      setFaceSwapImage(faceSwap.toDataURL())
    }
    catch (error) {
      console.log(error)
      setFaceSwapError(error.message)
    }
    setFaceSwapLoading(false)
  }

  return (
    <>
      <Head>
        <title>Face Swap</title>
        <meta name="description" content="Face Swap" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Face Swap</h1>
        <label>image</label>
        <input type='file' onChange={handleImageChange} />
        {image && <img src={image} alt='image' />}
        <input type='file' onChange={handleFaceImageChange} />
        {faceImage && <img src={faceImage} alt='face image' />}
        <button onClick={handleSwapFaces} disabled={loading || faceLoading || faceSwapLoading}>Swap Faces</button>
        <button onClick={detectFace}>Detect Face</button>
        {faceSwapError && <p>{faceSwapError}</p>}
        {faceSwapImage && <img src={faceSwapImage} alt='face swap' />}
      </main>
    </>
  )
}