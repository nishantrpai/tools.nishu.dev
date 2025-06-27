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
  const [selectedAsset, setSelectedAsset] = useState('Times New Roman')
  const [assetColor, setAssetColor] = useState('#54FF56')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [startTimeInput, setStartTimeInput] = useState('00:00.000')
  const [endTimeInput, setEndTimeInput] = useState('00:00.000')
  const [videoDuration, setVideoDuration] = useState(0)
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const italicRef = useRef(typeof window !== 'undefined' ? new window.Image() : null)
  const mediaRecorderRef = useRef(null)

  // Asset paths
  const assetPaths = {
    'Helvetica': '/higherhelvetica.svg',
    'Times New Roman': '/higheritalic.svg',
    'Comic Sans': '/highercomicsans.svg',
    'Higher TM': '/highertm.svg',
    'Arrow': '/higherarrow.svg',
    'Scanner': '/higherscanner.svg',
    'Adidagh': '/adidagh.svg'
  }

  useEffect(() => {
    // Preload the italic image with the selected asset
    if (italicRef.current) {
      const assetPath = assetPaths[selectedAsset] || '/higheritalic.svg'
      
      // For colored SVG assets
      if (assetPath !== '/higherscanner.svg') {
        fetch(assetPath)
          .then(response => response.text())
          .then(svgText => {
            const coloredSvg = svgText.replace(/fill="[^"]*"/g, `fill="${assetColor}"`);
            const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
            italicRef.current.src = URL.createObjectURL(blob);
          })
          .catch(error => {
            console.error('Error fetching SVG:', error);
            italicRef.current.src = assetPath;
          });
      } else {
        italicRef.current.src = assetPath;
      }
    }
  }, [selectedAsset, assetColor])

  // Update input fields when slider values change
  useEffect(() => {
    setStartTimeInput(formatTimeWithMs(startTime));
  }, [startTime]);

  useEffect(() => {
    setEndTimeInput(formatTimeWithMs(endTime));
  }, [endTime]);

  const drawFrame = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const videoElement = videoRef.current

    if (videoElement && !videoElement.paused && !videoElement.ended) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw video frame
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      
      // Check if we should display the asset based on time
      const currentTime = videoElement.currentTime
      if (currentTime >= startTime && currentTime <= endTime) {
        // Draw higher italic centered
        const italic = italicRef.current
        if (italic && italic.complete) {
          context.save()
          // Calculate center position
          const centerX = (canvas.width - italic.width * scale) / 2
          const centerY = (canvas.height - italic.height * scale) / 2
          context.translate(centerX + offsetX, centerY + offsetY)
          context.rotate(offsetTheta * Math.PI / 180)
          context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale)
          context.restore()
        }
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
        setVideoDuration(videoElement.duration)
        setEndTime(videoElement.duration) // Default end time to full video duration
        setEndTimeInput(formatTimeWithMs(videoElement.duration))
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
    const fps = videoElement.webkitVideoDecodedByteCount ? 
      Math.round(videoElement.webkitDecodedFrameCount / videoElement.currentTime) : 
      30; // Fallback to 30fps if can't detect
    
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
  
      // Check if we should display the asset based on time
      const currentTime = videoElement.currentTime
      if (currentTime >= startTime && currentTime <= endTime) {
        // Draw higher italic
        hqContext.save();
        const italic = italicRef.current;
        const centerX = (hqCanvas.width - italic.width * scale) / 2;
        const centerY = (hqCanvas.height - italic.height * scale) / 2;
        hqContext.translate(centerX + offsetX, centerY + offsetY);
        hqContext.rotate(offsetTheta * Math.PI / 180);
        hqContext.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        hqContext.restore();
      }
    };
  
    // Capture frames at original video frame rate
    const captureInterval = setInterval(() => {
      if (!videoElement.paused && !videoElement.ended) {
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

  // Format seconds to MM:SS.mmm format (minutes, seconds, milliseconds)
  const formatTimeWithMs = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  // Parse time string in MM:SS.mmm format to seconds
  const parseTimeInput = (timeString) => {
    try {
      // Handle different formats
      let minutes = 0;
      let seconds = 0;
      let milliseconds = 0;

      if (timeString.includes(':')) {
        const [minutesPart, secondsPart] = timeString.split(':');
        minutes = parseInt(minutesPart, 10) || 0;

        if (secondsPart.includes('.')) {
          const [secPart, msPart] = secondsPart.split('.');
          seconds = parseInt(secPart, 10) || 0;
          milliseconds = parseInt(msPart, 10) || 0;
        } else {
          seconds = parseInt(secondsPart, 10) || 0;
        }
      } else if (timeString.includes('.')) {
        const [secPart, msPart] = timeString.split('.');
        seconds = parseInt(secPart, 10) || 0;
        milliseconds = parseInt(msPart, 10) || 0;
      } else {
        seconds = parseInt(timeString, 10) || 0;
      }

      return minutes * 60 + seconds + milliseconds / 1000;
    } catch (error) {
      console.error('Error parsing time input:', error);
      return 0;
    }
  };

  const handleStartTimeChange = (e) => {
    const inputValue = e.target.value;
    setStartTimeInput(inputValue);
    
    const newTime = parseTimeInput(inputValue);
    if (!isNaN(newTime) && newTime >= 0 && newTime <= endTime) {
      setStartTime(newTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const inputValue = e.target.value;
    setEndTimeInput(inputValue);
    
    const newTime = parseTimeInput(inputValue);
    if (!isNaN(newTime) && newTime >= startTime && newTime <= videoDuration) {
      setEndTime(newTime);
    }
  };

  // Jump to specific time in video
  const jumpToTime = (timeInSeconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
    }
  };

  return (
    <>
      <Head>
        <title>Higher Italic Video</title>
        <meta name="description" content="Higher Italic Video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Italic Video
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

        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <label htmlFor="assetSelect">
            Select Asset
          </label>
          <select 
            id="assetSelect" 
            value={selectedAsset} 
            onChange={(e) => setSelectedAsset(e.target.value)}
          >
            {Object.keys(assetPaths).map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
          
          <label htmlFor="assetColor">
            Asset Color
          </label>
          <input 
            type="color" 
            id="assetColor"
            value={assetColor}
            onChange={(e) => setAssetColor(e.target.value)}
          />
          
          <label>
            Asset Display Time Control (MM:SS.mmm format)
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Start:</span>
            <input 
              type="text" 
              value={startTimeInput}
              onChange={handleStartTimeChange}
              style={{ width: '100px' }}
              placeholder="MM:SS.mmm"
            />
            <button 
              onClick={() => jumpToTime(startTime)}
              style={{ padding: '4px 8px' }}
            >
              Jump to
            </button>
            <input 
              type="range" 
              min={0} 
              max={videoDuration} 
              step={0.001}
              value={startTime} 
              onChange={(e) => setStartTime(Number(e.target.value))}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>End:</span>
            <input 
              type="text" 
              value={endTimeInput}
              onChange={handleEndTimeChange}
              style={{ width: '100px' }}
              placeholder="MM:SS.mmm"
            />
            <button 
              onClick={() => jumpToTime(endTime)}
              style={{ padding: '4px 8px' }}
            >
              Jump to
            </button>
            <input 
              type="range" 
              min={0} 
              max={videoDuration} 
              step={0.001}
              value={endTime} 
              onChange={(e) => setEndTime(Number(e.target.value))}
              style={{ flex: 1 }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Video Duration: {formatTimeWithMs(videoDuration)}</span>
            <span>Current Range: {formatTimeWithMs(endTime - startTime)}</span>
          </div>
          
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
