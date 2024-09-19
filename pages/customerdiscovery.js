import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function CustomerDiscoveryQuestions() {
  const [customerType, setCustomerType] = useState('')
  const [questions, setQuestions] = useState('')
  const [loading, setLoading] = useState(false)
  
  const generateQuestions = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Generate 7-10 precise and concise customer discovery questions for the following customer type: "${customerType}". These questions should aim at understanding this specific customer segment, their needs, pain points, and behaviors. Include questions about what they are outsourcing versus building in-house, and how external contributions could best support their business. Focus on quality over quantity, ensuring each question provides deep insights into how we can best contribute to their success.`,
        model: 'gpt-3.5-turbo'
      })
    })
    const data = await res.json()
    setQuestions(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Customer Discovery Questions</title>
        <meta name="description" content="Generate insightful customer discovery questions for specific customer types" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Customer Discovery Questions
        </h1>
        <p className={styles.description}>
          Enter a customer type (e.g., "Shopify store owner") to generate targeted discovery questions
        </p>

        <input
          type="text"
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value)}
          placeholder="Enter customer type (e.g., Shopify store owner)"
          className={styles.input}
        />

        <button onClick={generateQuestions} className={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>

        {questions && (
          <div style={{
            maxWidth: 500,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'monospace',
            textAlign: 'left',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: 10,
            background: '#000',
            width: '100%',
            lineHeight: 1.5,
            overflowY: 'auto'
          }}>
            <h2>Customer Discovery Questions:</h2>
            {questions}
          </div>
        )}
      </main>
    </>
  )
}
