import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@mediapipe/face_mesh'
import Delaunator from 'delaunator'

export default function FaceMorph() {
  const [targetImage, setTargetImage] = useState(null)
  const [jackFace, setJackFace] = useState(null)
  const [model, setModel] = useState(null)
  const [morphAmount, setMorphAmount] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [excludedFeatures, setExcludedFeatures] = useState({
    eyes: false,
    ears: false,
  })
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 1, height: 1 })
  const [curveFactor, setCurveFactor] = useState(1)
  const canvasRef = useRef(null)

  useEffect(() => {
    const loadModel = async () => {
      const { FaceMesh } = facemesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      })
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      setModel(faceMesh)

      const jackImg = new Image()
      jackImg.src = '/jackbutche.jpeg'
      jackImg.onload = () => setJackFace(jackImg)
    }
    loadModel()
    return () => model?.close()
  }, [])

  const getLandmarks = (image) => {
    return new Promise((resolve) => {
      model.onResults((results) => {
        if (results.multiFaceLandmarks?.length) {
          resolve(results.multiFaceLandmarks[0].map((point) => ({
            x: point.x,
            y: point.y,
          })))
        }
      })
      model.send({ image })
    })
  }

  const createTriangulation = (points) => {
    const flatPoints = points.reduce((arr, p) => [...arr, p.x, p.y], [])
    const delaunay = new Delaunator(flatPoints)
    return delaunay.triangles
  }

  const morphPoints = (sourcePoints, targetPoints, amount) => {
    return sourcePoints.map((sp, i) => ({
      x: sp.x + (targetPoints[i].x - sp.x) * amount,
      y: sp.y + (targetPoints[i].y - sp.y) * amount,
    }))
  }

  const featureIndices = {
    eyes: [...Array.from({ length: 10 }, (_, i) => 33 + i), ...Array.from({ length: 10 }, (_, i) => 263 + i)],
    ears: [...Array.from({ length: 21 }, (_, i) => 234 + i), ...Array.from({ length: 21 }, (_, i) => 93 + i)],
  }

  const renderMorph = async () => {
    if (!model || !targetImage || !jackFace || !canvasRef.current) return
  
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = targetImage.width
    canvas.height = targetImage.height
  
    const jackLandmarks = await getLandmarks(jackFace)
    const targetLandmarks = await getLandmarks(targetImage)
  
    const triangles = createTriangulation(jackLandmarks)
    const morphedPoints = morphPoints(jackLandmarks, targetLandmarks, morphAmount)
  
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(targetImage, 0, 0, canvas.width, canvas.height)
  
    const excludedLandmarks = new Set()
    Object.keys(excludedFeatures).forEach((key) => {
      if (excludedFeatures[key]) {
        featureIndices[key].forEach((index) => excludedLandmarks.add(index))
      }
    })
  
    for (let i = 0; i < triangles.length; i += 3) {
      const [a, b, c] = [triangles[i], triangles[i + 1], triangles[i + 2]]
  
      if (excludedLandmarks.has(a) || excludedLandmarks.has(b) || excludedLandmarks.has(c)) continue
  
      const sourceTriangle = [
        jackLandmarks[a],
        jackLandmarks[b],
        jackLandmarks[c],
      ]
  
      const targetTriangle = [
        morphedPoints[a],
        morphedPoints[b],
        morphedPoints[c],
      ].map((p) => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height,
      }))
  
      const sourceTrianglePx = sourceTriangle.map((p) => ({
        x: p.x * jackFace.width,
        y: p.y * jackFace.height,
      }))
  
      ctx.save()
      ctx.globalAlpha = opacity // set the opacity for jack's face
      ctx.beginPath()
      ctx.moveTo(targetTriangle[0].x, targetTriangle[0].y)
      ctx.lineTo(targetTriangle[1].x, targetTriangle[1].y)
      ctx.lineTo(targetTriangle[2].x, targetTriangle[2].y)
      ctx.closePath()
      ctx.clip()
  
      const minX = Math.min(...sourceTrianglePx.map((p) => p.x))
      const minY = Math.min(...sourceTrianglePx.map((p) => p.y))
      const maxX = Math.max(...sourceTrianglePx.map((p) => p.x))
      const maxY = Math.max(...sourceTrianglePx.map((p) => p.y))
  
      const width = maxX - minX
      const height = maxY - minY
  
      const targetBoundingBox = {
        x: Math.min(...targetTriangle.map((p) => p.x)),
        y: Math.min(...targetTriangle.map((p) => p.y)),
        width: Math.max(...targetTriangle.map((p) => p.x)) - Math.min(...targetTriangle.map((p) => p.x)),
        height: Math.max(...targetTriangle.map((p) => p.y)) - Math.min(...targetTriangle.map((p) => p.y)),
      }
  
      ctx.drawImage(
        jackFace,
        minX + crop.x * width, minY + crop.y * height, width * crop.width, height * crop.height,
        targetBoundingBox.x, targetBoundingBox.y, targetBoundingBox.width, targetBoundingBox.height
      )
      ctx.restore()
    }
  
    // Apply alpha blending to smooth the transition between the images
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255
      data[i] = data[i] * alpha + targetImage.data[i] * (1 - alpha)
      data[i + 1] = data[i + 1] * alpha + targetImage.data[i + 1] * (1 - alpha)
      data[i + 2] = data[i + 2] * alpha + targetImage.data[i + 2] * (1 - alpha)
    }
    ctx.putImageData(imageData, 0, 0)
  }
  
  return (
    <div className="container">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              const img = new Image()
              img.src = e.target.result
              img.onload = () => setTargetImage(img)
            }
            reader.readAsDataURL(file)
          }
        }}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={morphAmount * 100}
        onChange={(e) => {
          setMorphAmount(e.target.value / 100)
          renderMorph()
        }}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={opacity * 100}
        onChange={(e) => {
          setOpacity(e.target.value / 100)
          renderMorph()
        }}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={excludedFeatures.eyes}
            onChange={(e) => {
              setExcludedFeatures({ ...excludedFeatures, eyes: e.target.checked })
              renderMorph()
            }}
          />
          Exclude Eyes
        </label>
        <label>
          <input
            type="checkbox"
            checked={excludedFeatures.ears}
            onChange={(e) => {
              setExcludedFeatures({ ...excludedFeatures, ears: e.target.checked })
              renderMorph()
            }}
          />
          Exclude Ears
        </label>
      </div>
      <div>
        <label>
          Crop X:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crop.x}
            onChange={(e) => {
              setCrop({ ...crop, x: parseFloat(e.target.value) })
              renderMorph()
            }}
          />
        </label>
        <label>
          Crop Y:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crop.y}
            onChange={(e) => {
              setCrop({ ...crop, y: parseFloat(e.target.value) })
              renderMorph()
            }}
          />
        </label>
        <label>
          Crop Width:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crop.width}
            onChange={(e) => {
              setCrop({ ...crop, width: parseFloat(e.target.value) })
              renderMorph()
            }}
          />
        </label>
        <label>
          Crop Height:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crop.height}
            onChange={(e) => {
              setCrop({ ...crop, height: parseFloat(e.target.value) })
              renderMorph()
            }}
          />
        </label>
      </div>
      <div>
        <label>
          Curve Factor:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            value={curveFactor}
            onChange={(e) => {
              setCurveFactor(parseFloat(e.target.value))
              renderMorph()
            }}
          />
        </label>
      </div>
      <canvas ref={canvasRef} />
    </div>
  )
}
