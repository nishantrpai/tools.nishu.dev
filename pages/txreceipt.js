import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

const TxReceipt = () => {
  const [txHash, setTxHash] = useState('')
  const [txData, setTxData] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nftData, setNftData] = useState(null)
  const [chain, setChain] = useState('ETHEREUM')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const canvasRef = useRef(null)

  const RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth.llamarpc.com',
      'chainId': 1,
      'network': 'mainnet',
      'explorer': 'https://etherscan.io'
    },
    'POLYGON': {
      'rpc': 'https://polygon-rpc.com',
      'chainId': 137,
      'network': 'polygon',
      'explorer': 'https://polygonscan.com'
    },
    'BASE': {
      'rpc': 'https://mainnet.base.org',
      'chainId': 8453,
      'network': 'base',
      'explorer': 'https://basescan.org'
    }
  }

  const formatValue = (value, decimals = 18) => {
    return parseFloat(ethers.formatUnits(value, decimals)).toFixed(6)
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatHash = (hash) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const formatGas = (gas) => {
    return parseInt(gas).toLocaleString()
  }

  const getTransactionData = async (hash) => {
    if (!hash) return

    setLoading(true)
    setError('')
    setNftData(null)

    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      
      // Get transaction data and receipt
      const [tx, receipt] = await Promise.all([
        provider.getTransaction(hash),
        provider.getTransactionReceipt(hash)
      ])

      if (!tx) {
        setError('Transaction not found')
        return
      }

      // Get block to get timestamp
      const block = await provider.getBlock(receipt.blockNumber)
      
      setTxData({...tx, timestamp: block.timestamp})
      setReceipt(receipt)

      // Check if it's an ERC721 transaction
      await checkForNFT(receipt, provider)

    } catch (err) {
      console.error(err)
      setError('Failed to fetch transaction data')
    } finally {
      setLoading(false)
    }
  }

  const checkForNFT = async (receipt, provider) => {
    try {
      // Look for Transfer events that might be ERC721
      const transferLogs = receipt.logs.filter(log => 
        log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && 
        log.topics.length === 4 // ERC721 has 4 topics (event sig + from + to + tokenId)
      )

      if (transferLogs.length > 0) {
        const log = transferLogs[0]
        const contractAddress = log.address
        const tokenId = parseInt(log.topics[3], 16)

        // Try to get NFT metadata
        try {
          const contract = new ethers.Contract(
            contractAddress, 
            ['function tokenURI(uint256) view returns (string)'], 
            provider
          )
          
          const tokenURI = await contract.tokenURI(tokenId)
          let metadata = null

          if (tokenURI.startsWith('data:')) {
            metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
          } else if (tokenURI.startsWith('http')) {
            const response = await fetch(tokenURI)
            metadata = await response.json()
          } else if (tokenURI.startsWith('ipfs://')) {
            const ipfsHash = tokenURI.split('ipfs://')[1]
            const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
            const response = await fetch(ipfsUrl)
            metadata = await response.json()
          }

          if (metadata && metadata.image) {
            let image = metadata.image
            if (image.startsWith('ipfs://')) {
              const ipfsHash = image.split('ipfs://')[1]
              image = `https://ipfs.io/ipfs/${ipfsHash}`
            }

            setNftData({
              contractAddress,
              tokenId,
              name: metadata.name,
              image,
              metadata
            })
          }
        } catch (nftError) {
          console.log('Not an ERC721 or metadata not accessible')
        }
      }
    } catch (err) {
      console.log('Error checking for NFT:', err)
    }
  }

  useEffect(() => {
    if (txHash) {
      getTransactionData(txHash)
    }
  }, [txHash, chain])

  const getStatusIcon = (status) => {
    return status === 1 ? '✅' : '❌'
  }

  const getStatusText = (status) => {
    return status === 1 ? 'Success' : 'Failed'
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const generateScreenshot = async () => {
    setIsGeneratingImage(true)
    
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = 600
      canvas.height = 800
      
      // Fill background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      if (isDarkMode) {
        bgGradient.addColorStop(0, '#1a1a1a')
        bgGradient.addColorStop(1, '#111111')
      } else {
        bgGradient.addColorStop(0, '#ffffff')
        bgGradient.addColorStop(1, '#f8fafc')
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw content
      await drawReceiptContent(ctx)
      
      // Download the image
      const link = document.createElement('a')
      link.download = `tx-receipt-${formatHash(txData.hash)}.png`
      link.href = canvas.toDataURL()
      link.click()
      
    } catch (error) {
      console.error('Error generating screenshot:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }
  
  const drawReceiptContent = async (ctx) => {
    const textColor = isDarkMode ? '#ffffff' : '#1a202c'
    const secondaryColor = isDarkMode ? '#888888' : '#64748b'
    
    ctx.fillStyle = textColor
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.textAlign = 'center'
    
    // Title
    const titleGradient = ctx.createLinearGradient(0, 0, 600, 0)
    titleGradient.addColorStop(0, '#667eea')
    titleGradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = titleGradient
    ctx.fillText('Transaction Receipt', 300, 60)
    
    let yPos = 120
    
    // Status
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'left'
    const statusText = `${getStatusIcon(receipt.status)} ${getStatusText(receipt.status)}`
    ctx.fillText(statusText, 50, yPos)
    
    // Block number
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = secondaryColor
    ctx.textAlign = 'right'
    ctx.fillText(`Block #${receipt.blockNumber.toLocaleString()}`, 550, yPos)
    
    yPos += 60
    
    // NFT section if available
    if (nftData && nftData.image) {
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = nftData.image
        })
        
        // Draw NFT image
        ctx.drawImage(img, 50, yPos, 80, 80)
        
        // NFT info
        ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif'
        ctx.fillStyle = textColor
        ctx.textAlign = 'left'
        ctx.fillText(nftData.name || 'Unknown NFT', 150, yPos + 25)
        
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif'
        ctx.fillStyle = secondaryColor
        ctx.fillText(`Token ID: ${nftData.tokenId}`, 150, yPos + 45)
        ctx.fillText(formatAddress(nftData.contractAddress), 150, yPos + 65)
        
        yPos += 100
      } catch (error) {
        console.log('Failed to load NFT image for canvas')
      }
    }
    
    // Transaction details
    const details = [
      ['Transaction Hash', formatHash(txData.hash)],
      ['From', formatAddress(txData.from)],
      ['To', formatAddress(txData.to)],
      ['Value', `${formatValue(txData.value)} ETH`],
      ['Gas Used', `${formatGas(receipt.gasUsed)} / ${formatGas(txData.gasLimit)}`],
      ['Gas Price', `${formatValue(txData.gasPrice, 9)} Gwei`],
      ['Transaction Fee', `${formatValue(BigInt(receipt.gasUsed) * BigInt(txData.gasPrice))} ETH`],
      ['Date', new Date(txData.timestamp * 1000).toLocaleDateString()]
    ]
    
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif'
    details.forEach(([label, value]) => {
      ctx.fillStyle = secondaryColor
      ctx.textAlign = 'left'
      ctx.fillText(label, 50, yPos)
      
      ctx.fillStyle = textColor
      ctx.textAlign = 'right'
      ctx.fillText(value, 550, yPos)
      
      yPos += 35
    })
    
    // Footer
    yPos += 20
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = '#667eea'
    ctx.textAlign = 'center'
    ctx.fillText('Generated by tools.nishu.dev', 300, yPos)
  }
  
  const generateTweet = () => {
    const statusEmoji = receipt.status === 1 ? '✅' : '❌'
    const chainName = chain.charAt(0) + chain.slice(1).toLowerCase()
    const explorerUrl = `${RPC_CHAINS[chain].explorer}/tx/${txData.hash}`
    
    const tweetText = `${statusEmoji} Transaction ${getStatusText(receipt.status)} on ${chainName}\\n\\n` +
      `💰 Value: ${formatValue(txData.value)} ETH\\n` +
      `⛽ Gas: ${formatGas(receipt.gasUsed)}\\n` +
      `🧱 Block: ${receipt.blockNumber.toLocaleString()}\\n\\n` +
      `${explorerUrl}\\n\\n` +
      `#${chainName} #crypto #blockchain`
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(tweetUrl, '_blank')
  }

  return (
    <main className={`${styles.main} ${isDarkMode ? 'dark' : 'light'}`}>
      <a href='/' className={styles.home}>🏠</a>
      
      <div className="receipt-container">
        <div className="header">
          <div className="header-top">
            <h1>Transaction Receipt</h1>
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p>Beautiful, screenshotable transaction receipts</p>
        </div>

        <div className="input-section">
          <select 
            className="chain-select"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
          >
            <option value="ETHEREUM">Ethereum</option>
            <option value="POLYGON">Polygon</option>
            <option value="BASE">Base</option>
          </select>

          <div className="search-container">
            <input
              className="tx-input"
              placeholder="Enter transaction hash..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching transaction data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {txData && receipt && (
          <div className="receipt">
            {nftData && (
              <div className="nft-section">
                <div className="nft-image">
                  {nftData.image ? (
                    <img 
                      src={nftData.image} 
                      alt={nftData.name || 'NFT'} 
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className="nft-placeholder" style={{display: nftData.image ? 'none' : 'flex'}}>
                    🖼️
                  </div>
                </div>
                <div className="nft-info">
                  <h3>{nftData.name || 'Unknown NFT'}</h3>
                  <p>Token ID: {nftData.tokenId}</p>
                  <p className="contract-address">{formatAddress(nftData.contractAddress)}</p>
                </div>
              </div>
            )}

            <div className="tx-header">
              <div className="status">
                <span className="status-icon">{getStatusIcon(receipt.status)}</span>
                <span className="status-text">{getStatusText(receipt.status)}</span>
              </div>
              <div className="block-number">
                Block #{receipt.blockNumber.toLocaleString()}
              </div>
            </div>

            <div className="tx-details">
              <div className="detail-row">
                <span className="label">Transaction Hash</span>
                <span className="value hash" onClick={() => copyToClipboard(txData.hash)}>
                  {formatHash(txData.hash)}
                  <span className="copy-icon">📋</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="label">From</span>
                <span className="value address" onClick={() => copyToClipboard(txData.from)}>
                  {formatAddress(txData.from)}
                  <span className="copy-icon">📋</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="label">To</span>
                <span className="value address" onClick={() => copyToClipboard(txData.to)}>
                  {formatAddress(txData.to)}
                  <span className="copy-icon">📋</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Value</span>
                <span className="value">{formatValue(txData.value)} ETH</span>
              </div>

              <div className="detail-row">
                <span className="label">Gas Used</span>
                <span className="value">{formatGas(receipt.gasUsed)} / {formatGas(txData.gasLimit)}</span>
              </div>

              <div className="detail-row">
                <span className="label">Gas Price</span>
                <span className="value">{formatValue(txData.gasPrice, 9)} Gwei</span>
              </div>

              <div className="detail-row">
                <span className="label">Transaction Fee</span>
                <span className="value">
                  {formatValue(BigInt(receipt.gasUsed) * BigInt(txData.gasPrice))} ETH
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Nonce</span>
                <span className="value">{txData.nonce}</span>
              </div>

              {receipt.blockHash && txData.timestamp && (
                <div className="detail-row">
                  <span className="label">Date</span>
                  <span className="value">{new Date(txData.timestamp * 1000).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button 
                className="screenshot-btn"
                onClick={generateScreenshot}
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? '📸 Generating...' : '📸 Screenshot'}
              </button>
              
              <button 
                className="tweet-btn"
                onClick={generateTweet}
              >
                🐦 Tweet
              </button>
            </div>

            <div className="action-buttons">
              <button 
                className="screenshot-btn"
                onClick={generateScreenshot}
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? '📸 Generating...' : '📸 Screenshot'}
              </button>
              
              <button 
                className="tweet-btn"
                onClick={generateTweet}
              >
                🐦 Tweet
              </button>
            </div>

            <div className="footer">
              <a 
                href={`${RPC_CHAINS[chain].explorer}/tx/${txData.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-link"
              >
                View on {chain.charAt(0) + chain.slice(1).toLowerCase()} Explorer ↗
              </a>
            </div>
          </div>
        )}
      </div>
      
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />

      <style jsx>{`
        .receipt-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          color: white;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-top {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-bottom: 10px;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .theme-toggle {
          background: ${isDarkMode ? '#333' : '#e2e8f0'};
          border: 1px solid ${isDarkMode ? '#555' : '#cbd5e0'};
          border-radius: 8px;
          padding: 8px 12px;
          color: ${isDarkMode ? 'white' : '#2d3748'};
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background: ${isDarkMode ? '#444' : '#d2d6dc'};
          transform: scale(1.05);
        }

        .header p {
          color: ${isDarkMode ? '#888' : '#64748b'};
          margin: 0;
        }

        .input-section {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .chain-select {
          background: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
          border: 1px solid ${isDarkMode ? '#333' : '#e2e8f0'};
          border-radius: 8px;
          padding: 12px 16px;
          color: ${isDarkMode ? 'white' : '#2d3748'};
          font-size: 14px;
          outline: none;
          cursor: pointer;
          min-width: 120px;
        }

        .chain-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-container {
          flex: 1;
        }

        .tx-input {
          width: 100%;
          background: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
          border: 1px solid ${isDarkMode ? '#333' : '#e2e8f0'};
          border-radius: 8px;
          padding: 12px 16px;
          color: ${isDarkMode ? 'white' : '#2d3748'};
          font-size: 14px;
          outline: none;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        }

        .tx-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .tx-input::placeholder {
          color: #666;
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #333;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #ef4444;
        }

        .receipt {
          background: ${isDarkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'};
          border: 1px solid ${isDarkMode ? '#333' : '#e2e8f0'};
          border-radius: 16px;
          padding: 30px;
          box-shadow: ${isDarkMode ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.1)'};
          backdrop-filter: blur(10px);
        }

        .nft-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
          border-radius: 12px;
          border: 1px solid ${isDarkMode ? '#333' : '#e2e8f0'};
        }

        .nft-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: ${isDarkMode ? '#333' : '#f1f5f9'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nft-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .nft-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: ${isDarkMode ? '#666' : '#cbd5e0'};
          background: ${isDarkMode ? '#222' : '#f7fafc'};
          border-radius: 8px;
        }

        .nft-info h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: ${isDarkMode ? 'white' : '#1a202c'};
        }

        .nft-info p {
          margin: 4px 0;
          color: ${isDarkMode ? '#888' : '#64748b'};
          font-size: 14px;
        }

        .contract-address {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        }

        .tx-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid ${isDarkMode ? '#333' : '#e2e8f0'};
        }

        .status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-icon {
          font-size: 20px;
        }

        .status-text {
          font-weight: 600;
          font-size: 18px;
          color: ${isDarkMode ? 'white' : '#1a202c'};
        }

        .block-number {
          color: ${isDarkMode ? '#888' : '#64748b'};
          font-size: 14px;
        }

        .tx-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          color: ${isDarkMode ? '#888' : '#64748b'};
          font-size: 14px;
          font-weight: 500;
        }

        .value {
          color: ${isDarkMode ? 'white' : '#1a202c'};
          font-weight: 600;
          font-size: 14px;
          text-align: right;
        }

        .value.hash,
        .value.address {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .value.hash:hover,
        .value.address:hover {
          color: #667eea;
        }

        .copy-icon {
          opacity: 0;
          margin-left: 8px;
          transition: opacity 0.2s ease;
        }

        .value.hash:hover .copy-icon,
        .value.address:hover .copy-icon {
          opacity: 1;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .screenshot-btn,
        .tweet-btn {
          background: ${isDarkMode ? '#333' : '#f1f5f9'};
          border: 1px solid ${isDarkMode ? '#555' : '#e2e8f0'};
          border-radius: 8px;
          padding: 12px 20px;
          color: ${isDarkMode ? 'white' : '#2d3748'};
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .screenshot-btn:hover:not(:disabled),
        .tweet-btn:hover {
          background: ${isDarkMode ? '#444' : '#e2e8f0'};
          transform: translateY(-1px);
        }
        
        .screenshot-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .tweet-btn {
          background: #1da1f2;
          border-color: #1da1f2;
          color: white;
        }
        
        .tweet-btn:hover {
          background: #1991db;
          border-color: #1991db;
        }

        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid ${isDarkMode ? '#333' : '#e2e8f0'};
        }

        .explorer-link {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .explorer-link:hover {
          color: #764ba2;
        }

        @media (max-width: 768px) {
          .receipt-container {
            padding: 15px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .input-section {
            flex-direction: column;
          }

          .chain-select {
            min-width: 100%;
          }

          .receipt {
            padding: 20px;
          }

          .nft-section {
            flex-direction: column;
            text-align: center;
          }

          .nft-image {
            width: 120px;
            height: 120px;
          }

          .tx-header {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .value {
            text-align: left;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .screenshot-btn,
          .tweet-btn {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </main>
  )
}

export default TxReceipt
