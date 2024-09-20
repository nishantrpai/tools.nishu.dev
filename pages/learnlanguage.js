import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function LearnLanguage() {
  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState(1)
  const [story, setStory] = useState('')
  const [conversation, setConversation] = useState([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameOverReason, setGameOverReason] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [isTyping, setIsTyping] = useState(false)

  const levels = [
    "Survival Essentials",
    "Basic Conversations",
    "Intermediate Interactions",
    "Advanced Discussions",
    "Fluent Communication"
  ]

  useEffect(() => {
    if (language && !isTyping) {
      generateStory()
    }
  }, [language, level, isTyping])

  const generateStory = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Generate a short, engaging story scenario in English for learning ${language} at ${levels[level - 1]} level. The story should start with "You are..." and be 1-2 sentences long, placing the user as the main character. Prompt the user to respond with a single sentence in ${language}. Include another character's dialogue in ${language} with its English translation in parentheses. End with a clear, simple question or prompt that requires only a one-sentence response in ${language}.`,
        model: 'gpt-4o-mini'
      })
    })
    const data = await res.json()
    setStory(data.response)
    setConversation([{ role: 'system', content: data.response }])
    setLoading(false)
  }

  const handleUserInput = async () => {
    setLoading(true)
    const updatedConversation = [...conversation, { role: 'user', content: userInput }]
    
    const res = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Language learning assistant for ${language}. Level: ${levels[level - 1]}. 
                 User input: "${userInput}". Check if in ${language}. If not, "GAME OVER: [reason]".
                 If in ${language}, evaluate correctness and understandability, it is ok if the user's response is not perfect as long as it is understandable.
                 If good, continue story (1-2 sentences). Include character's response in ${language} 
                 (English translation in parentheses). End with new question/prompt in ${language}.
                 If in ${language} but incorrect/incomprehensible, "GAME OVER: [reason]".
                 Numbers generally okay (e.g., "2 pommes" in French), but context matters.
                 Conversation history: ${JSON.stringify(updatedConversation)}.`,
        model: 'gpt-4o-mini',
      })
    })
    const data = await res.json()
    
    if (data.response.includes("GAME OVER:")) {
      setGameOver(true)
      const reason = data.response.split("GAME OVER:")[1].trim()
      setGameOverReason(reason)
    } else {
      setConversation([...updatedConversation, { role: 'assistant', content: data.response }])
    }
    
    setUserInput('')
    setLoading(false)
  }

  const handleLevelUp = () => {
    if (level < levels.length) {
      setLevel(level + 1)
      setGameOver(false)
      setGameOverReason('')
    }
  }

  const restartGame = () => {
    setGameOver(false)
    setGameOverReason('')
    generateStory()
  }

  const handleLanguageChange = (e) => {
    const value = document.getElementById('language-input').value
    setIsTyping(true)
    setLanguage(value)
    const level = document.getElementById('level-select').value
    setLevel(level)
    clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(() => {
      setIsTyping(false)
    }, 1000))
  }

  return (
    <>
      <Head>
        <title>Interactive Language Learning</title>
        <meta name="description" content="Learn any language through interactive storytelling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>Interactive Language Learning</h1>
        <p className={styles.description}>Learn {language || 'any language'} through storytelling</p>

        {!language && (
          <div>
          <input
            type="text"
            defaultValue={language}
            placeholder="Enter language to learn"
            className={styles.input}
            id="language-input"
          />
          <select id="level-select">
            <option value="1">Survival Essentials</option>
            <option value="2">Basic Conversations</option>
            <option value="3">Intermediate Interactions</option>
            <option value="4">Advanced Discussions</option>
            <option value="5">Fluent Communication</option>
          </select>
          <button onClick={handleLanguageChange} className={styles.button}>Learn</button>

          </div>
        )}

        {language && !isTyping && !gameOver && (
          <>
            <h2>Level {level}: {levels[level - 1]}</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', border: '1px solid #333', padding: '10px', borderRadius: '5px', minHeight: '300px', maxHeight: '300px', overflowY: 'scroll'  }}>
              {conversation.map((message, index) => (
                <div key={index} style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                  <p style={{
                    color: message.role === 'user' ? '#fff' : '#888'
                  }}>{message.role === 'user' ? 'You:' : 'Story:'} {message.content}</p>
                </div>
              ))}
            </div>

            <input
              type="text"
              defaultValue={userInput}
              onChange={(e) => setUserInput(`${e.target.value}`)}
              placeholder={`Type your response in ${language}...`}
              className={styles.input}
              style={{
                outline: 'none',
                backgroundColor: '#000',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '5px',
                padding: '10px',
                marginTop: '10px',
                width: '100%',
                maxWidth: '100%',
                
              }}
            />

            <button onClick={handleUserInput} className={styles.button} disabled={loading || !userInput}>
              {loading ? 'Processing...' : 'Send'}
            </button>

            <p className={styles.hint}>
              Use the Google Translate tool below to help formulate your response in {language}.
            </p>

          </>
        )}

        {gameOver && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px', padding: '10px', borderRadius: '5px', minHeight: '300px', overflowY: 'auto'  }}>
            <h2>Game Over</h2>
            <p>Your last response was incorrect or not understandable. Reason: {gameOverReason}</p>
            <button onClick={restartGame} className={styles.button}>
              Restart Level
            </button>
          </div>
        )}
      </main>
    </>
  )
}
