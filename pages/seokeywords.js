// refine idea with seo keywords
// 1. suggest keywords that would be good for SEO
// 2. use the keywords to refine the idea
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function SeoKeywords() {
  // 
  const [idea, setIdea] = useState('')
  const [keywords, setKeywords] = useState([])
  
  const [suggestions, setSuggestions] = useState([])

  const refineIdea = async (keyword, idea) => {
    let prompt = `This is the idea: ${idea}.\n\n
    This is the keyword I want to use: ${keyword}.\n\n
    List all possibilities you would make to the idea to make it match those keywords.\n\n
    The possibilities must use the keyword in a way that makes sense.\n\n
    Keep it concise and very specific for e.g., "overlay vide on image" or "add a call to action button".\n\n
    Keep suggestions concise and specific.
    Make it compelling and interesting.\n\n
    Don't add any extra information.
    List will be in numbered format.`
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    console.log(data.response)
    setSuggestions(data.response)
  }

  const getKeywords = async (idea) => {
    let prompt = `Given the prompt:${idea}.\n\n
    List array of keywords for e.g., ["keyword1", "keyword2", "keyword3"] that would improve the SEO of the idea.\n\n
    Don't add SEO in the keywords, unnecessary words or phrases unless they are part of the keyword.\n\n
    Respond only as an array of keywords.
    `
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setKeywords(JSON.parse(data.response))
  }

 return (
  <>
    <Head>
      <title>SEO Keywords</title>
      <meta name="description" content="SEO Keywords" />
    </Head>
    <main>
      <h1 className={styles.title}>
        SEO Keywords
      </h1>
      <h2 className={styles.description}>
        Refine your idea with SEO keywords
      </h2>
      <div style={{
        display: 'flex',
        gap: '10px',
        width: '100%'
      }}>
        <input type="text" id="idea" value={idea} onChange={(e) => setIdea(e.target.value)}  placeholder="Enter your idea"  style={{
          width: '90%',
          border: '1px solid #333',
          padding: '8px',
          outline: 'none',
          fontSize: 16,
          background: '#000',
          borderRadius: 5,
          color: '#fff'
        }}></input>
        <button onClick={() => getKeywords(idea)}>🔍</button>
      </div>
      <div style={{
        width: '100%',
        marginTop: '20px',
      }}>
        <h2 style={{marginBottom: 5}}>🔍 Keywords</h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: '10px'
        }}>
          {keywords.map((keyword, index) => (
            <li key={index} style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'}}>
              <span style={{
                margin: '5px',
                flex: '90%',
                width: '90%'
              }}>
              {keyword}
                </span>
              <button onClick={() => refineIdea(keyword, idea)}>✍️</button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{
        width: '100%',
        lineHeight: 2
      }}>
        <h2>✍️ Suggestions</h2>
        <p style={{
          whiteSpace: 'pre-wrap'
        }}
        >{suggestions}</p>
      </div>
    </main>

  </>
 )


}