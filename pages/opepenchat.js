import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import html2canvas from 'html2canvas'

export default function OpepenChat() {
  const RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth-pokt.nodies.app',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }
  const [collectionAddress, setCollectionAddress] = useState('0x6339e5e072086621540d0362c4e3cea0d643e114')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('1')
  const [opepen, setOpepen] = useState('')
  const [title, setTitle] = useState('')
  const canvasRef = useRef(null)

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
      return '';
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    if (opepen) {
      const image = new Image();
      image.crossOrigin = 'anonymous'
      image.src = opepen;
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const scaleX = canvas.width / image.width;
        const scaleY = canvas.height / image.height;
        const scale = Math.max(scaleX, scaleY);
        const x = (canvas.width / 2) - (image.width / 2) * scale;
        const y = 0;
        context.drawImage(image, x, y, image.width * scale, image.height * scale);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.closePath();
      }
    }
  }, [opepen]);

  const downloadImage = () => {
    const opepenCover = document.getElementById('opepen-cover');
    html2canvas(opepenCover, {
      allowTaint: true,
      backgroundColor: null,
      useCORS: true,
    }).then(canvas => {
      let img = canvas.toDataURL('image/png');
      let a = document.createElement('a');
      a.href = img;
      a.download = 'profile.png';
      a.click();
    }).catch(err => {
      console.error('Error capturing div:', err);
    });
  }

  return (
    <>
      <Head>
        <title>Opepen Chat</title>
        <meta name="description" content="Opepen Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Opepen Chat
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Create cover for twitter spaces
        </span>

        <div style={{
          width: '1024px',
          height: '700px',
          position: 'relative',
          backgroundColor: '#000',
        }} id="opepen-cover">
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: '#fff',
            opacity: 0.95,
            padding: '10px',
            fontFamily: 'opepen',
            fontSize: '2em',
            whiteSpace: 'pre',
          }}>
            Opepen Chat
            {/* add hosts */}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: '20px' }}>
              <div style={{ position: 'relative' }}>
                <img src="/opepen_hosts/boredopepen.jpg" style={{ width: 100, height: 100, borderRadius: 50, border: '1px solid #333' }} />
                {/* add a green circle for online */}
                <div style={{ width: 15, height: 15, backgroundColor: 'green', borderRadius: 100, position: 'absolute', bottom: 0, right: 15 }}></div>
              </div>
              <div style={{ position: 'relative' }}>
                <img src="/opepen_hosts/akin.jpg" style={{ width: 100, height: 100, borderRadius: 50, border: '1px solid #333' }} />
                {/* add a green circle for online */}
                <div style={{ width: 15, height: 15, backgroundColor: 'green', borderRadius: 100, position: 'absolute', bottom: 0, right: 15 }}></div>
              </div>
              <div style={{ position: 'relative' }}>
                <img src="/opepen_hosts/ljw.jpg" style={{ width: 100, height: 100, borderRadius: 50, border: '1px solid #333' }} />
                {/* add a green circle for online */}
                <div style={{ width: 15, height: 15, backgroundColor: 'green', borderRadius: 100, position: 'absolute', bottom: 0, right: 15 }}></div>
              </div>

            </div>

          </span>

          <span style={{
            position: 'absolute',
            top: 200,
            left: 0,
            color: '#fff',
            padding: '10px',
            fontFamily: 'opepen',
            fontSize: '7em',
            whiteSpace: 'pre',
          }}>
            {title}
          </span>
          <canvas ref={canvasRef} id="canvas" width={1024} height={700} style={{ border: '1px solid #111' }}></canvas>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', marginTop: '20px', width: '100%' }}>
          <textarea placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{
            backgroundColor: '#000',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: 10,
            padding: '10px',
            font: '16px',
            width: '100%', height: '200px'
          }}></textarea>
          <input type="text"
            placeholder="Token ID" value={token1} onChange={(e) => setToken1(e.target.value)} style={{
              backgroundColor: '#000',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: 10,
              padding: '10px',
              font: '16px',
              width: '100%'
            }} />
          <input type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => {
                setOpepen(img.src)
              }
            }
            reader.readAsDataURL(file)
          }} />
          <button onClick={() => {
            getNFTData(collectionAddress, token1).then((data) => {
              if (!data) return;
              setOpepen(data.image);
            });
          }} style={{
            width: '100%',
            padding: '10px',
          }}>Change Background</button>
          <button onClick={downloadImage} style={{
            width: '100%',
            padding: '10px',
          }}>
            Download
          </button>
        </div>
      </main>
    </>
  )
}
