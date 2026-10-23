// extract fear-bearing sentences from transcripts
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [sentences, setSentences] = useState([])
  const [goals, setgoals] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')

  // Regex patterns for different fear categories with labels
  const fearPatterns = [
  {
    label: 'Goals & Intentions',
    regex: /\b(goal|objective|aim|target|intend to|plan to|want to achieve|trying to achieve|working toward|hope to accomplish)\b/i,
    description: 'Explicit goals and intended outcomes'
  },
  {
    label: 'Needs & Requirements',
    regex: /\b(need|needs|needed|require|requires|must have|have to have|essential|necessary|lack|lacking|missing)\b/i,
    description: 'Stated needs, requirements, or unmet necessities'
  },
  {
    label: 'Wants & Desires',
    regex: /\b(want|wants|wish|wishes|would like|would love|desire|desires|long for|dream of|looking for|hope for)\b/i,
    description: 'Explicit wants, wishes, and desires'
  },
  {
    label: 'Aspirations & Identity',
    regex: /\b(aspire to|dream of becoming|want to become|hope to become|see myself as|be the kind of person|my ambition|my dream is)\b/i,
    description: 'Desired identity, future self, or ambitions'
  },
  {
    label: 'Motivation & Purpose',
    regex: /\b(because i want|so that i can|in order to|the reason i|what drives me|motivated by|matters to me|important to me|my purpose)\b/i,
    description: 'Reasons, purpose, and motivation behind goals'
  },
  {
    label: 'Improvement & Growth',
    regex: /\b(improve|improving|better at|get better|develop my|strengthen my|grow as|learn to|master|make progress|level up|optimize)\b/i,
    description: 'Signals of desired improvement or development'
  },
  {
    label: 'Problem Resolution',
    regex: /\b(solve|fix|resolve|overcome|address|tackle|deal with|get rid of|break free from|move past|work through)\b/i,
    description: 'Problems the person wants to resolve'
  },
  {
    label: 'Desired Experiences & States',
    regex: /\b(want to feel|want to experience|want to live|feel more|feel less|be happier|be healthier|have more|have less|find peace|feel fulfilled|feel secure|gain confidence)\b/i,
    description: 'Desired emotional states, life conditions, or experiences'
  },
  {
    label: 'Values & Priorities',
    regex: /\b(i value|i care about|matters most|my priority|top priority|important to me|i believe in|non-negotiable|what counts is)\b/i,
    description: 'Values and priorities that guide desired outcomes'
  },
  {
    label: 'Commitment & Action',
    regex: /\b(i have decided to|committed to|determined to|taking steps to|started working on|actively pursuing|making an effort to|dedicated to)\b/i,
    description: 'Commitments or actions toward an outcome'
  },
  {
    label: 'Frustration & Dissatisfaction',
    regex: /\b(tired of|sick of|fed up with|frustrated with|unhappy with|dissatisfied with|can't stand|had enough of|not happy with|over this)\b/i,
    description: 'Possible implicit desire for change or improvement'
  },
  {
    label: 'Struggle & Difficulty',
    regex: /\b(struggling with|having trouble|finding it hard|difficulty with|can't seem to|keep failing to|stuck in|feel stuck|having a hard time)\b/i,
    description: 'Possible unmet goal or need revealed through difficulty'
  },
  {
    label: 'Gap & Deficiency',
    regex: /\b(not enough|don't have enough|lack of|missing out on|wish i had|if only i had|short on|falling short|not where i want to be|something is missing)\b/i,
    description: 'A perceived gap between current and desired states'
  },
  {
    label: 'Change & Escape Signals',
    regex: /\b(want things to change|need a change|can't keep living like this|want out|escape from|leave behind|move away from|stop living|break the cycle|start over)\b/i,
    description: 'Possible desire to exit or change an unwanted situation'
  },
  {
    label: 'Implicit Desired Outcome',
    regex: /\b(i wish things were|i wish i could|if things were better|hopefully things will|i just want things to|would be nice if|i miss being|i used to be happier)\b/i,
    description: 'Indirect expressions suggesting a desired alternative'
  },
  {
    label: 'Expectation & Future Outcome',
    regex: /\b(i hope that|i expect to|looking forward to|can't wait to|eventually i want|my plan is|the outcome i want|ideally i would)\b/i,
    description: 'Expected or hoped-for future states'
  },
  {
    label: 'Prevention & Avoidance Goals',
    regex: /\b(want to avoid|need to prevent|make sure i don't|stop this from|keep .* from happening|never want to|don't want to end up|avoid having to)\b/i,
    description: 'Desired prevention of an unwanted outcome'
  }
];

  const extractfearWithReason = (sentence, index, allSentences) => {
    for (const pattern of fearPatterns) {
      const match = sentence.match(pattern.regex)
      if (match) {
        // Get context: 2 sentences before and after
        const contextBefore = allSentences.slice(Math.max(0, index - 2), index)
        const contextAfter = allSentences.slice(index + 1, Math.min(allSentences.length, index + 3))

        return {
          sentence: sentence.trim(),
          matchedText: match[0],
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

    // Extract fear-bearing sentences with reasons and context
    const extractedgoals = sentenceArray
      .map((sentence, index) => extractfearWithReason(sentence, index, sentenceArray))
      .filter(fear => fear !== null)
    setgoals(extractedgoals)
    setFilterCategory('all')
  }

  const filteredgoals = filterCategory === 'all'
    ? goals
    : goals.filter(fear => fear.label === filterCategory)

  const uniqueCategories = [...new Set(goals.map(b => b.label))]

  return (
    <>
      <Head>
        <title>Transcript Breaker</title>
        <meta name="description" content="Break transcripts into sentences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Extract goals
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Break transcripts into sentences and extract fear-bearing statements</span>

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
          Extract goals
        </button>

        {sentences.length > 0 && (
          <>

            {goals.length > 0 && (
              <div>
                <h2>goals ({filteredgoals.length})</h2>

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
                  {filteredgoals.map((fear, idx) => (
                    <li key={idx} style={{ marginBottom: '20px', color: '#fff', fontSize: 12 }}>
                      {fear.contextBefore.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontStyle: 'italic', borderLeft: '2px solid #555', paddingLeft: '8px' }}>
                          {fear.contextBefore.map((ctx, i) => (
                            <div key={i}>{ctx.trim()}</div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontWeight: '500', fontSize: 12, backgroundColor: '#2a2a2a', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
                        {fear.sentence}
                      </div>

                      {fear.contextAfter.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontStyle: 'italic', borderLeft: '2px solid #555', paddingLeft: '8px' }}>
                          {fear.contextAfter.map((ctx, i) => (
                            <div key={i}>{ctx.trim()}</div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px' }}>
                        <span style={{ backgroundColor: '#333', color: '#888', padding: '2px 6px', borderRadius: '3px', fontWeight: '600' }}>
                          {fear.label}
                        </span>
                        <span style={{ marginLeft: '8px', color: '#ccc' }}>— {fear.description}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#ccc', marginTop: '6px' }}>
                        Triggered by: <strong>{fear.matchedText}</strong>
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
