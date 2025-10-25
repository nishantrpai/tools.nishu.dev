import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'

export default function GuitarTuner() {
  const [isRecording, setIsRecording] = useState(false)
  const [frequency, setFrequency] = useState(0)
  const [note, setNote] = useState('')
  const [cents, setCents] = useState(0)

  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const animationFrameRef = useRef(null)

  const strings = [
    { name: 'E (Low)', freq: 82.41 },
    { name: 'A', freq: 110.00 },
    { name: 'D', freq: 146.83 },
    { name: 'G', freq: 196.00 },
    { name: 'B', freq: 246.94 },
    { name: 'E (High)', freq: 329.63 }
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      microphoneRef.current.connect(analyserRef.current)
      setIsRecording(true)
      detectPitch()
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setIsRecording(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const detectPitch = () => {
    const bufferLength = analyserRef.current.fftSize
    const dataArray = new Float32Array(bufferLength)
    analyserRef.current.getFloatTimeDomainData(dataArray)

    // Simple autocorrelation for pitch detection
    let bestOffset = -1
    let bestCorrelation = 0
    const correlations = new Array(Math.floor(bufferLength / 2))
    for (let offset = 1; offset < correlations.length; offset++) {
      let correlation = 0
      for (let i = 0; i < bufferLength - offset; i++) {
        correlation += dataArray[i] * dataArray[i + offset]
      }
      correlations[offset] = correlation
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation
        bestOffset = offset
      }
    }

    if (bestOffset !== -1) {
      const freq = audioContextRef.current.sampleRate / bestOffset
      setFrequency(freq)

      // Find closest string
      let closest = strings[0]
      let minDiff = Math.abs(freq - strings[0].freq)
      for (let string of strings) {
        const diff = Math.abs(freq - string.freq)
        if (diff < minDiff) {
          minDiff = diff
          closest = string
        }
      }
      setNote(closest.name)

      // Calculate cents off
      const centsOff = 1200 * Math.log2(freq / closest.freq)
      setCents(centsOff)
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch)
  }

  return (
    <>
      <Head>
        <title>Guitar Tuner</title>
        <meta name="description" content="Tune your guitar with microphone input" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Guitar Tuner
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Use your microphone to tune your 6-string guitar</span>

        <button onClick={isRecording ? stopRecording : startRecording} className={styles.button}>
          {isRecording ? 'Stop Tuning' : 'Start Tuning'}
        </button>

        {isRecording && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Detected Frequency: {frequency.toFixed(2)} Hz</p>
            <p>Closest String: {note}</p>
            <p>Cents Off: {cents.toFixed(2)}</p>
            <div style={{ width: '100%', height: '30px', background: '#ccc', position: 'relative', marginTop: '10px' }}>
              <div style={{
                width: '2px',
                height: '100%',
                background: 'black',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}></div>
              <div style={{
                width: `${Math.min(Math.abs(cents) / 50 * 50, 50)}%`,
                height: '100%',
                background: Math.abs(cents) < 5 ? 'green' : 'red',
                position: 'absolute',
                left: cents > 0 ? '50%' : `${50 - Math.min(Math.abs(cents) / 50 * 50, 50)}%`
              }}></div>
            </div>
            <p style={{ fontSize: '12px', color: '#777' }}>Green: In tune (±5 cents)</p>
          </div>
        )}
      </main>
    </>
  )
}