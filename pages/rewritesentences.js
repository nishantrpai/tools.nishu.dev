// Rewrite sentences using local LM Studio
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [sentences, setSentences] = useState('')
  const [template, setTemplate] = useState('___ is costing a fortune')
  const [lmStudioUrl, setLmStudioUrl] = useState('http://localhost:1234')
  const [model, setModel] = useState('local-model')
  const [rewritten, setRewritten] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [separator, setSeparator] = useState('single')

  const rewriteSentences = async () => {
    setLoading(true)
    setError('')
    setRewritten([])

    let sep = separator === 'double' ? /\n\n+/ : '\n'
    const sentenceList = sentences.split(sep).map(s => s.trim()).filter(s => s.length > 0)
    if (sentenceList.length === 0) {
      setError('No sentences provided.')
      setLoading(false)
      return
    }

    const results = []
    for (const sentence of sentenceList) {
      try {
        const prompt = `Read this sentence and fill in the blank that would be more accurate: "${template}". Respond with only the filled-in phrase, no explanation. Sentence: ${sentence}`

        const response = await fetch(`${lmStudioUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 100,
          })
        })

        if (!response.ok) {
          throw new Error(`LM Studio API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const rewrittenSentence = data.choices[0].message.content.trim()
        results.push(rewrittenSentence)
        setRewritten([...results])
      } catch (err) {
        results.push(`Error: ${err.message}`)
        setRewritten([...results])
      }
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Rewrite Sentences</title>
        <meta name="description" content="Rewrite sentences using local LM Studio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Rewrite Sentences
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Rewrite sentences into a specific format using local LM Studio</span>

        <textarea
          value={sentences}
          onChange={(e) => setSentences(e.target.value)}
          placeholder="Enter your sentences, one per line or separated by double lines for multi-line sentences"
          style={{
            width: '100%',
            height: '200px',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            resize: 'vertical'
          }}
        />

        <input
          type="text"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Enter the rewrite template, e.g., ___ is costing a fortune"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginTop: '10px'
          }}
        />

        <input
          type="text"
          value={lmStudioUrl}
          onChange={(e) => setLmStudioUrl(e.target.value)}
          placeholder="LM Studio URL, e.g., http://localhost:1234"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginTop: '10px'
          }}
        />

        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model name, e.g., local-model"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginTop: '10px'
          }}
        />

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', width: '100%' }}>
          <label>
            Line separator:
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
            >
              <option value="single">Single line</option>
              <option value="double">Double line</option>
            </select>
          </label>
        </div>

        <button onClick={rewriteSentences} className={styles.button} disabled={loading}>
          {loading ? 'Rewriting...' : 'Rewrite Sentences'}
        </button>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </div>
        )}

        {rewritten.length > 0 && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, background: '#000', width: '100%', lineHeight: 1.5, marginTop: '20px'}}>
            <p style={{margin: 0}}>Rewritten Sentences:</p>
            <p style={{margin: 0}}>{'='.repeat(30)}</p>
            {rewritten.map((rw, idx) => (
              <p key={idx} style={{margin: 0, marginTop: '5px'}}>{`${idx + 1}. ${rw}`}</p>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
