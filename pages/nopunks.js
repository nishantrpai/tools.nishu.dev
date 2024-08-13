// add no punks to any image
// blend two images together using canvas in the browser
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers';

const BlendLayer = () => {
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

  const [chain, setChain] = useState('BASE');
  const [contract, setContract] = useState('0x4ed83635e2309a7c067d0f98efca47b920bf79b1');
  const [tokenId, setTokenId] = useState(1);
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [blendMode, setBlendMode] = useState('normal')
  const [opacity, setOpacity] = useState(1)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.8)
  const [offsetTheta, setOffsetTheta] = useState(0)

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

  const handleImage1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage1(image)
        console.log(getImageData(image))  
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImage2 = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage2(image)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleBlendMode = (e) => {
    setBlendMode(e.target.value)
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }

  const getImageData = (image1) => {
    let image = image1;
    return {width: image.width, height: image.height}
  }

  const downloadImage = () => {
    // get higher resolution image
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `blended-image-${new Date().getTime()}.png`
    a.click()
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  useEffect(() => {
    if (image1 && image2) {
      // draw image1 onto the main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    
      // create an offscreen canvas to manipulate image2
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      offCanvas.width = image2.width;
      offCanvas.height = image2.height;
    
      // draw image2 onto the offscreen canvas
      offCtx.drawImage(image2, 0, 0);
    
      // get image data from the offscreen canvas
      const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const data = imageData.data;
    
      // loop through the pixels and make #000 (black) fully transparent
      for (let i = 0; i < data.length; i += 4) {
        if ((data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) 
      ) {
          data[i + 3] = 0; // set alpha to 0 (transparent)
        }
      }
    
      // put the modified image data back onto the offscreen canvas
      offCtx.putImageData(imageData, 0, 0);
    
      // draw the modified image2 onto the main canvas at the specified offset
      ctx.drawImage(offCanvas, offsetX, offsetY, image2.width * scale, image2.height * scale);
    }
  }, [image1, image2, blendMode, opacity, offsetX, offsetY, scale, offsetTheta])

  useEffect(() => {
    getNFTData(contract, tokenId).then((data) => {
      let image = new Image();
      image.src = data.image;
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        setImage2(image);
      };
    });
  }, [tokenId])

  return (
    <>
      <Head>
        <title>Add no punks</title>
        <meta name="description" content="Add no punks to any image" /> 
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Add no punks
        </h1>

        <p className={styles.description}>
          Add no punks to any image
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%'}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div style={{display: 'flex', gap: '20px'}}>
          <canvas id="canvas" width={image1?.width || 500} height={image1?.height || 500}></canvas>
                  <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <label>
            Offset X
          </label>
          <input type="range" min={-500} max={500} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-500} max={500} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.01} value={scale} onChange={(e) => setScale(e.target.value)} />
        </div>


          </div>
          <input type="file" onChange={handleImage1} />
          <div className={styles.searchContainer} style={{ margin: 0, marginBottom: 20 }}>
          <input
            type="number"
            defaultValue={tokenId}
            onChange={(e) => {
              // wait 2 seconds before fetching the new image
              setTimeout(() => {
                setTokenId(e.target.value);
                getNFTData(contract, e.target.value).then((data) => {
                  let image = new Image();
                  image.src = data.image;
                  image.crossOrigin = 'Anonymous';  
                  image.onload = () => {
                    setImage2(image);
                  };
                });
  
              }, 2000);
            }}
            className={styles.search}
            placeholder='Enter Scapes ID'
          />
        </div>
        {/*  */}

            <button style={{border: '1px solid #333'}} onClick={downloadImage}>Download</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default BlendLayer