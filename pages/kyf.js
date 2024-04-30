// know your farcaster: user inputs a farcaster username fetch their tweets from searchcaster and ask gpt to summarize what they do like/dislike
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function Home() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState({})
  const [tweets, setTweets] = useState([])
  const [summary, setSummary] = useState('')
  const [question, setQuestion] = useState('')
  const [askedQuestion, setAskedQuestion] = useState('')
  const [answer, setAnswer] = useState('')

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
            {formattedSummary[key].map((item, index) => <li style={{ color: '#ccc', marginBottom: '5px' }} key={index}>- {item.toLowerCase()}</li>)}
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
    let prompt = `Given the tweets of ${username}: ${casts.join(' ')}, summarize what ${username} does and what they like/dislike. 
    Tips for summarizing: 0. respond in json and the keys should be lower case 
    1. Keep 3 sections of concise information, first is "about", "like" and third is "dislike". 
    2. Don't summarize what is obvious, read between the lines and see the repeating patterns. 
    3. Avoid recency bias. 
    4. Replace any mention of twitter with farcaster or tweets with posts.  
    5. No quotes. 
    6. Speak in third person.
    7. Don't repeat the name, just share the information.
    8. Each point will be value in array.`
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

  const shareProfile = () => {
    // capture the profile div as image and share it
    let profile = document.getElementById('profile')
    html2canvas(profile, {
      allowTaint: true,
      backgroundColor: 'transparent',
      useCORS: true,
    }).then(canvas => {
      let img = canvas.toDataURL('image/png')
      let a = document.createElement('a')
      a.href = img
      a.download = 'profile.png'
      a.click()
    });
  }

  const formatSummaryForGPT = (summary) => {
    let { about, like, dislike } = JSON.parse(summary)
    let profile = `About ${username}: ${about.join(' ')}. Likes: ${like.join(' ')}. Dislikes: ${dislike.join(' ')}`
    return profile
  }

  const askQuestion = () => {
    console.log(question)
    // ask gpt to answer the question
    setAnswer('Loading...')
    setAskedQuestion(question)
    let prompt = `You are  ${username}: \n\n${formatSummaryForGPT(summary)}. Here is a question: ${question}. How would you answer. Speak in first person, don't speak about yourself in third person.`
    fetch(`/api/gpt?prompt`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.response)
        setAnswer(data.response)
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
            {Object.keys(profile).length ? <div id="profile" style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #333', background: '#000', borderRadius: '5px', padding: '10px', }}>
              <div style={{ display: 'flex', gap: '20px', padding: '30px 10px', borderBottom: '1px solid #333' }}>
                <img crossorigin="anonymous" src={profile.avatarUrl} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #333'}} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h2>{profile.displayName}</h2>
                  <h3 style={{ color: '#aaa', fontSize: '14px', fontWeight: '100' }}>@{profile.username}</h3>
                  <p style={{ color: '#888', fontSize: '12px', fontWeight: '100' }}>{profile.bio}</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', fontSize: '12px', marginTop: '0px', padding: '20px' }}>{formatSummary(summary)}</p>
            </div> : null}
          </div>

          {Object.keys(profile).length ? <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={shareProfile}>Share Profile</button>
          </div> : null}
        </div>

        {/* ask questions with the summary of the profile */}
        {(summary.length > 0 && summary !== 'Loading...') ? <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', marginTop: '50px' }}>
          <h2>Ask Questions</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={{ border: '1px solid #333', background: '#000', padding: '5px 10px', outline: 'none', fontSize: '16px', flexBasis: '90%' }} type="text" placeholder="Enter question" onChange={(e) => { setQuestion(e.target.value) }} />
            <button onClick={askQuestion}>Ask</button>
          </div>
          {askedQuestion ? <div style={{ display: 'flex', gap: '10px', alignContent: 'center', justifyContent: 'center', border: '1px solid #333', padding: '20px' }}>
            <img src={profile.avatarUrl} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #333', margin: 'auto', marginTop: '15px'  }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexBasis: '90%' }}>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', fontSize: '12px', marginTop: '0px', padding: '20px' }}>
                {askedQuestion}
              </p>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', fontSize: '12px', marginTop: '0px', padding: '20px', color: '#ccc', paddingTop: '0px' }}>
                <b>{username}</b>: {answer}
              </p>

            </div>
          </div> : null}
        </div> : null}

      </main>
    </div>
  )
}
