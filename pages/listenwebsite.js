// Listen to website content

import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function ListenWebsite() {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [vidx, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    setVoices(voices);
    setVoice(voices[0]);
  }, []);

  const fetchContent = async () => {
    const voices = window.speechSynthesis.getVoices();
    setVoices(voices);
    setVoice(voices[0]);

    console.log('fetching content', url)
    let proxy = 'https://api.codetabs.com/v1/proxy/?quest='
    const response = await fetch(proxy + url, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Origin': 'https://www.google.com', 
      }
    });
    const res = await response.text();
    let document = new DOMParser().parseFromString(res, 'text/html');
    // remove extra spaces and new lines
    // remove script and style tags
    // allow paragraphs
    let text = document.body.textContent;
    text = text.replace(/<script.*?<\/script>/g, '');
    text = text.replace(/<style.*?<\/style>/g, ''); 
    text = text.replace(/\s+/g, ' ');
    setContent(text);
  };

  const speak = () => {
    window.speechSynthesis.cancel();
    const chunks = content.match(/.{1,100}/g); // Split content into chunks of 100 characters
    let currentChunk = 0;

    const speakChunk = () => {
      if (currentChunk < chunks.length) {
        const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
        utterance.voice = voice || window.speechSynthesis.getVoices()[0];
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
          currentChunk++;
          speakChunk();
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    };

    speakChunk();
  }

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Listen to Website</title>
        <meta name="description" content="Listen to website content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Listen to Website
        </h1>
        <h2 className={styles.description}>
          Enter a website URL and listen to its content
        </h2>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Enter website URL"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button onClick={fetchContent}>Fetch Content</button>
          <textarea 
            style={{ background: '#000', border: '1px solid #333', width:'100%', minWidth: '300px', height: '200px', color: '#fff' }} 
            defaultValue={content} 
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {voices.length > 0 &&
            <select value={vidx} onChange={e => { setVoice(voices[e.target.value]); setVoiceIndex(e.target.value) }}>
              {voices.map((voice, index) => (
                <option key={index} value={index}>{voice.name}</option>
              ))}
            </select>}
        <div>
          <h3>Rate: {rate}</h3>
          <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <h3>Pitch: {pitch}</h3>
          <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(e.target.value)} />
        </div>
        <div>
          <h3>Volume: {volume}</h3>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(e.target.value)} />
        </div>
        <div style={{
          display: 'flex',
          gap: '30px'
        }}>
          <button onClick={speak} disabled={isPlaying || !content}>
            {isPlaying ? 'Speaking...' : 'Speak'}
          </button>
          <button onClick={stop} disabled={!isPlaying}>Stop</button>
        </div>
      </main>
    </div>
  )
}
