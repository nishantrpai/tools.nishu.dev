// know your farcaster: user inputs a farcaster username fetch their tweets from searchcaster and ask gpt to summarize what they do like/dislike
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState({})
  const [tweets, setTweets] = useState([])
  const [summary, setSummary] = useState('')

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }

  const formatSummary = (summary) => {
    // summary is a json object with keys about, like, dislike
    if (summary === 'Loading...') return summary
    let formattedSummary = JSON.parse(summary)
    let sections = []
    for (let key in formattedSummary) {
      let elem =
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
          <h4>{key.toUpperCase()}</h4>
          <ul style={{ listStyle: 'none' }}>
            {formattedSummary[key].map((item, index) => <li style={{ color: '#ccc', marginBottom: '5px' }} key={index}>- {item}</li>)}
          </ul>
        </div>
      sections.push(elem)
    }
    return sections
  }


  const fetchTweets = () => {
    setSummary('Loading...')
    fetch(`https://searchcaster.xyz/api/profiles?username=${username}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data[0].body)
        let fid = data[0].body.id
        console.log(fid)
        let url = encodeURIComponent(`https://client.warpcast.com/v2/casts?fid=${fid}&limit=30`)

        fetch(`https://cors-proxy-production-a6e6.up.railway.app/?url=${url}`).then(res => res.json()).then(data => {
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
    let prompt = `Given the tweets of ${username}: ${casts.join(' ')}, summarize what ${username} does and what they like/dislike. Tips for summarizing: 0. respond in json and the keys should be lower case 1. Keep 3 sections of concise information, first is "about", "like" and third is "dislike".  2. Don't summarize what is obvious, read between the lines and see the repeating patterns. 3. Avoid recency bias. 4. Replace any mention of twitter with farcaster or tweets with posts.  5. Speak in third person. No quotes.  6. Each point will be value in array.`
    fetch(`/api/gpt?prompt`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
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
          Fetch casts from a farcaster and summarize what they do and what they like/dislike
        </p>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input style={{ border: '1px solid #333', background: '#000', padding: '5px 10px', outline: 'none', fontSize: '16px', flexBasis: '90%' }} type="text" placeholder="Enter username" value={username} onChange={handleUsername} />
              <button onClick={fetchTweets}>Analyze</button>
            </div>
            {Object.keys(profile).length ? <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #333', borderRadius: '5px', padding: '10px', }}>
              <div style={{ display: 'flex', gap: '20px', padding: '30px 10px', borderBottom: '1px solid #333' }}>
                <img src={profile.avatarUrl} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #333' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h2>{profile.displayName}</h2>
                  <h3 style={{ color: '#aaa', fontSize: '14px', fontWeight: '100' }}>@{profile.username}</h3>
                  <p style={{ color: '#888', fontSize: '12px', fontWeight: '100' }}>{profile.bio}</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', fontSize: '12px', marginTop: '0px', padding: '20px' }}>{formatSummary(summary)}</p>
            </div> : null}
          </div>
        </div>
      </main>
    </div>
  )
}
