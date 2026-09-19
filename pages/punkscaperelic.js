import Head from 'next/head';
import { ethers } from 'ethers';
import styles from '@/styles/Home.module.css';
import { useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';

export default function HorizonScapes() {
  const RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://ethereum-rpc.publicnode.com',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ETHEREUM_FALLBACK_1': {
      'rpc': 'https://rpc.nodeflare.app/eth/public',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ETHEREUM_FALLBACK_2': {
      'rpc': 'https://public.1rpc.io/eth',
      'chainId': 1,
      'network': 'mainnet',
    },
  };

  const CANVAS_WIDTH = 1536;
  const CANVAS_HEIGHT = 1024;
  const BG_COLOR = '#1C1C1E';
  const NFT_WIDTH = 280;
  const NFT_HEIGHT = 94;

  const COLLECTIONS = {
    'PUNKSCAPE_RELIC': '0x51ae5e2533854495f6c587865af64119db8f59b4',
    'SCAPES': '0xb7def63a9040ad5dc431aff79045617922f4023a',
  };

  const [scapesId, setScapesId] = useState(1);
  const [chain, setChain] = useState('ETHEREUM');
  const [collection, setCollection] = useState('PUNKSCAPE_RELIC');
  const [nftImage, setNftImage] = useState('');
  const [loading, setLoading] = useState(false);

  const changeSVG2PNG = async (svg) => {
    return new Promise((resolve, reject) => {
      if (!svg.startsWith('data:image/svg+xml')) resolve(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = svg;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        resolve(png);
      };
    });
  };

  const getNFTData = async (collection_address, id, rpcUrl) => {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        collection_address,
        ['function tokenURI(uint256) view returns (string)'],
        provider
      );
      const tokenURI = await contract.tokenURI(id);

      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(
          atob(tokenURI.split('data:application/json;base64,')[1])
        );
        if (metadata.image) {
          metadata.image = await changeSVG2PNG(metadata.image);
        }
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.filebase.io/ipfs/${metadata.image.split('ipfs://')[1]}`;
        }
        return metadata;
      } else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.filebase.io/ipfs/${metadata.image.split('ipfs://')[1]}`;
        }
        return metadata;
      } else {
        const ipfsHash = tokenURI.split('ipfs://')[1];
        const ipfsUrl = `https://ipfs.filebase.io/ipfs/${ipfsHash}`;
        const response = await fetch(ipfsUrl);
        const metadata = await response.json();
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.filebase.io/ipfs/${metadata.image.split('ipfs://')[1]}`;
        }
        return metadata;
      }
    } catch (e) {
      console.log('Error fetching NFT data:', e);
      return null;
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!scapesId) return;
      setLoading(true);
      const rpcUrl = RPC_CHAINS[chain].rpc;
      const contractAddress = COLLECTIONS[collection];
      const scape = await getNFTData(contractAddress, scapesId, rpcUrl);
      if (scape) {
        setNftImage(scape.image);
      }
      setLoading(false);
    }
    fetchData();
  }, [scapesId, chain, collection]);

  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw NFT image centered
    if (nftImage) {
      const img = new Image();
      img.src = nftImage;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const x = (CANVAS_WIDTH - NFT_WIDTH) / 2;
        const y = (CANVAS_HEIGHT - NFT_HEIGHT) / 2;
        ctx.drawImage(img, x, y, NFT_WIDTH, NFT_HEIGHT);

        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `punkscaperelic-${scapesId}.png`;
        a.click();
      };
    }
  };

  return (
    <>
      <Head>
        <title>Punkscape Relic</title>
        <meta name="description" content="Punkscape Relic and Scape" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <h1>Punkscape Relic</h1>
          <span style={{ color: 'gray', fontSize: '14px' }}>
            Minimalist NFT artwork showcase - {CANVAS_WIDTH}x{CANVAS_HEIGHT}px canvas
          </span>
        </div>

        <div className={styles.searchContainer} style={{ margin: 0, marginBottom: 20 }}>
          <input
            type="text"
            value={scapesId}
            onChange={(e) => setScapesId(e.target.value)}
            className={styles.search}
            placeholder="Enter Scapes ID"
          />
        </div>

        <div
          style={{
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: BG_COLOR,
            position: 'relative',
            margin: '20px auto',
            border: '1px solid #333',
            maxWidth: '100%',
            maxHeight: '300px'
          }}
          id="horizon-scapes-bg"
        >
          {loading ? (
            <div style={{ color: '#666', fontSize: '14px' }}>Loading...</div>
          ) : nftImage ? (
            <img
              src={nftImage}
              alt="NFT Artwork"
              style={{
                width: `${NFT_WIDTH}px`,
                height: `${NFT_HEIGHT}px`,
                objectFit: 'contain',
              }}
            />
          ) : (
            <div style={{ color: '#666', fontSize: '14px' }}>No NFT loaded</div>
          )}
        </div>

        {/* <div className={styles.searchContainer} style={{ marginTop: 20 }}>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className={styles.search}
          >
            {Object.keys(RPC_CHAINS).map((chainKey) => (
              <option key={chainKey} value={chainKey}>
                {chainKey}
              </option>
            ))}
          </select>
        </div> */}

        <div className={styles.searchContainer} style={{ marginTop: 20 }}>
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className={styles.search}
          >
            {Object.keys(COLLECTIONS).map((collectionKey) => (
              <option key={collectionKey} value={collectionKey}>
                {collectionKey.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <button onClick={downloadImage} style={{ marginTop: 20, padding: '10px 20px' }}>
          Download Image
        </button>
      </main>
    </>
  );
}
