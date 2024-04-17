// Add "↑" on any image: on the canvas image add "↑" in the middle, font size 2rem
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Higher() {
  const [image, setImage] = useState(null)
  let higher = '↑';
  // upload image, add text in the center
  
  useEffect(() => {
    if (!image) return
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image
    img.onload = () => {
      
      let ratio = img.height / img.width
      canvas.width = img.width
      canvas.height = img.height
      // add opacity to image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      // draw a rectangle with 0.8 opacity
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // remove opacity
      ctx.globalAlpha = 1

      ctx.font = `${ratio * 5}rem  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      // add opacity to 
      ctx.globalAlpha = 1
      ctx.fillText(higher, canvas.width / 2 + (10 * ratio), canvas.height / 2 - 50)
    }
  }, [image])

  const download = () => {
    // rescale the canvas to img size

    const canvas = document.getElementById('canvas')
    const image = canvas.toDataURL()
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = 'higher.png'
    a.click()
  }

  return (
    <>
      <Head>
        <title>Higher</title>
        <meta name="description" content="Add '↑' on any image" />
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
      <main>
      <h1>Higher</h1>
      <span style={{
        fontSize: '14px',
        color: 'gray',
        marginBottom: '20px',
      }}>
        Go Higer! Add "↑" on any image
      </span>
      <form>
        <input type="file" onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}  placeholder='Choose your file'/>
      </form>
      <canvas id="canvas" width="300" height="300"></canvas>
      {image && <button style={{
        padding: '10px',
        backgroundColor: '#111',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
      }} onClick={download}>Download</button>}

      </main>
      
    </>
  )
}