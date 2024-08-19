import Head from 'next/head'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
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
  const [scapeSVG, setScapeSVG] = useState('')
  const [chain, setChain] = useState('ETHEREUM')
  const [status, setStatus] = useState('')
  const [scapeOffsetX, setScapeOffsetX] = useState(0)
  const [scapeOffsetY, setScapeOffsetY] = useState(0)
  const [scapeScale, setScapeScale] = useState(4) // default zoom
  const scapeContract = '0xb7def63a9040ad5dc431aff79045617922f4023a'

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
      } else if (tokenURI.startsWith('http')) {
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

  const applyTransformations = () => {
    const svgElement = document.getElementById('svg-wrapper').querySelector('svg')
    
    console.log(svgElement)

    if (!svgElement) return

    // set view box 0 0 4 6

    svgElement.setAttribute('viewBox', `${scapeOffsetX} ${scapeOffsetY} 4 6`)
    svgElement.setAttribute('height', 600)
    svgElement.setAttribute('width', 400)
  }

  useEffect(() => {
    if (!scapeID) return

    setStatus('fetching scape...')
    getNFTData(scapeContract, scapeID).then(scape => {
      if (scape.image) {
        fetch(scape.image)
          .then(res => res.text())
          .then(svgText => {
            setScapeSVG(svgText)
            setStatus('')
          })
      }
    })
  }, [scapeID])

  useEffect(() => {
    applyTransformations()
  }, [scapeOffsetX, scapeOffsetY, scapeScale])

  return (
    <>
      <Head>
        <title>
          Opepen Scapes
        </title>
        <meta name="description" content="Opepen Scapes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          Opepen Scapes
        </h1>
        <h2 className={styles.description}>
          Get fun opepen from scapes
        </h2>

        <div
          id="svg-container"
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px'
          }}
        >
          <div
            id="svg-wrapper"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            dangerouslySetInnerHTML={{ __html: scapeSVG }}
          />
        </div>

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
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              <input type="range" min={0} max={1500} step={1} value={scapeOffsetX} onChange={(e) => setScapeOffsetX(e.target.value)} />
              <input type='number' value={scapeOffsetX} onChange={(e) => setScapeOffsetX(e.target.value)} style={{
                border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
              }} />
            </div>

            <label>
              Scape Offset Y
            </label>
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              <input type="range" min="0" max="1500" step={1} value={scapeOffsetY}   onChange={(e) => setScapeOffsetY(e.target.value)} />
              <input type='number' value={scapeOffsetY} onChange={(e) => setScapeOffsetY(e.target.value)} style={{
                border: '1px solid #333', width: '30%', fontSize: 16, borderRadius: 10, padding: 5
              }} />
            </div>


            {/* download button */}
            <button onClick={() => {
              // download as png 800x1200
              const svgContainer = document.getElementById('svg-container')
              const svg = svgContainer.querySelector('svg')
              const canvas = document.createElement('canvas')
              canvas.width = 800
              canvas.height = 1200
              const ctx = canvas.getContext('2d')
              const img = new Image()
              const svgData = new XMLSerializer().serializeToString(svg)
              const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
              const url = URL.createObjectURL(svgBlob)
              img.onload = () => {
                ctx.drawImage(img, 0, 0, 800, 1200) 
                const a = document.createElement('a')
                a.href = canvas.toDataURL('image/png')
                a.download = `scape-${scapeID}:${scapeOffsetX}-${scapeOffsetY}.png`
                a.click()
              }
              img.src = url



            }} style={{
              marginTop: 20
            }}>
              Download
            </button>

          </div>
          <span style={{
            height: 10,
            fontFamily: 'monospace',
            color: '#eee'
          }}>{status}</span>

        </div>
      </main>
    </>
  )
}
