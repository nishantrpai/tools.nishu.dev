import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function Home() {
  const [colors, setColors] = useState([{ id: 1, hex: '#FF0000' }, { id: 2, hex: '#0000FF' }])
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [nextId, setNextId] = useState(3)
  const [blendedColor, setBlendedColor] = useState('#000000')
  const [blendMethod, setBlendMethod] = useState('average') // average, additive, subtractive
  
  useEffect(() => {
    // Calculate blended color whenever colors array changes
    if (colors.length > 0) {
      calculateBlendedColor()
    }
  }, [colors, blendMethod])

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
    navigator.clipboard.writeText(text).then(() => {
      // Copied successfully
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
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
                  <button onClick={() => copyToClipboard(blendedColor)}>Copy Hex</button>
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
