import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

export default function Liquify() {


  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth-pokt.nodies.app',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    },
    'BASE': {
      'rpc': 'https://base.llamarpc.com',
      'chainId': 8453,
      'network': 'mainnet',
    }
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


  const [img, setImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle')
  const [brushSize, setBrushSize] = useState(50)
  const [isWarping, setIsWarping] = useState(false)
  const [chain, setChain] = useState('ETHEREUM') // Added chain state
  const [contractAddress, setContractAddress] = useState('') // Added contract address state
  const [tokenId, setTokenId] = useState('') // Added token ID state
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const cursorCanvasRef = useRef(null)
  const lastPositionRef = useRef(null)
  const originalImageRef = useRef(null)

  

  useEffect(() => {
    if (img) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        if (image.width < 500 || image.height < 500) {
          canvas.width = 500
          canvas.height = 500
          ctx.drawImage(image, 0, 0, 500, 500)
        } else {
          canvas.width = image.width
          canvas.height = image.height
          ctx.drawImage(image, 0, 0)
        }
        contextRef.current = ctx

        // Store the original image for reset functionality
        originalImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Set up cursor canvas
        const cursorCanvas = cursorCanvasRef.current
        cursorCanvas.width = canvas.width
        cursorCanvas.height = canvas.height
      }
      getNFTData(contractAddress, tokenId).then((metadata) => {
        if (metadata.image) {
          image.src = metadata.image
        } else {
          console.error(`Image not found in metadata.`);
        }
      })
    }
  }, [img, contractAddress, tokenId])

  useEffect(() => {
    if (contractAddress && tokenId) {
      setLoading(true)
      getNFTData(contractAddress, tokenId).then((metadata) => {
        if (metadata.image) {
          setImg(metadata.image)
          setStatus('image fetched')
          setLoading(false)
        } else {
          console.error(`Image not found in metadata.`);
          setLoading(false);
        }
      })
    }
  }, [contractAddress, tokenId])

  const startWarping = (e) => {
    setIsWarping(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    lastPositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    warp(e)
  }

  const stopWarping = () => {
    setIsWarping(false)
    lastPositionRef.current = null
  }

  const warp = (e) => {
    if (!isWarping) return;
  
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    const ctx = contextRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
  
    for (let py = 0; py < canvas.height  + brushSize; py++) {
      for (let px = 0; px < canvas.width + (2 * brushSize); px++) {
        const dx = px - x;
        const dy = py - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < brushSize) {
          const amount = (brushSize - distance) / brushSize;
          const angle = Math.atan2(dy, dx);
          const ax = Math.cos(angle) * amount * brushSize;
          const ay = Math.sin(angle) * amount * brushSize;
  
          const sx = Math.round(px + ax);
          const sy = Math.round(py + ay);
  
          if (sx >= 0 && sx < canvas.width && sy >= 0 && sy < canvas.height) {
            const sourceIndex = (sy * canvas.width + sx) * 4;
            const targetIndex = (py * canvas.width + px) * 4;
  
            if (targetIndex >= 0 && targetIndex < pixels.length && sourceIndex >= 0 && sourceIndex < pixels.length) {
              pixels[targetIndex] = pixels[sourceIndex];
              pixels[targetIndex + 1] = pixels[sourceIndex + 1];
              pixels[targetIndex + 2] = pixels[sourceIndex + 2];
              pixels[targetIndex + 3] = pixels[sourceIndex + 3];
            }
          }
        }
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
    lastPositionRef.current = { x, y };
  };
  
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const cursorCanvas = cursorCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    const ctx = cursorCanvas.getContext('2d');
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2 - 1, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  
    if (isWarping) {
      warp(e);
    }
  };
  
  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setImg(URL.createObjectURL(blob))
        setStatus('image pasted')
        break;
      }
    }
  }

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const resetImage = () => {
    if (originalImageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.putImageData(originalImageRef.current, 0, 0)
      setStatus('image reset')
    }
  }

  return (
    <>
      <Head>
        <title>Liquify Tool</title>
        <meta name="description" content="Liquify your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Liquify Tool
        </h1>
        <h2 className={styles.description}>
          Click and drag on the image to warp it
        </h2>
        <div style={{ position: 'relative' }}>
          <canvas 
            ref={canvasRef}
            onMouseDown={startWarping}
            onMouseUp={stopWarping}
            onMouseOut={stopWarping}
            onMouseMove={handleMouseMove}
            style={{  border: '1px solid #333', borderRadius: 10, cursor: 'none', minWidth: 500 }}
          />
          <canvas 
            ref={cursorCanvasRef}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
        </div>
        <div>
          <label htmlFor="brushSize">Warp Size: </label>
          <input 
            type="range" 
            id="brushSize" 
            min="10" 
            max="500" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <span>{brushSize}px</span>
        </div>
        <span>
          {loading ? (
            <>
              Processing... Status: {status}
            </>
          ) : `Upload image or paste from clipboard (Status: ${status})`}
        </span>
        
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0]
            setImg(URL.createObjectURL(file))
            setStatus('image uploaded')
          }}
        />
        <button
          onClick={() => {
            const canvas = canvasRef.current
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'liquify.png'
            a.click()
            setStatus('image downloaded')
          }}
        >
          Download
        </button>
        <button onClick={resetImage}>
          Reset
        </button>
        <div>
          <label htmlFor="chain">Select Chain: </label>
          <select 
            id="chain" 
            value={chain} 
            onChange={(e) => setChain(e.target.value)}
          >

            <option value="ETHEREUM">Mainnet</option>
            <option value="ZORA">Zora</option>
            <option value="BASE">Base</option>

          </select>
        </div>
        <div>
          <label htmlFor="contractAddress">Contract Address: </label>
          <input 
            type="text" 
            id="contractAddress" 
            value={contractAddress} 
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tokenId">Token ID: </label>
          <input 
            type="text" 
            id="tokenId" 
            value={tokenId} 
            onChange={(e) => setTokenId(e.target.value)}
          />
        </div>
      </main>
    </>
  )
}
