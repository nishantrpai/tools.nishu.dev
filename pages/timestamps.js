import { useState, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';

export default function Timestamps() {
  const [videoUrl, setVideoUrl] = useState('');
  const [timestamps, setTimestamps] = useState([]);
  const [description, setDescription] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoLoad = (e) => {
    videoRef.current = e.target;
  };

  const handleTimeClick = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSaveTimestamp = () => {
    if (!description || currentTime === null) return;
    
    const newTimestamp = {
      time: currentTime,
      description: description,
      formattedTime: formatTime(currentTime)
    };

    setTimestamps([...timestamps, newTimestamp].sort((a, b) => a.time - b.time));
    setDescription('');
  };

  const getFormattedTimestamps = () => {
    return timestamps.map(ts => `${ts.formattedTime} - ${ts.description}`).join('\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedTimestamps());
    alert('Timestamps copied to clipboard!');
  };

  // New state handler functions
  const handleDurationInput = (e) => {
    const [minutes, seconds] = e.target.value.split(':').map(Number);
    setDuration((minutes * 60) + seconds);
  };

  const handleProgressBarClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  const handleProgressBarDrag = (e) => {
    if (!isDragging) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  return (
    <>
    <Head>
      <title>YouTube Timestamp Generator</title>
      <meta name="description" content="Generate YouTube video timestamps" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.container}>
      <h1>YouTube Timestamp Generator</h1>
      
      {/* <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Paste YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div> */}

      {/* New duration input element */}
      <div style={{ marginBottom: '20px', width: '100%' }}>
        <input
          type="text"
          placeholder="Enter video duration (MM:SS)"
          onChange={handleDurationInput}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      {/* {videoUrl && (
        <div style={{ marginBottom: '20px' }}>
          <iframe
            width="560"
            height="315"
            src={`${videoUrl.replace('watch?v=', 'embed/')}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
          ></iframe>
        </div>
      )} */}

      {/* Modified progress bar */}
      <div 
        style={{ 
          height: '40px', 
          backgroundColor: '#fff', 
          cursor: 'pointer',
          position: 'relative',
          marginBottom: '20px',
          width: '100%'
        }}
        onClick={handleProgressBarClick}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleProgressBarDrag}
      >
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            height: '100%',
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            backgroundColor: '#ff0000',
            pointerEvents: 'none'
          }}
        />
        {timestamps.map((ts, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${duration ? (ts.time / duration) * 100 : 0}%`,
              top: '0',
              width: '1px',
              height: '100%',
              backgroundColor: '#333'
            }}
            title={ts.description}
          />
        ))}
      </div>
      <p>Current Time: {formatTime(currentTime)}</p>

      <div style={{ marginBottom: '20px', justifyContent: 'center', display: 'flex', flexDirection: 'column', width: '100%' }}>
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleSaveTimestamp} style={{margin: 'auto'}}>Save Timestamp</button>
      </div>

      <div>
        <h3>Timestamps:</h3>
        <pre style={{ backgroundColor: '#000', padding: '10px', width: '100%' }}>
          {getFormattedTimestamps()}
        </pre>
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
      </div>
    </main>
    </>
  );
}