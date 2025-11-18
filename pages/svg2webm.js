import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Svg2Webm() {
  const [svgCode, setSvgCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState(null)
  const [animationId, setAnimationId] = useState(null)

  const handleSvgChange = (e) => {
    setSvgCode(e.target.value)
  }

  const svgDataUri = svgCode ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}` : ''

  const startRecording = () => {
    if (!svgCode || isRecording) return
    setLoading(true)
    const img = new Image();
    img.src = svgDataUri;
    img.onload = () => {
      const w = width || img.naturalWidth;
      const h = height || img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(30); // 30 fps
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'animation.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setLoading(false);
        setIsRecording(false);
        setRecorder(null);
      };
      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
      setLoading(false);

      const animate = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        if (isRecording) {
          setAnimationId(requestAnimationFrame(animate));
        }
      };
      animate();
    };
  }

  const stopRecording = () => {
    if (recorder && isRecording) {
      recorder.stop();
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }
    }
  }

  return (
    <>
      <Head>
        <title>SVG to WebM Converter</title>
        <meta name="description" content="Convert animated SVG to WebM video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          SVG to WebM Converter
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Paste your animated SVG code and download it as WebM video.</span>

        <textarea
          value={svgCode}
          onChange={handleSvgChange}
          placeholder="Paste your SVG code here"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            height: '200px',
          }}
        />

        <div style={{ margin: '20px 0' }}>
          <label style={{ marginRight: '20px' }}>
            Width: 
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(Number(e.target.value))} 
              placeholder="Auto" 
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </label>
          <label>
            Height: 
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(Number(e.target.value))} 
              placeholder="Auto" 
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </label>
        </div>

        {svgDataUri && (
          <div style={{ margin: '20px 0' }}>
            <div>Preview:</div>
            <img 
              src={svgDataUri} 
              width={width || undefined} 
              height={height || undefined} 
              onLoad={(e) => {
                if (!width) setWidth(e.target.naturalWidth);
                if (!height) setHeight(e.target.naturalHeight);
              }}
              style={{ border: '1px solid #ccc', maxWidth: '100%' }}
              alt="SVG Preview"
            />
          </div>
        )}

        <button onClick={startRecording} className={styles.button} disabled={loading || isRecording}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        <button onClick={stopRecording} className={styles.button} disabled={!isRecording}>
          Stop Recording
        </button>
      </main>
    </>
  )
}
