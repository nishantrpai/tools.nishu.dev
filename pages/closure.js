import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Closure() {
  const [text, setText] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!text.trim()) {
      setOutput('Please write something first — even a few lines help.')
      return
    }

    setLoading(true)

    const prompt = `You are a compassionate guide. Convert the raw user writing below into a calm, testimony-style internal-closure narrative suitable for reading aloud. The narrative should: name the emotions clearly; acknowledge the user's effort and intention; separate responsibility from blame; recognize external circumstances and differences; confirm an ending; and affirm internal authorship. Write a single continuous narrative in first person, suitable to be read aloud as testimony. Do NOT include headings, labels (for example, "Named emotions:"), breathing instructions, step-by-step guidance, or any meta commentary. Use the user's text as the source and do not invent facts.\n\nUser text:\n"""${text.trim()}"""`

    try {
      const res = await fetch(`/api/gpt?prompt=${encodeURIComponent(prompt)}`)
      const data = await res.json()
      // API returns the model's text in `response` (per similar pages)
      const resp = data?.response ?? data?.text ?? (typeof data === 'string' ? data : JSON.stringify(data))
      setOutput(resp || 'No response from API.')
    } catch (err) {
      setOutput('Error generating narrative. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Closure</title>
        <meta name="description" content="Turn unresolved experiences into an internal closure narrative" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Closure</h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '14px', display: 'block' }}>
          Pour out what’s unresolved. No grammar, no edits — just speak your truth.
        </span>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Write about what’s stuck in your mind. What happened? What do you feel? What do you wish had happened? What needs acknowledgment?`}
          style={{ width: '100%', padding: '12px', border: '1px solid #333', outline: 'none', resize: 'vertical' }}
        />

        <div style={{ marginTop: '12px' }}>
          <button onClick={handleGenerate} className={styles.button} disabled={loading}>
            {loading ? 'Generating...' : 'Create Closure Narrative'}
          </button>
        </div>

        {output && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '14px', border: '1px solid #333', background: '#000', color: '#eee', marginTop: '16px', lineHeight: 1.5, borderRadius: 10 }}>
            {output}
          </div>
        )}
      </main>
    </>
  )
}
