import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherConfessions() {
  const [confession, setConfession] = useState('I JUST WANT TO GO HIGHER.')
  const [confessionSVG, setConfessionSVG] = useState('')
  const arrowPng = 'https://localhost:3000/arrow.png'


  const generateConfession = () => {
    let tempConfession = `
    <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <style type="text/css">
          @font-face {
            font-family: 'Helvetica';
            src: url('fonts/helvetica-bold.ttf') format('truetype');
            font-weight: bold;
          }
        </style>
      </defs>
      <!-- Background -->
      <rect width="100%" height="100%" fill="#06C85F" />
      <rect x="1%" y="1%" width="97.5%" height="97.5%" fill="black" />
      
      <g id="arrow" transform="translate(187.5, 50) scale(0.1)" width="100" height="100">
              <path xmlns="http://www.w3.org/2000/svg" d="M 624 325.5 L 344 605 L 427.75 687.75 L 564.75 550.25 L 564.84 925 H 686.25 V 550.25 L 824 687.75 L 906 605 L 626.5 325.5 H 624 Z" fill="#06C85F"/>

      </g>
      
      <!-- Text -->
      <text>
        ${confession.split('\n').map((line, index) => `<tspan x="50%" y="${40 + (index * 5)}%" font-family="Helvetica" font-size="16" fill="#06C85F" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${line.trim().toUpperCase()}</tspan>`).join('')}
      </text>
    
      <text x="50%" y="95%" font-family="Helvetica" font-size="20" fill="#06C85F" font-weight="bold" text-anchor="middle">
        HIGHER.
      </text>
    </svg>
    `
    let url = `data:image/svg+xml;utf8,${encodeURIComponent(tempConfession)}`
    setConfessionSVG(url)
  }

  useEffect(() => {
    generateConfession()
  }, [confession])

  return (
    <>
      <Head>
        <title>Higher Confessions</title>
        <meta name="description" content="Generate higher confessions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Higher Confessions</h1>
        <h2 className={styles.description}>Generate Higher Confessions</h2>

        <img src={confessionSVG} alt="Higher Confession" />
        <textarea value={confession} onChange={(e) => setConfession(e.target.value)} style={{
          width: '95%',
          height: '100px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#000',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #333',
          resize: 'none',
          outline: 'none',
        }}
          placeholder="Enter your higher confession"
        />
        <button onClick={() => {
          // 2x and download as png
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = 1000
          canvas.height = 1000
          // confessionsvg is a data url
          const img = new Image()
          img.src = confessionSVG
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataUrl
            a.download = 'higher-confession.png'
            a.click()
          }
        }}>Generate</button>
      </main>
    </>
  )
}