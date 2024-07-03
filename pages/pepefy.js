// add pepe color to an image and save it
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Pepe() {
  const [img, setImg] = useState(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const pepeShades = [
    // dark light pepe shades
    '#67984C', '#7AA357', '#8CB162', '#9EBF6D', '#B0CD78', '#C2DB83', '#D4E98E', '#E6F799',
  ]
  const [pepeShade, setPepeShade] = useState(pepeShades[0])

  const colorDistance = (c1, c2) => {
    return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2)
  }

  const hexToRGB = (hex) => {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ]
  }

  const fillPepeColor = (x, y) => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    let data = imgData.data
    // pick the pixel that mouse is clicking
    let currentPixelColor = canvas.getContext('2d').getImageData(x, y, 1, 1).data
    let rgb = [currentPixelColor[0], currentPixelColor[1], currentPixelColor[2]]
    console.log('rgb', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
    console.log('pepeShade', pepeShade)
    let pepeColor = hexToRGB(pepeShade)
    // find all neighboring pixels that have the same color as the clicked pixel and fill them with the new color
    let stack = [[x, y]]
    let visited = new Set()
    while (stack.length > 0) {
      let [x, y] = stack.pop()
      let index = (y * canvas.width + x) * 4
      if (visited.has(index)) continue
      visited.add(index)
      if (colorDistance([data[index], data[index + 1], data[index + 2]], rgb) < 50) {
        data[index] = pepeColor[0]
        data[index + 1] = pepeColor[1]
        data[index + 2] = pepeColor[2]
        stack.push([x - 1, y])
        stack.push([x + 1, y])
        stack.push([x, y - 1])
        stack.push([x, y + 1])
      }
    }
    context.putImageData(imgData, 0, 0)
  }


  useEffect(() => {
    if (!img) return
    const canvas = document.getElementById('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)
    canvas.addEventListener('click', (event) => {
      const x = event.clientX - canvas.offsetLeft
      const y = event.clientY - canvas.offsetTop
      console.log('clic', 'x', x, 'y', y)
      setX(x)
      setY(y)
      fillPepeColor(x, y)
    })
  }, [img])
  return (
    <>
      <Head>
        <title>Pepe</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Add pepe color to an image and save it" />
      </Head>
      <main>
      <h1 className={styles.title}>
        Pepe
      </h1>
      <h2 className={styles.description}>
        Add pepe color to an image and save it
      </h2>
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
              setImg(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" style={{ border: '1px solid black' }}></canvas>
        <div>
          {pepeShades.map((shade, index) => (
            <button key={index} style={{ backgroundColor: shade, color: 'white' }} onClick={() => setPepeShade(shade)}>
              {shade}
            </button>
          ))}
        </div>
        
        {/* reset */}
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const context = canvas.getContext('2d')
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0)
        }}>
          Reset
        </button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = 'pepe.png'
          a.click()
        }}>
          Save Pepe
        </button>
      </main>

    </>
  )
}