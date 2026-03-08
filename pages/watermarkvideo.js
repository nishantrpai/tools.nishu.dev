import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function WatermarkVideo() {
  const [video, setVideo] = useState(null)
  const [watermarkImage, setWatermarkImage] = useState(null)
  const [positionX, setPositionX] = useState(50) // percentage from left
  const [positionY, setPositionY] = useState(50) // percentage from top
  const [scale, setScale] = useState(0.5) // scale factor for image
  const [transparency, setTransparency] = useState(0.8) // 0 to 1
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const imageRef = useRef(null)

  const drawFrame = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const videoElement = videoRef.current

    if (videoElement) {
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Draw video frame
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

      // Draw watermark image
      const watermarkImg = imageRef.current
      if (watermarkImg && watermarkImg.complete && watermarkImg.naturalWidth > 0) {
        context.save()
        context.globalAlpha = transparency

        const imgWidth = watermarkImg.naturalWidth * scale
        const imgHeight = watermarkImg.naturalHeight * scale
        const x = (positionX / 100) * canvas.width - imgWidth / 2
        const y = (positionY / 100) * canvas.height - imgHeight / 2

        context.drawImage(watermarkImg, x, y, imgWidth, imgHeight)
        context.restore()
      }

      if (!videoElement.paused && !videoElement.ended) {
        animationRef.current = requestAnimationFrame(drawFrame)
      }
    }
  }

  useEffect(() => {
    if (video) {
      drawFrame()
    }
  }, [positionX, positionY, scale, transparency])

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
        drawFrame()
        videoElement.play()
      }
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        imageRef.current = img
        setWatermarkImage(url)
        if (video) drawFrame()
      }
      img.src = url
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
      drawFrame() // Draw the current frame with watermark
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;

    // Create a new canvas matching original video dimensions
    const hqCanvas = document.createElement('canvas');
    const hqContext = hqCanvas.getContext('2d');
    hqCanvas.width = canvas.width;
    hqCanvas.height = canvas.height;

    // Match original video frame rate
    const fps = 30; // Default to 30fps

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
      a.download = `watermarked-video-${Date.now()}.webm`;
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

      // Draw watermark image
      const watermarkImg = imageRef.current
      if (watermarkImg && watermarkImg.complete && watermarkImg.naturalWidth > 0) {
        hqContext.save()
        hqContext.globalAlpha = transparency

        const imgWidth = watermarkImg.naturalWidth * scale
        const imgHeight = watermarkImg.naturalHeight * scale
        const x = (positionX / 100) * hqCanvas.width - imgWidth / 2
        const y = (positionY / 100) * hqCanvas.height - imgHeight / 2

        hqContext.drawImage(watermarkImg, x, y, imgWidth, imgHeight)
        hqContext.restore()
      }
    };

    // Capture frames at video frame rate
    const captureInterval = setInterval(() => {
      if (!videoElement.paused && !videoElement.ended) {
        captureFrame();
      } else if (videoElement.ended) {
        clearInterval(captureInterval);
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }, 1000 / fps);

    mediaRecorder.start();
    setIsRecording(true);

    videoElement.currentTime = 0;
    videoElement.play();
  };

  return (
    <>
      <Head>
        <title>Watermark Video</title>
        <meta name="description" content="Add watermark to videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Watermark Video
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add image watermark to your videos
        </span>

        <input type="file" accept="video/*" onChange={handleVideoUpload} />

        <div style={{ marginTop: '10px' }}>
          <label htmlFor="watermarkImage">
            Watermark Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <div style={{ display: 'none' }}>
          <video ref={videoRef} />
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

        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '50%' }}>
          <label htmlFor="scale">
            Image Scale: {(scale * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            id="scale"
            min={0.1}
            max={2}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />

          <label htmlFor="transparency">
            Transparency: {(transparency * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            id="transparency"
            min={0}
            max={1}
            step={0.01}
            value={transparency}
            onChange={(e) => setTransparency(Number(e.target.value))}
          />

          <label htmlFor="positionX">
            Position X: {positionX}%
          </label>
          <input
            type="range"
            id="positionX"
            min={0}
            max={100}
            value={positionX}
            onChange={(e) => setPositionX(Number(e.target.value))}
          />

          <label htmlFor="positionY">
            Position Y: {positionY}%
          </label>
          <input
            type="range"
            id="positionY"
            min={0}
            max={100}
            value={positionY}
            onChange={(e) => setPositionY(Number(e.target.value))}
          />
        </div>
      </main>
    </>
  )
}
