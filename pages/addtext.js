import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'
import Draggable from 'react-draggable'
import html2canvas from 'html2canvas'

export default function AddText() {
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
      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
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
  const [chain, setChain] = useState('ETHEREUM')
  const [contractAddress, setContractAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [tokenId, setTokenId] = useState('1')
  const [text, setText] = useState('')
  const [textList, setTextList] = useState([])
  const selectedTextRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    getNFTData(contractAddress, tokenId).then((metadata) => {
      console.log('metadata', metadata)
      if (metadata.image) {
        setImg(metadata.image)
        setStatus('image fetched')
        setLoading(false)
      }
    })
  }, [contractAddress, tokenId])

  useEffect(() => {
    if (img) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        const aspectRatio = image.width / image.height;
        canvas.width = Math.max(500 * aspectRatio, 500); // Maintain aspect ratio
        canvas.height = 500; // Set min height
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = img;
    }
  }, [img]);

  const handleMouseDown = (e, index) => {
    selectedTextRef.current = index
  }

  const handleMouseMove = (e, ui) => {
    if (selectedTextRef.current !== null) {
      const newList = [...textList]
      newList[selectedTextRef.current].x = ui.x
      newList[selectedTextRef.current].y = ui.y
      setTextList(newList)
    }
  }

  const handleMouseUp = () => {
    selectedTextRef.current = null
  }

  const addText = () => {
    const newText = { text, x: 50, y: 50, size: 30, rotation: 0 }
    setTextList([...textList, newText])
    setText('')
  }

  const resetImage = () => {
    setTextList([])
    setStatus('image reset')
  }

  const downloadImage = async () => {
    const canvas = await html2canvas(document.getElementById('imageContainer'), {
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',  // set a background color to avoid transparency issues
    });
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'image_with_text.png';
    a.click();
    setStatus('image downloaded');
  }

  const editSelectedText = () => {
    if (selectedTextRef.current !== null) {
      const newTextList = [...textList];
      newTextList[selectedTextRef.current].text = text;
      setTextList(newTextList);
      setText('');
    }
  }

  return (
    <>
      <Head>
        <title>Add Text Tool</title>
        <meta name="description" content="Add text to your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Add Text Tool
        </h1>
        <h2 className={styles.description}>
          Click and drag on the image to move the text. Use the mouse wheel to scale and rotate the text.
        </h2>
        <div id="imageContainer" style={{ position: 'relative' }}>
          <canvas ref={canvasRef} style={{ maxWidth: '100%', minHeight: '500px', height: 'auto', border: '1px solid #333', borderRadius: 10, cursor: 'move' }} />
          {textList.map((item, index) => (
            <Draggable
              key={index}
              defaultPosition={{ x: item.x, y: item.y }}
              onDrag={(e, ui) => handleMouseMove(e, ui)}
              onStop={() => handleMouseUp()}
              onStart={(e) => handleMouseDown(e, index)}
            >
              <div style={{ position: 'absolute', top: item.y, left: item.x, transform: `rotate(${item.rotation}deg)` }}>
                <p style={{ fontSize: `${item.size}px`, color: 'white' }}>{item.text}</p>
              </div>
            </Draggable>
          ))}
        </div>

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0]
            setImg(URL.createObjectURL(file))
            setStatus('image uploaded')
          }}
        />
       
        <div>
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
          <input 
            type="text" 
            id="contractAddress" 
            value={contractAddress} 
            placeholder='Enter contract address'
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>

        <div>
          <input 
            type="text" 
            id="tokenId" 
            value={tokenId} 
            placeholder='Enter token ID'
            onChange={(e) => setTokenId(e.target.value)}
          />
        </div>

        <div>
          <input 
            type="text" 
            id="text" 
            value={text} 
            placeholder='Enter text'
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={addText}>Add Text</button>
          <button onClick={editSelectedText}>Edit Text</button>
        </div>

        <button onClick={downloadImage}>
          Download
        </button>

        <button onClick={resetImage}>
          Reset
        </button>
      </main>
    </>
  )
}
