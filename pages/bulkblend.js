// bulk blend a layer onto images in the browser
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [images1, setImages1] = useState([])
  const [images2, setImages2] = useState([])
  const [blendMode, setBlendMode] = useState('normal')
  const [opacity, setOpacity] = useState(1)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const allBlends = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
  const handleImage1 = async (e) => {
    const files = e.target.files
    setImages1([])
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const image = await loadImage(files[i])
      setImages1(prevImages => [...prevImages, image])
    }
  }

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          resolve(image)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleImage2 = async (e) => {
    const files = e.target.files
    setImages2([])
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const image = await loadImage(files[i])
      setImages2(prevImages => [...prevImages, image])
    }
  }


  const handleBlendMode = (e) => {
    setBlendMode(e.target.value)
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }

  const downloadImage = (i, j, k) => {
    // get higher resolution image
    const canvas = document.getElementById(`canvas-${i}-${j}-${k}`)
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = 'blended-image-' + i + '.png'
    a.click()
  }

  const renderCanvas = (image1, image2, i, j, k) => {
    const canvas = document.getElementById(`canvas-${i}-${j}-${k}`)
    const ctx = canvas.getContext('2d')
    canvas.width = image1.width
    canvas.height = image1.height
    ctx.globalAlpha = opacity
    ctx.globalCompositeOperation = allBlends[k]
    // draw rectangle to not add transparency to the image
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(image2, 0, 0, canvas.width, canvas.height)
  }

  useEffect(() => {
    console.log(images1.length, images2.length)
    if (images1.length > 0 && images2.length > 0) {
      allBlends.forEach((blend, k) => {
        images1.forEach((image1, i) => {
          images2.forEach((image2, j) => {
            console.log(i, j)
            renderCanvas(image1, image2, i, j, k)
          })
        })
      })

    }
  }, [images1, images2, blendMode, opacity])

  // we'll need a grid of canvas and each canvas will have image for image1 and image2 i,j
  // we'll blend image1 onto image2 and show the result in canvas
  // we'll also have a download button for each canvas on click

  return (
    <>
      <Head>
        <title>Bulk Blend Layer</title>
        <meta name="description" content="Bulk blend a layer onto images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Blend Layer
        </h1>

        <p className={styles.description}>
          Blend multiple images together
        </p>

        <div className={styles.searchContainer}>
          <input type='file' onChange={handleImage1} multiple />
          <input type='file' onChange={handleImage2} multiple />
          {/* <select onChange={handleBlendMode}>
            <option value='normal'>Normal</option>
            <option value='multiply'>Multiply</option>
            <option value='screen'>Screen</option>
            <option value='overlay'>Overlay</option>
            <option value='darken'>Darken</option>
            <option value='lighten'>Lighten</option>
            <option value='color-dodge'>Color Dodge</option>
            <option value='color-burn'>Color Burn</option>
            <option value='hard-light'>Hard Light</option>
            <option value='soft-light'>Soft Light</option>
            <option value='difference'>Difference</option>
            <option value='exclusion'>Exclusion</option>
            <option value='hue'>Hue</option>
            <option value='saturation'>Saturation</option>
            <option value='color'>Color</option>
            <option value='luminosity'>Luminosity</option>
          </select> */}
          <input type='range' min='0' max='1' step='0.01' onChange={handleOpacity} />
        </div>
        <div className='grid'>
          {allBlends.map((blend, k) => (
            (images1.map((image1, i) => (
              images2.map((image2, j) => (
                <div key={i + j} className={styles.gridItem}>
                  <canvas id={`canvas-${i}-${j}-${k}`} style={{ width: '500px' }} ref={setCanvas} />
                  <button onClick={() => downloadImage(i, j, k)}>Download</button>
                </div>
              ))
            )))
          ))}

        </div>
      </main>
    </>
  )
}