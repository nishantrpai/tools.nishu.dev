import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { FiPlay, FiPause, FiClock } from 'react-icons/fi'
import { FaHistory } from "react-icons/fa";

export default function LibrevoxPlayer() {
  const [url, setUrl] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookDescription, setBookDescription] = useState('')
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sleepTimer, setSleepTimer] = useState(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const proxy = 'https://api.codetabs.com/v1/proxy/?quest='
  const [timeLeft, setTimeLeft] = useState(null)
  const [chapterProgress, setChapterProgress] = useState({})
  const [bookHistory, setBookHistory] = useState([])

  const saveProgress = () => {
    const progress = {
      url,
      bookTitle,
      currentChapter,
      chapterProgress,
      lastAccessed: Date.now()
    }
    localStorage.setItem('currentBook', JSON.stringify(progress))

    // Update history
    const history = JSON.parse(localStorage.getItem('bookHistory') || '[]')
    const existingIndex = history.findIndex(b => b.url === url)
    if (existingIndex > -1) {
      history.splice(existingIndex, 1)
    }
    history.unshift(progress)
    history.splice(10) // Keep only last 10 books
    localStorage.setItem('bookHistory', JSON.stringify(history))
    setBookHistory(history)
  }

  const loadProgress = () => {
    const progress = JSON.parse(localStorage.getItem('currentBook'))
    if (progress) {
      setUrl(progress.url)
      setBookTitle(progress.bookTitle)
      setCurrentChapter(progress.currentChapter)
      setChapterProgress(progress.chapterProgress || {})
    }
    const history = JSON.parse(localStorage.getItem('bookHistory') || '[]')
    setBookHistory(history)
  }

  const resumeBook = (book) => {
    setUrl(book.url)
    setBookTitle(book.bookTitle)
    setCurrentChapter(book.currentChapter)
    setChapterProgress(book.chapterProgress || {})
  }

  useEffect(() => {
    loadProgress()
  }, [])

  useEffect(() => {
    if (url && bookTitle) {
      saveProgress()
    }
  }, [url, currentChapter, chapterProgress])

  const fetchChapters = async () => {
    try {
      setLoading(true)
      setError(null)

      // First fetch the HTML page
      const response = await fetch(proxy + url, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        }
      });
      const html = await response.text();

      // Extract RSS link from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      let rssLink = Array.from(doc.getElementsByTagName('a'))
        .find(a => a.href && a.href.includes('/rss/'))?.href;

      if (!rssLink) {
        throw new Error('RSS feed not found on this page');
      }

      // if rsslink has itpc:// replace it with https://
      if (rssLink.includes('itpc://')) {
        rssLink = rssLink.replace('itpc://', 'https://');
      }

      // Fetch RSS feed
      const rssResponse = await fetch(proxy + rssLink, {
        headers: {
          'Accept': 'text/xml',
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        }
      });
      const rssData = await rssResponse.text();

      // Parse RSS XML
      const xml = parser.parseFromString(rssData, 'text/xml');
      const items = xml.getElementsByTagName('item');

      // get rss title and description 
      const title = xml.getElementsByTagName('title')[0]?.textContent;
      const description = xml.getElementsByTagName('itunes:summary')[0]?.textContent;
      setBookTitle(title);
      setBookDescription(description);
      const chaptersList = Array.from(items).map(item => ({
        title: item.getElementsByTagName('title')[0].textContent,
        url: item.getElementsByTagName('enclosure')[0]?.getAttribute('url'),
        duration: item.getElementsByTagName('itunes:duration')[0]?.textContent
      })).filter(chapter => chapter.url);

      setChapters(chaptersList);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const playChapter = (index) => {
    setCurrentChapter(index)
    setIsPlaying(true)
    audioRef.current.src = chapters[index].url
    if (chapterProgress[index]) {
      audioRef.current.currentTime = chapterProgress[index]
    }
    audioRef.current.play()
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const setSleepTimerDuration = (minutes) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      clearInterval(timerRef.current)
    }

    if (minutes) {
      setSleepTimer(minutes)
      const endTime = Date.now() + minutes * 60 * 1000

      // Update countdown every second
      timerRef.current = setInterval(() => {
        const remaining = Math.ceil((endTime - Date.now()) / 1000)
        if (remaining <= 0) {
          audioRef.current.pause()
          setIsPlaying(false)
          setSleepTimer(null)
          setTimeLeft(null)
          clearInterval(timerRef.current)
          window.close()
        } else {
          const mins = Math.floor(remaining / 60)
          const secs = remaining % 60
          setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`)
        }
      }, 1000)
    } else {
      setSleepTimer(null)
      setTimeLeft(null)
    }
  }

  const handleTimeUpdate = () => {
    setChapterProgress({
      ...chapterProgress,
      [currentChapter]: audioRef.current.currentTime
    })
  }

  useEffect(() => {
    if (url) {
      fetchChapters()
    }
  }, [url])

  return (
    <>
      <Head>
        <title>LibriVox Audiobook Player</title>
        <meta name="description" content="Listen to LibriVox audiobooks" />
      </Head>
      <main>
        <h1>LibriVox Audiobook Player</h1>



        <div style={{ marginBottom: '40px', width: '100%' }}>
          <label htmlFor="url">LibriVox URL</label>
          <br />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste LibriVox book URL (e.g. https://librivox.org/...)"
          />
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          {loading && <div style={{ marginTop: '10px' }}>Loading chapters...</div>}
        </div>

        <div style={{ marginBottom: '20px', width: '100%' }}>
          <audio
            ref={audioRef}
            onEnded={() => currentChapter < chapters.length - 1 && playChapter(currentChapter + 1)}
            onTimeUpdate={handleTimeUpdate}
            style={{ width: '100%' }}
            controls
          />
        </div>

        {timeLeft && (
          <div style={{
            fontSize: '48px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {timeLeft}
          </div>
        )}

        <label htmlFor="sleep-timer"><FiClock /> Sleep Timer</label>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', width: '100%' }}>
          <button onClick={() => setSleepTimerDuration(5)}>5 min</button>
          <button onClick={() => setSleepTimerDuration(10)}>10 min</button>
          <button onClick={() => setSleepTimerDuration(15)}>15 min</button>
          <button onClick={() => setSleepTimerDuration(30)}>30 min</button>
          <button onClick={() => setSleepTimerDuration(60)}>1 hour</button>
          {sleepTimer && (
            <button onClick={() => setSleepTimerDuration(null)}>
              Cancel Timer ({sleepTimer}m)
            </button>
          )}
        </div>

        <div style={{  width: '100%'}}>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>{bookTitle}</h2>
          <div style={{
            color: '#666',
            marginBottom: '10px',
            fontSize: 12
          }} dangerouslySetInnerHTML={{ __html: bookDescription }} />
          <div style={{ marginBottom: '10px', fontSize: 12, width: '100%', border: '1px solid #333', borderRadius: '4px', maxHeight: '400px', overflow: 'auto', }}>
            {chapters.map((chapter, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: currentChapter === index ? '#111' : 'transparent',
                  color: currentChapter === index ? '#fff' : '#888',
                  marginBottom: '5px',
                  borderRadius: '4px',
                  fontSize: 12
                }}
              >
                <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => playChapter(index)}>
                  {chapter.title}
                </div>
                {currentChapter === index && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay()
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'inherit'
                    }}
                  >
                    {isPlaying ? <FiPause /> : <FiPlay />}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add history section before URL input */}
        {bookHistory.length > 0 && (
          <div style={{ marginBottom: 40, width: '100%', opacity: 0.75 }}>
            <h4 style={{fontSize: 14, display: 'flex', gap: 5, alignItems: 'center'}}><FaHistory/>Recent Books</h4>
            {bookHistory.map((book, index) => (
              <div
                key={index}
                onClick={() => resumeBook(book)}
                style={{
                  cursor: 'pointer',
                  margin: '10px 0',
                  borderRadius: '4px',
                }}
              >
                <div style={{ color: '#ccc', fontSize: 14}}>{book.bookTitle || 'Untitled Book'}</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 5 }}>
                  Chapter {book.currentChapter + 1} {book.chapterProgress[book.currentChapter] ? `(${Math.floor(book.chapterProgress[book.currentChapter] / 60)}m)` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </>
  )
}
