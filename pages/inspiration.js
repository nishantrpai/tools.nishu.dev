// Generate inspiring stories of impossible things achieved
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [storiesArray, setStoriesArray] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [totalStoriesShown, setTotalStoriesShown] = useState(0)
  const [showEndMessage, setShowEndMessage] = useState(false)
  
  const generateStories = async () => {
    if (loading) return // Prevent multiple simultaneous calls
    
    setLoading(true)
    const prompt = "give me a list of 10 short, inspiring stories (real or fictional) where something once thought impossible was achieved or overcome. each should include the name/title, the time or setting (if known), and a 2–3 sentence summary describing exactly what was achieved and why it was considered impossible. keep each under 100 words. no fluff—focus on what happened and why it mattered. Format each story clearly separated with a blank line between them. Format each story as: **Title** on first line, *Setting/Time* on second line, then summary paragraph. Do not include labels like 'Title:', 'Setting:', 'Summary:'."
    
    const res = await fetch(`/api/gpt?prompt=${encodeURIComponent(prompt)}`)
    const data = await res.json()
    
    // Split stories into array and format them
    const storiesText = data.response
    const stories = storiesText.split('\n\n').filter(story => story.trim().length > 0)
    
    // Process each story to convert markdown to HTML-like structure
    const formattedStories = stories.map(story => {
      // Replace **text** with <h2>text</h2>
      story = story.replace(/\*\*(.*?)\*\*/g, '<h2>$1</h2>')
      // Replace *text* with <h3>text</h3>
      story = story.replace(/\*(.*?)\*/g, '<h3>$1</h3>')
      // Wrap remaining text in <p> tags
      const lines = story.split('\n').filter(line => line.trim())
      let formatted = ''
      lines.forEach(line => {
        if (line.includes('<h2>') || line.includes('<h3>')) {
          formatted += line + '\n'
        } else if (line.trim()) {
          formatted += `<p>${line}</p>\n`
        }
      })
      return formatted
    })
    
    setStoriesArray(formattedStories)
    setCurrentIndex(0)
    setTotalStoriesShown(prev => prev + formattedStories.length)
    setLoading(false)
  }

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Navigation functions
  const nextStory = () => {
    if (isTransitioning) return // Prevent rapid navigation
    
    if (currentIndex < storiesArray.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
        setIsTransitioning(false)
      }, 150)
    } else {
      // Check if we've shown 20 stories total
      if (totalStoriesShown >= 20) {
        setShowEndMessage(true)
      } else {
        setIsTransitioning(true)
        setTimeout(() => {
          generateStories() // Generate new stories only if under 20 total
          setIsTransitioning(false)
        }, 150)
      }
    }
  }

  const prevStory = () => {
    if (isTransitioning) return // Prevent rapid navigation
    
    if (currentIndex > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }

  // Mobile touch/scroll handling
  useEffect(() => {
    if (!isMobile) return

    let startY = 0
    let isScrolling = false

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      if (isScrolling) return
      const endY = e.changedTouches[0].clientY
      const diff = startY - endY

      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          nextStory()
        } else {
          prevStory()
        }
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      if (e.deltaY > 0) {
        nextStory()
      } else {
        prevStory()
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [currentIndex, storiesArray.length, isMobile])

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        nextStory()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        prevStory()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, storiesArray.length])

  // Auto-generate on page load
  useEffect(() => {
    generateStories()
  }, [])

  return (
    <>
      <Head>
        <title>Inspiration Stories</title>
        <meta name="description" content="Get inspired by stories of impossible things achieved" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx>{`
        .feed-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .story-card {
          width: 90vw;
          max-width: 400px;
          height: 80vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 30px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .story-card.transitioning {
          transform: translateY(-20px);
          opacity: 0.7;
        }

        .story-content {
          font-size: 18px;
          line-height: 1.6;
          white-space: pre-wrap;
          overflow-y: auto;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .story-content.transitioning {
          transform: translateY(10px);
          opacity: 0;
        }

        .story-content h2 {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .story-content h3 {
          font-size: 16px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 16px 0;
          font-style: italic;
        }

        .story-content p {
          font-size: 18px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.6;
        }

        .story-counter {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .navigation {
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 10;
        }

        .nav-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          font-size: 18px;
          color: white;
        }

        .mobile-hint {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-align: center;
        }

        .end-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
        }

        .end-message h2 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 16px 0;
          line-height: 1.3;
        }

        .end-message p {
          font-size: 18px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 24px 0;
          line-height: 1.6;
        }

        .restart-button {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .restart-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .navigation {
            display: none;
          }
          .story-card {
            width: 95vw;
            height: 85vh;
            padding: 30px 20px;
          }
          .story-content {
            font-size: 16px;
          }
          .story-content h2 {
            font-size: 20px;
          }
          .story-content h3 {
            font-size: 14px;
          }
          .end-message h2 {
            font-size: 24px;
          }
          .end-message p {
            font-size: 16px;
          }
          .restart-button {
            font-size: 14px;
            padding: 10px 20px;
          }
        }
      `}</style>

      <div className="feed-container">
        <div className={`story-card ${isTransitioning ? 'transitioning' : ''}`}>
          {loading && (
            <div className="loading-overlay">
              Generating stories...
            </div>
          )}
          
          {showEndMessage ? (
            <div className="end-message">
              <h2>✨ Time to Be the Inspiration ✨</h2>
              <p>You've consumed enough stories. Now go create your own impossible achievement!</p>
              <button 
                className="restart-button"
                onClick={() => {
                  setShowEndMessage(false)
                  setTotalStoriesShown(0)
                  generateStories()
                }}
              >
                Start Over
              </button>
            </div>
          ) : storiesArray.length > 0 && (
            <>
              <div className="story-counter">
                {totalStoriesShown - storiesArray.length + currentIndex + 1} / 20
              </div>
              
              <div className={`story-content ${isTransitioning ? 'transitioning' : ''}`}>
                <div dangerouslySetInnerHTML={{ __html: storiesArray[currentIndex] }} />
              </div>
              
              <div className="mobile-hint">
                {isMobile ? 'Swipe up/down for more stories' : 'Use arrow keys or scroll'}
              </div>
            </>
          )}
        </div>

        {!isMobile && storiesArray.length > 0 && !showEndMessage && (
          <div className="navigation">
            <button 
              className="nav-button" 
              onClick={prevStory}
              disabled={currentIndex === 0}
            >
              ↑
            </button>
            <button 
              className="nav-button" 
              onClick={nextStory}
            >
              ↓
            </button>
          </div>
        )}
      </div>
    </>
  )
}