// take voice input and convert it to text in the text area

import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FiPlay, FiPause } from 'react-icons/fi';
import styles from '@/styles/Tool.module.css'
import Head from 'next/head';

const Voice2Txt = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [voiceInput, setVoiceInput] = useState('');

  const [isListening, setIsListening] = useState(false);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleListen = () => {
    SpeechRecognition.startListening({
      continuous: true,
    });
    setIsListening(true);
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setVoiceInput(transcript);
    setIsListening(false);
  }

  return (
    <>
    <Head>
      <title>Voice to Text</title>
      <meta name="description" content="A simple voice to text converter." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
    <a href='/' className={styles.home}>🏠</a>
      <h1>Voice to Text</h1>
      <span style={{
        width: '100%',
        textAlign: 'center',
        color: '#666',
        fontSize: '12px'
      }}>
        A simple voice to text converter. Click the play button and start speaking. The text will appear in the text area. 

      </span>
      <textarea
        value={voiceInput || transcript}
        onChange={(e) => setVoiceInput(e.target.value)}
        placeholder="Press the play button and start speaking..."
        rows={5}
        cols={50}
        style={{
          background: '#333',
          color: '#eee',
          border: 'none',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '5px',
          width: '100%',
          outline: 'none',
        }}
      />
      <button onClick={() => {
        if (isListening) {
          handleStop()
        } else {
          handleListen()
        }

      }}
        style={{
          background: 'transparent',
          color: '#eee',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '50%',
          marginTop: '20px',
          fontSize: '1rem'
        }}
      >
        {isListening ? <FiPause /> : <FiPlay />}

      </button>
    </main>
    </>
  );

}

export default Voice2Txt;