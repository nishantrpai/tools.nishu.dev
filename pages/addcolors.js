import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { ethers } from 'ethers'

// Contract details
const contractAddress = '0x7bc1c072742d8391817eb4eb2317f98dc72c61db';
const abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "color",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "color",
        "type": "string"
      }
    ],
    "name": "getColorData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isUsed",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "nameChangeCount",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "modifiableTraits",
            "type": "string[]"
          }
        ],
        "internalType": "struct IBaseColors.ColorData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function Home() {
  const [colors, setColors] = useState([{ id: 1, hex: '#FF0000' }, { id: 2, hex: '#0000FF' }])
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [nextId, setNextId] = useState(3)
  const [blendedColor, setBlendedColor] = useState('')
  const [blendMethod, setBlendMethod] = useState('average') // average, additive, subtractive
  
  // Wallet and contract state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [colorOwner, setColorOwner] = useState(null);
  const [colorTokenId, setColorTokenId] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  
  // Calculate blended color whenever colors array changes
  useEffect(() => {
    if (colors.length > 0) {
      calculateBlendedColor()
    }
  }, [colors, blendMethod])

  // Check if the color is already owned whenever blendedColor changes
  useEffect(() => {
    const checkOwnership = async () => {
      if (!blendedColor || !isValidHexColor(blendedColor)) {
        setColorOwner(null);
        setColorTokenId(null);
        return;
      }
      
      setIsChecking(true);
      
      try {
        // Create a one-time provider for this check
        const tempProvider = new ethers.JsonRpcProvider('https://base.llamarpc.com');
        const tempContract = new ethers.Contract(contractAddress, abi, tempProvider);
        
        // Get the color value without the # prefix
        const colorValue = blendedColor.trim();
        
        // First check if the color exists and get its token ID using getColorData
        const colorData = await tempContract.getColorData(colorValue);

        console.log('Color data:', colorValue, colorData, colorData.isUsed, colorData.tokenId);
        
        // Check if the color is used (minted)
        if (colorData.isUsed) {
          setColorTokenId(colorData.tokenId);
          
          // Now get the owner using the token ID
          const owner = await tempContract.ownerOf(colorData.tokenId);
          setColorOwner(owner);
        } else {
          // Color exists in the system but isn't minted/used
          setColorOwner(null);
        }
      } catch (error) {
        // If the color doesn't exist or there's an error
        console.error('Error checking color ownership:', error);
        setColorOwner(null);
        setColorTokenId(null);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkOwnership();
  }, [blendedColor]);

  // Connect to the user's wallet
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(walletProvider);
        const walletSigner = walletProvider.getSigner();
        setSigner(walletSigner);
        const walletContract = new ethers.Contract(contractAddress, abi, walletSigner);
        setContract(walletContract);
      } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet.');
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  // Ensure the user is on the Base chain (chainId: 8453)
  const checkNetwork = async () => {
    if (!provider) return false;
    
    const network = await provider.getNetwork();
    if (network.chainId !== 8453) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 8453 in hex
        });
        return true;
      } catch (error) {
        console.error('Network switch failed:', error);
        alert('Please switch to the Base chain.');
        return false;
      }
    }
    return true;
  };

  // Mint the blended color
  const mintColor = async () => {
    if (!isValidHexColor(blendedColor)) {
      alert('Invalid color format. Please blend a valid color.');
      return;
    }

    if (colorOwner) {
      alert('This color is already owned and cannot be minted again.');
      return;
    }

    if (!contract) {
      alert('Please connect your wallet first.');
      return;
    }

    setIsMinting(true);
    try {
      const networkReady = await checkNetwork();
      if (!networkReady) {
        setIsMinting(false);
        return;
      }
      
      const colorToMint = blendedColor.replace('#', '');
      const tx = await contract.mint(colorToMint);
      console.log('Transaction hash:', tx.hash);
      await tx.wait();
      alert('Color minted successfully!');
      
      // Refresh ownership status
      try {
        const tempProvider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');
        const tempContract = new ethers.Contract(contractAddress, abi, tempProvider);
        
        const colorData = await tempContract.getColorData(colorToMint);
        let tokenId = colorData.tokenId.toString();
        if (tokenId !== '0') {
          // big number to string
          setColorTokenId(tokenId);
          const owner = await tempContract.ownerOf(colorData.tokenId);
          setColorOwner(owner);
        } else {
          setColorTokenId(null);
          setColorOwner(null);
        }
      } catch (error) {
        console.error('Error checking new ownership:', error);
        if(error.message.includes('color not used')) {
          setColorTokenId(null);
          setColorOwner(null);
        }
      }
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. ' + (error.message || 'Check console for details.'));
    } finally {
      setIsMinting(false);
    }
  };

  // Validate hex color format
  const isValidHexColor = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  const calculateBlendedColor = () => {
    if (colors.length === 0) return '#000000'
    if (colors.length === 1) return colors[0].hex

    // Convert all hex colors to RGB
    const rgbColors = colors.map(color => hexToRgb(color.hex))
    
    let result
    
    switch(blendMethod) {
      case 'average':
        // Average all colors
        result = rgbColors.reduce((acc, curr) => {
          return {
            r: acc.r + curr.r,
            g: acc.g + curr.g,
            b: acc.b + curr.b
          }
        }, { r: 0, g: 0, b: 0 })
        
        result.r = Math.round(result.r / rgbColors.length)
        result.g = Math.round(result.g / rgbColors.length)
        result.b = Math.round(result.b / rgbColors.length)
        break
        
      case 'additive':
        // Additive blending (like light)
        result = rgbColors.reduce((acc, curr) => {
          return {
            r: Math.min(255, acc.r + curr.r),
            g: Math.min(255, acc.g + curr.g),
            b: Math.min(255, acc.b + curr.b)
          }
        }, { r: 0, g: 0, b: 0 })
        break
        
      case 'subtractive':
        // Subtractive blending (like paint)
        result = rgbColors.reduce((acc, curr, index) => {
          if (index === 0) return curr
          return {
            r: Math.max(0, Math.round((acc.r + curr.r) / 2)),
            g: Math.max(0, Math.round((acc.g + curr.g) / 2)),
            b: Math.max(0, Math.round((acc.b + curr.b) / 2))
          }
        })
        break
        
      default:
        result = rgbColors[0]
    }
    
    const hexResult = rgbToHex(result.r, result.g, result.b)
    setBlendedColor(hexResult)
    return hexResult
  }

  const addColor = () => {
    setColors([...colors, { id: nextId, hex: '#000000' }])
    setNextId(nextId + 1)
  }
  
  const removeColor = (id) => {
    setColors(colors.filter(color => color.id !== id))
  }
  
  const updateColor = (id, hex) => {
    setColors(colors.map(color => 
      color.id === id ? { ...color, hex } : color
    ))
  }
  
  const selectColor = (hex) => {
    setSelectedColor(hex)
    copyToClipboard(hex)
  }
  
  const copyToClipboard = (text) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text).then(() => {
        // Show success message
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      }, (err) => {
        console.error('Could not copy text: ', err)
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000);
      })
    }
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const downloadImage = () => {
    const paletteElement = document.getElementById('color-palette')
    html2canvas(paletteElement, {
      scale: 2,
      backgroundColor: '#ffffff',
    }).then((canvas) => {
      const a = document.createElement('a')
      a.href = canvas.toDataURL()
      a.download = 'color-palette.png'
      a.click()
    })
  }

  // Generate OpenSea link for the current blended color
  const getOpenSeaLink = () => {
    
    // Use the token ID from the contract if available
    return `https://opensea.io/assets/base/${contractAddress}/${colorTokenId}`;
  };

  return (
    <>
      <Head>
        <title>Color Blender</title>
        <meta name="description" content="Blend multiple colors together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Color Blender</h1>
        <h2 className={styles.description}>Combine multiple colors to create new ones</h2>
        
        <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Your Colors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {colors.map(color => (
                <div key={color.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(color.id, e.target.value)}
                  />
                  <input 
                    type="text"
                    value={color.hex}
                    onChange={(e) => updateColor(color.id, e.target.value)}
                    style={{ width: '100px' }}
                  />
                  <button onClick={() => selectColor(color.hex)}>Select</button>
                  <button onClick={() => removeColor(color.id)}>Remove</button>
                </div>
              ))}
            </div>
            <button 
              onClick={addColor} 
              style={{ marginTop: '1rem' }}
            >
              Add New Color
            </button>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Blend Method</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label>
                  <input 
                    type="radio" 
                    name="blendMethod" 
                    value="average" 
                    checked={blendMethod === 'average'} 
                    onChange={() => setBlendMethod('average')} 
                  /> 
                  Average
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="blendMethod" 
                    value="additive" 
                    checked={blendMethod === 'additive'} 
                    onChange={() => setBlendMethod('additive')} 
                  /> 
                  Additive
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="blendMethod" 
                    value="subtractive" 
                    checked={blendMethod === 'subtractive'} 
                    onChange={() => setBlendMethod('subtractive')} 
                  /> 
                  Subtractive
                </label>
              </div>
            </div>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div id="color-palette" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3>Final Blended Color</h3>
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  backgroundColor: blendedColor,
                  borderRadius: '4px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  marginTop: '0.5rem'
                }}></div>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: '0' }}>Result: {blendedColor}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => copyToClipboard(blendedColor.replace('#', ''))}>
                      Copy Hex
                    </button>
                    {copySuccess && (
                      <span style={{ fontSize: '0.8rem', color: '#38a169' }}>{copySuccess}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* NFT Minting Section */}
              <div style={{ 
                padding: '1rem', 
                border: '1px solid #333', 
                borderRadius: '8px',
                backgroundColor: '#000' 
              }}>
                <h3>Is this available on basecolors?</h3>
                <div>
                  {isChecking ? (
                    <p style={{ margin: '0.5rem 0', color: '#ffffff' }}>Checking ownership status...</p>
                  ) : colorTokenId ? (
                    <div>
                      <p style={{ margin: '0.5rem 0', color: '#e53e3e' }}>
                        This color is already owned by:{' '}
                        <a
                          href={`https://basescan.org/address/${colorOwner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'underline', color: '#0070f3' }}
                        >
                          {colorOwner.slice(0, 6)}...{colorOwner.slice(-4)}
                        </a>
                      </p>
                      {colorTokenId && (
                        <p style={{ margin: '0.5rem 0', color: '#ffffff' }}>
                          Token ID: {colorTokenId.toString()}
                        </p>
                      )}
                      {colorTokenId && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <a
                            href={getOpenSeaLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'inline-block', 
                              margin: '0.5rem 0', 
                              color: '#0070f3', 
                              textDecoration: 'underline'
                            }}
                          >
                            View on OpenSea
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0.5rem 0', color: '#38a169' }}>
                        This color is available to mint as an NFT
                      </p>
                      
                      {/* Mint options for available colors */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {/* Option 1: Mint directly here with wallet */}
                        <div>
                          <a href='https://www.basecolors.com' target="_blank" rel="noopener noreferrer" style={{ 
                              display: 'inline-block', 
                              margin: '0.5rem 0', 
                              color: '#0070f3', 
                              textDecoration: 'underline'
                            }}>
                            Mint on BaseColors.com
                          </a>

                        </div>
                        
                        
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
              
              <div>
                <h3>Source Colors</h3>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {colors.map(color => (
                    <div key={color.id} style={{ textAlign: 'center' }}>
                      <div 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          backgroundColor: color.hex,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                          marginBottom: '0.25rem'
                        }}
                        onClick={() => selectColor(color.hex)}
                      ></div>
                      <div style={{ fontSize: '0.8rem' }}>{color.hex}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3>Blending Process</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  height: '60px'
                }}>
                  {colors.map((color, index) => (
                    <div
                      key={color.id}
                      style={{
                        flex: 1,
                        height: '100%',
                        backgroundColor: color.hex,
                        position: 'relative'
                      }}
                    >
                      {index < colors.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: '#fff'
                        }}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: blendedColor,
                  marginTop: '10px',
                  borderRadius: '4px'
                }}></div>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {blendMethod === 'average' && 'Average: All colors are combined by averaging their RGB values'}
                  {blendMethod === 'additive' && 'Additive: Colors are added together (like light)'}
                  {blendMethod === 'subtractive' && 'Subtractive: Colors are mixed together (like paint)'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={downloadImage}
              style={{ marginTop: '1.5rem' }}
            >
              Download Result
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
