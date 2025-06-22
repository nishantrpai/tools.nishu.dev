import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Scene2Frames() {
  const [sceneDescription, setSceneDescription] = useState('')
  const [numFrames, setNumFrames] = useState(8)
  const [frameBreakdown, setFrameBreakdown] = useState('')
  const [loading, setLoading] = useState(false)
  
  const generateFrames = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/gpt?prompt=Generate ${numFrames} precise, detailed frame descriptions for a video based on this scene: "${sceneDescription}".
      
For each frame:
1. Number them sequentially (Frame 1, Frame 2, etc.)
2. Focus on specific visual elements only - composition, lighting, subjects, colors, camera angle
3. Be extremely concrete, avoid ambiguity
4. Use short, clear sentences
5. No interpretations, emotions, or subjective descriptions
6. Include only what would be visibly present
7. Keep descriptions at 2-3 sentences maximum per frame
8. No transitions between frames - each is a distinct shot

Format as a numbered list. Ensure descriptions are highly specific to prevent AI hallucinations during image generation.`)
      
      const data = await res.json()
      setFrameBreakdown(data.response)
    } catch (error) {
      console.error("Error generating frame breakdown:", error)
      setFrameBreakdown("Error generating frame breakdown. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Scene to Frames Breakdown</title>
        <meta name="description" content="Generate precise frame-by-frame breakdowns of scenes for video generation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Scene to Frames Breakdown
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Generate precise frame descriptions for video production to minimize hallucinations
        </span>

        <div style={{ margin: '20px 0', width: '100%' }}>
          <textarea
            value={sceneDescription}
            onChange={(e) => setSceneDescription(e.target.value)}
            placeholder="Describe your scene here..."
            style={{
              width: '100%',
              minHeight: '150px',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              marginBottom: '15px',
              fontFamily: 'inherit',
            }}
          />
          
          <div style={{ margin: '15px 0' }}>
            <label style={{ marginRight: '10px' }}>
              Number of frames:
              <input
                type="number"
                min="1"
                max="20"
                value={numFrames}
                onChange={(e) => setNumFrames(parseInt(e.target.value) || 5)}
                style={{
                  width: '60px',
                  marginLeft: '10px',
                  padding: '5px',
                  border: '1px solid #333',
                }}
              />
            </label>
          </div>

          <button 
            onClick={generateFrames} 
            className={styles.button}
            disabled={loading || !sceneDescription.trim()}
          >
            {loading ? 'Generating...' : 'Generate Frame Breakdown'}
          </button>
        </div>

        {frameBreakdown && (
          <div style={{ width: '100%' }}>
            <h2>Frame-by-Frame Breakdown:</h2>
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace', 
              textAlign: 'left', 
              padding: '15px', 
              border: '1px solid #333', 
              borderRadius: '5px',
              background: '#000', 
              width: '100%', 
              lineHeight: 1.5,
              overflow: 'auto',
              maxHeight: '500px'
            }}>
              {frameBreakdown}
            </div>
            <div style={{ marginTop: '15px' }}>
              <button
                onClick={() => {navigator.clipboard.writeText(frameBreakdown)}}
                className={styles.button}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}