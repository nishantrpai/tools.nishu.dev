// Extend boolean queries with OR operators for related keywords
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [booleanQuery, setBooleanQuery] = useState('')
  const [extendedQuery, setExtendedQuery] = useState('')
  const [loading, setLoading] = useState(false)
  
  const extendQuery = async () => {
    // make api call to /api/gpt?prompt
    setLoading(true)
    const res = await fetch(`/api/gpt?prompt='Boolean Query: "${booleanQuery}"

Extend this boolean query by adding OR operators with related keywords, synonyms, and variations for each main term. 

Rules:
1. Identify the main keywords/terms in the query
2. For each keyword, find 3-5 related terms, synonyms, or variations
3. Group related terms with OR operators in parentheses
4. Preserve the original boolean structure (AND, NOT operators)
5. ALWAYS keep quotes around multi-word phrases to maintain proper boolean logic
6. Make the query more comprehensive while maintaining search intent

Example:
Input: "machine learning AND data science"
Output: ("machine learning" OR "ML" OR "artificial intelligence" OR "AI") AND ("data science" OR "analytics" OR "big data" OR "statistics")

Input: "javascript NOT python"  
Output: ("javascript" OR "JS" OR "ECMAScript" OR "node.js") NOT ("python" OR "py" OR "python3")

Input: "content marketing AND social media"
Output: ("content marketing" OR "content strategy" OR "digital marketing") AND ("social media" OR "social networks" OR "social platforms")

Provide the extended boolean query:'`)
    const data = await res.json()
    setExtendedQuery(data.response)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Extend Boolean Query</title>
        <meta name="description" content="Extend your boolean queries with OR operators for related keywords" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Extend Boolean Query
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Add OR operators with related keywords and synonyms to make your boolean queries more comprehensive
        </span>

        <textarea
          value={booleanQuery}
          onChange={(e) => setBooleanQuery(e.target.value)}
          placeholder='Enter your boolean query (e.g., "machine learning AND python")'
          rows={3}
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
        />

        <button onClick={extendQuery} className={styles.button}>
          {loading ? 'Extending Query...' : 'Extend Query'}
        </button>

        {extendedQuery && (
          <div>
            <h3 style={{ color: '#777', fontSize: '16px', marginBottom: '10px', marginTop: '20px' }}>
              Extended Boolean Query:
            </h3>
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace', 
              textAlign: 'left', 
              padding: '20px', 
              border: '1px solid #333', 
              background: '#000', 
              width: '100%', 
              lineHeight: 1.6,
              borderRadius: '10px',
              fontSize: '14px'
            }}>
              {extendedQuery}
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(extendedQuery)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: '1px solid #333',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </main>
    </>
  )
}
