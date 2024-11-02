import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { FiYoutube } from 'react-icons/fi';
import html2canvas from 'html2canvas';

export default function AskYT() {
  const [timeStamp, setTimeStamp] = useState('0');
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=pwLergHG81c');
  const [transcript, setTranscript] = useState('');
  const [frame, setFrame] = useState('');
  const [quote, setQuote] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [spacing, setSpacing] = useState(50);

  const parseTime = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':');
    return parseFloat(minutes) * 60 + parseFloat(seconds);
  };



  const getQuote = (time) => {
    let lines = transcript.split('\n');
    let quote = '';
    let isCollecting = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        let [start, end] = lines[i].split(' --> ');
        console.log(start, end, time);
        start = start.split('.')[0];
        end = end.split('.')[0];
        if (compareTime(time, start) >= 0 && compareTime(time, end) <= 0) {
          isCollecting = true;
          continue;
        } else {
          isCollecting = false;
        }
      }

      if (isCollecting) {
        quote += lines[i] + '\n';
      }
    }

    return quote.trim();
  };


  const getYoutubeId = (url) => {
    if (!url) return '';
    return url.split(/(v=|vi=|\/v\/|\/vi\/|\/embed\/|youtu.be\/|\/user\/\S+\/\S+\/)/)[2].split(/[?&\/]/)[0];
  }

  const getTranscript = async (url) => {
    const videoId = getYoutubeId(url);

    const fetchTranscript = async (captionUrl) => {
      try {
        const res = await fetch(captionUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.text();
        setTranscript(data);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    try {
      await fetchTranscript(`https://invidious.fdn.fr/api/v1/captions/${videoId}?label=English`);
    } catch (err) {
      try {
        await fetchTranscript(`https://invidious.fdn.fr/api/v1/captions/${videoId}?label=English%20(auto-generated)`);
      } catch (err) {
        console.error('Failed to fetch transcript from both URLs', err);
      }
    }
  };


  const compareTime = (time1, time2) => {
    // compare time 00:00:17 and 00:00:18
    const time1Parts = time1.toString().split(':');
    const time2Parts = time2.toString().split(':');
    for (let i = 0; i < time1Parts.length; i++) {
      if (parseInt(time1Parts[i]) > parseInt(time2Parts[i])) {
        return 1;
      } else if (parseInt(time1Parts[i]) < parseInt(time2Parts[i])) {
        return -1;
      }
    }
    return 0;
  };

  const formatTime = (timeStr) => {
    // format time from 770.33192 to 00:12:50.331
    console.log('timeStr', timeStr);
    const parts = timeStr.split('.');
    const totalSeconds = parseInt(parts[0], 10);
    const milliseconds = parts[1] || '000';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}}`;
  };



  const captureFrame = () => {
    let video = videoRef.current;
    // get current time from video
    const currentTime = video.currentTime;
    setTimeStamp(formatTime(currentTime.toString()));
    let cq = getQuote(formatTime(currentTime.toString()));
    // if there are . or , replace with \n
    cq = cq.replace(/([.,?])/g, '$1\n');
    let lines = cq.split('\n');
    lines = lines.map(line => line.trim());
    // split further with . and , 

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 1500;
    canvas.height = video.videoHeight * (canvas.width / video.videoWidth);
    // set crossOrigin to anonymous to avoid tainted canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // draw a rectangle of canvas width with 0.5 opacity
    ctx.globalAlpha = 0.125;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw text on canvas
    ctx.globalAlpha = 1;
    // add line height 1.5
    ctx.textBaseline = 'top';
    ctx.font = `bold ${50 + parseInt(scale)}px Arial`;
    ctx.fillStyle = 'white';

    for (let i = 0; i < lines.length; i++) {
      let x = 100 + parseFloat(offsetX);
      let y = canvas.height - (200) + i * spacing + parseFloat(offsetY);
      console.log('x', x, 'y', y);
      ctx.fillText(lines[i].toUpperCase(), x, y);
    }
  };

  useEffect(() => {
    if (!url) return;
    console.log(url);
    getTranscript(url);
  }, [url]);

  useEffect(() => {
    console.log('offsetX', offsetX);
    captureFrame();
  }, [offsetX, offsetY, scale, rotation, spacing]);

  return (
    <>
      <Head>
        <title>Youtube Quotes</title>
        <meta name="description" content="Generate quotes from youtube videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center' }}>Youtube Quotes</h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>
          Generate quotes from youtube videos
        </h2>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }} placeholder="Paste youtube video url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className={styles.col} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ flexBasis: '100%', border: '1px solid #333', height: '500px' }}>
            <video
              src={`https://inv.nadeko.net/latest_version?id=${getYoutubeId(url)}&itag=18`}
              width="1500px"
              height="100%"
              controls
              style={{
                width: '100%',
              }}
              ref={videoRef}

            />
          </div>
          <canvas id="canvas" ref={canvasRef} style={{
            width: '100%',
            border: '1px solid #333',
            borderRadius: '5px',
            display: 'block',
            margin: '0 auto'
          }} />
          {/* <input type="text" value={timeStamp} onChange={(e) => setTimeStamp(e.target.value)} /> */}
          <label>offsetX</label>
          <input type="range" min="-1000" max="1000" step="0.01" value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>offsetY</label>
          <input type="range" min="-1000" max="1000" step="0.01" value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>scale</label>
          <input type="range" min="-100" max="100" step="1" value={scale} onChange={(e) => setScale(e.target.value)} />
          <label>line spacing</label>
          <input type="range" min="-100" max="100" step="1" value={spacing} onChange={(e) => setSpacing(e.target.value)} />
          <button onClick={captureFrame} style={{
            margin: '0 auto',
          }}>Capture Frame</button>
          <span style={{
            color: '#fff',
            fontSize: 12,
            fontWeight: 200,
            margin: '0 auto',
          }}>
            Right click, save image as to download the frame
          </span>

        </div>
      </main>
    </>
  );
}
