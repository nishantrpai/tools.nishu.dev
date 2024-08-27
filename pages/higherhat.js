// add higher hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers';


export default function HigherHat() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.8)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)

  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://rpc.eth.gateway.fm',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    },
    'BASE': {
      'rpc': 'https://base.api.onfinality.io/public	',
      'chainId': 8453,
      'network': 'base',
    }
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


  const [chain, setChain] = useState('BASE');
  const [contract, setContract] = useState('0x307038E518CE52e62c4C8c662e6BA04719C9B219');
  const [tokenId, setTokenId] = useState(1);
  const [higherHat4, setHigherHat4] = useState(null)

  const higherHat = '/higherhat.png'
  const higherHat2 = '/higherhat2.png'
  const higherHat3 = '/higherhat3.png'
  const higherCrown = '/highercrown.png'

  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const hat = new Image()
      if (hatType === 0)
        hat.src = higherHat
      else if (hatType === 1)
        hat.src = higherHat2
      else if (hatType === 2)
        hat.src = higherHat3
      else if (hatType === 3)
        hat.src = higherCrown
      else if (hatType === 4)
        hat.src = higherHat4

      hat.crossOrigin = 'anonymous'

      hat.onload = () => {
        console.log('hat', hat)
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
        context.closePath()
      }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType, higherHat4])

  useEffect(() => {
    getNFTData(contract, tokenId).then(data => {
      // set image higherhat4 
      const img = new Image()
      img.src = data.image
      setHigherHat4(data.image)
      // img.onload = () => {
      //   setHigherHat4(img)
      // }
    })
  }, [chain, contract, tokenId])

  return (
    <>
      <Head>
        <title>Higher Hat</title>
        <meta name="description" content="Higher Hat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Hat
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add higher hat on any image
        </span>

        {/* upload photo */}
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(38)
              setOffsetY(60)
              setScale(0.8)
              setOffsetTheta(0)
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <div style={{ display: 'flex', gap: 20,             margin: '20px 0',
 }}>


          <canvas id="canvas" width="800" height="800" style={{
            border: '1px solid #333',
            borderRadius: 10,
            maxHeight: 500,
            height: 'auto',
            flexBasis: '95%'
          }}></canvas>

          <div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'space-between' }}>
              <div style={{
                width: 100,
                height: 100,
                border: hatType === 0 ? '2px solid #333' : '2px solid #111',
                borderRadius: 10,
                padding: 10
              }}>
                <img src={higherHat} alt="Higher Hat" style={{
                  height: 'auto', width: 70,
                  margin: 'auto',
                  marginTop: 20,
                }} onClick={() => setHatType(0)} />
              </div>
            </div>
            <div style={{
              width: 100,
              height: 100,
              border: hatType === 1 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={higherHat2} alt="Higher Hat 2" style={{
                width: '80%', height: 'auto',
                margin: 'auto',
                marginTop: 30,
                marginLeft: 10
              }} onClick={() => setHatType(1)} />
            </div>
            <div style={{
              width: 100,
              height: 100,
              border: hatType === 2 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={higherHat3} alt="Higher Hat 3" style={{
                width: 100, height: 'auto',
                marginTop: 20,
              }} onClick={() => setHatType(2)} />
            </div>
            <div style={{
              width: 100,
              height: 100,
              border: hatType === 3 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={higherCrown} alt="Higher Crown" style={{
                width: 100, height: 'auto',
                marginTop: 20,
              }} onClick={() => setHatType(3)} />
            </div>

            <div style={{
              width: 100,
              height: 100,
              border: hatType === 4 ? '2px solid #333' : '2px solid #111',
              borderRadius: 10
            }}>
              <img src={higherHat4} alt="Higher Hat 4" style={{
                width: 100, height: 'auto',
                marginTop: 20,
              }} onClick={() => { setHatType(4)
              setScale(0.25)
              }} />
              <input type="number" value={tokenId} onChange={(e) => {
                setTokenId(e.target.value)
              }} style={{
                width: 100,
                marginTop: 10,
                borderRadius: 5,
                backgroundColor: '#000',
                border: '1px solid #333',
                padding: 5,
              }} />
            </div>


          </div>
        </div>


        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <label>
            Offset X
          </label>
          <input type="range" min={-(imgWidth * 1.5)} max={(imgWidth * 1.5)} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <input type="number" value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-(imgHeight * 1.5)} max={(imgHeight * 1.5)} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <input type="number" value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.0001} value={scale} onChange={(e) => setScale(e.target.value)} />
          <input type="number" value={scale} onChange={(e) => setScale(e.target.value)} />
          <label>
            Rotate
          </label>
          <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
          <input type="number" value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `higher-hat-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
        <div style={{ textAlign: 'center', marginTop: 20, color: '#777', fontSize: 12 }}>
          Higher hat by  <a href="https://warpcast.com/clfx.eth" style={{ color: '#fff', textDecoration: 'underline' }} target='_blank'>clfx</a>, smiley hat by <a href="https://warpcast.com/chicbangs.eth" style={{ color: '#fff', textDecoration: 'underline' }} target='_blank'>Chic</a>, pixel hat by <a href="https://warpcast.com/catra.eth" style={{ color: '#fff', textDecoration: 'underline' }} target='_blank'>catra</a>
        </div>
      </main>
    </>
  )
}