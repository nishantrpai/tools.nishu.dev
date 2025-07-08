// TCRE Framework AI Prompt Generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [objective, setObjective] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('objective') // objective, questioning, generating, complete
  const [tcreData, setTcreData] = useState({
    task: '',
    context: '',
    references: '',
    evaluate: ''
  })
  const [finalPrompt, setFinalPrompt] = useState('')
  const [evaluation, setEvaluation] = useState('')
  const [improvements, setImprovements] = useState('')

  const startQuestioning = async () => {
    if (!objective.trim()) return

    setPhase('questioning')
    setLoading(true)

    // Initial message
    const initialMessage = {
      type: 'assistant',
      content: `Great! I'll help you create an effective AI prompt using the TCRE framework for: "${objective}"\n\nLet's start with the Task component. I'll ask you specific questions to gather all essential information.\n\n**Question 1:** What is the specific, concrete action or output you want the AI to perform? Be as detailed as possible about the exact deliverable.`
    }

    setChatMessages([initialMessage])
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!currentInput.trim() || loading) return

    const userMessage = {
      type: 'user',
      content: currentInput
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentInput('')
    setLoading(true)

    try {
      const conversationHistory = [...chatMessages, userMessage]
        .map(msg => `${msg.type}: ${msg.content}`)
        .join('\n\n')

      const prompt = `You are helping create an AI prompt using the TCRE framework (Task, Context, References, Evaluate/Iterate) for this objective: "${objective}"

Conversation so far:
${conversationHistory}

You are conducting a structured interview to gather information for each TCRE component. Ask ONE specific, focused question at a time. Use the 5 Whys technique when helpful to uncover deeper context.

Current phase: Gathering information for TCRE components
- Task: What exactly should the AI do?
- Context: What background info, constraints, audience details are needed?
- References: What examples, formats, styles, or standards should guide the output?
- Evaluate: What criteria define success? How should the AI iterate?

Guidelines:
1. Ask only ONE question at a time
2. Be specific and actionable
3. Build on previous answers
4. Use 5 Whys when you need deeper insight
5. When you have enough info for all TCRE components, say "COMPLETE_QUESTIONING" and provide a summary

Respond with your next question OR "COMPLETE_QUESTIONING" followed by a summary of all gathered TCRE information.`

      const res = await fetch(`/api/gpt?prompt=${encodeURIComponent(prompt)}`)
      const data = await res.json()

      if (data.response.includes('COMPLETE_QUESTIONING')) {
        // Move to generation phase
        setPhase('generating')
        const summary = data.response.replace('COMPLETE_QUESTIONING', '').trim()

        const assistantMessage = {
          type: 'assistant',
          content: `Perfect! I've gathered all the necessary information. Here's what we have:\n\n${summary}\n\nNow generating your optimized TCRE prompt...`
        }
        setChatMessages(prev => [...prev, assistantMessage])

        // Generate the final prompt
        await generateFinalPrompt(conversationHistory + '\n\n' + summary)
      } else {
        const assistantMessage = {
          type: 'assistant',
          content: data.response
        }
        setChatMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        type: 'assistant',
        content: 'Sorry, there was an error. Please try again.'
      }
      setChatMessages(prev => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const generateFinalPrompt = async (allInfo) => {
    try {
      const generatePrompt = `Based on this information gathered through TCRE framework questioning for objective "${objective}":

${allInfo}

Generate the best possible AI prompt using the TCRE framework. Structure it clearly with:

**Task:** (Clear, specific action/output)
**Context:** (Background, constraints, audience)
**References:** (Examples, formats, standards)
**Evaluate:** (Success criteria, iteration instructions)

Make it comprehensive, actionable, and optimized for AI understanding.`

      const res = await fetch(`/api/gpt?prompt=${encodeURIComponent(generatePrompt)}`)
      const data = await res.json()
      setFinalPrompt(data.response)

      // Generate evaluation
      await evaluatePrompt(data.response)
    } catch (error) {
      console.error('Error generating prompt:', error)
    }
  }

  const evaluatePrompt = async (prompt) => {
    try {
      const evalPrompt = `Evaluate this AI prompt using the TCRE framework:

${prompt}

Provide:
1. **TCRE Evaluation:** Briefly explain how this prompt satisfies each TCRE element (Task, Context, References, Evaluate)
2. **Improvements:** Suggest 3-5 specific, actionable improvements to enhance clarity, completeness, or impact

Be concise but thorough.`

      const res = await fetch(`/api/gpt?prompt=${encodeURIComponent(evalPrompt)}`)
      const data = await res.json()

      const sections = data.response.split('**Improvements:**')
      setEvaluation(sections[0].replace('**TCRE Evaluation:**', '').trim())
      setImprovements(sections[1]?.trim() || '')

      setPhase('complete')
    } catch (error) {
      console.error('Error evaluating prompt:', error)
      setPhase('complete')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (phase === 'objective') {
        startQuestioning()
      } else if (phase === 'questioning') {
        sendMessage()
      }
    }
  }

  const resetTool = () => {
    setObjective('')
    setChatMessages([])
    setCurrentInput('')
    setPhase('objective')
    setFinalPrompt('')
    setEvaluation('')
    setImprovements('')
  }

  return (
    <>
      <Head>
        <title>TCRE Prompt Generator</title>
        <meta name="description" content="Create highly effective AI prompts using the TCRE framework" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          TCRE Prompt Generator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Create highly effective AI prompts using Task, Context, References, Evaluate framework
        </span>

        {phase === 'objective' && (
          <>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your objective (what you want to achieve with AI)"
              style={{
                width: '100%',
                border: '1px solid #333',
                padding: '10px',
                outline: 'none',
                marginBottom: '10px'
              }}
            />
            <button onClick={startQuestioning} className={styles.button} disabled={!objective.trim()}>
              Start TCRE Interview
            </button>
          </>
        )}

        {(phase === 'questioning' || phase === 'generating') && (
          <>
            <div style={{
              width: '100%',
              height: '400px',
              border: '1px solid #333',
              padding: '15px',
              overflowY: 'auto',
              marginBottom: '10px',
            }}>
              {chatMessages.map((msg, index) => (
                <div key={index} style={{
                  marginBottom: '15px',
                  padding: '10px',
                  borderRadius: '5px',
                  background: msg.type === 'user' ? '#111' : '#333',
                  whiteSpace: 'pre-wrap'
                }}>
                  <strong>{msg.type === 'user' ? 'You' : 'TCRE Assistant'}:</strong>
                  <div style={{ marginTop: '5px' }}>{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ padding: '10px', fontStyle: 'italic', color: '#666' }}>
                  Assistant is thinking...
                </div>
              )}
            </div>

            {phase === 'questioning' && (
              <>
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer here... (Press Enter to send)"
                  style={{
                    width: '100%',
                    height: '80px',
                    border: '1px solid #333',
                    padding: '10px',
                    outline: 'none',
                    resize: 'vertical',
                    marginBottom: '10px'
                  }}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  className={styles.button}
                  disabled={loading || !currentInput.trim()}
                >
                  {loading ? 'Processing...' : 'Send Answer'}
                </button>
              </>
            )}
          </>
        )}

        {phase === 'complete' && (
          <>
            <h2>📝 Your Optimized TCRE Prompt</h2>
            <div style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              textAlign: 'left',
              padding: '15px',
              border: '1px solid #000',
              borderRadius: 10,
              background: '#111',
              color: 'white',
              width: '100%',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}>
              {finalPrompt}
            </div>

            {evaluation && (
              <>
                <h3>✅ TCRE Framework Evaluation</h3>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  padding: '15px',
                  border: '1px solid #000',
                  borderRadius: 10,
                  background: '#111',
                  width: '100%',
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  {evaluation}
                </div>
              </>
            )}

            {improvements && (
              <>
                <h3>🚀 Suggested Improvements</h3>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  padding: '15px',
                  border: '1px solid #000',
                  borderRadius: 10,
                  background: '#111',
                  width: '100%',
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  {improvements}
                </div>
              </>
            )}

            <button onClick={resetTool} className={styles.button}>
              Create Another Prompt
            </button>
          </>
        )}

        <div style={{ marginTop: '30px', fontSize: '12px', color: '#666', textAlign: 'left' }}>
          <strong>TCRE Framework:</strong><br />
          <strong>T</strong>ask - Clear, specific action/output<br />
          <strong>C</strong>ontext - Background, constraints, audience<br />
          <strong>R</strong>eferences - Examples, formats, standards<br />
          <strong>E</strong>valuate - Success criteria, iteration process
        </div>
      </main>
    </>
  )
}