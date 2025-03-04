import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ethers } from 'ethers' // Add ethers for NFT data fetching

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
  const [originalImageData, setOriginalImageData] = useState(null)
  const [screenshotWidth, setScreenshotWidth] = useState(1920)
  const [screenshotHeight, setScreenshotHeight] = useState(1080)
  const [showLightingSettings, setShowLightingSettings] = useState(true)
  const [modelData, setModelData] = useState(null)

  // Use debounce to prevent too many updates
  const debounceTimeoutRef = useRef(null);

  // Group settings that require regenerating the depth map
  const [depthSettings, setDepthSettings] = useState({
    depthStrength: 50,
    smoothingLevel: 3,
    resolution: 128,
    enable360View: false,
    removeBackgroundEnabled: false,
    invertDepth: false  // Add the new invertDepth setting
  });

  // Create a separate state for lighting settings that can be updated without re-processing
  const [lightingSettings, setLightingSettings] = useState({
    ambientIntensity: 0.5,
    directionalIntensity: 1,
    position: {
      x: 1,
      y: 1,
      z: 1
    }
  });

  // Add NFT fetching functionality
  const [collectionAddress, setCollectionAddress] = useState('0x5537d90a4a2dc9d9b37bab49b490cf67d4c54e91')
  const [tokenId, setTokenId] = useState('2')
  const [chain, setChain] = useState('ETHEREUM')
  const [nftFetchError, setNftFetchError] = useState(null)
  const [nftFetchStatus, setNftFetchStatus] = useState('')

  // Define RPC endpoints for different chains
  const RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth-pokt.nodies.app',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 7777777,
      'network': 'mainnet',
    },
    'BASE': {
      'rpc': 'https://mainnet.base.org',
      'chainId': 8453,
      'network': 'mainnet',
    }
  }

  // Function to fetch NFT data
  const getNFTData = async (collection_address, id) => {
    setNftFetchStatus('Fetching NFT data...')
    setNftFetchError(null)
    
    try {
      // Validate inputs
      if (!collection_address || !id) {
        throw new Error('Collection address and token ID are required')
      }
      
      // Get provider for selected chain
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const contract = new ethers.Contract(
        collection_address, 
        ['function tokenURI(uint256) view returns (string)'], 
        provider
      )
      
      // Fetch token URI
      setNftFetchStatus('Fetching token URI...')
      const tokenURI = await contract.tokenURI(id)
      
      // Parse metadata based on URI type
      let metadata
      if (tokenURI.startsWith('data:')) {
        // Handle base64 encoded data URI
        setNftFetchStatus('Processing on-chain data...')
        metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
      }
      else if (tokenURI.startsWith('http')) {
        // Handle HTTP URL
        setNftFetchStatus('Fetching metadata from URL...')
        const response = await fetch(tokenURI)
        metadata = await response.json()
      } else {
        // Handle IPFS URI
        setNftFetchStatus('Fetching metadata from IPFS...')
        const ipfsHash = tokenURI.split('ipfs://')[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        const response = await fetch(ipfsUrl)
        metadata = await response.json()
      }
      
      if (!metadata.image) {
        throw new Error('No image found in NFT metadata')
      }
      
      // Process IPFS image URLs
      let imageUrl = metadata.image
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = `https://ipfs.io/ipfs/${imageUrl.split('ipfs://')[1]}`
      }
      
      setNftFetchStatus('Processing image...')
      
      // Handle SVG images
      if (imageUrl.startsWith('data:image/svg+xml')) {
        imageUrl = await convertSvgToPng(imageUrl)
      }
      
      setNftFetchStatus('')
      return imageUrl
      
    } catch (error) {
      setNftFetchError(error.message || 'Error fetching NFT data')
      setNftFetchStatus('')
      console.error('Error fetching NFT:', error)
      return null
    }
  }
  
  // Convert SVG to PNG
  const convertSvgToPng = (svgUrl) => {
    return new Promise(async (resolve, reject) => {
      if (!svgUrl.startsWith('data:image/svg+xml')) {
        resolve(svgUrl);
        return;
      }
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous"; // Ensure CORS is enabled
        
        img.onload = () => {
          try {

          
          canvas.width = img.width || 1000;
          canvas.height = img.height || 1000;
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          resolve(pngUrl);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = (e) => {
          reject(new Error('Failed to convert SVG to PNG'));
        };
        
        img.src = svgUrl;
      } catch (error) {
        reject(error);
      }
    });
  };

  // Function to load an image with proper CORS handling
  const loadImageWithCORS = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS
      
      img.onload = () => {
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        
        // Try with a CORS proxy as fallback for images that don't support CORS
        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        console.log("Attempting with CORS proxy:", corsProxyUrl);
        
        const proxyImg = new Image();
        proxyImg.crossOrigin = "anonymous";
        
        proxyImg.onload = () => {
          resolve(proxyImg);
        };
        
        proxyImg.onerror = () => {
          reject(new Error("Failed to load image, even with CORS proxy"));
        };
        
        proxyImg.src = corsProxyUrl;
      };
      
      img.src = url;
    });
  };

  // Process NFT image URL
  const processNftImageUrl = async (imageUrl) => {
    try {
      // Handle IPFS URLs
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = `https://ipfs.io/ipfs/${imageUrl.split('ipfs://')[1]}`;
      }
      
      // Handle SVG images
      if (imageUrl.startsWith('data:image/svg+xml')) {
        imageUrl = await convertSvgToPng(imageUrl);
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error processing NFT image URL:", error);
      throw error;
    }
  };

  // Handle NFT fetch button click
  const handleNftFetch = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      // Clear any previous errors
      setNftFetchError(null);
      
      // Get NFT metadata
      const imageUrl = await getNFTData(collectionAddress, tokenId);
      
      if (imageUrl) {
        // Process the image URL (handle IPFS, SVG, etc.)
        const processedUrl = await processNftImageUrl(imageUrl);
        
        // Store the URL for reference
        setOriginalImageData(processedUrl);
        
        // Load the image with CORS handling
        await processImageFromUrl(processedUrl);
      } else {
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error in NFT fetch handler:', error);
      setNftFetchError(error.message || 'Failed to fetch NFT');
      setProcessing(false);
    }
  };

  // Process image from URL with CORS handling
  const processImageFromUrl = async (imageUrl) => {
    try {
      // Load the image with CORS handling
      const img = await loadImageWithCORS(imageUrl);
      
      // Create a canvas to safely work with the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      // allow crossorigin anonymous

      ctx.drawImage(img, 0, 0);
      
      // Get a safe data URL that we can use without CORS issues
      const safeImageUrl = canvas.toDataURL('image/png');
      
      // Process the safe image URL
      await processImage(safeImageUrl);
      
    } catch (error) {
      console.error("Error processing image from URL:", error);
      setNftFetchError(`Error processing image: ${error.message}`);
      setProcessing(false);
    }
  };

  // Process image when first uploaded
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

  // Apply depth settings changes with debounce
  useEffect(() => {
    if (!originalImageData) return;

    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced processing
    debounceTimeoutRef.current = setTimeout(async () => {
      setProcessing(true);
      await processImage(originalImageData);
    }, 300); // 300ms debounce

    // Cleanup timeout when component unmounts or settings change again
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [depthSettings, originalImageData]);

  // Update lighting in real-time without re-processing the image
  useEffect(() => {
    if (!modelData) return;

    // Update lighting settings in the modelData
    setModelData(prevData => ({
      ...prevData,
      lighting: lightingSettings
    }));
  }, [lightingSettings]);

  // Handler for depth settings changes
  const handleDepthSettingChange = (setting, value) => {
    setDepthSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Handler for lighting settings changes
  const handleLightingChange = (setting, value) => {
    if (setting.includes('.')) {
      // Handle nested properties like 'position.x'
      const [parent, child] = setting.split('.');
      setLightingSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle top-level properties
      setLightingSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    }
  };

  const processImage = async (imageData) => {
    try {
      // Process image based on current settings
      let processedImageUrl = imageData;

      // If background removal is enabled, process the image
      // In a real application, you would integrate with a background removal service
      // For now, we'll just set a flag to simulate this functionality
      const hasTransparency = depthSettings.removeBackgroundEnabled;

      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS
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
          depthStrength: depthSettings.depthStrength,
          resolution: depthSettings.resolution,
          hasTransparency,
          enable360View: depthSettings.enable360View,
          invertDepth: depthSettings.invertDepth, // Pass the invertDepth setting to ThreeScene
          lighting: lightingSettings
        });

        setProcessing(false);
      };
      
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        setNftFetchError("Failed to load the image");
        setProcessing(false);
      };
      
      img.src = processedImageUrl;
    } catch (error) {
      console.error("Error processing image:", error);
      setProcessing(false);
    }
  };

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
      // If invertDepth is enabled, flip the depth calculation
      let depth;
      if (depthSettings.invertDepth) {
        depth = grayscale; // Non-inverted: lighter areas appear closer
      } else {
        depth = 256 - grayscale; // Default: darker areas appear closer
      }

      // Set depth pixel values
      depthPixels[i] = depth
      depthPixels[i + 1] = depth
      depthPixels[i + 2] = depth
      depthPixels[i + 3] = 255
    }

    // Apply Gaussian blur for smoothing if needed
    if (depthSettings.smoothingLevel > 0) {
      for (let s = 0; s < depthSettings.smoothingLevel; s++) {
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

  const downloadMap = (dataURL, type) => {
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `${type}.png`
    a.click()
  }

  // Function to take screenshot
  const takeScreenshot = () => {
    if (window.ThreeSceneExport && window.ThreeSceneExport.takeScreenshot) {
      window.ThreeSceneExport.takeScreenshot(screenshotWidth, screenshotHeight)
    }
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
                <img src={imageUrl} alt="Original" style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #333', borderRadius: 5 }} />
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  
                  {/* Image Upload */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Upload an image:</label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                  </div>
                  
                  <div style={{ textAlign: 'center', margin: '8px 0' }}>- OR -</div>
                  
                  {/* NFT Input Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Import from NFT:</label>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select 
                        value={chain}
                        onChange={(e) => setChain(e.target.value)}
                        style={{ 
                          flex: '1',
                          padding: '8px',
                          borderRadius: '4px',
                        }}
                      >
                        {Object.keys(RPC_CHAINS).map(chainName => (
                          <option key={chainName} value={chainName}>{chainName}</option>
                        ))}
                      </select>
                    </div>
                    
                    <input 
                      type="text"
                      placeholder="Collection Address (0x...)"
                      value={collectionAddress}
                      onChange={(e) => setCollectionAddress(e.target.value)}
                    />
                    
                    <input 
                      type="text"
                      placeholder="Token ID"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                    />
                    
                    <button 
                      onClick={handleNftFetch}
                    >
                      {nftFetchStatus || (processing ? 'Processing...' : 'Import NFT')}
                    </button>
                    
                    {nftFetchError && (
                      <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                        Error: {nftFetchError}
                      </div>
                    )}
                  </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="remove-background"
                    checked={depthSettings.removeBackgroundEnabled}
                    onChange={(e) => handleDepthSettingChange('removeBackgroundEnabled', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="remove-background">Transparent Background</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="enable-360-view"
                    checked={depthSettings.enable360View}
                    onChange={(e) => handleDepthSettingChange('enable360View', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="enable-360-view">Enable 360° View</label>
                </div>

                {/* Add the invert depth checkbox */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="invert-depth"
                    checked={depthSettings.invertDepth}
                    onChange={(e) => handleDepthSettingChange('invertDepth', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="invert-depth">Invert Depth (Inside Out)</label>
                </div>

                <div>
                  <label>Depth Strength: {depthSettings.depthStrength}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={depthSettings.depthStrength}
                    onChange={(e) => handleDepthSettingChange('depthStrength', parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Smoothing: {depthSettings.smoothingLevel}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={depthSettings.smoothingLevel}
                    onChange={(e) => handleDepthSettingChange('smoothingLevel', parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Resolution: {depthSettings.resolution}</label>
                  <input
                    type="range"
                    min="32"
                    max="2048"
                    step="16"
                    value={depthSettings.resolution}
                    onChange={(e) => handleDepthSettingChange('resolution', parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>


                {showLightingSettings && (
                  <div style={{
                    borderRadius: '5px',
                    marginTop: '5px'
                  }}>
                    <div>
                      <label>Ambient Light: {lightingSettings.ambientIntensity.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={lightingSettings.ambientIntensity}
                        onChange={(e) => handleLightingChange('ambientIntensity', parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <label>Directional Light: {lightingSettings.directionalIntensity.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={lightingSettings.directionalIntensity}
                        onChange={(e) => handleLightingChange('directionalIntensity', parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <label>Light Position:</label>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.8em' }}>X: {lightingSettings.position.x.toFixed(1)}</label>
                          <input
                            type="range"
                            min="-3"
                            max="3"
                            step="0.1"
                            value={lightingSettings.position.x}
                            onChange={(e) => handleLightingChange('position.x', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.8em' }}>Y: {lightingSettings.position.y.toFixed(1)}</label>
                          <input
                            type="range"
                            min="-3"
                            max="3"
                            step="0.1"
                            value={lightingSettings.position.y}
                            onChange={(e) => handleLightingChange('position.y', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.8em' }}>Z: {lightingSettings.position.z.toFixed(1)}</label>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={lightingSettings.position.z}
                            onChange={(e) => handleLightingChange('position.z', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}



                {/* Screenshot resolution settings */}
                {modelData && (
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
                    <h4>Screenshot Settings</h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label htmlFor="width-input">Width: </label>
                      <input
                        id="width-input"
                        type="number"
                        min="400"
                        max="4096"
                        value={screenshotWidth}
                        onChange={(e) => setScreenshotWidth(Math.max(400, parseInt(e.target.value) || 400))}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label htmlFor="height-input">Height: </label>
                      <input
                        id="height-input"
                        type="number"
                        min="400"
                        max="4096"
                        value={screenshotHeight}
                        onChange={(e) => setScreenshotHeight(Math.max(400, parseInt(e.target.value) || 400))}
                      />
                    </div>
                    <div style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
                      Higher resolution screenshots may take longer to generate
                    </div>
                    <button
                      onClick={takeScreenshot}
                      disabled={processing || !modelData}
                      style={{ marginTop: '10px' }}
                    >
                      Download Screenshot
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
          {modelData && (
            <>
              <button
                onClick={() => window.ThreeSceneExport && window.ThreeSceneExport.downloadSTL()}
                disabled={processing}
              >
                Download STL
              </button>
            </>
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
