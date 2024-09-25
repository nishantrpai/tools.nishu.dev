// generate mobile wallpaper from scapes, should have preview

import Head from 'next/head';
import { ethers } from 'ethers';
import styles from '@/styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function ScapeWallpaper() {
  const [bg, setBg] = useState('');
  const [scapesId, setScapesId] = useState(1);
  const scapesContract = "0xb7def63a9040ad5dc431aff79045617922f4023a";
  const [chain, setChain] = useState('ETHEREUM');
  const [position, setPosition] = useState({ x: 0 });
  const canvasRef = useRef(null);
  const previewRef = useRef(null);

  const MOBILE_RESOLUTION = { width: 1080, height: 1920 }; // Standard mobile wallpaper resolution
  const VIEW_WIDTH = 500; // Width of the preview container

  const RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://rpc.eth.gateway.fm',
      'chainId': 1,
      'network': 'mainnet',
    }
  };

  const changeSVG2PNG = async (svg) => {
    return new Promise((resolve, reject) => {
      if (!svg.startsWith('data:image/svg+xml')) resolve(svg);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2;  // Double the size for higher quality
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);  // Scale up to use the larger canvas
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        resolve(png);
      };
      img.src = svg;
    });
  };

  const getNFTData = async (collection_address, id) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc);
      const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider);
      const tokenURI = await contract.tokenURI(id);
      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]));
        if (metadata.image) {
          metadata.image = await changeSVG2PNG(metadata.image);
        }
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`;
        }
        return metadata;
      } else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`;
        }
        return metadata;
      } else {
        const ipfsHash = tokenURI.split('ipfs://')[1];
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        const response = await fetch(ipfsUrl);
        const metadata = await response.json();
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`;
        }
        return metadata;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!scapesId) return;
      const scape = await getNFTData(scapesContract, scapesId);
      setBg(scape.image);
    }
    fetchData();
  }, [scapesId]);

  useEffect(() => {
    if (bg) {
      updateCanvas();
    }
  }, [bg, position]);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = bg;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleFactor = canvas.height / img.height;
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = canvas.height;
      const x = (canvas.width - scaledWidth) / 2 + position.x;
      
      // Use a temporary canvas for high-quality scaling
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = scaledWidth;
      tempCanvas.height = scaledHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      
      ctx.drawImage(tempCanvas, x, 0);
    };
  };

  const downloadImage = () => {
    html2canvas(previewRef.current, {
      backgroundColor: null,
      scale: 2,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'scape-wallpaper.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <>
      <Head>
        <title>Scape Wallpaper</title>
        <meta name="description" content="Create mobile wallpaper from scape NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Scape Wallpaper</h1>
        <h2 className={styles.description}>Create mobile wallpaper from scape NFT</h2>
        <div>
          <label htmlFor="scapesId">Scapes ID:</label>
          <input
            type="number"
            id="scapesId"
            value={scapesId}
            onChange={(e) => setScapesId(e.target.value)}
            style={{
              width: '100px',
              height: '30px',
              fontSize: '16px',
              padding: '5px',
              margin: '10px',
              border: '1px solid #333',
              borderRadius: '5px',
            }}
          />
        </div>
        <div>
          <label htmlFor="positionX">X Position:</label>
          <input
            type="range"
            min="-5000"
            max="5000"
            id="positionX"
            value={position.x}
            onChange={(e) => setPosition({...position, x: parseInt(e.target.value)})}
          />
        </div>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          border: '1px solid #333',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
        <div 
          ref={previewRef}
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%',
            aspectRatio: '9 / 16',
            margin: '0 auto',
            overflow: 'hidden'
          }}
        >
          <canvas 
            ref={canvasRef} 
            width={VIEW_WIDTH * 2}  // Double the size for higher quality
            height={VIEW_WIDTH * 2 * (MOBILE_RESOLUTION.height / MOBILE_RESOLUTION.width)}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        </div>
        <button onClick={downloadImage}>Download Wallpaper</button>
      </main>
    </>
  );
}