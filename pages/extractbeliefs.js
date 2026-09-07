// extract belief-bearing sentences from transcripts
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [sentences, setSentences] = useState([])
  const [beliefs, setBeliefs] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')
  
  // Regex patterns for different belief categories with labels
  const beliefPatterns = [
    {
      label: 'Explicit Belief',
      regex: /\b(i|we|he|she|they)\s+(think|believe|feel|suspect|assume|know|guess|reckon|consider|find)\b/i,
      description: 'Direct statement of belief or thought'
    },
    {
      label: 'Opinion/Conviction',
      regex: /\b(in my opinion|personally|i'd say|i would say|i'd argue|i'm convinced)\b/i,
      description: 'Personal opinion or conviction expressed'
    },
    {
      label: 'Absolute Generalization',
      regex: /\b(always|never|all|none|every|everyone|nobody|nothing)\b/i,
      description: 'Universal or absolute statement (black/white thinking)'
    },
    {
      label: 'Rule/Obligation',
      regex: /\b(should|must|have to|ought to|supposed to|need to)\b/i,
      description: 'Internalized rule or obligation'
    },
    {
      label: 'Externalized Agency',
      regex: /\b(makes me|makes us|makes them|caused me to|forced me to)\b/i,
      description: 'Blaming external forces for personal feelings/actions'
    },
    {
      label: 'Causal Claim',
      regex: /\b(because|causes|leads to|results in|if.*then)\b/i,
      description: 'Causal relationship or consequence belief'
    },
    {
      label: 'Prediction',
      regex: /\b(will|won't|will never|will always|is going to)\b/i,
      description: 'Prediction or future belief'
    },
    {
      label: 'Identity Claim',
      regex: /\b(i'm\s+the\s+kind\s+of|i'm\s+a|i'm\s+not\s+a|i'm\s+someone\s+who)\b/i,
      description: 'Self-model or identity claim'
    },
    {
      label: 'Evaluation/Judgment',
      regex: /\b(good|bad|terrible|wonderful|stupid|smart|brilliant|awful|amazing|useless|worthless|perfect|wrong|right)\b/i,
      description: 'Value judgment or evaluation'
    },
  ]
  
  const extractBeliefWithReason = (sentence, index, allSentences) => {
    for (const pattern of beliefPatterns) {
      if (pattern.regex.test(sentence)) {
        // Get context: 2 sentences before and after
        const contextBefore = allSentences.slice(Math.max(0, index - 2), index)
        const contextAfter = allSentences.slice(index + 1, Math.min(allSentences.length, index + 3))
        
        return {
          sentence: sentence.trim(),
          label: pattern.label,
          description: pattern.description,
          contextBefore,
          contextAfter
        }
      }
    }
    return null
  }
  
  const breakIntoSentences = () => {
    // Split by sentence delimiters (., !, ?)
    const sentenceArray = text
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0)
    setSentences(sentenceArray)
    
    // Extract belief-bearing sentences with reasons and context
    const extractedBeliefs = sentenceArray
      .map((sentence, index) => extractBeliefWithReason(sentence, index, sentenceArray))
      .filter(belief => belief !== null)
    setBeliefs(extractedBeliefs)
    setFilterCategory('all')
  }

  const filteredBeliefs = filterCategory === 'all' 
    ? beliefs 
    : beliefs.filter(belief => belief.label === filterCategory)

  const uniqueCategories = [...new Set(beliefs.map(b => b.label))]

  return (
    <>
      <Head>
        <title>Transcript Breaker</title>
        <meta name="description" content="Break transcripts into sentences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Extract Beliefs
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Break transcripts into sentences and extract belief-bearing statements</span>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your transcript here..."
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            minHeight: '200px',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical',
          }}
        />

        <button onClick={breakIntoSentences} className={styles.button}>
          Extract Beliefs
        </button>

        {sentences.length > 0 && (
          <>

            {beliefs.length > 0 && (
              <div>
                <h2>beliefs ({filteredBeliefs.length})</h2>
                
                <div style={{ marginBottom: '20px' }}>
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      backgroundColor: '#222',
                      color: '#ccc',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <ol style={{ lineHeight: 2, paddingLeft: '20px', fontSize: '14px' }}>
                  {filteredBeliefs.map((belief, idx) => (
                    <li key={idx} style={{ marginBottom: '20px', color: '#fff', fontSize: 12 }}>
                      {belief.contextBefore.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontStyle: 'italic', borderLeft: '2px solid #555', paddingLeft: '8px' }}>
                          {belief.contextBefore.map((ctx, i) => (
                            <div key={i}>{ctx.trim()}</div>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ fontWeight: '500', fontSize: 12, backgroundColor: '#2a2a2a', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        {belief.sentence}
                      </div>
                      
                      {belief.contextAfter.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontStyle: 'italic', borderLeft: '2px solid #555', paddingLeft: '8px' }}>
                          {belief.contextAfter.map((ctx, i) => (
                            <div key={i}>{ctx.trim()}</div>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px' }}>
                        <span style={{ backgroundColor: '#333', color: '#888', padding: '2px 6px', borderRadius: '3px', fontWeight: '600' }}>
                          {belief.label}
                        </span>
                        <span style={{ marginLeft: '8px', color: '#ccc' }}>— {belief.description}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
