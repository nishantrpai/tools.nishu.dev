// pick natural colors from an image by hovering on the canvas
// and clicking on the desired color
// the color will be added to the palette
// there will be 5 colors in the palette
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
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

export default function NaturalGradient() {
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)
  const [palette, setPalette] = useState(['#000', '#000', '#000', '#000', '#000'])
  const [colorStates, setColorStates] = useState([
    { isChecking: false, owner: null, tokenId: null },
    { isChecking: false, owner: null, tokenId: null },
    { isChecking: false, owner: null, tokenId: null },
    { isChecking: false, owner: null, tokenId: null },
    { isChecking: false, owner: null, tokenId: null }
  ])
  const [selectedColorIndex, setSelectedColorIndex] = useState(null)

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    setCanvas(canvas)
    setContext(context)
  }, [])

  // add copy paste functionality
  useEffect(() => {
    window.addEventListener('paste', async (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
              canvas.width = img.width
              canvas.height = img.height
              context.clearRect(0, 0, canvas.width, canvas.height) // clear canvas before drawing new image
              context.drawImage(img, 0, 0)
              setImage(img)
            }
          }
          reader.readAsDataURL(blob)
        }
      }
    })
  }, [canvas, context])

  // Check if the color is already owned whenever palette changes
  useEffect(() => {
    palette.forEach((color, index) => {
      if (color !== '#000') {
        checkOwnership(color, index);
      }
    });
  }, [palette]);

  const handleImage = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        context.clearRect(0, 0, canvas.width, canvas.height) // clear canvas before drawing new image
        context.drawImage(img, 0, 0)
        setImage(img)
      }
    }
    reader.readAsDataURL(file)
  }

  // Check if the color is owned
  const checkOwnership = async (colorHex, index) => {
    if (!colorHex || !isValidHexColor(colorHex)) {
      return;
    }
    
    setColorStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = { ...newStates[index], isChecking: true };
      return newStates;
    });
    
    try {
      // Create a one-time provider for this check
      const tempProvider = new ethers.JsonRpcProvider('https://base.llamarpc.com');
      const tempContract = new ethers.Contract(contractAddress, abi, tempProvider);
      
      // Get the color value without the # prefix
      const colorValue = colorHex.trim();
      
      // First check if the color exists and get its token ID using getColorData
      const colorData = await tempContract.getColorData(colorValue);
      
      // Check if the color is used (minted)
      if (colorData.isUsed) {
        // Now get the owner using the token ID
        const owner = await tempContract.ownerOf(colorData.tokenId);
        
        setColorStates(prevStates => {
          const newStates = [...prevStates];
          newStates[index] = { 
            isChecking: false, 
            owner: owner, 
            tokenId: colorData.tokenId.toString() 
          };
          return newStates;
        });
      } else {
        // Color exists in the system but isn't minted/used
        setColorStates(prevStates => {
          const newStates = [...prevStates];
          newStates[index] = { isChecking: false, owner: null, tokenId: null };
          return newStates;
        });
      }
    } catch (error) {
      // If the color doesn't exist or there's an error
      console.error('Error checking color ownership:', error);
      setColorStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = { isChecking: false, owner: null, tokenId: null };
        return newStates;
      });
    }
  };

  // Validate hex color format
  const isValidHexColor = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  // Generate OpenSea link for a selected color
  const getOpenSeaLink = (tokenId) => {
    return `https://opensea.io/assets/base/${contractAddress}/${tokenId}`;
  };
  
  const pickColor = (x, y) => {
    const imgData = context.getImageData(x, y, 5, 5).data
    // pick dominant color from a 5x5 pixel area
    let dominantColor = [0, 0, 0]
    let maxCount = 0
    const colorCount = {}
    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i]
      const g = imgData[i + 1]
      const b = imgData[i + 2]
      const color = `rgb(${r}, ${g}, ${b})`
      if (colorCount[color]) {
        colorCount[color]++
      } else {
        colorCount[color] = 1
      }
      if (colorCount[color] > maxCount) {
        maxCount = colorCount[color]
        dominantColor = [r, g, b]
      }
    }
    // Convert RGB to HEX
    const hexColor = rgbToHex(dominantColor)
    return hexColor
  }

  const handleStop = (index, data) => {
    const rect = canvas.getBoundingClientRect()
    let scaleX = canvas.width / rect.width
    let scaleY = canvas.height / rect.height
    const x = data.x * scaleX
    const y = data.y * scaleY

    const color = pickColor(x, y)
    setPalette((prevPalette) => {
      const newPalette = [...prevPalette]
      newPalette[index] = color
      return newPalette
    })
    
    setSelectedColorIndex(index)
  }

  const rgbToHex = (rgb) => {
    const [r, g, b] = rgb
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied ${text} to clipboard!`)
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  let initialPositions = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 0 },
    { x: 30, y: 0 },
    { x: 40, y: 0 },
  ]

  return (
    <div className={styles.container}>
      <Head>
        <title>Pick Colors</title>
        <meta name="description" content="Pick colors from an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pick colors
        </h1>
        <h2 className={styles.description}>
          Pick colors from an image
        </h2>

        <input type="file" onChange={handleImage} />
        <div id="palette-card" style={{
          width: '100%',
          height: '100%',
          padding: '10px',
        }}>

        <div style={{
          display: 'flex',
          border: '1px solid #111',
          borderRadius: '10px',
          width: '100%',
          height: '100%',
        }}>
          <div id="circles" style={{
            position: 'relative',
          }}>
            {initialPositions.map((pos, index) => (
              <Draggable key={index} onStop={(e, data) => handleStop(index, data)} defaultPosition={pos}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.25)', 
                    border: '1px solid #fff',
                    boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                    position: 'absolute',
                    zIndex: 100,
                  }}
                ></div>
              </Draggable>
            ))}
          </div>

          <canvas
            id="canvas"
            style={{
              border: '1px solid #0e0e0e',
              width: '100%',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)',
              borderRadius: '10px',
            }}
          >
          </canvas>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          padding:2,
        }}>
          {palette.map((color, index) => (
            <div style={{
              flex: '25%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <div
              key={index}
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: color,
                borderRadius: index === 0 ? '5px 0 0 5px' : index === 4 ? '0 5px 5px 0' : 0,
                display: 'inline-block',
              }}
            ></div>
            <span style={{
              textAlign: 'center',
              color: '#888',
              fontSize: '12px'
            }}>
              {!color.startsWith('#') ? rgbToHex(color.replace('rgb(', '').replace(')', '').split(',').map((x) => parseInt(x))) : color} 
            </span>
            </div>
          ))}
        </div>

        {/* Color Details and BaseColors Availability */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',  // Changed to column layout
          alignItems: 'center',
          marginTop: '30px',
          gap: '20px',
          width: '100%'
        }}>
          {palette.map((color, index) => (
            color !== '#000' && (
              <div key={`details-${index}`} style={{
                width: '100%',  // Full width for column layout
                maxWidth: '500px', // Limit max width for better readability
                display: 'flex',  // Make each color card a row
                border: '1px solid #333',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#111'
              }}>
                {/* Color Display - Left side */}
                <div style={{
                  width: '120px',  // Fixed width for the color square
                  height: '120px',
                  backgroundColor: color,
                  position: 'relative',
                  flexShrink: 0, // Prevent shrinking
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#fff'
                  }}>
                    {color}
                  </div>
                </div>
                
                {/* Color Availability - Right side */}
                <div style={{
                  padding: '15px',
                  color: '#fff',
                  flex: 1,  // Take remaining space
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>BaseColors Status</h4>
                  
                  {colorStates[index].isChecking ? (
                    <p style={{ fontSize: '14px', color: '#999' }}>Checking availability...</p>
                  ) : colorStates[index].owner ? (
                    <>
                      <p style={{ fontSize: '14px', color: '#e53e3e', margin: '5px 0' }}>
                        Already owned by:
                      </p>
                      <a
                        href={`https://basescan.org/address/${colorStates[index].owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: '#0070f3', wordBreak: 'break-all' }}
                      >
                        {colorStates[index].owner.slice(0, 6)}...{colorStates[index].owner.slice(-4)}
                      </a>
                      {colorStates[index].tokenId && (
                        <>
                          <p style={{ fontSize: '14px', margin: '10px 0 5px 0' }}>
                            Token ID: {colorStates[index].tokenId}
                          </p>
                          <a
                            href={getOpenSeaLink(colorStates[index].tokenId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '13px', color: '#0070f3' }}
                          >
                            View on OpenSea
                          </a>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '14px', color: '#38a169', margin: '5px 0' }}>
                        Available to mint
                      </p>
                      <a
                        href="https://www.basecolors.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: '#0070f3' }}
                      >
                        Mint on BaseColors.com
                      </a>
                    </>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
        </div>
        <button  onClick={() => {
          const paletteCard = document.getElementById('palette-card')
          html2canvas(paletteCard, {
            backgroundColor: '#000',
          }).then((canvas) => {
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'palette.png'
            a.click()
          })
        }}>
          Download Palette
        </button>
      </main>
    </div>
  )
}
