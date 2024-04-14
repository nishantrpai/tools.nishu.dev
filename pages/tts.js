// given a text input, the user can convert the text to speech using window speechsynthesis
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [vidx, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!window.speechSynthesis) return;
      setVoices(window.speechSynthesis.getVoices());
    if (!voice)
      setVoice(window.speechSynthesis.getVoices()[0]);

  }, [text]);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Text to Speech</title>
        <meta name="description" content="Convert text to speech" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Text to Speech
        </h1>
        <div>
          <textarea value={text} onChange={e => setText(e.target.value)}></textarea>
        </div>
        <div>
          {voices.length > 0 &&
            <select value={vidx} onChange={e => { setVoice(voices[e.target.value]); setVoiceIndex(e.target.value) }}>
              {voices.map((voice, index) => (
                <option key={index} value={index}>{voice.name}</option>
              ))}
            </select>}
        </div>
        <div>
          <h3>Rate</h3>
          <input type="range" min="0" max="2" step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <h3>Pitch</h3>
          <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(e.target.value)} />
        </div>
        <div>
          <h3>Volume</h3>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(e.target.value)} />
        </div>
        <div>
          <button onClick={speak}>Speak</button>
        </div>
      </main>
    </div>
  )
}
