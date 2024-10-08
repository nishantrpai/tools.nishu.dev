import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function GradientWave() {
  const [baseColor, setBaseColor] = useState('#ff0000')
  const [waveCount, setWaveCount] = useState(5)
  const [direction, setDirection] = useState('lightToDark')
  const [waves, setWaves] = useState([])
  const [sameFrequency, setSameFrequency] = useState(false)
  const [phase, setPhase] = useState(0)
  const [waveDifference, setWaveDifference] = useState(50)
  const [maxWaveHeight, setMaxWaveHeight] = useState(50)
  const [maxAmplitude, setMaxAmplitude] = useState(50) // New state for max amplitude
  const canvasRef = useRef(null)

  useEffect(() => {
    generateWaves()
  }, [waveCount, baseColor, direction, sameFrequency, phase, waveDifference, maxWaveHeight, maxAmplitude])

  const generateWaves = () => {
    const baseFrequency = Math.random() * 0.049 + 0.001
    const newWaves = Array.from({ length: waveCount }, (_, index) => ({
      amplitude: Math.random() * (maxAmplitude / 2) + (maxAmplitude / 4), // Adjust amplitude based on maxAmplitude
      frequency: sameFrequency ? baseFrequency : Math.random() * 0.049 + 0.001,
      phase: sameFrequency ? phase * index : Math.random() * Math.PI * 2,
    }))
    setWaves(newWaves)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const drawWaves = () => {
      ctx.clearRect(0, 0, width, height)

      // draw black background
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      const baseColorRGB = hexToRgb(baseColor)
      const gradientStops = direction === 'lightToDark' ? [1, 0] : [0, 1]

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        ctx.moveTo(0, height)

        for (let x = 0; x < width; x++) {
          const y = height - (i * (height / waveCount) * (waveDifference / 100)) - 
                    Math.sin(x * (waves[i]?.frequency || 0.001) + (waves[i]?.phase || 0)) * (waves[i]?.amplitude || maxAmplitude / 2)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.closePath()

        let alpha = 1 - (i / waveCount)
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(gradientStops[0], `rgba(${baseColorRGB.r}, ${baseColorRGB.g}, ${baseColorRGB.b}, ${alpha})`)
        gradient.addColorStop(gradientStops[1], `rgba(${baseColorRGB.r}, ${baseColorRGB.g}, ${baseColorRGB.b}, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    drawWaves()
  }, [baseColor, waveCount, direction, waves, waveDifference, maxWaveHeight, maxAmplitude])

  const handleColorChange = (newColor) => {
    setBaseColor(newColor)
  }

  const handleRandomize = () => {
    setBaseColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
    setWaveCount(Math.floor(Math.random() * 5) + 3)
    setDirection(Math.random() > 0.5 ? 'lightToDark' : 'darkToLight')
    setSameFrequency(Math.random() > 0.5)
    setPhase(Math.random() * Math.PI * 2)
    setWaveDifference(Math.floor(Math.random() * 100) + 1)
    setMaxWaveHeight(Math.floor(Math.random() * 100) + 1)
    setMaxAmplitude(Math.floor(Math.random() * 100) + 1) // Randomize max amplitude
    generateWaves()
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.href = canvas.toDataURL()
    link.download = 'gradient_wave.png'
    link.click()
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  return (
    <>
      <Head>
        <title>Gradient Wave</title>
        <meta name="description" content="Generate stacked gradient waves with customizable properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Stacked Gradient Waves Generator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Customize your stacked gradient waves</span>
        <canvas ref={canvasRef} width="1024" height="576" style={{ border: '1px solid #333', borderRadius: '10px', width: '100%', height: '100%' }}></canvas>

        <input
          type="color"
          value={baseColor}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{
            width: '10%',
            outline: 'none',
            marginBottom: '10px'
          }}
        />

        <label>
          Wave Count:
          <input
            type="number"
            value={waveCount}
            onChange={(e) => setWaveCount(parseInt(e.target.value))}
            min="3"
            max="100"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              marginBottom: '10px'
            }}
          />
        </label>

        <label>
          Direction:
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              marginBottom: '10px'
            }}
          >
            <option value="lightToDark">Light to Dark</option>
            <option value="darkToLight">Dark to Light</option>
          </select>
        </label>

        <label>
          Same Frequency:
          <input
            type="checkbox"
            checked={sameFrequency}
            onChange={(e) => setSameFrequency(e.target.checked)}
            style={{
              marginLeft: '10px',
              marginBottom: '10px'
            }}
          />
        </label>

        <label>
          Phase:
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.01"
            value={phase}
            onChange={(e) => setPhase(parseFloat(e.target.value))}
            style={{
              width: '100%',
              marginBottom: '20px'
            }}
          />
        </label>

        <label>
          Wave Difference:
          <input
            type="range"
            min="1"
            max="100"
            value={waveDifference}
            onChange={(e) => setWaveDifference(parseInt(e.target.value))}
            style={{
              width: '100%',
              marginBottom: '20px'
            }}
          />
          <span>{waveDifference}%</span>
        </label>

        <label>
          Max Wave Height:
          <input
            type="range"
            min="10"
            max="1000"
            value={maxWaveHeight}
            onChange={(e) => setMaxWaveHeight(parseInt(e.target.value))}
            style={{
              width: '100%',
              marginBottom: '20px'
            }}
          />
          <span>{maxWaveHeight}%</span>
        </label>

        <label>
          Max Amplitude:
          <input
            type="range"
            min="10"
            max="1000"
            value={maxAmplitude}
            onChange={(e) => setMaxAmplitude(parseInt(e.target.value))}
            style={{
              width: '100%',
              marginBottom: '20px'
            }}
          />
          <span>{maxAmplitude}%</span>
        </label>

        <button
          onClick={handleRandomize}
        >
          Randomize
        </button>
        <button onClick={handleDownload}>Download</button>

      </main>
    </>
  )
}
