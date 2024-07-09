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
  const [invert, setInvert] = useState(false)
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
          // if invert is true, invert color of 
          if(invert){
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i] = 255 - imgData.data[i]
              imgData.data[i + 1] = 255 - imgData.data[i + 1]
              imgData.data[i + 2] = 255 - imgData.data[i + 2]
            }
            ctx.putImageData(imgData, 0, 0)
          }
          
          // draw punk
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = invert ? 'lighten' : 'darken';
          let scaleFactor = 1;
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
  }, [scapeID])


  useEffect(() => {
    if (!scapeID) return
    if (!punkID) return

    setStatus('blending...')

    blendUpdateCanvas(punkImg, scapeImg)
  }, [scapeImg, punkImg, scapeOffsetX, scapeOffsetY, scapeScale, invert])

  return (
    <>
      <Head>
        <title>8pepeblend</title>
        <meta name="description" content="8pepeblend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          8pepeblend
        </h1>
        <h2 className={styles.description}>
          Blend 8pepen with any image
        </h2>
        <canvas id="canvas" width="800" height="800"
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20,
            width: '100%'
          }}
        ></canvas>
        <div style={{ margin: 0, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 20, width: '50%' }}>
          <input type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => {
                setScapeImg(reader.result)
              }
            }
            reader.readAsDataURL(file)
          }} />
          <div style={{
            display: 'flex', gap: 20, margin: 'auto', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'
          }}>
          <div style={{display: 'flex', gap: 20, width: '100%'}}>
            <label>Invert</label>
            <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} />
            </div>
            <label>
              Offset X
            </label>
            <div style={{display: 'flex', gap: 20, width: '100%'}}>
            <input type="range" min={-1000} max={1000} step={0.01} value={scapeOffsetX} onChange={(e) => setScapeOffsetX(e.target.value)} />
            <input type='number' value={scapeOffsetX} onChange={(e) => setScapeOffsetX(e.target.value)} style={{
              border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
            }} />
            </div>
            
            <label>
              Offset Y
            </label>
            <div style={{display: 'flex', gap: 20, width: '100%'}}>
            <input type="range" min="-800" max="800" value={scapeOffsetY} onChange={(e) => setScapeOffsetY(e.target.value)} />
            <input type='number' value={scapeOffsetY} onChange={(e) => setScapeOffsetY(e.target.value)} style={{
              border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
            }} />
</div>
            
            <label>
              Scale
            </label>
            <div style={{display: 'flex', gap: 20, width: '100%'}}>
            
            <input type="range" min="0" max="10" step="0.01" value={scapeScale} onChange={(e) => setScapeScale(e.target.value)} />
            <input type='number' value={scapeScale} onChange={(e) => setScapeScale(e.target.value)} style={{
              border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
            }} />
            </div>
          </div>
        </div>
        
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = '8pepe-blend.png'
          a.click()
        }}>
          Download Image
        </button>
      </main>
    </>
  )

}