// know your farcaster: user inputs a farcaster username fetch their tweets from searchcaster and ask gpt to summarize what they do like/dislike
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [tweets, setTweets] = useState([])
  const [summary, setSummary] = useState('')

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }

  const fetchTweets = () => {
    setSummary('Loading...')
    fetch(`https://searchcaster.xyz/api/profiles?username=${username}`)
      .then(res => res.json())
      .then(data => {
        let fid = data[0].body.id
        console.log(fid)
        fetch(`https://client.warpcast.com/v2/casts?fid=${fid}&limit=30`).then(res => res.json()).then(data => {
          let casts = data.result.casts
          casts = casts.filter(cast => cast.author.fid === fid)
          casts = casts.map(cast => cast.text)
          casts = casts.filter(cast => cast.length > 0)
          console.log(casts)
          setTweets(casts)
        })
      })
  }

  const summarize = (casts, username) => {
    fetch(`/api/gpt?prompt="Given the tweets of ${username}: ${casts.join(' ')}, summarize what ${username} does and what they like/dislike. Don't summarize what is obvious, read between the lines and see the repeating patterns. Avoid recency bias. Replace any mention of twitter with farcaster or tweets with posts. Speak in third person. No quotes. Keep 3 sections of concise information, first is About, Like and third is Dislike. Add new lines between each section. For each section keep bullet points."`)
      .then(res => res.json())
      .then(data => {
        setSummary(data.response)
      })
  }

  useEffect(() => {
    summarize(tweets, username)
  }, [tweets])

  return (
    <div className={styles.container}>
      <Head>
        <title>Know Your Farcaster</title>
        <meta name="description" content="Know your farcaster" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Know Your Farcaster
        </h1>

        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>
          Fetch tweets from a farcaster and summarize what they do and what they like/dislike
        </p>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input style={{ border: '1px solid #333', background: '#000', padding: '5px 10px', outline: 'none', fontSize: '16px', flexBasis: '90%' }} type="text" placeholder="Enter username" value={username} onChange={handleUsername} />
              <button onClick={fetchTweets}>Analyze</button>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{summary}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
