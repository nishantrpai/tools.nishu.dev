// Generate various emotional and transformational angles for product descriptions
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [productDescription, setProductDescription] = useState('')
  const [copyAngles, setCopyAngles] = useState('')
  const [loading, setLoading] = useState(false)
  
  const generateAngles = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='Product: "${productDescription}" 

Generate 10+ different copy angles for this product that trigger various emotions and transformations:

EMOTIONAL TRIGGERS:
- Fear of missing out (FOMO)
- Desire for transformation 
- Social proof/belonging
- Urgency/scarcity
- Curiosity/mystery
- Aspiration/status
- Problem/pain point relief
- Instant gratification
- Trust/authority
- Exclusivity/VIP feeling

ANGLE TYPES:
- Before/After transformation
- Problem-solution focused
- Social status enhancement
- Time-saving benefit
- Expert endorsement
- Customer success story
- Comparison advantage
- Limited availability
- Emotional outcome
- Lifestyle upgrade

Format each angle as a compelling headline or short description. Make them punchy, specific, and emotionally engaging. Vary the emotional triggers used.'`)
    const data = await res.json()
    setCopyAngles(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Copy Angles Generator</title>
        <meta name="description" content="Generate various emotional and transformational angles for your product descriptions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Copy Angles Generator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Generate emotional and transformational angles for your product descriptions
        </span>

        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Enter your product description..."
          rows={4}
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />

        <button onClick={generateAngles} className={styles.button}>
          {loading ? 'Generating Angles...' : 'Generate Copy Angles'}
        </button>

        {copyAngles && (
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace', 
            textAlign: 'left', 
            padding: '20px', 
            border: '1px solid #333', 
            background: '#000', 
            width: '100%', 
            lineHeight: 1.6,
            borderRadius: '10px'
          }}>
            {copyAngles}
          </div>
        )}
      </main>
    </>
  )
}
