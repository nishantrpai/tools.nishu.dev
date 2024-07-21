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

  const parseTime = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':');
    return parseFloat(minutes) * 60 + parseFloat(seconds);
  };

  const getQuote = (time) => {
    let lines = transcript.split('\n');
    let quote = '';
    console.log(lines);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        console.log(lines[i]);
        const [start, end] = lines[i].split(' --> ');
        console.log(start, end, time);
        if (compareTime(time, start) >= 0 && compareTime(time, end) <= 0) {
          quote = lines[i + 1];
          break;
        }
      }
    }
    setQuote(quote);
    return quote;
  };


  const getYoutubeId = (url) => {
    return url.split(/(v=|vi=|\/v\/|\/vi\/|\/embed\/|youtu.be\/|\/user\/\S+\/\S+\/)/)[2].split(/[?&\/]/)[0];
  }

  const getTranscript = (url) => {
    const videoId = url.split(/(v=|vi=|\/v\/|\/vi\/|\/embed\/|youtu.be\/|\/user\/\S+\/\S+\/)/)[2].split(/[?&\/]/)[0];
    fetch(`https://invidious.fdn.fr/api/v1/captions/${videoId}?label=English`)
      .then(res => res.text())
      .then(data => {
        setTranscript(data);
      })
      .catch(err => console.log(err));

    return videoId;
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
    // format time from 17.5 to 00:00:17
    
    const parts = timeStr.split('.');
    const seconds = parseInt(parts[0]);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const captureFrame = () => {
    let video = videoRef.current;
    video.crossOrigin = 'anonymous';
    // get current time from video
    const currentTime = video.currentTime;
    setTimeStamp(formatTime(currentTime.toString()));
    let cq = getQuote(formatTime(currentTime.toString()));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 1500;
    canvas.height = video.videoHeight * (canvas.width / video.videoWidth);
    // set crossOrigin to anonymous to avoid tainted canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 50px Helvetica';
    ctx.fillStyle = 'white';
    console.log(cq);
    ctx.fillText(cq.toUpperCase(), 100, canvas.height - 100);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // // draw img on canvas
    // const image = new Image();
    // image.src = img;
    // image.onload = () => {
    //   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // };
    // const videoElement = player.getIframe();
    // canvas.width = 1500;
    // canvas.height = 1200;
    // // draw a rectangle covering the entire canvas
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // // ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // // const quote = getQuote(currentTime);
    // ctx.font = '30px Arial';
    // ctx.fillStyle = 'white';
    // // draw the quote at the bottom of the canvas
    // ctx.fillText(quote, canvas.width/2 - 500, canvas.height - 100);
    // });
  };

  useEffect(() => {
    if (!url) return;

    getTranscript(url);
  }, [url]);

  return (
    <>
      <Head>
        <title>Ask a youtube video any question you have</title>
        <meta name="description" content="Ask a youtube video any question you have" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center', fontFamily: 'monospace' }}><FiYoutube /> Ask YT</h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>Ask a youtube video any question you have</h2>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }} placeholder="Paste youtube video url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className={styles.col} style={{display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ flexBasis: '100%', border: '1px solid #333', height: '500px' }}>
            <video
            src={`https://invidious.fdn.fr/latest_version?id=${getYoutubeId(url)}&itag=18`}
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
          }}/>
          {/* <input type="text" value={timeStamp} onChange={(e) => setTimeStamp(e.target.value)} /> */}
          <button onClick={captureFrame}>Capture Frame</button>
          <button onClick={() => {
            // allow cors for the image
            const canvas = canvasRef.current;
            html2canvas(canvas, {
              allowTaint: true,
              useCORS: true,
            }).then((canvas) => {
              const img = canvas.toDataURL('image/png');
              const a = document.createElement('a');
              a.href = img;
              a.download = 'image.png';
              a.click();
            });
          }}>
            Download Image
          </button>
        </div>
      </main>
    </>
  );
}
