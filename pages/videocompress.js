import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function HigherItalicVideo() {
  const [video, setVideo] = useState(null)
  const [offsetX, setOffsetX] = useState(0) // Start at 0 for center
  const [offsetY, setOffsetY] = useState(0) // Start at 0 for center 
  const [scale, setScale] = useState(1) // Start with scale 1
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)
  const [maxScale, setMaxScale] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const italicRef = useRef(typeof window !== 'undefined' ? new window.Image() : null)
  const mediaRecorderRef = useRef(null)

  //const higherItalic = '/higheritalic.svg'

  useEffect(() => {
    // Preload the italic image
    // if (italicRef.current) {
    //   italicRef.current.src = higherItalic
    // }
  }, [])

  const drawFrame = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const videoElement = videoRef.current

    if (videoElement && !videoElement.paused && !videoElement.ended) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw video frame
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      
      // Draw higher italic centered
      const italic = italicRef.current
      if (italic && italic.complete) {
        context.save()
        // Calculate center position
        const centerX = (canvas.width - italic.width * scale) / 2
        const centerY = (canvas.height - italic.height * scale) / 2
        context.translate(centerX + offsetX, centerY + offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        //context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale)
        context.restore()
      }

      animationRef.current = requestAnimationFrame(drawFrame)
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  useEffect(() => {
    drawFrame()
  }, [offsetX, offsetY, scale, offsetTheta])

  const handleVideoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideo(url)
      
      const videoElement = videoRef.current
      videoElement.src = url
      videoElement.onloadedmetadata = () => {
        setVideoWidth(videoElement.videoWidth)
        setVideoHeight(videoElement.videoHeight)
        canvasRef.current.width = videoElement.videoWidth
        canvasRef.current.height = videoElement.videoHeight

        // Calculate max scale based on video dimensions
        const italic = italicRef.current
        const widthScale = videoElement.videoWidth / italic.width
        const heightScale = videoElement.videoHeight / italic.height
        setMaxScale(Math.min(widthScale, heightScale))
        setScale(Math.min(widthScale, heightScale) / 2) // Set initial scale to half of max

        drawFrame()
        videoElement.play()
      }
    }
  }

  const handlePlay = () => {
    const videoElement = videoRef.current
    if (videoElement.paused || videoElement.ended) {
      videoElement.play()
      drawFrame()
    }
  }

  const handlePause = () => {
    const videoElement = videoRef.current
    if (!videoElement.paused) {
      videoElement.pause()
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const videoElement = videoRef.current;
    
    // Create a new canvas matching original video dimensions
    const hqCanvas = document.createElement('canvas');
    const hqContext = hqCanvas.getContext('2d');
    hqCanvas.width = canvas.width;
    hqCanvas.height = canvas.height;
    
    // Match original video frame rate
    const userFps = prompt('Enter desired frame rate (fps):');
    const fps = userFps ? Math.max(1, parseInt(userFps, 10)) : 30;
    const stream = hqCanvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 8000000 // 8 Mbps for good quality
    });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rendered-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const captureFrame = () => {
      // Clear canvas
      hqContext.clearRect(0, 0, hqCanvas.width, hqCanvas.height);
      
      // Draw video frame
      hqContext.drawImage(videoElement, 0, 0, hqCanvas.width, hqCanvas.height);
  
      // Draw higher italic
      hqContext.save();
      const italic = italicRef.current;
      const centerX = (hqCanvas.width - italic.width * scale) / 2;
      const centerY = (hqCanvas.height - italic.height * scale) / 2;
      hqContext.translate(centerX + offsetX, centerY + offsetY);
      hqContext.rotate(offsetTheta * Math.PI / 180);
      //hqContext.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
      hqContext.restore();
    };
  
    // Capture frames at original video frame rate
    const captureInterval = setInterval(() => {
	let currentFrame = 0;

      if (!videoElement.paused && !videoElement.ended) {
        const videoDuration = Math.round(videoElement.duration * 1000);
        const maxFrame = Math.round(videoDuration / 1000) * fps;
        if(currentFrame < maxFrame){
          captureFrame();
          currentFrame++;
        } else {
          clearInterval(captureInterval)
          mediaRecorder.stop();
        }
      }
        captureFrame();
      }
    }, 1000 / fps);
  
    videoElement.onended = () => {
      clearInterval(captureInterval);
      setIsRecording(false);
      mediaRecorder.stop();
    };
  
    mediaRecorder.start();
    setIsRecording(true);
    
    videoElement.currentTime = 0;
    videoElement.play();
  };


  return (
    <>
      <Head>
        <title>Compress Video</title>
        <meta name="description" content="Compress Video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Compress Video
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add higher italic on any video
        </span>

        <input type="file" accept="video/*" onChange={handleVideoUpload} />
        
        <div style={{ display: 'none' }}>
          <video ref={videoRef}  />
        </div>

        <canvas 
          ref={canvasRef}
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            width: '100%',
            height: 'auto',
            margin: '20px 0'
          }}
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleDownload} disabled={isRecording}>
            {isRecording ? 'Recording...' : 'Download Video'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <label>
            Offset X
          </label>
          <input type="range" min={-(videoWidth/4)} max={videoWidth/4} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-(videoHeight/4)} max={videoHeight/4} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
          <label>
            Scale
          </label>
          <input type="range" min={0.1} max={maxScale} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          <label>
            Rotate
          </label>
          <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(Number(e.target.value))} />
        </div>
      </main>
    </>
  )
}
