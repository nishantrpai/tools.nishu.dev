// idea to problem: user inputs an idea and localhost:3000/api/gpt?prompt= fetches problems that are solved with that idea
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [problems, setProblems] = useState([])

  const handleIdea = (e) => {
    setIdea(e.target.value)
  }

  const fetchProblems = () => {
    setProblems(['Loading...'])
    fetch(`/api/gpt?prompt="Given the idea: ${idea}, find problems (maybe even business problem) that are solved with this idea. Respond a list of array of problems for e.g., ["1","2","3"].  Don't include the idea in the response or any other information."`)
      .then(res => res.json())
      .then(data => {
        setProblems(JSON.parse(data.response))
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Idea to Problem</title>
        <meta name="description" content="Suggest problems that are solved with your idea" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Idea to Problem
        </h1>

        <p className={styles.description}>
          Suggests problems that are solved with your idea.
        </p>

        <div style={{ display: 'flex', width: '100%', fontSize: '12px', gap: '20px'}}>
          <input style={{flexBasis: '90%', padding: '10px', border: '1px solid #333', outline: 'none'}} type="text" placeholder="Enter an idea" value={idea} onChange={handleIdea} />
          <button onClick={fetchProblems}>Suggest</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontSize: '12px', gap: '20px', fontFamily: 'monospace'}}>
          {problems.map((problem, index) => (
            <div key={index}>
              <p>- {problem}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}