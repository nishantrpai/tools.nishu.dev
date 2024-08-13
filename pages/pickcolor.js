// pick natural colors from an image by hovering on the canvas
// and clicking on the desired color
// the color will be added to the palette
// there will be 5 colors in the palette
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import html2canvas from 'html2canvas'

export default function NaturalGradient() {
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)
  const [palette, setPalette] = useState(['#000', '#000', '#000', '#000', '#000'])

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
  }
  , [canvas, context])

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

  
  const pickColor = (x, y) => {
    console.log(x, y);
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
    const color = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
    return color
  }

  const handleStop = (index, data) => {
    const rect = canvas.getBoundingClientRect()
    let scaleX = canvas.width / rect.width
    let scaleY = canvas.height / rect.height
    const x = data.x * scaleX
    const y = data.y * scaleY

    console.log(x, y)
    const color = pickColor(x, y)
    setPalette((prevPalette) => {
      const newPalette = [...prevPalette]
      newPalette[index] = color
      return newPalette
    })

  }

  const rgbToHex = ([r, g, b]) => {
    console.log(r, g, b)
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  let initialPositions = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 0 },
    { x: 30, y: 0 },
    { x: 40, y: 0 },
  ]

  // initialPositions = initialPositions.map((pos) => {
  //   return {
  //     x: pos.x + window.innerWidth / 2,
  //     y: pos.y + window.innerHeight / 2,
  //   }
  // })

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
        </div>
        <button style={{
          marginTop: '10px',
        }} onClick={() => {
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
