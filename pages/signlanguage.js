// generate sign language images and videos from text using Wikipedia and SignASL API

import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function SignLanguage() {
  const [essentialWords, setEssentialWords] = useState([])
  const [signData, setSignData] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filterWords = async (words) => {
    // filter essential words for sign language using gpt
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        prompt: `Filter the following words to only include essential words for sign language: ${words.join(' ')}. Only respond with filtered words, no prefix or suffix`
      })
    })
    const data = await res.json()
    return data.response.split(' ')
  }

  const getWikipediaImage = async (word) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&prop=pageimages&format=json&pithumbsize=300&origin=*`);
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      return pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null;
    } catch (error) {
      console.error('Error fetching Wikipedia image:', error);
      return null;
    }
  }

  const getSignVideo = async (word) => {
    try {
      let proxy = 'https://api.codetabs.com/v1/proxy/?quest='
      const response = await fetch(proxy + `https://www.signasl.org/sign/${encodeURIComponent(word)}`);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      console.log(doc)
      const videoElement = doc.getElementById('video_con_signasl_1');

      if (videoElement) {
        return videoElement.querySelector('source').src;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching sign language video:', error);
      return null;
    }
  }

  const getSignData = async () => {
    setLoading(true)
    const words = text.split(' ')
    const filteredWords = await filterWords(words)
    setEssentialWords(filteredWords)
    console.log(filteredWords)
    const data = []
    for (const word of filteredWords) {
      const image = await getWikipediaImage(word)
      const video = await getSignVideo(word)
      data.push({ word, image, video })
    }
    setSignData(data)
    setLoading(false)
    setCurrentIndex(0)
  }

  const handleNextImage = () => {
    if (currentIndex < signData.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <>
      <Head>
        <title>Sign Language</title>
      </Head>
      <main>
        <h1>Sign Language</h1>
        <h2 className={styles.description}>Convert text to sign language</h2>
        <input type="text" placeholder="Enter text" value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', padding: 20, fontSize: 20, borderRadius: 10, border: '1px solid #333', marginBottom: 20 }}/>
        <button onClick={getSignData} disabled={loading}>{loading ? 'Loading...' : 'Generate'}</button>
        {essentialWords.length > 0 && <span>MESSAGE: {essentialWords.join(' ')}</span>}
        {signData.length > 0 && <span>{signData.length} signs</span>}
        {signData.length > 0 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>{signData[currentIndex].word.toUpperCase()}</p>
            {signData[currentIndex].image && (
              <img src={signData[currentIndex].image} alt={`Wikipedia image for ${signData[currentIndex].word}`} style={{ width: '100%' }} />
            )}
            {signData[currentIndex].video && (
              <video src={signData[currentIndex].video} controls style={{ width: '100%' }} />
            )}
            <div style={{ display: 'flex', gap: 20, flex: 1 }}>
              <button onClick={handlePrevImage} style={{width: '50%', padding: 20}} disabled={currentIndex === 0}>Previous</button>
              <button onClick={handleNextImage} style={{width: '50%', padding: 20}} disabled={currentIndex === signData.length - 1}>Next</button>

            </div>
          </div>
        )}
      </main>
    </>
  )
}
