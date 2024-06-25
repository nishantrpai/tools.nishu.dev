// merge one day punks and scapes
import Head from 'next/head'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import styles from '@/styles/Home.module.css'


export default function Home() {
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


  const [scapeID, setScapesId] = useState(1)
  const [punkID, setPunkId] = useState(1)
  const [scapeImg, setScapeImg] = useState('')
  const [punkImg, setPunkImg] = useState('/8pepen.png')
  const [chain, setChain] = useState('ETHEREUM')
  const [status, setStatus] = useState('')
  const [scapeOffsetX, setScapeOffsetX] = useState(0)
  const [scapeOffsetY, setScapeOffsetY] = useState(0)
  const [scapeScale, setScapeScale] = useState(1)
  const punkContract = '0x5537d90a4a2dc9d9b37bab49b490cf67d4c54e91'
  const scapeContract = '0xb7def63a9040ad5dc431aff79045617922f4023a'

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

      console.log(url)

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


  const blendUpdateCanvas = (image1, image2) => {
    // draw punk
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')


    console.log(image1, image2)
    if (!image1) return
    if (!image2) return

    getImgFromURL(image1).then(img1 => {
      getImgFromURL(image2).then(img2 => {
        // wait 2 seconds
        setStatus('loading image 1...')
        if (img1 && img2) {
          // draw black rectangle

          // draw punk
          const canvas = document.getElementById('canvas')
          const ctx = canvas.getContext('2d')
          console.log('clearing canvas')
          ctx.beginPath()
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          console.log('draw image1')
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height)

          // draw punk
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = 'darken'
          let scaleFactor = canvas.width / img2.width
          const scaledHeight = img2.height * scaleFactor
          const center = (canvas.height - scaledHeight) / 2

          console.log('draw image2')

          ctx.drawImage(img2, scapeOffsetX, scapeOffsetY, img2.width * scapeScale, img2.height * scapeScale)
          setStatus('')
          ctx.globalCompositeOperation = 'source-over';
          ctx.closePath()
        }
      });
    })
  }

  useEffect(() => {

    if (!scapeID) return

    setStatus('fetching scape...')
    getNFTData(scapeContract, scapeID).then(scape => {
      if (scape.image)
        setScapeImg(scape.image)
    });
  }, [scapeID])


  useEffect(() => {
    if (!scapeID) return
    if (!punkID) return

    setStatus('blending...')

    blendUpdateCanvas(punkImg, scapeImg)
  }, [scapeImg, punkImg, scapeOffsetX, scapeOffsetY, scapeScale])

  return (
    <>
      <Head>
        <title>8scapepe</title>
        <meta name="description" content="8scapepe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          8scapepe
        </h1>
        <h2 style={{
          color: '#333',
          fontSize: 12
        }}>
          Merge 8pepen and Scapes
        </h2>
        <canvas id="canvas" width="500" height="500"
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20
          }}
        ></canvas>
        <div style={{ margin: 0, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 20, width: '50%' }}>
          <label>
            Enter Scapes ID
          </label>
          <input type="text" value={scapeID} onChange={(e) => setScapesId(e.target.value)} placeholder='Enter Scapes ID' style={{
            border: '1px solid #333', width: '100%', fontSize: 16, borderRadius: 10, padding: 5
          }} />
          <div style={{
            display: 'flex', gap: 20, margin: 'auto', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'
          }}>
            <label>
              Scape Offset X
            </label>
            <div style={{display: 'flex', gap: 20, width: '100%'}}>
            <input type="range" min={-1000} max={1000} step={0.01} value={scapeOffsetX} onChange={(e) => setScapeOffsetX(e.target.value)} />
            <input type='number' value={scapeOffsetX} onChange={(e) => setScapeOffsetX(e.target.value)} style={{
              border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
            }} />
            </div>
            
            <label>
              Scape Offset Y
            </label>
            <div style={{display: 'flex', gap: 20, width: '100%'}}>
            <input type="range" min="-500" max="500" value={scapeOffsetY} onChange={(e) => setScapeOffsetY(e.target.value)} />
            <input type='number' value={scapeOffsetY} onChange={(e) => setScapeOffsetY(e.target.value)} style={{
              border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
            }} />
</div>
            
            <label>
              Scape Scale
            </label>
            <div style={{display: 'flex', gap: 20, width: '100%'}}>
            
            <input type="range" min="0" max="2" step="0.01" value={scapeScale} onChange={(e) => setScapeScale(e.target.value)} />
            <input type='number' value={scapeScale} onChange={(e) => setScapeScale(e.target.value)} style={{
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
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = '8scapepe.png'
          a.click()
        }}>
          Download Image
        </button>
      </main>
    </>
  )

}