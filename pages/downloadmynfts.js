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
  const [resolvedAddress, setResolvedAddress] = useState('')
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

  const resolveENS = async (ensName) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS['ETHEREUM'].rpc)
      const address = await provider.resolveName(ensName)
      return address
    } catch (error) {
      console.error('Error resolving ENS:', error)
      return null
    }
  }

  const fetchNFTs = async (addressOrENS, page = 1) => {
    if (!addressOrENS) return
    setLoading(true)
    
    let resolvedAddress = addressOrENS
    
    // Check if it's an ENS name (ends with .eth)
    if (addressOrENS.toLowerCase().endsWith('.eth')) {
      console.log('Resolving ENS name:', addressOrENS)
      const resolved = await resolveENS(addressOrENS)
      if (!resolved) {
        alert('Could not resolve ENS name. Please check the name and try again.')
        setLoading(false)
        return
      }
      resolvedAddress = resolved
      setResolvedAddress(resolved)
      console.log('Resolved to address:', resolvedAddress)
    } else {
      setResolvedAddress(resolvedAddress)
    }
    
    try {
      const response = await fetch(`/api/getnfts?address=${resolvedAddress}&page=${page}`)
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
        setTimeout(() => fetchNFTs(resolvedAddress, page + 1), 100) // Small delay to prevent overwhelming the API
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

  const toggleSelected = (index) => {
    const newSelected = [...selected]
    newSelected[index] = !newSelected[index]
    setSelected(newSelected)
  }

  useEffect(() => {
    // When nftImages changes, extend the selected array with true values for new images
    setSelected(prev => {
      const newSelected = [...prev]
      while (newSelected.length < nftImages.length) {
        newSelected.push(true)
      }
      return newSelected
    })
  }, [nftImages])

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
        }}>Enter your wallet address or ENS name to download all NFTs</p>

        <div className={styles.searchContainer}>
          <input className={styles.search} placeholder="Wallet Address or ENS name (e.g. vitalik.eth)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          marginTop: '30px',
          padding: '0 20px',
          maxWidth: '100%',
          margin: '30px auto 0'
        }}>
          {loading && (
            <div style={{
              padding: '16px 24px',
              borderRadius: '8px',
              border: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #666',
                borderTop: '2px solid #4CAF50',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{color: '#e0e0e0', fontSize: '16px', margin: '0'}}>
                Loading NFTs... (Page {currentPage}{totalNFTs > 0 ? ` of ~${Math.ceil(totalNFTs / 12)}` : ''})
              </p>
            </div>
          )}
          <div style={{flex: 1, width: '100%'}}>
            <div style={{
              width: '100%',
              textAlign: 'center',
              marginBottom: '30px',
              padding: '16px',
              borderRadius: '8px',
            }}>
              <span style={{color: '#888', fontSize: '12px', fontWeight: '500'}}>
                {nftImages.length > 0 ? `Showing ${nftImages.length}${totalNFTs > 0 ? ` of ${totalNFTs}` : ''} NFTs` : 'No NFTs loaded yet'}
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: nftImages.length === 1 ? '1fr' :
                                   nftImages.length === 2 ? '1fr 1fr' :
                                   nftImages.length === 3 ? '1fr 1fr' :
                                   nftImages.length === 4 ? '1fr 1fr' : 'repeat(auto-fill, minmax(100px, 1fr))',
              gridTemplateRows: nftImages.length === 3 ? '1fr 1fr' : 'auto',
              gap: '0px',
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#000',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              {nftImages.map((nft, i) => (
                <div key={i} style={{
                  position: 'relative',
                  aspectRatio: nftImages.length === 1 ? '16/9' :
                              nftImages.length === 2 ? '1/1' :
                              nftImages.length === 3 && i === 0 ? '2/1' :
                              '1/1',
                  backgroundColor: '#1a1a1a',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => toggleSelected(i)}
                >
                  <img
                    src={nft.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.2s ease, opacity 0.2s ease'
                    }}
                    onError={() => handleImageError(i)}
                    alt={nft.name || 'NFT'}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)'
                      e.target.style.opacity = '0.9'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)'
                      e.target.style.opacity = '1'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: selected[i] ? 'rgba(29, 161, 242, 0.9)' : 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                  }}>
                    {selected[i] && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    padding: '40px 12px 12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}>
                    {nft.name || `NFT #${nft.tokenId || i + 1}`}
                  </div>
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
            setResolvedAddress('')
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
