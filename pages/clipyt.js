import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { FiYoutube } from 'react-icons/fi'

export default function ClipYT() {
  const [url, setUrl] = useState('')
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('00:10')
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [redirectedUrl, setRedirectedUrl] = useState('')
  const [duration, setDuration] = useState(0)

  const getYoutubeId = (url) => {
    if (!url) return ''
    return url.split(/(v=|vi=|\/v\/|\/vi\/|\/embed\/|youtu.be\/|\/user\/\S+\/\S+\/)/)[2].split(/[?&\/]/)[0]
  }

  const parseTime = (timeStr) => {
    const parts = timeStr.split(':')
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1])
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    }
    return 0
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return

    const currentTime = video.currentTime
    if (currentTime >= parseTime(endTime)) {
      video.pause()
      video.currentTime = parseTime(startTime)
      if (isRecording) {
        stopRecording()
      }
    }
  }

  const startRecording = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = parseTime(startTime)
    video.play()

    const stream = video.captureStream()
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    const chunks = []
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clip.webm`
      a.click()
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = parseTime(startTime)
  }, [startTime])

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value)
    const video = videoRef.current
    if (video) {
      video.currentTime = parseTime(e.target.value)
    }
  }

  const handleTimeBarChange = (e) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = e.target.value
    }
  }

  // useEffect(() => {
  //   if (url) {
  //     const fetchRedirectedUrl = async () => {
  //       const proxyUrl = `https://inv.nadeko.net/latest_version?id=${getYoutubeId(url)}&itag=18`
  //       try {
  //         const response = await fetch(proxyUrl)
  //         setRedirectedUrl(response.url)
  //       } catch (error) {
  //         console.error('Error fetching redirected URL:', error)
  //       }
  //     }
  //     fetchRedirectedUrl()
  //   }
  // }, [url])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.onloadedmetadata = () => {
        setDuration(video.duration)
      }
    }
  }, [redirectedUrl])

  return (
    <>
      <Head>
        <title>Clip YouTube</title>
        <meta name="description" content="Create clips from YouTube videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center' }}>
          <FiYoutube /> Clip YouTube
        </h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>
          Create clips from YouTube videos
        </h2>

        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px', marginBottom: '20px' }}>
          <input
            type="text"
            style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }}
            placeholder="Paste YouTube video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Start Time (MM:SS or HH:MM:SS)</label>
            <input
              type="text"
              value={startTime}
              onChange={handleStartTimeChange}
              style={{ padding: '5px', background: 'none', border: '1px solid #333', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>End Time (MM:SS or HH:MM:SS)</label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ padding: '5px', background: 'none', border: '1px solid #333', color: '#fff' }}
            />
          </div>
        </div>

          <div style={{ border: '1px solid #333', borderRadius: '5px', padding: '20px' }}>
            <video
              ref={videoRef}
              src={`https://api.codetabs.com/v1/proxy/?quest=https://inv.nadeko.net/latest_version?id=${getYoutubeId(url)}&itag=18`}
              controls
              style={{ width: '100%' }}
              onTimeUpdate={handleTimeUpdate}
            />
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{ marginTop: '10px', padding: '5px 10px', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
      </main>
    </>
  )
}
