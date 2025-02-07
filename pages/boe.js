// merge american flag on any nft/image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

export default function America() {
  const AMERICAN_FLAG = '/boe.png'
  const AMERICAN_FLAG2 = '/boe2.png'

  // New state to track flag variant
  const [flagVariant, setFlagVariant] = useState('1')

  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth.llamarpc.com',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const [collectionAddress, setCollectionAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('1')
  const [debouncedToken, setDebouncedToken] = useState(token1)
  const [img, setImg] = useState(null)
  const [blendType, setBlendType] = useState('lighten')
  const [opacity, setOpacity] = useState(1)

  const getNFTData = async (collection_address, id) => {
    // get metadata of nft and ipfs hash
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider)
      console.log('contract', collection_address, id)
      const tokenURI = await contract.tokenURI(id)
      // if tokenURI is a url, fetch the metadata, if it is ipfs replace with ipfs.io
      // if token uri is data:// json parse it
      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
        return metadata
      }
      else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI)
        const metadata = await response.json()
        return metadata
      } else {
        const ipfsHash = tokenURI.split('ipfs://')[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        const response = await fetch(ipfsUrl)
        const metadata = await response.json()
        return metadata
      }
    } catch (e) {
      return '';
    }
  }
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
        if (canvas.width < 500)
          canvas.width = 1000
        canvas.height = img.height
        if (canvas.height < 500)
          canvas.height = 1000
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

  const blendUpdateCanvas = (image1, image2) => {
    // draw punk
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    console.log(image1, image2)
    if (!image1) return
    if (!image2) return

    getImgFromURL(image1).then(img1 => {
      getImgFromURL(image2).then(img2 => {
        // wait 2 seconds
        // setStatus('loading image 1...')
        if (img1 && img2) {
          // draw black rectangle

          // draw punk
          const canvas = document.getElementById('canvas')
          const ctx = canvas.getContext('2d')
          console.log('clearing canvas')
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          console.log('draw image1')
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height)

          // draw punk
          ctx.globalAlpha = opacity;
          ctx.globalCompositeOperation = blendType;
          let scaleFactor = canvas.width / img2.width
          const scaledHeight = img2.height * scaleFactor
          const center = (canvas.height - scaledHeight) / 2

          console.log('draw image2')

          ctx.drawImage(img2, 0, center, canvas.width, scaledHeight)
          // setStatus('')
        }
      });
    })
  }



  useEffect(() => {
    // when set blend update, use variant based flag image
    blendUpdateCanvas(flagVariant === '2' ? AMERICAN_FLAG2 : AMERICAN_FLAG, img)
  }, [img, blendType, opacity, flagVariant])


  useEffect(() => {
    if (!collectionAddress || !token1) return
    getNFTData(collectionAddress, token1).then((data) => {
      if (!data) return
      setImg(data.image)
    })
  }, [token1, collectionAddress])

  useEffect(() => {
    const handler = setTimeout(() => {
      setToken1(debouncedToken);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedToken]);

  const handleBlendMode = (e) => {
    setBlendType(e.target.value)
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }


  return (
    <>
      <Head>
        <title>Built on Ethereum</title>
        <meta name="description" content="Add Built on Ethereum to any NFT or image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* blend  */}
        <h1 className={styles.title}>
        Boe Ξ 
        </h1>

        <p className={styles.description}>
          Add built on ethereum to any nft/image
        </p>

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
                setImg(reader.result)
              }
            }
            reader.readAsDataURL(file)
          }} />

          {/* New selection for variant */}
          <select onChange={(e) => setFlagVariant(e.target.value)} value={flagVariant}>
            <option value="1">Variant 1</option>
            <option value="2">Variant 2</option>
          </select>

          <select onChange={handleBlendMode}>
            <option value="normal">Normal</option>
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
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={handleOpacity} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <label>
              Collection Address
            </label>

            <div className={styles.searchContainer} style={{ marginTop: 0, marginBottom: 1 }}>
              <input className={styles.search} placeholder="Collection Address"
                onChange={(e) => {
                  setCollectionAddress(e.target.value)
                }}
                value={collectionAddress}
                ></input>
              </div>
              <label>
                Token ID
              </label>
              <div className={styles.searchContainer} style={{ marginTop: 0 }}>
                <input 
                  className={styles.search} 
                  placeholder="Token ID"
                  onChange={(e) => {
                    setDebouncedToken(e.target.value)
                  }}
                  value={debouncedToken}
                ></input>
              </div>
              <button style={{border: '1px solid #333'}} onClick={async () => {
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait for canvas to update
              let canvas = document.getElementById('canvas')
              let a = document.createElement('a')
              a.href = canvas.toDataURL('image/png')
              a.download = 'boe.png'
              a.click()
            }}>Download</button>

          </div>
        </div>
      </main>
    </>
  )

}