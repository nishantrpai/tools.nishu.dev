import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function Silence() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [microphoneStream, setMicrophoneStream] = useState(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [additionalToneFrequency, setAdditionalToneFrequency] = useState(0)
  const [noiseLevel, setNoiseLevel] = useState(0.15)
  const [oscillator, setOscillator] = useState(null)
  const [qValue, setQValue] = useState(0.25)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          latency: 0,
          channelCount: 1,
        }
      })

      const context = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 48000,
      })
      const source = context.createMediaStreamSource(stream)
      const analyserNode = context.createAnalyser()
      
      // Create nodes for processing
      const processorNode = context.createScriptProcessor(256, 1, 1)
      const mixerNode = context.createGain()
      const filterNode = context.createBiquadFilter()

      // Create oscillator for additional tone
      const additionalOscillator = context.createOscillator()
      const additionalGain = context.createGain()
      additionalOscillator.type = 'sine'
      additionalOscillator.frequency.value = additionalToneFrequency
      additionalGain.gain.value = additionalToneFrequency > 0 ? 0.1 : 0
      
      // Configure brown noise filter
      filterNode.type = 'lowpass'
      filterNode.frequency.value = 120
      filterNode.Q.value = qValue

      // Audio routing with filter and additional tone
      source.connect(analyserNode)
      analyserNode.connect(filterNode)
      filterNode.connect(processorNode)
      processorNode.connect(mixerNode)
      source.connect(mixerNode)
      
      // Connect additional tone
      additionalOscillator.connect(additionalGain)
      additionalGain.connect(mixerNode)
      additionalOscillator.start()
      
      mixerNode.connect(context.destination)

      let lastOutput = 0
      processorNode.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0)
        const outputData = audioProcessingEvent.outputBuffer.getChannelData(0)
        
        for (let i = 0; i < inputData.length; i++) {
          const white = Math.random() * 2 - 1
          lastOutput = (0.02 * white + 0.98 * lastOutput)
          outputData[i] = (-inputData[i] + lastOutput * noiseLevel)
        }
      }

      mixerNode.gain.value = 0.5
      analyserNode.fftSize = 1024
      
      setOscillator({ oscillator: additionalOscillator, gain: additionalGain })
      setAudioContext(context)
      setAnalyser(analyserNode)
      setMicrophoneStream(stream)
      setIsRecording(true)

      visualize(analyserNode)
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop())
    }
    if (audioContext) {
      audioContext.close()
    }
    if (oscillator) {
      oscillator.oscillator.stop()
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setIsRecording(false)
    setAudioContext(null)
    setAnalyser(null)
    setMicrophoneStream(null)
    setOscillator(null)
  }

  const visualize = (analyserNode) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const bufferLength = analyserNode.frequencyBinCount
    const originalData = new Uint8Array(bufferLength)
    
    // Optimize drawing
    const sliceWidth = width * 1.0 / bufferLength
    ctx.lineWidth = 2

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      
      analyserNode.getByteTimeDomainData(originalData)
      
      // Clear canvas with black background
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)
      
      // Draw original waveform (blue)
      ctx.beginPath()
      ctx.strokeStyle = 'rgb(0, 0, 255)'
      
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const v = originalData[i] / 128.0
        const y = v * height / 4

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }
      ctx.stroke()

      // Draw inverted waveform (red)
      ctx.beginPath()
      ctx.strokeStyle = 'rgb(255, 0, 0)'
      
      x = 0
      for (let i = 0; i < bufferLength; i++) {
        const v = originalData[i] / 128.0
        const y = (height * 3/4) + (-v * height / 4)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }
      ctx.stroke()

      // Simplified center lines
      ctx.strokeStyle = 'rgb(255, 255, 255)'
      ctx.beginPath()
      ctx.moveTo(0, height/4)
      ctx.lineTo(width, height/4)
      ctx.moveTo(0, height*3/4)
      ctx.lineTo(width, height*3/4)
      ctx.stroke()

      // Add labels only once per second
      if (Date.now() % 1000 < 16) {
        ctx.fillStyle = 'white'
        ctx.font = '14px Arial'
        ctx.fillText('Original Audio', 10, 20)
        ctx.fillText('Inverted Audio', 10, height/2 + 20)
      }
    }

    draw()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 0.8
    canvas.height = window.innerHeight * 0.6

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      stopRecording()
    }
  }, [])

  useEffect(() => {
    if (oscillator) {
      oscillator.oscillator.frequency.value = additionalToneFrequency
      oscillator.gain.gain.value = additionalToneFrequency > 0 ? 0.1 : 0
    }
  }, [additionalToneFrequency, oscillator])

  return (
    <>
      <Head>
        <title>Silence Generator</title>
        <meta name="description" content="Generate silence from ambient noise" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Silence Generator</h1>
        <h2 className={styles.description}>Generate silence from ambient noise</h2>
        
        <canvas 
          ref={canvasRef}
          style={{ width: '100%', height: 'auto', border: '1px solid #333' }}
        />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            Additional Tone Frequency: {additionalToneFrequency} Hz
            <input
              type="range"
              min="0"
              max="1000"
              value={additionalToneFrequency}
              onChange={(e) => setAdditionalToneFrequency(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            Noise Level: {noiseLevel.toFixed(2)}
            <input
              type="range"
              min="0"
              max="10"
              step="0.01"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            Q Value: {qValue.toFixed(2)}
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={qValue}
              onChange={(e) => setQValue(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop' : 'Start'} Silence
        </button>
      </main>
    </>
  )
}
