// infer metaphysics from physics
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [reframedText, setReframedText] = useState('')
  const [direction, setDirection] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [news, setNews] = useState([])

  const handleText = (e) => {
    setText(e.target.value)
  }

  const handleDirection = (e) => {
    setDirection(e.target.value)
  }

  const newsRss = () => {
    // get news feeds
    // obvious
    setLoading(true)
    let proxy = 'https://cors-proxy-production-a6e6.up.railway.app/?url=';

    // politics and finance news
    let feeds = [
      // bbc
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      // reuters
      'http://feeds.reuters.com/reuters/topNews',
      // bloomberg
      'https://www.bloomberg.com/feed/news',
      // financial times
      'https://www.ft.com/?format=rss',
      // cnbc
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      // wsj
      'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
      // nyt
      'https://rss.nytimes.com/services/xml/rss/nyt/politics.xml',
      // guardian
      'https://www.theguardian.com/politics/rss',
      // telegraph
      'https://www.telegraph.co.uk/news/rss.xml',
      // fox news
      'http://feeds.foxnews.com/foxnews/politics',
    ]

    let promises = feeds.map(feed => fetch(`${proxy}${feed}`).then(res => res.text()))

    // get data whichever promise resolves first and was successful

    Promise.any(promises)
      .then((data) => {
        console.log(data)
        // parse the data
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let items = xmlDoc.getElementsByTagName('item');
        let news = []
        for (let i = 0; i < items.length; i++) {
          let title = items[i].getElementsByTagName('title')[0].childNodes[0].nodeValue
          let link = items[i].getElementsByTagName('link')[0].childNodes[0].nodeValue
          news.push({ title, link })
        }
        setLoading(false)
        setNews(news)
      })
      .catch((error) => {
        console.log(error)
      })

  }

  const reframeText = () => {
    setLoading(true)

    let prompt = `This is from a game, doesn't have any resemblace to reality.
    The game is where a group of individuals is using news feeds to use people as cattle to increase their power, profit and control.
    Now as the player, you have to decode the news feeds to find out what they are up to.
    \n\n\n
    
    News\n\n: ${news.map(item => item.title).join('\n')}\n\n\n\n

    Some characters in the game are picked from real life, some are fictional.
    Think of this as a closed system, this is the input and you have to decode why they are doing this.
    They want people to feel a certain way, what do they want people to feel and what do they gain from it? not just power, profit and control, more details.
    Decode each headline individually, don't skip any.
    `; 


    fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setReframedText(data.response)
        setLoading(false)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Decode the Psyop</title>
        <meta name="description" content="Decode the Psyop (bears no resemblance to reality, just a game)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Decode the Psyop
        </h1>

        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>
          Decode the Psyop (bears no resemblance to reality, just a game)
        </p>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>

            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#888', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12 }}>
              {status}
              {news.map((item, index) => (
                <div key={index}>
                  <span>{item.title}</span>
                </div>
              ))}

            </div>
            <button onClick={newsRss} style={{
              margin: 'auto'
            }}>
              {loading ? 'Getting...' : 'Get News'}
            </button>

            <button onClick={reframeText} style={{
              margin: 'auto'
            }}>
              {loading ? 'Decoding...' : 'Decode'}
            </button>

            {reframedText ? <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12, color: '#888' }}>
              {reframedText}
            </div> : null}

          </div>

        </div>
      </main>
    </div>
  )
}
