// transcribe audio or video file to text, use window speech if possible
import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const Transcribe = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);

  useEffect(() => {
    if (mediaFile && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + transcriptPart);
          } else {
            interimTranscript += transcriptPart;
          }
        }
        setTranscript(prev => prev + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      const playMediaAndTranscribe = () => {
        const media = new Audio(URL.createObjectURL(mediaFile));
        media.play();
        recognition.start();
        media.onended = () => {
          recognition.stop();
        };
      };

      playMediaAndTranscribe();

      return () => {
        recognition.stop();
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [mediaFile]);

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Transcribe Audio</title>
        <meta name="description" content="Transcribe audio or video file to text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Transcribe Audio or Video
        </h1>
        <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />
        <p>{transcript}</p>
      </main>
    </div>
  );
};

export default Transcribe;