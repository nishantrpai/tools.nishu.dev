import Head from 'next/head'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import styles from '@/styles/Home.module.css'
import { analytics } from '@/utils/analytics'


export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://ethereum-rpc.publicnode.com',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }

  const [imageToBlend, setImageToBlend] = useState(null)
  const [chain, setChain] = useState('ETHEREUM')
  const [status, setStatus] = useState('')
  const [imageOffsetX, setImageOffsetX] = useState(0)
  const [imageOffsetY, setImageOffsetY] = useState(0)
  const [imageScale, setImageScale] = useState(1)
  const [blendMode, setBlendMode] = useState('source-over')
  const [invertBase, setInvertBase] = useState(false)
  
  // Generate 8pepen SVG
  const generate8pepenSVG = () => {
    const bg = invertBase ? "#FFFFFF" : "#000000";
    const fg = invertBase ? "#000000" : "#FFFFFF";
    
    // Create pattern definition
    const pattern = `
      <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100" height="100" fill="${fg}"/>
        </pattern>
      </defs>
    `;
    
    // Complete SVG with pattern applied to all rectangles
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" xml:space="preserve" style="background:${bg}">
        ${pattern}
        <g fill="url(#pattern)">
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 350)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 350)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 350)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 450)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 450)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 450)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 450)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 550)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 550)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 550)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 550)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 750)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 750)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 750)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 750)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(450 250)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(350 250)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(250 250)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 350)"/>
          <rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" transform="translate(550 250)"/>
        </g>
      </svg>
    `;
    
    // Convert SVG to data URL
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
  };

  const changeSVG2PNG = async (svg) => {
    return new Promise((resolve, reject) => {
      if (!svg.startsWith('data:image/svg+xml')) resolve(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = svg
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const png = canvas.toDataURL('image/png')
        resolve(png)
      }
    })
  }

  const getImgFromURL = async (url) => {
    return new Promise(async (resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        resolve(img)
      }

      // handle for ipfs
      if (url.startsWith('ipfs://')) {
        url = `https://ipfs.io/ipfs/${url.split('ipfs://')[1]}`
      }

      url = await changeSVG2PNG(url)
      img.src = url
    })
  }

  const getNFTData = async (collection_address, id) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider)
      const tokenURI = await contract.tokenURI(id)
      // if tokenURI is a url, fetch the metadata, if it is ipfs replace with ipfs.io
      // if token uri is data:// json parse it
      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))

        // if tokenuri image starts with ipfs, replace with ipfs.io
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`
        }
        return metadata
      }
      else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI)
        const metadata = await response.json()
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`
        }

        return metadata
      } else {
        const ipfsHash = tokenURI.split('ipfs://')[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        const response = await fetch(ipfsUrl)
        const metadata = await response.json()
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`
        }
        return metadata
      }
    } catch (e) {
      console.log(e)
    }
  }

  const blendUpdateCanvas = (overlayImage) => {
    if (!overlayImage) return;

    // Generate the current 8pepen SVG based on invert state
    const baseImageSvg = generate8pepenSVG();
    
    getImgFromURL(baseImageSvg).then(img1 => {
      getImgFromURL(overlayImage).then(img2 => {
        setStatus('loading images...')
        if (img1 && img2) {
          const canvas = document.getElementById('canvas');
          const ctx = canvas.getContext('2d');

          // Clear canvas
          ctx.beginPath();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw base image (8pepen SVG)
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

          // Draw overlay image with blend mode
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = blendMode;
          ctx.drawImage(img2, imageOffsetX, imageOffsetY, img2.width * imageScale, img2.height * imageScale);

          setStatus('');
          ctx.globalCompositeOperation = 'source-over';
          ctx.closePath();
        }
      });
    })
  }

  useEffect(() => {
    if (imageToBlend) {
      blendUpdateCanvas(imageToBlend);
    }
  }, [imageToBlend, invertBase]);

  useEffect(() => {
    if (imageToBlend) {
      setStatus('blending...');
      blendUpdateCanvas(imageToBlend);
    }
  }, [imageOffsetX, imageOffsetY, imageScale, blendMode, invertBase]);

  return (
    <>
      <Head>
        <title>8pepen Blender</title>
        <meta name="description" content="8pepen image blender" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          8pepen Blender
        </h1>
        <h2 className={styles.description}>
          Merge 8pepen and Images
        </h2>
        <canvas id="canvas" width="1500" height="1500"
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20,
            width: '100%',
            maxWidth: '1500px'
          }}
        ></canvas>
        <div style={{ margin: 0, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 20, width: '50%' }}>
          <label>
            Select Image to Blend
          </label>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedImage(file);
              setImageToBlend(URL.createObjectURL(file));
            }
          }} style={{
            border: '1px solid #333', width: '100%', fontSize: 16, borderRadius: 10, padding: 5
          }} />
          <label>
            Blend Mode:
            <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)}>
              <option value="source-over">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="hue">Hue</option>
              <option value="saturation">Saturation</option>
              <option value="color">Color</option>
              <option value="luminosity">Luminosity</option>
            </select>
          </label>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10
          }}>
            <input
              type="checkbox"
              id="invertBase"
              checked={invertBase}
              onChange={(e) => setInvertBase(e.target.checked)}
            />
            <label htmlFor="invertBase">Invert (White background, Black foreground)</label>
          </div>

          <div style={{
            display: 'flex', gap: 20, margin: 'auto', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'
          }}>
            <label>
              Image Offset X
            </label>
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              <input type="range" min={-1000} max={1000} step={0.01} value={imageOffsetX} onChange={(e) => setImageOffsetX(e.target.value)} />
              <input type='number' value={imageOffsetX} onChange={(e) => setImageOffsetX(e.target.value)} style={{
                border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
              }} />
            </div>

            <label>
              Image Offset Y
            </label>
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              <input type="range" min="-500" max="500" value={imageOffsetY} onChange={(e) => setImageOffsetY(e.target.value)} />
              <input type='number' value={imageOffsetY} onChange={(e) => setImageOffsetY(e.target.value)} style={{
                border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
              }} />
            </div>

            <label>
              Image Scale
            </label>
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              <input type="range" min="0" max="2" step="0.01" value={imageScale} onChange={(e) => setImageScale(e.target.value)} />
              <input type='number' value={imageScale} onChange={(e) => setImageScale(e.target.value)} style={{
                border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
              }} />
            </div>
          </div>
          <span style={{
            height: 10,
            fontFamily: 'monospace',
            color: '#eee'
          }}>{status}</span>
        </div>

        <button onClick={() => {
          analytics({
            event: 'download',
            metadata: {
              type: 'image',
              name: '8pepen-blend'
            }
          })
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = '8pepen-blend.png'
          a.click()
        }}>
          Download Image
        </button>
      </main>
    </>
  )
}