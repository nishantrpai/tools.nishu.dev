// suggest slug or domain name for the idea
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function SeoKeywords() {
  // 
  const [idea, setIdea] = useState('')
  const [keywords, setKeywords] = useState([])
  

  const refineIdea = async (idea) => {
    let prompt = `This is the idea: ${idea}.
    Can you suggest a slug or domain name for the idea that would be easier to remember and SEO friendly?
    The slug or domain name should be concise, easy to remember, and SEO friendly.
    Respond as an array of slugs or domain names for e.g., ["/slug1", "/slug2", "/slug3", "domain1.com", "domain2.com"].
    Keep it in the format of "/slug" or "domain.com" (use the prefixes and suffixes).
    `
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

  const getKeywords = async () => {
    let prompt = `This is the idea: "${idea}".
    Can you suggest a slug idea that would be easier to remember and SEO friendly?
    The slug should be concise, easy to remember, and SEO friendly.
    Respond as an array of slugs for e.g., ["slug1", "slug2", "slug3"].
    Keep it in the format of "/slug" (use the prefixes).
    Keep it minimal and few syllables.
    Please don't use '-' or '_' in the slugs.
    Don't make it too jargon or technical.
    Don't use spammy or promotional slugs.
    Suggest atleast 20 slugs.
    Don't add any prefixes as I am using the json for the app directly.
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
      <title>Suggest slug</title>
      <meta name="description" content="Suggest slug" />
    </Head>
    <main>
      <h1 className={styles.title}>
        Suggest slug
      </h1>
      <h2 className={styles.description}>
        Suggest a slug for your idea
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
        <button onClick={() => getKeywords()}>🔍</button>
      </div>
      <div style={{
        width: '100%',
        marginTop: '20px',
      }}>
        <h2 style={{marginBottom: 5}}>🔍 Possible /slugs</h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          width: '100%',
          gap: '10px'
        }}>
          {keywords.map((keyword, index) => (
            <li key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'}}>
              <span style={{
                margin: '5px',
                flex: '90%',
                width: '100%',
              }}>
              {keyword.toLowerCase()}
                </span>
            </li>
          ))}
        </ul>
      </div>
    </main>

  </>
 )


}