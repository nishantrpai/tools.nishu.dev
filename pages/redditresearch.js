import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiArrowRight, FiStar } from "react-icons/fi";

export default function RedditResearch() {
  const [subreddit, setSubreddit] = useState('webdev')
  const [query, setQuery] = useState('')
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [exactMatch, setExactMatch] = useState(false)
  const [activeTab, setActiveTab] = useState('search')
  const [history, setHistory] = useState([])

  useEffect(() => {
    setSearches([])
  }, [subreddit])

  const copyResults = () => {
    let text = ''
    searches.forEach(search => {
      text += `query: ${search.query}\nposts:\n`
      search.posts.forEach(post => {
        text += `- ${post.title}\n`
      })
      text += '\n'
    })
    navigator.clipboard.writeText(text)
  }

  const toggleStar = (idx) => {
    setHistory(prev => prev.map((h, i) => i === idx ? {...h, starred: !h.starred} : h))
  }

  const searchPosts = async () => {
    if (!query.trim()) return;
    const lowerQuery = query.toLowerCase()
    if (searches.some(s => s.query.toLowerCase() === lowerQuery)) {
      alert('Query already searched for')
      return
    }
    setLoading(true)
    setStatus('fetching posts...')
    try {
      const res = await fetch(`https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=100&sort=relevance`)
      const data = await res.json()
      const allPosts = data.data.children.map(post => post.data)
      console.log('All Posts:', allPosts)
      let matchingPosts
      if (exactMatch) {
        matchingPosts = allPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()))
      } else {
        const words = query.toLowerCase().split(' ').filter(w => w.trim())
        matchingPosts = allPosts.filter(post => words.every(word => post.title.toLowerCase().includes(word)))
      }
      console.log('Matching Posts:', matchingPosts)
      setSearches(prev => [{ query, posts: matchingPosts }, ...prev])
      // Add to history if not already present
      setHistory(prev => {
        const exists = prev.some(h => h.subreddit === subreddit && h.query.toLowerCase() === query.toLowerCase())
        if (!exists) {
          return [{ subreddit, query, posts: matchingPosts, starred: false }, ...prev]
        }
        return prev
      })
      setLoading(false)
    } catch (error) {
      setStatus('error fetching posts')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Reddit Research</title>
        <meta name="description" content="Search Reddit posts by exact title match" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

        <h1 className={styles.title}>Reddit Research</h1>
        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>Search Reddit posts by title match</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('search')} 
            style={{ 
              background: activeTab === 'search' ? '#333' : '#000', 
              color: '#fff', 
              border: '1px solid #333', 
              padding: '10px 20px', 
              borderRadius: 5 
            }}
          >
            Search
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            style={{ 
              background: activeTab === 'history' ? '#333' : '#000', 
              color: '#fff', 
              border: '1px solid #333', 
              padding: '10px 20px', 
              borderRadius: 5 
            }}
          >
            History
          </button>
        </div>

        {activeTab === 'search' && (
          <>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '70%', flexWrap: 'wrap', width: '100%' }}>
              <input style={{ background: '#000', color: '#fff', border: '1px solid #333', padding: '5px', borderRadius: 5, flex: 1 }} type="text" value={subreddit} onChange={(e) => setSubreddit(e.target.value)} placeholder='Enter the subreddit' />
              <input style={{ background: '#000', color: '#fff', border: '1px solid #333', padding: '5px', borderRadius: 5, flex: 1 }} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Enter the query' />
              <button style={{ width: '100%' }} onClick={(e) => { e.preventDefault(); searchPosts() }}>Search</button>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', color: '#fff' }}>
                <input type="checkbox" style={{width: 'max-content'}} checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} />
                Exact Match
              </label>
              <button style={{ width: '100%' }} onClick={(e) => { e.preventDefault(); copyResults() }}>Copy Results</button>
            </form>

            <br />
            <hr />
            {loading && <p>{status}</p>}

            {searches.map((search, idx) => (
              <div key={idx} style={{ marginBottom: '20px', width: '100%' }}>
                <p style={{ textAlign: 'left', marginBottom: 10, color: '#888' }}>query: {search.query}</p>
                <p style={{ textAlign: 'left', marginBottom: 20, color: '#888' }}>posts:</p>
                <ul style={{
                  listStyleType: 'none',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  padding: 0,
                  display: 'flex', flexDirection: 'column', gap: '10px',
                  width: '100%',
                }}>
                  {search.posts.map((post, index) => (
                    <li key={index}>
                      <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                        {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <hr style={{ color: '#fff', marginTop: 20 }} />
              </div>
            ))}
          </>
        )}        {activeTab === 'history' && (
          <>
            {history.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '20px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 10 }}>
                  <p style={{ textAlign: 'left', color: '#888', margin: 0 }}>r/{item.subreddit}: {item.query}</p>
                  <button onClick={() => toggleStar(idx)} style={{ background: 'none', border: 'none', color: item.starred ? '#ffd700' : '#888', cursor: 'pointer' }}>
                    <FiStar />
                  </button>
                </div>
                <hr style={{ color: '#fff', marginTop: 20 }} />
              </div>
            ))}
          </>
        )}
      </main>

    </>
  )
}
