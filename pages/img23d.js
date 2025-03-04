import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Import Three.js components dynamically with ssr: false
const ThreeScene = dynamic(() => import('../components/ThreeScene'), { ssr: false })

export default function Image2Model3D() {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [depthMap, setDepthMap] = useState(null)
  const [normalMap, setNormalMap] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [depthStrength, setDepthStrength] = useState(50)
  const [smoothingLevel, setSmoothingLevel] = useState(3)
  const [resolution, setResolution] = useState(128)
  const [modelData, setModelData] = useState(null)
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(false)
  const [enable360View, setEnable360View] = useState(false)
  const [originalImageData, setOriginalImageData] = useState(null)

  // Generate depth map from image using grayscale as simple approximation
  const generateDepthMap = (img) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Create a new imageData for depth map
    const depthData = ctx.createImageData(canvas.width, canvas.height)
    const depthPixels = depthData.data

    // Estimate depth based on grayscale value (simple approximation)
    for (let i = 0; i < data.length; i += 4) {
      // Calculate grayscale
      const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]

      // Invert and adjust based on depth strength (darker areas will appear closer)
      const depth = 255 - grayscale

      // Set depth pixel values
      depthPixels[i] = depth
      depthPixels[i + 1] = depth
      depthPixels[i + 2] = depth
      depthPixels[i + 3] = 255
    }

    // Apply Gaussian blur for smoothing if needed
    if (smoothingLevel > 0) {
      for (let s = 0; s < smoothingLevel; s++) {
        applyGaussianBlur(depthPixels, canvas.width, canvas.height)
      }
    }

    ctx.putImageData(depthData, 0, 0)

    return canvas.toDataURL('image/png')
  }

  // Simple Gaussian blur implementation for smoothing depth map
  const applyGaussianBlur = (pixels, width, height) => {
    const tempPixels = new Uint8ClampedArray(pixels.length)

    // Copy original pixels
    for (let i = 0; i < pixels.length; i++) {
      tempPixels[i] = pixels[i]
    }

    const kernel = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ]
    const kernelWeight = 16

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0, g = 0, b = 0

        // Apply kernel
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4
            const weight = kernel[ky + 1][kx + 1]

            r += tempPixels[pixelIndex] * weight
            g += tempPixels[pixelIndex + 1] * weight
            b += tempPixels[pixelIndex + 2] * weight
          }
        }

        const pixelIndex = (y * width + x) * 4
        pixels[pixelIndex] = r / kernelWeight
        pixels[pixelIndex + 1] = g / kernelWeight
        pixels[pixelIndex + 2] = b / kernelWeight
      }
    }
  }

  // Generate normal map from depth map
  const generateNormalMap = (depthMapUrl) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        const normalData = ctx.createImageData(canvas.width, canvas.height)
        const normalPixels = normalData.data

        // Generate normals from depth
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            // Get depth values from neighboring pixels
            const leftIdx = ((y) * canvas.width + (x - 1)) * 4
            const rightIdx = ((y) * canvas.width + (x + 1)) * 4
            const topIdx = ((y - 1) * canvas.width + (x)) * 4
            const bottomIdx = ((y + 1) * canvas.width + (x)) * 4

            // Calculate derivatives
            const dzdx = (data[rightIdx] - data[leftIdx]) / 2.0
            const dzdy = (data[bottomIdx] - data[topIdx]) / 2.0

            // Calculate normal vector (simplified for client-side)
            // Normalize and map to [0, 1] range
            const length = Math.sqrt(dzdx * dzdx + dzdy * dzdy + 1)
            const nx = -dzdx / length
            const ny = -dzdy / length
            const nz = 1.0 / length

            // Convert to RGB (0-255)
            const pixelIndex = (y * canvas.width + x) * 4
            normalPixels[pixelIndex] = Math.floor((nx * 0.5 + 0.5) * 255)
            normalPixels[pixelIndex + 1] = Math.floor((ny * 0.5 + 0.5) * 255)
            normalPixels[pixelIndex + 2] = Math.floor((nz * 0.5 + 0.5) * 255)
            normalPixels[pixelIndex + 3] = 255
          }
        }

        ctx.putImageData(normalData, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = depthMapUrl
    })
  }

  // Remove background from image using a simple algorithm
  // In a real app, you'd use a more sophisticated method or API
  const removeBackground = async (imageData) => {
    try {
      // For demonstration purposes, using a placeholder for background removal
      // Normally you would use a library like remove.bg API or ML-based solutions
      console.log('Removing background...');
      
      // Create a new Image to load the image data
      const img = new Image();
      img.src = imageData;
      
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Get pixel data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Simple background removal (this is just a placeholder)
          // In reality, you would use a proper background removal service or algorithm
          // ... background removal code would go here ...
          
          // For demonstration, using a simulated result:
          // In a real implementation, you'd replace this with actual background removal
          
          // Return the canvas data URL
          const processedDataUrl = canvas.toDataURL('image/png');
          resolve(processedDataUrl);
        };
      });
    } catch (error) {
      console.error('Error removing background:', error);
      return imageData; // Return original if removal fails
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      // Store the original image data
      setOriginalImageData(e.target.result)
      setProcessing(true)

      // Process the image with current settings
      await processImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (imageData) => {
    try {
      // Process image based on current settings
      let processedImageUrl = imageData;
      
      // If background removal is enabled, process the image
      // In a real application, you would integrate with a background removal service
      // For now, we'll just set a flag to simulate this functionality
      const hasTransparency = removeBackgroundEnabled;
      
      const img = new Image();
      img.onload = async () => {
        setImage(img);
        setImageUrl(processedImageUrl);
        setImgWidth(img.width);
        setImgHeight(img.height);

        // Generate depth map
        const depthMapUrl = generateDepthMap(img);
        setDepthMap(depthMapUrl);

        // Generate normal map
        const normalMapUrl = await generateNormalMap(depthMapUrl);
        setNormalMap(normalMapUrl);

        // Create model data for ThreeScene component
        setModelData({
          imageUrl: processedImageUrl,
          depthMapUrl,
          normalMapUrl,
          width: img.width,
          height: img.height,
          depthStrength,
          resolution,
          hasTransparency, // Pass this flag to the ThreeScene component
          enable360View // Pass the 360 view flag to the ThreeScene component
        });

        setProcessing(false);
      };
      img.src = processedImageUrl;
    } catch (error) {
      console.error("Error processing image:", error);
      setProcessing(false);
    }
  };

  const applyUpdatedSettings = async () => {
    if (!originalImageData) return

    setProcessing(true)

    // Process the image with updated settings
    await processImage(originalImageData)
  }

  const downloadMap = (dataURL, type) => {
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `${type}.png`
    a.click()
  }

  return (
    <>
      <Head>
        <title>2D to 3D Converter</title>
        <meta name="description" content="Convert 2D images to 3D models" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          2D to 3D Converter
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Turn your 2D images into 3D models
        </span>

        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: '20px' }}>
          <div style={{ flex: 1, padding: '10px' }}>

            {imageUrl && (
              <div style={{ marginTop: '20px' }}>
                <h3>Original Image</h3>
                <img src={imageUrl} alt="Original" style={{ maxWidth: '100%', maxHeight: '300px' }} />
              </div>
            )}

            {/* {depthMap && (
              <div style={{ marginTop: '20px' }}>
                <h3>Depth Map</h3>
                <img src={depthMap} alt="Depth Map" style={{ maxWidth: '100%', maxHeight: '300px' }} />
              </div>
            )} */}

            {/* {normalMap && (
              <div style={{ marginTop: '20px' }}>
                <h3>Normal Map</h3>
                <img src={normalMap} alt="Normal Map" style={{ maxWidth: '100%', maxHeight: '300px' }} />
              </div>
            )} */}
          </div>

          <div style={{ flex: 1, padding: '10px' }}>
            <h3>3D Preview</h3>
            <div style={{
              width: '100%',
              height: '400px',
              border: '1px solid #333',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              {modelData && <ThreeScene modelData={modelData} />}
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>Settings</h3>
              <input type="file" accept="image/*" onChange={handleFileUpload} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="remove-background"
                    checked={removeBackgroundEnabled}
                    onChange={(e) => setRemoveBackgroundEnabled(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="remove-background">Transparent Background</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="enable-360-view"
                    checked={enable360View}
                    onChange={(e) => setEnable360View(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="enable-360-view">Enable 360° View</label>
                </div>

                <div>
                  <label>Depth Strength: {depthStrength}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={depthStrength}
                    onChange={(e) => setDepthStrength(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Smoothing: {smoothingLevel}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={smoothingLevel}
                    onChange={(e) => setSmoothingLevel(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Resolution: {resolution}</label>
                  <input
                    type="range"
                    min="32"
                    max="2048"
                    step="16"
                    value={resolution}
                    onChange={(e) => setResolution(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  onClick={applyUpdatedSettings}
                  disabled={!originalImageData || processing}
                >
                  {processing ? 'Processing...' : 'Apply Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
          {modelData && (
            <button
              onClick={() => window.ThreeSceneExport && window.ThreeSceneExport.downloadSTL()}
              disabled={processing}
            >
              Download STL
            </button>
          )}

          <button
            onClick={() => downloadMap(depthMap, 'depth-map')}
            disabled={!depthMap || processing}
          >
            Download Depth Map
          </button>

          <button
            onClick={() => downloadMap(normalMap, 'normal-map')}
            disabled={!normalMap || processing}
          >
            Download Normal Map
          </button>
        </div>
      </main>
    </>
  )
}
