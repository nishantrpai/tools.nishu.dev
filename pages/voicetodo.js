// voice to todo list using window speechsynthesis
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function VoiceToDo() {
  const [todos, setTodos] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [voiceInput, setVoiceInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const [isListening, setIsListening] = useState(false);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleListen = () => {
    setVoiceInput('');
    console.log('listening');
    SpeechRecognition.startListening({
      continuous: true,
    });
    setIsListening(true);
    setIsPlaying(true);
  };

  const handleStop = () => {
    console.log('stopped');
    SpeechRecognition.stopListening();
    setVoiceInput(transcript);
    setIsListening(false);
    setIsPlaying(false);
  }

  const addTodo = () => {
    handleStop();
    let textArea = document.querySelector('textarea');
    let finalValue = voiceInput || textArea.value;
    setTodos([...todos, finalValue]);
    resetTranscript();
  }

  return (
    <>
    <Head>
      <title>Voice to To Do</title>
      <meta name="description" content="A simple voice to text to do list." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
    <a href='/' className={styles.home}>🏠</a>
      <h1>Voice to To Do</h1>
      <span style={{
        width: '100%',
        textAlign: 'center',
        color: '#666',
        fontSize: '12px'
      }}>
        A simple voice to text to do list. Click the play button and start speaking. The text will appear in the text area. Click the add button to add the todo to the list.
      </span>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <button onClick={!isPlaying ? handleListen : handleStop} style={{
          padding: '10px',
          backgroundColor: '#333',
          color: '#eee',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          {isListening ? 'Listening...' : 'Listen'}
        </button>
        <button onClick={addTodo} style={{
          padding: '10px',
          backgroundColor: '#333',
          color: '#eee',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          Add
        </button>
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
            marginBottom: '20px'
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}>
          <h2>To Do List</h2>
          {todos.map((todo, index) => (
            // checkbox for todo
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '10px'
            }}>
              <input type="checkbox" id={`todo-${index}`} name={`todo-${index}`} value={todo} style={{
                marginRight: '10px'
              }} />
              <label htmlFor={`todo-${index}`}>{todo}</label>
            </div>

          ))}
        </div>
      </div>
    </main>
    </>
  );
}
