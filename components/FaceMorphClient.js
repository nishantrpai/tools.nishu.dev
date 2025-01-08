import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@mediapipe/face_mesh'
import Delaunator from 'delaunator'

export default function FaceMorph() {
  const [targetImage, setTargetImage] = useState(null)
  const [jackFace, setJackFace] = useState(null)
  const [model, setModel] = useState(null)
  const [morphAmount, setMorphAmount] = useState(0.1)
  const [opacity, setOpacity] = useState(1)
  const [excludedFeatures, setExcludedFeatures] = useState({
    eyes: false,
    ears: false,
  })
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 1, height: 1 })
  const [curveFactor, setCurveFactor] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const loadModel = async () => {
      try {
        setLoading(true)
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
        
        if (mounted) {
          setModel(faceMesh)
          
          // Load Jack's image
          const jackImg = new Image()
          jackImg.crossOrigin = "anonymous"
          jackImg.src = '/jackbutcher.jpeg'
          jackImg.onload = () => {
            if (mounted) {
              setJackFace(jackImg)
              setImageLoaded(true)
            }
          }
        }
      } catch (error) {
        console.error('Model loading error:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    
    loadModel()
    
    return () => {
      mounted = false
      model?.close()
    }
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
    if (!model || !targetImage || !jackFace || !canvasRef.current || !imageLoaded) {
      console.log('Missing requirements:', {model, targetImage, jackFace, canvas: canvasRef.current, imageLoaded})
      return
    }

    try {
      setLoading(true)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = targetImage.width
      canvas.height = targetImage.height

      const jackLandmarks = await getLandmarks(jackFace)
      console.log(jackLandmarks)
      const targetLandmarks = await getLandmarks(targetImage)
      console.log(targetLandmarks)

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
          x: (p.x + offsetX * targetImage.width) * canvas.width,
          y: (p.y + offsetY * targetImage.height) * canvas.height,
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
    } catch (error) {
      console.error('Render error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = e.target.result
        img.onload = () => {
          setTargetImage(img)
          setImageLoaded(true)
          setLoading(false)
          renderMorph()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container">
      {loading && <div className="loading">Processing...</div>}
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} 
        style={{
          border: '1px solid #333', 
          borderRadius: 10,
          opacity: loading ? 0.5 : 1
        }} 
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <label>
          Select File
        </label>
        <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={loading}
      />
        {/* <input
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
        /> */}
        <label>
          Morph Amount: {morphAmount}
        </label>
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
        <label>
          Opacity: {opacity}
        </label>
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

        <button onClick={() => {
          const canvas = canvasRef.current
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `sensei-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
      </div>
      <style jsx>{`
        .container {
          position: relative;
        }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 10px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
