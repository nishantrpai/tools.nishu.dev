// use scapes to generate youtube thumbnails, instagram 
import Head from 'next/head'
import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function Scapes() {
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
    }
  }

  const ASSET_SIZES = {
    'YOUTUBE': '1280x720',
    'INSTAGRAM': '1080x1080',
    'TWITTER': '1024x512',
    'FACEBOOK': '1200x630',
    'TIKTOK': '1080x1920',
    'SNAPCHAT': '1080x1920',
    'PINTEREST': '1000x1500',
    'LINKEDIN': '1200x627',
  }

  const [bg, setBg] = useState('')
  const [scapesId, setScapesId] = useState(1)
  const [collectionAddress, setCollectionAddress] = useState('0x5537d90a4a2dc9d9b37bab49b490cf67d4c54e91')
  const [token1, setToken1] = useState(4003)
  const scapesContract = "0xb7def63a9040ad5dc431aff79045617922f4023a"
  const [chain, setChain] = useState('ETHEREUM')
  const [tokens, setTokens] = useState([])
  const [assetImg, setAssetImage] = useState('')

  const changeSVG2PNG = async (svg) => {
    return new Promise((resolve, reject) => {
      if (!svg.startsWith('data:image/svg+xml')) resolve(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = svg
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const png = canvas.toDataURL('image/png')
        resolve(png)
      }
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

        if(metadata.image) {
          metadata.image = await changeSVG2PNG(metadata.image)
        }
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

  useEffect(() => {
    try {
      async function fetchData() {
        if (!scapesId) return
        getNFTData(scapesContract, scapesId).then(scape => {
          setBg(scape.image)
          setAssetImage(scape.image)
        });
      }
      fetchData()

    } catch (e) {
      console.log(e)
    }
  }, [scapesId])

  useEffect(() => {
    if (!collectionAddress || !token1) return
    getNFTData(collectionAddress, token1).then((data) => {
      if (!data) return
      setTokens(prev => Array.from(new Set([...prev, data.image])))
    })
  }, [token1, collectionAddress])

  const drag = (e, tokenId) => {
    // dropeffect move
    let tokenDiv = document.querySelector(tokenId)
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('text', tokenId)
  }

  const allowDrop = (e) => {
    e.preventDefault()
  }

  const drop = (e) => {
    try {
      e.preventDefault()
      const data = e.dataTransfer.getData('text')
      console.log(data)
      const tokenDiv = document.getElementById(data)
      // check if tokendiv already exists
      if (!(tokenDiv.parentElement === e.target))
        e.target.appendChild(tokenDiv)

      console.log(e.clientX, e.clientY, tokenDiv.clientHeight, tokenDiv.clientWidth)
      tokenDiv.style.position = 'absolute'
      tokenDiv.style.left = (e.clientX - (tokenDiv.clientHeight / 2)) + 'px'

      tokenDiv.style.top = (e.clientY - (tokenDiv.clientWidth / 2)) + 'px'

      html2canvas(document.getElementById('scapes-bg'), {
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        scale: 4
      }).then(canvas => {
        let img = canvas.toDataURL()
        console.log(img)
        setAssetImage(img)
      })


    } catch (e) {
      console.log(e)
    }
  }


  return (
    <>
      <Head>
        <title>Scapes</title>
        <meta name="description" content="Scapes: Use scapes to generate yt thumbnails, ig posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', textAlign: 'center', marginBottom: 20 }}>
          <h1>Scapes</h1>
          <span style={
            {
              color: 'gray',
              fontSize: '14px'
            }
          }>Use scapes to generate yt thumbnails, ig posts
          </span>
        </div>
        <div className={styles.searchContainer} style={{ margin: 0, marginBottom: 20 }}>
          <input type="text" value={scapesId} onChange={(e) => setScapesId(e.target.value)} className={styles.search}
            placeholder='Enter Scapes ID' />
        </div>
        <div onDragOver={allowDrop} onDrop={drop} style={{
          width: '1000px',
          height: 400,
          display: 'flex',
          background: `url(${bg})`,
          backgroundRepeat: 'no-repeat'
        }}
          id="scapes-bg"
        >
        </div>

        <input type="file" accept="image/*" onChange={(e) => {
          let reader = new FileReader()
          reader.onload = (e) => {
            // add to tokens
            setTokens(prev => Array.from(new Set([...prev, e.target.result])))
          }
          reader.readAsDataURL(e.target.files[0])
        }}></input>
        <div style={{ display: 'flex', width: '100%', height: 100, border: '1px solid #333', marginTop: 20, overflow: 'scroll' }} onDragOver={allowDrop}
          onDrop={drop}
        >
          {tokens.map((token, index) => (
            <div style={{ display: 'flex', flexDirection: 'column', width: 'max-content', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: 'max-content', height: '100%' }}>
                <div
                  style={{ resize: 'both', overflow: 'hidden', height: 'max-content', cursor: 'move', width: '100px' }} id={`token-${index}`}
                  onDragStart={(e) => {
                    drag(e, `token-${index}`);
                  }}
                  draggable="true"

                  onResize={() => {
                    html2canvas(document.getElementById('scapes-bg'), {
                      useCORS: true,
                      allowTaint: true,
                      scrollX: 0,
                      scrollY: 0,
                      scale: 1
                    }).then(canvas => {
                      let img = canvas.toDataURL()
                      console.log(img)
                      setAssetImage(img)
                    })

                  }}
                >
                  <img
                    crossOrigin="anonymous"
                    src={token}
                    style={{ width: '100%', height: 'max-content', zIndex: 1000, resize: 'both' }}
                  // on move set to x,y
                  ></img>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.searchContainer} style={{ marginTop: 20 }}>
          <input className={styles.search} placeholder="Collection Address"
            onChange={(e) => {
              setCollectionAddress(e.target.value)
            }}
            value={collectionAddress}
          ></input>
        </div>

        <div className={styles.searchContainer} style={{ marginTop: 10 }}>
          <input className={styles.search} placeholder="Token ID"
            onChange={(e) => {
              setToken1(e.target.value)
            }}
            value={token1}></input>
        </div>
        <button onClick={() => {
          let canvas = document.createElement('canvas')
          canvas.width = 1000
          canvas.height = 380
          let ctx = canvas.getContext('2d')
          let img = new Image()
          img.src = assetImg
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 1000, 400)
            // if any svgs are present, convert to png
            let a = document.createElement('a')
            a.href = canvas.toDataURL()
            a.download = 'scapes.png'
            a.click()
          }
        }}>
          Download
        </button>
      </main>
    </>
  )
}