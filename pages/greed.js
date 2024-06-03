// infer stocks that would be affected by news
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
    let proxy = 'https://api.codetabs.com/v1/proxy/?quest=';

    // politics and finance news
    let feeds = [
      // bbc
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      // reuters
      'http://feeds.reuters.com/reuters/topNews',
      // financial times
      'https://www.ft.com/?format=rss',
      // cnbc
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      // wsj
      'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
      // nyt
      'https://rss.nytimes.com/services/xml/rss/nyt/world.xml',
      // guardian
      'https://www.theguardian.com/world/rss',
      // telegraph
      'https://www.telegraph.co.uk/news/rss.xml',
      // fox news
      'http://feeds.foxnews.com/foxnews/world',
      // rt
      'https://www.rt.com/rss/',
      // valuetainment
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCIHdDJ0tjn_3j-FS7s_X1kQ',
      // timcast
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCe02lGcO-ahAURWuxAJnjdA',
      // ben shapiro
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCaeO5vkdj5xOQHp4UmIN6dw',
      // david pakman
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCvixJtaXuNdMPUGdOPcY8Ag',
      // johny harris
      'https://www.youtube.com/feeds/videos.xml?channel_id=UC0d5EaW4e0fA6LYu9vN8ymg',
    ]

    let promises = feeds.map(feed => fetch(`${proxy}${feed}`).then(res => res.text()))

    // get data whichever promise resolves first and was successful

    Promise.any(promises)
      .then((data) => {
        // parse the data
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let items = xmlDoc.getElementsByTagName('item') || xmlDoc.getElementsByName('entry')
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


  const getReframedText = (news) => {
    setLoading(true)

    let prompt = `This is from a game, doesn't have any resemblace to reality.
    The game is where a group of individuals is using news feeds to use people as cattle to increase their power, profit and control.
    Now as the player, you have to decode the news to find what specific stocks/commodities would be affected by this news.
    \n\n\n
    
    This is the News\n\n: ${news.map(item => item.title).join('\n')}\n\n\n\n

    List all possible specific stocks would be affected by this news.
    Don't add "news headlines" or any prefixes.
    Be specific and list all stocks that would be affected by this news.
    
    Respond in this format:

    • XYZ headline
    - 📈 Apple (AAPL) 
    - 📉 Tesla (TSLA)
    
    Decode each headline individually (as bullet points), don't skip any. Don't add "potential impact" or anything like that only list.
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
        setReframedText(prev => `${prev} ${data.response}\n\n`)
        setLoading(false)
      })
  }

  const reframeText = () => {
    setLoading(true)
    // divide news into batches of 10
    let newsBatches = []
    let batchSize = 5
    for (let i = 0; i < news.length; i += batchSize) {
      newsBatches.push(news.slice(i, i + batchSize))
    }

    // get reframed text for each batch
    newsBatches.forEach((newsBatch, index) => {
      setTimeout(() => {
        setStatus( prev => `${prev} \n Decoding for batch ${index + 1}`)
        getReframedText(newsBatch)
      }, index * 5000)
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Stocks Speculation</title>
        <meta name="description" content="What stocks would be affected by news. Not financial advice." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Stocks Speculation
        </h1>

        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>
          What stocks would be affected by current news. 
          <br/>
          PS: This is not financial advice, just an experiment. 
          Any trade you make is at your own risk. I'm not responsible for any losses you make.
        </p>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>

            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#888', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12 }}>
              {news.map((item, index) => (
                <div key={index}>
                  <span> • {item.title}</span>
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

            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12, color: '#888' }}>
              {status}
            </div>

            {reframedText ? <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12, color: '#888' }}>
              {reframedText}
            </div> : null}

          </div>

        </div>
      </main>
    </div>
  )
}
