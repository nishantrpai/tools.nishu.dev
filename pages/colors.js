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
  const [color, setColor] = useState('#000000')
  const [cellColor, setCellColor] = useState('')
  const [colorGrid, setColorGrid] = useState([])
  
  // State variables for ownership checking
  const [colorOwner, setColorOwner] = useState(null)
  const [colorTokenId, setColorTokenId] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    generateColorGrid(color)
  }, [color])

  // Check if the color is already owned whenever cellColor changes
  useEffect(() => {
    if (cellColor) {
      checkOwnership(cellColor);
    }
  }, [cellColor]);

  const generateColorGrid = (baseColor) => {
    const grid = []
    for (let i = 0; i < 10; i++) {
      const row = []
      for (let j = 0; j < 10; j++) {
        const lightness = 100 - (i * 10 + j * 10) / 2
        row.push(adjustColor(baseColor, lightness))
      }
      grid.push(row)
    }
    setColorGrid(grid)
  }

  // Check if the color is owned
  const checkOwnership = async (colorHex) => {
    if (!colorHex || !isValidHexColor(colorHex)) {
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
      const colorValue = colorHex.trim();
      
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

  // Validate hex color format
  const isValidHexColor = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  // Generate OpenSea link for the selected color
  const getOpenSeaLink = () => {
    return `https://opensea.io/assets/base/${contractAddress}/${colorTokenId}`;
  };

  const adjustColor = (hex, lightness) => {
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl[2] = lightness / 100
    const adjustedRgb = hslToRgb(hsl[0], hsl[1], hsl[2])
    return rgbToHex(adjustedRgb[0], adjustedRgb[1], adjustedRgb[2])
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return [h, s, l]
  }

  const hslToRgb = (h, s, l) => {
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // alert(`Copied ${text} to clipboard!`)
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const downloadImage = () => {
      const gridElement = document.getElementById('color-grid')
      html2canvas(gridElement, {
        scale: 2,
        backgroundColor: '#000000',
      }).then((canvas) => {
        const a = document.createElement('a')
        a.href = canvas.toDataURL()
        a.download = 'color-grid.png'
        a.click()
      })
  }
  return (
    <>
      <Head>
        <title>Color Grid Generator</title>
        <meta name="description" content="Generate a 10x10 color grid from a base color" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Color Grid Generator</h1>
        <h2 className={styles.description}>Select a color to generate a 10x10 color grid</h2>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <div id="color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 50px)', gap: '0px' }}>
          {colorGrid.map((row, i) => 
            row.map((cellColor, j) => 
              <div 
                key={`${i}-${j}`} 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: cellColor,
                  border: cellColor === color ? '2px solid #ffffff' : 'none',
                  cursor: 'pointer'
                }} 
                onClick={() => {
                  copyToClipboard(cellColor)
                  setCellColor(cellColor) 
                }}
              />
            )
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, justifyContent: 'space-between', marginTop: '20px' }}>
          <span>Selected Color: {cellColor}</span>
          
          {/* NFT Availability Section */}
          {cellColor && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #333', 
              borderRadius: '8px',
              backgroundColor: '#000',
              width: '100%',
              maxWidth: '500px',
              marginTop: '1rem'
            }}>
              <h3>Is this available on basecolors?</h3>
              <div>
                {isChecking ? (
                  <p style={{ margin: '0.5rem 0', color: '#ffffff' }}>Checking ownership status...</p>
                ) : colorTokenId ? (
                  <div>
                    <p style={{ margin: '0.5rem 0', color: '#e53e3e' }}>
                      {cellColor} is already owned by:{' '}
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
                      {cellColor} is available to mint as an NFT
                    </p>
                    
                    {/* Mint options for available colors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
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
          )}
          
          <button onClick={downloadImage}>Download</button>
        </div>
      </main>
    </>
  )
}
