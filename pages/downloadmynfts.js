import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import JSZip from 'jszip'
import { ethers } from 'ethers'

export default function DownloadNFTs() {
  const RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth.llamarpc.com',
      'chainId': 1,
      'network': 'mainnet',
    }
  }
  const [walletAddress, setWalletAddress] = useState('')
  const [nfts, setNfts] = useState([])
  const [nftImages, setNftImages] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalNFTs, setTotalNFTs] = useState(0)

  const getNFTData = async (collection_address, id, type) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS['ETHEREUM'].rpc)
      const functionName = type === 'ERC-1155' ? 'uri' : 'tokenURI'
      console.log('Fetching NFT data for', collection_address, id, 'using function', functionName)
      const contract = new ethers.Contract(collection_address, [`function ${functionName}(uint256) view returns (string)`], provider)
      const tokenURI = await contract[functionName](id)
      console.log('tokenURI', tokenURI)
      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
        return metadata
      }
      else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI)
        if (response.status === 400) {
          console.warn('Metadata returned 400 for tokenURI:', tokenURI)
          return null
        }
        const metadata = await response.json()
        return metadata
      } else if (tokenURI.startsWith('ipfs://')) {
        const ipfsHash = tokenURI.split('ipfs://')[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        const response = await fetch(ipfsUrl)
        if (response.status !== 200) {
          console.warn('Metadata returned 400 for IPFS URL:', ipfsUrl)
          return null
        }
        const metadata = await response.json()
        return metadata
      } else {
        // Handle other formats or return null
        console.warn('Unknown tokenURI format:', tokenURI)
        return null
      }
    } catch (error) {
      console.error('Error fetching NFT data:', error)
      return null
    }
  }

  const fetchNFTs = async (address, page = 1) => {
    if (!address) return
    setLoading(true)
    try {
      const response = await fetch(`/api/getnfts?address=${address}&page=${page}`)
      const data = await response.json()
      const newNfts = data.data || []
      const pagination = data.pagination || {}
      
      console.log(`Fetched ${newNfts.length} NFTs for page ${page}`)
      console.log('Pagination info:', pagination)
      
      if (page === 1) {
        setNfts(newNfts)
        setTotalNFTs(pagination.recordsTotal || 0)
      } else {
        setNfts(prev => [...prev, ...newNfts])
      }
      
      setCurrentPage(page)
      
      // Fetch images for the new NFTs
      if (newNfts.length > 0) {
        await fetchImagesForNFTs(newNfts)
      }
      
      // Automatically load next page if there are more pages
      if (pagination.hasMore && page < 50) { // Safety limit of 50 pages
        console.log(`Auto-loading next page ${page + 1}`)
        setTimeout(() => fetchNFTs(address, page + 1), 100) // Small delay to prevent overwhelming the API
      } else {
        console.log('All pages loaded or reached safety limit')
        setHasMore(false)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      if (page === 1) {
        setNfts([])
      }
      setHasMore(false)
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = currentPage + 1
    fetchNFTs(walletAddress, nextPage)
  }

  const handleImageError = (index) => {
    console.log('Image failed to load, removing:', index)
    setNftImages(prev => prev.filter((_, i) => i !== index))
    setSelected(prev => prev.filter((_, i) => i !== index))
  }

  const fetchImagesForNFTs = async (nftList) => {
    const images = await Promise.all(nftList.map(async (nft) => {
      let imageUrl = null
      
      // Always fetch from chain to get full resolution images
      try {
        const metadata = await getNFTData(nft.contractAddress, nft.tokenId, nft.type)
        console.log('Fetched metadata for', nft.contractAddress, nft.tokenId, metadata)
        if (metadata && metadata.image) {
          imageUrl = metadata.image
          if (imageUrl.startsWith('ipfs://')) {
            const ipfsHash = imageUrl.split('ipfs://')[1]
            imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`
          } else if (imageUrl.startsWith('ipfs/')) {
            // Handle ipfs/ format without protocol
            const ipfsHash = imageUrl.split('ipfs/')[1]
            imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`
          } else if (imageUrl.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
            // Handle raw IPFS hash
            imageUrl = `https://ipfs.io/ipfs/${imageUrl}`
          }
        } else {
          // Fallback to etherscan image if no metadata found
          if (nft.imageUrl && nft.imageUrl !== 'https://etherscan.io/images/main/nft-placeholder.svg') {
            imageUrl = nft.imageUrl
          } else {
            return null
          }
        }
      } catch (error) {
        console.error(error)
        // Fallback to etherscan image if chain fetch fails
        if (nft.imageUrl && nft.imageUrl !== 'https://etherscan.io/images/main/nft-placeholder.svg') {
          imageUrl = nft.imageUrl
        } else {
          return null
        }
      }
      if (!imageUrl) return null
      
      try {
        const response = await fetch(imageUrl)
        if (!response.ok) {
          console.warn('Failed to fetch image:', imageUrl, response.status)
          return null
        }
        const blob = await response.blob()
        if (blob.size === 0) {
          console.warn('Empty blob for image:', imageUrl)
          return null
        }
        const url = URL.createObjectURL(blob)
        return {
          name: nft.name || `NFT_${nft.tokenId}`,
          url,
          blob
        }
      } catch (error) {
        console.error('Error fetching image:', imageUrl, error)
        return null
      }
    }))
    
    const validImages = images.filter(Boolean)
    setNftImages(prev => [...prev, ...validImages])
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    nftImages.forEach(({name, blob}, i) => {
      if (selected[i]) {
        zip.file(`${name}.png`, blob)
      }
    })
    const content = await zip.generateAsync({type: 'blob'})
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nfts.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Download NFTs</title>
        <meta name="description" content="Download all NFTs from a wallet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>

        <h1>Download NFTs</h1>
        <p style={{
          color: '#888',
          fontSize: '14px',
          margin: '20px 0',
          width: '100%',
          textAlign: 'center'
        }}>Enter your wallet address to download all NFTs</p>

        <div className={styles.searchContainer}>
          <input className={styles.search} placeholder="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginTop: '20px'
        }}>
          {loading && (
            <p style={{color: '#666', fontSize: '16px'}}>
              Loading NFTs... (Page {currentPage}{totalNFTs > 0 ? ` of ~${Math.ceil(totalNFTs / 12)}` : ''})
            </p>
          )}
          <div style={{flex: 1, width: '100%'}}>
            <span style={{width: '100%', textAlign: 'left', marginBottom: '20px', display: 'flex', color :'#888 '}}>
            {nftImages.length > 0 ?  `Showing ${nftImages.length}${totalNFTs > 0 ? ` of ${totalNFTs}` : ''} NFTs` : ''}
            </span>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
              {nftImages.map((nft, i) => (
                <div key={i} style={{marginBottom: '20px', textAlign: 'center'}}>
                  <img 
                    src={nft.url} 
                    style={{maxWidth: '200px', border: '1px solid #333'}} 
                    onError={() => handleImageError(i)}
                    alt={nft.name || 'NFT'}
                  />
                  <p style={{color: '#888', fontSize: '12px'}}>
                    {nft.name}
                  </p>
                  <input type="checkbox" checked={selected[i]} onChange={() => toggleSelected(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px 0',
          flexWrap: 'wrap'
        }}>
          <button onClick={() => {
            setCurrentPage(1)
            setNfts([])
            setNftImages([])
            setSelected([])
            setTotalNFTs(0)
            setHasMore(true)
            fetchNFTs(walletAddress, 1)
          }} disabled={!walletAddress || loading}>Get NFTs</button>

          <button onClick={downloadZip} disabled={!nftImages.length || loading}>
            {loading ? 'Loading NFTs...' : 'Download Zip'}
          </button>
        </div>
      </main>
    </div>
  )
}
