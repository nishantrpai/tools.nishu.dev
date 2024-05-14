// get frequently asked questions/problems from the subreddit
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { RiSparklingFill } from "react-icons/ri";


export default function SubredditIdeas() {
  const [subreddit, setSubreddit] = useState('webdev')
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const getIdeas = async (posts) => {
    // /api/gpt
    setStatus('checking patterns...')
    fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: `"Here are some recent posts from the subreddit ${subreddit}: ${posts.join(', ')}. \n\nFrom the posts problems have two patterns, people are either complaining about it or looking for solutions or maybe something else. Filter only the problems, don't show anything else. Two problems could be the same, but expressed in different langauge consider it as one.  List the problems and frequency for each for e.g., 1/d 1/h 1/w 1/y and how many posts you found related to that. Sort by most frequent to least frequent, many posts would be great. Respond only in json format for e.g.,[{problem, frequency, no}]. Don't add \` in the response."` })
    })
      .then(res => res.json())
      .then(data => {
        setIdeas(JSON.parse(data.response))
        setLoading(false)
      })
  }


  useEffect(() => {
    const fetchIdeas = async () => {
      setStatus('fetching posts...')
      const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=20`)
      const data = await res.json()
      let posts = data.data.children.map(post => `${post.data.title}`)
      getIdeas(posts)
      setLoading(false)
    }

    fetchIdeas()
  }, [subreddit])

  return (
    <>
      <Head>
        <title>Subreddit FAQ</title>
        <meta name="description" content="Get frequently asked questions in a subreddit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

        <h1 className={styles.title}>Subreddit FAQ</h1>
        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>Get frequently asked questions in a subreddit</p>

        <form style={{ display: 'flex', gap: '10px', width: '70%' }}>
          <input style={{ background: '#000', color: '#fff', border: '1px solid #333', width: '90%', padding: '5px', borderRadius: 5 }} type="text" defaultValue={subreddit} id="subreddit" placeholder='Enter the subreddit'/>
          <button style={{ background: '#000', color: '#fff', border: '1px solid #333 !important', padding: '10px 12px'}} onClick={(e) => { e.preventDefault(); setSubreddit(document.getElementById('subreddit').value); setLoading(true) }}><RiSparklingFill /></button>
        </form>

        <br />
        <hr />
        {loading && <p>{status}</p>}

        <ul style={{
          listStyleType: 'none',
          fontSize: '14px',
          fontFamily: 'monospace',
          padding: 0,
          display: 'flex', flexDirection: 'column', gap: '10px',
          width: '100%',
        }}>
          {ideas.map((idea, index) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <li key={index}>{idea.problem}</li>
              <div style={{ display: 'flex', gap: 10, fontSize: '8px', color: '#888' }}>
                <span>frequency: {idea.frequency}</span>
                <span>number: {idea.no}</span>
              </div>
            </div>

          ))}
        </ul>
      </main>

    </>
  )
}