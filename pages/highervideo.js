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
  const [enterAnimation, setEnterAnimation] = useState('fade')
  const [exitAnimation, setExitAnimation] = useState('fade')
  const [animationDuration, setAnimationDuration] = useState(0.5) // in seconds
  const nikeDuration = 2; // seconds for nike ending
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const italicRef = useRef(typeof window !== 'undefined' ? new window.Image() : null)
  const arrowRef = useRef(typeof window !== 'undefined' ? new window.Image() : null)
  const mediaRecorderRef = useRef(null)
  const lastRenderTimeRef = useRef(0)

  // Available animations
  const animations = {
    'none': {
      name: 'None',
      description: 'No animation'
    },
    'fade': {
      name: 'Fade',
      description: 'Fade in/out'
    },
    'slide-left': {
      name: 'Slide Left',
      description: 'Slide from/to left'
    },
    'slide-right': {
      name: 'Slide Right',
      description: 'Slide from/to right'
    },
    'slide-up': {
      name: 'Slide Up',
      description: 'Slide from/to bottom'
    },
    'slide-down': {
      name: 'Slide Down',
      description: 'Slide from/to top'
    },
    'scale-up': {
      name: 'Scale Up',
      description: 'Grow from small/Shrink to small'
    },
    'scale-down': {
      name: 'Scale Down',
      description: 'Shrink from large/Grow to large'
    },
    'rotate-in': {
      name: 'Rotate In',
      description: 'Spin while fading in/out'
    },
    'bounce': {
      name: 'Bounce',
      description: 'Bounce in/out'
    },
    'flicker': {
      name: 'Flicker',
      description: 'Glitchy tube light turning on/off effect'
    }
  }

  // Asset paths
  const assetPaths = {
    'None': null,
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
    if (italicRef.current && selectedAsset !== 'None') {
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

    // Preload arrow with white fill for nike ending
    if (arrowRef.current) {
      fetch('/higherarrow.svg')
        .then(response => response.text())
        .then(svgText => {
          const whiteSvg = svgText.replace(/fill="[^"]*"/g, `fill="#fff"`);
          const blob = new Blob([whiteSvg], { type: 'image/svg+xml' });
          arrowRef.current.src = URL.createObjectURL(blob);
        })
        .catch(error => {
          console.error('Error fetching arrow SVG:', error);
          arrowRef.current.src = '/higherarrow.svg';
        });
    }
  }, [selectedAsset, assetColor])

  // Update input fields when slider values change
  useEffect(() => {
    setStartTimeInput(formatTimeWithMs(startTime));
  }, [startTime]);

  useEffect(() => {
    setEndTimeInput(formatTimeWithMs(endTime));
  }, [endTime]);

  // Calculate animation progress
  const calculateAnimationProgress = (currentTime) => {
    // For entrance animation
    if (currentTime >= startTime && currentTime < startTime + animationDuration) {
      // Calculate progress from 0 to 1
      return (currentTime - startTime) / animationDuration;
    }
    // For exit animation
    else if (currentTime > endTime - animationDuration && currentTime <= endTime) {
      // Calculate progress from 1 to 0
      return (endTime - currentTime) / animationDuration;
    }
    // Middle part - fully visible
    else if (currentTime >= startTime + animationDuration && currentTime <= endTime - animationDuration) {
      return 1;
    }
    // Outside time range - not visible
    return 0;
  }

  // Apply animation effect based on progress (0-1)
  const applyAnimation = (context, italic, progress, isEntering) => {
    // Skip if not visible
    if (progress <= 0) return false;

    // Default position and scale calculations
    const centerX = (canvasRef.current.width - italic.width * scale) / 2;
    const centerY = (canvasRef.current.height - italic.height * scale) / 2;

    // Save the context state before applying transformations
    context.save();

    // Get the animation type (entrance or exit)
    const animationType = isEntering ? enterAnimation : exitAnimation;

    // Apply transformations based on selected animation type
    switch (animationType) {
      case 'fade':
        context.translate(centerX + offsetX, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        context.globalAlpha = progress;
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'slide-left':
        const xOffsetLeft = isEntering ? 
          (1 - progress) * canvasRef.current.width * -1 : 
          progress * canvasRef.current.width * -1;
        context.translate(centerX + offsetX + xOffsetLeft, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'slide-right':
        const xOffsetRight = isEntering ? 
          (1 - progress) * canvasRef.current.width : 
          progress * canvasRef.current.width;
        context.translate(centerX + offsetX + xOffsetRight, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'slide-up':
        const yOffsetUp = isEntering ? 
          (1 - progress) * canvasRef.current.height : 
          progress * canvasRef.current.height;
        context.translate(centerX + offsetX, centerY + offsetY + yOffsetUp);
        context.rotate(offsetTheta * Math.PI / 180);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'slide-down':
        const yOffsetDown = isEntering ? 
          (1 - progress) * canvasRef.current.height * -1 : 
          progress * canvasRef.current.height * -1;
        context.translate(centerX + offsetX, centerY + offsetY + yOffsetDown);
        context.rotate(offsetTheta * Math.PI / 180);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'scale-up':
        const scaleUpFactor = isEntering ? progress : 1 - progress;
        context.translate(centerX + offsetX, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        context.scale(scaleUpFactor, scaleUpFactor);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'scale-down':
        const scaleDownFactor = isEntering ? 2 - progress : 1 + progress;
        context.translate(centerX + offsetX, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        context.scale(scaleDownFactor, scaleDownFactor);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'rotate-in':
        const rotationAngle = isEntering ? (1 - progress) * Math.PI * 2 : progress * Math.PI * 2;
        context.translate(centerX + offsetX, centerY + offsetY);
        context.rotate(rotationAngle + (offsetTheta * Math.PI / 180));
        context.globalAlpha = progress;
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;

      case 'bounce':
        const bounceOffset = isEntering ?
          Math.sin(progress * Math.PI) * (1 - progress) * 50 :
          Math.sin(progress * Math.PI) * progress * 50;
        context.translate(centerX + offsetX, centerY + offsetY - bounceOffset);
        context.rotate(offsetTheta * Math.PI / 180);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;
        
      case 'flicker':
        // Generate flickering effect like a glitchy tube light
        context.translate(centerX + offsetX, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        
        // Use noise patterns for flickering
        const flickerSeed = Date.now(); // Use current time to generate randomness
        const flickerNoiseValue = Math.sin(flickerSeed * 0.01);
        
        // Create flicker frequency that changes based on progress
        // Early flickering is fast and erratic, then stabilizes
        const flickerSpeed = isEntering ? 
          20 - (15 * progress) : // Goes from fast to slow for entrance
          5 + (15 * progress);   // Goes from slow to fast for exit
          
        // Calculate flicker intensity based on progress
        const flickerIntensity = isEntering ?
          (1 - progress) * 0.8 : // Gradually less intense for entrance
          progress * 0.8;        // Gradually more intense for exit
          
        // Determine if visible this frame based on noise patterns
        const noiseSum = 
          Math.sin(progress * flickerSpeed) + 
          Math.sin(progress * flickerSpeed * 2.5) * 0.4 + 
          Math.sin(progress * flickerSpeed * 4.7) * 0.2 +
          Math.sin(flickerSeed * 0.01) * 0.1;
          
        const isVisible = 
          // Initial dimming (entrance) or final dimming (exit)
          (isEntering && progress < 0.2 && Math.random() < progress * 3) ||
          (!isEntering && progress > 0.8 && Math.random() < progress) ||
          // Stable visibility with occasional flicker
          (noiseSum > -0.2 - flickerIntensity);
          
        // Subtle position jitter during strong flickers
        if (Math.abs(noiseSum) > 0.5 && isVisible) {
          const jitterX = (Math.random() - 0.5) * 5 * flickerIntensity;
          const jitterY = (Math.random() - 0.5) * 5 * flickerIntensity;
          context.translate(jitterX, jitterY);
          
          // Subtle color distortion for electrical glitch effect
          if (Math.random() < 0.3 * flickerIntensity) {
            context.globalCompositeOperation = 'screen';
            context.globalAlpha = 0.2 * flickerIntensity;
            context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
            context.globalCompositeOperation = 'source-over';
            context.globalAlpha = progress;
          }
        }
        
        // Draw only if visible this frame
        if (isVisible) {
          // Adjust opacity based on flicker intensity
          const baseAlpha = isEntering ? progress : 1 - progress;
          const flickerAlpha = baseAlpha * (0.4 + (Math.random() * 0.6));
          context.globalAlpha = flickerAlpha;
          
          // Main draw
          context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
          
          // Occasionally add slight motion blur for extra effect
          if (Math.random() < flickerIntensity * 0.3) {
            context.globalAlpha = flickerAlpha * 0.3;
            context.drawImage(italic, 
              Math.random() * 2 - 1, Math.random() * 2 - 1, 
              italic.width * scale, italic.height * scale);
          }
        }
        break;

      case 'none':
      default:
        context.translate(centerX + offsetX, centerY + offsetY);
        context.rotate(offsetTheta * Math.PI / 180);
        context.drawImage(italic, 0, 0, italic.width * scale, italic.height * scale);
        break;
    }

    // Restore the context state after drawing
    context.restore();
    return true;
  }

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
      lastRenderTimeRef.current = currentTime;
      
      if (currentTime >= startTime && currentTime <= endTime) {
        // Draw higher italic centered with animation
        const italic = italicRef.current
        if (italic && italic.complete && selectedAsset !== 'None') {
          // Check if this is an entrance or exit animation
          const isEntering = currentTime < startTime + animationDuration;
          const progress = calculateAnimationProgress(currentTime);
          
          // Apply animation with calculated progress
          applyAnimation(context, italic, progress, isEntering);
        }
      } else if (currentTime > videoDuration - nikeDuration) {
        // Nike ending
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const arrow = arrowRef.current;
        if (arrow && arrow.complete) {
          const arrowScale = Math.min(canvas.width / arrow.width, canvas.height / arrow.height) * 0.125;
          const x = (canvas.width - arrow.width * arrowScale) / 2;
          const y = (canvas.height - arrow.height * arrowScale) / 2;
          context.drawImage(arrow, x, y, arrow.width * arrowScale, arrow.height * arrowScale);
          
          // Draw "AIM HIGHER" below the arrow
          const fontSize = Math.min(canvas.width, canvas.height) / 32;
          context.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
          context.fillStyle = '#fff';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          const textY = y + arrow.height * arrowScale + 20 + fontSize / 2;
          context.fillText('AIM HIGHER', canvas.width / 2, textY);
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
  }, [offsetX, offsetY, scale, offsetTheta, enterAnimation, exitAnimation, animationDuration])

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

    let isVideoEnded = false;
    let startExtraTime = null;

    const captureFrame = () => {
      // Clear canvas
      hqContext.clearRect(0, 0, hqCanvas.width, hqCanvas.height);
      
      let currentTime;
      if (!isVideoEnded) {
        // Draw video frame
        hqContext.drawImage(videoElement, 0, 0, hqCanvas.width, hqCanvas.height);
        currentTime = videoElement.currentTime;
      } else {
        // Black background for nike ending
        hqContext.fillStyle = '#000';
        hqContext.fillRect(0, 0, hqCanvas.width, hqCanvas.height);
        const extraTime = (Date.now() - startExtraTime) / 1000;
        currentTime = videoDuration + extraTime;
        if (extraTime >= nikeDuration) {
          clearInterval(captureInterval);
          setIsRecording(false);
          mediaRecorder.stop();
          return;
        }
      }
  
      // Check if we should display the asset based on time
      if (currentTime >= startTime && currentTime <= endTime) {
        const italic = italicRef.current;
        // Check if this is an entrance or exit animation
        const isEntering = currentTime < startTime + animationDuration;
        const progress = calculateAnimationProgress(currentTime);
          
        // Apply animation with calculated progress
        if (italic && italic.complete && selectedAsset !== 'None') {
          applyAnimation(hqContext, italic, progress, isEntering);
        }
      } else if (currentTime > videoDuration - nikeDuration) {
        // Nike ending
        hqContext.fillStyle = '#000';
        hqContext.fillRect(0, 0, hqCanvas.width, hqCanvas.height);
        const arrow = arrowRef.current;
        if (arrow && arrow.complete) {
          const arrowScale = Math.min(hqCanvas.width / arrow.width, hqCanvas.height / arrow.height) * 0.125;
          const x = (hqCanvas.width - arrow.width * arrowScale) / 2;
          const y = (hqCanvas.height - arrow.height * arrowScale) / 2;
          hqContext.drawImage(arrow, x, y, arrow.width * arrowScale, arrow.height * arrowScale);
          
          // Draw "AIM HIGHER" below the arrow
          const fontSize = Math.min(hqCanvas.width, hqCanvas.height) / 32;
          hqContext.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
          hqContext.fillStyle = '#fff';
          hqContext.textAlign = 'center';
          hqContext.textBaseline = 'middle';
          const textY = y + arrow.height * arrowScale + 10 + fontSize / 2;
          hqContext.fillText('AIM HIGHER', hqCanvas.width / 2, textY);
        }
      }
    };
  
    // Capture frames at original video frame rate
    const captureInterval = setInterval(() => {
      if (!videoElement.paused && !videoElement.ended) {
        captureFrame();
      } else if (isVideoEnded) {
        captureFrame();
      }
    }, 1000 / fps);
  
    videoElement.onended = () => {
      isVideoEnded = true;
      startExtraTime = Date.now();
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
      
      // If video is paused, redraw the frame to show the current time
      if (videoRef.current.paused) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Draw the video frame
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Check if we should display the asset
        if (timeInSeconds >= startTime && timeInSeconds <= endTime) {
          const italic = italicRef.current;
          if (italic && italic.complete && selectedAsset !== 'None') {
            // Check if this is an entrance or exit animation
            const isEntering = timeInSeconds < startTime + animationDuration;
            const progress = calculateAnimationProgress(timeInSeconds);
            
            // Apply animation with calculated progress
            applyAnimation(context, italic, progress, isEntering);
          }
        } else if (timeInSeconds > videoDuration - nikeDuration) {
          // Nike ending
          context.fillStyle = '#000';
          context.fillRect(0, 0, canvas.width, canvas.height);
          const arrow = arrowRef.current;
          if (arrow && arrow.complete) {
            const arrowScale = Math.min(canvas.width / arrow.width, canvas.height / arrow.height) * 0.5;
            const x = (canvas.width - arrow.width * arrowScale) / 2;
            const y = (canvas.height - arrow.height * arrowScale) / 2;
            context.drawImage(arrow, x, y, arrow.width * arrowScale, arrow.height * arrowScale);
            
            // Draw "AIM HIGHER" below the arrow
            const fontSize = Math.min(canvas.width, canvas.height) / 8;
            context.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
            context.fillStyle = '#fff';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            const textY = y + arrow.height * arrowScale + 20 + fontSize / 2;
            context.fillText('AIM HIGHER', canvas.width / 2, textY);
          }
        }
      }
    }
  };

  // Preview animation at a specific time point
  const previewAnimationAtTime = (previewType) => {
    let timeToPreview;
    
    if (previewType === 'enter') {
      timeToPreview = startTime + (animationDuration / 2);
    } else { // exit
      timeToPreview = endTime - (animationDuration / 2);
    }
    
    jumpToTime(timeToPreview);
  };

  return (
    <>
      <Head>
        <title>Higher Video</title>
        <meta name="description" content="Higher Video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Video
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Make higher videos
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

        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '50%' }}>
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
          
          <div style={{ 
            borderRadius: '5px', 
            marginTop: '10px',
          }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Animation Settings</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="animationDuration">
                Animation Duration (seconds)
              </label>
              <input 
                type="number" 
                id="animationDuration"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(Number(e.target.value))}
                min={0.1}
                max={2}
                step={0.1}
                style={{ width: '80px', marginLeft: '10px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="enterAnimation">
                  Enter Animation
                </label>
                <select 
                  id="enterAnimation" 
                  value={enterAnimation} 
                  onChange={(e) => setEnterAnimation(e.target.value)}
                  style={{ width: '100%', marginTop: '5px' }}
                >
                  {Object.entries(animations).map(([key, animation]) => (
                    <option key={key} value={key}>{animation.name}</option>
                  ))}
                </select>
                <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                  {animations[enterAnimation]?.description}
                </p>
                <button 
                  onClick={() => previewAnimationAtTime('enter')} 
                  style={{ marginTop: '5px', padding: '4px 8px' }}
                >
                  Preview Enter
                </button>
              </div>
              
              <div style={{ flex: 1 }}>
                <label htmlFor="exitAnimation">
                  Exit Animation
                </label>
                <select 
                  id="exitAnimation" 
                  value={exitAnimation} 
                  onChange={(e) => setExitAnimation(e.target.value)}
                  style={{ width: '100%', marginTop: '5px' }}
                >
                  {Object.entries(animations).map(([key, animation]) => (
                    <option key={key} value={key}>{animation.name}</option>
                  ))}
                </select>
                <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                  {animations[exitAnimation]?.description}
                </p>
                <button 
                  onClick={() => previewAnimationAtTime('exit')} 
                  style={{ marginTop: '5px', padding: '4px 8px' }}
                >
                  Preview Exit
                </button>
              </div>
            </div>
          </div>
          
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
