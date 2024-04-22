// convert voice to emoji real time
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// load json from public/phonetics.json as file

export default function Home() {
  // for each voice input, generate a related emoji for e.g, 
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastset, setLastSet] = useState(new Date().getTime());
  const [currentChar, setCurrentChar] = useState('');
  const [currentWord, setCurrentWord] = useState('check');
  const [videoBlob, setVideoBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaChunks, setMediaChunks] = useState([]);

  // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }


  const handleListen = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US'
    });
    setIsListening(true);
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setVoiceInput(transcript);
    setIsListening(false);
  }



  const [enPhonetics, setEnPhonetics] = useState({});
  const phoneticMap = {
    "EY1": "😀",
    "D": "😃",
    "AH1": "😄",
    "B": "😁",
    "AH0": "😆",
    "L": "😅",
    "T": "🤣",
    "R": "😂",
    "IH2": "🙂",
    "P": "😉",
    "AA1": "😊",
    "ER0": "😇",
    "G": "🥰",
    "K": "😍",
    "N": "🤩",
    "IY1": "😘",
    "S": "😗",
    "EH0": "😁",
    "TH": "😚",
    "M": "😙",
    "AO2": "🥲",
    "AA0": "😏",
    "EH1": "🙃",
    "V": "🫠",
    "AA2": "🤐",
    "UW0": "🤨",
    "UH0": "😐",
    "F": "😑",
    "Z": "😶",
    "AO1": "😅",
    "IH0": "😒",
    "AY2": "🙄",
    "IY2": "😬",
    "UW1": "😮‍💨",
    "AE1": "🤥",
    "OW2": "🫨",
    "IY0": "😕",
    "AE2": "🫤",
    "OW1": "😮",
    "OW0": "😮",
    "NG": "😮",
    "SH": "😯",
    "ZH": "😲",
    "Y": "😳",
    "EY0": "🥺",
    "AE0": "🥹",
    "HH": "😦",
    "AW2": "😧",
    "AW1": "😨",
    "EY2": "😰",
    "EH2": "😥",
    "AH2": "😢",
    "UW2": "😭",
    "AO0": "😱",
    "AY1": "😖",
    "JH": "😣",
    "CH": "😞",
    "W": "😓",
    "ER1": "😩",
    "UH1": "😫",
    "UH2": "😤",
    "DH": "😡",
    "OY2": "😠",
    "AY0": "🤬",
    "OY1": "😠",
    "ER2": "😠",
    "OY0": "🤬",
    "AW0": "😠"
  }

  const getEveryLetterAfter1sec = (emojiArr) => {
    let emoji = '';
    let words = emojiArr
    let textwords = transcript.replace(voiceInput, '').split(" ");

    let i = 0;
    let j = 0;
    if (words.length === 0) {
      return;
    }
    let interval = setInterval(() => {
      if (i < words.length) {
        emoji = words[i];
        console.log(emoji);
        setCurrentChar(emoji);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    if (textwords.length === 0) {
      return;
    }

    let interval2 = setInterval(() => {
      console.log(j, textwords.length)
      if (j < textwords.length) {
        let word = textwords[j];
        if (word === '') {
          j++;
          return;
        }
        console.log(word);
        setCurrentWord(word);
        j++;
      } else {
        clearInterval(interval2);
        console.log(textwords[j])
        console.log('restting transcript')
        setVoiceInput(transcript)
        // resetTranscript();
        j = 0;
      }
    }, 100);
  }

  useEffect(() => {

    // clear canvas
    let canvas = document.getElementById('video-container');
    let ctx = canvas.getContext('2d');

    canvas.style.background = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw current char on canvas
    ctx.font = "240px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(currentChar || '😐', canvas.width / 2, canvas.height / 2);

    // draw current word on canvas below it
  }, [currentChar])

  useEffect(() => {
    let canvas = document.getElementById('video-container');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(currentWord, canvas.width / 2, canvas.height / 2 + 100);
  
  }, [currentWord])

  const phoneticEmoji = (text) => {
    // get phonetic from enPhonetics
    // split text into words
    let words = text.split(" ");
    let emoji = [];
    words.forEach(word => {
      let phonetic = enPhonetics[word.toUpperCase()];
      if (!phonetic) {
        return;
      }
      for (let i = 0; i < phonetic.length; i++) {
        emoji.push(phoneticMap[phonetic[i]]);
      }
    });
    return emoji;
  }


  useEffect(() => {
    console.log(transcript)
    // remove voiceinput from transcript and set that 
    getEveryLetterAfter1sec(phoneticEmoji(transcript.replace(voiceInput, '')));
  }, [transcript])

  useEffect(() => {
    fetch('/api/phonetics')
      .then(res => res.json())
      .then(data => {
        setEnPhonetics(JSON.parse(data.phoneticMap));
      })
  }, [])


  useEffect(() => {
    if(isListening)  {
      // record canvas and save it as video
      let canvas = document.getElementById('video-container');
      let stream = canvas.captureStream(25);
      let recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      let chunks = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      }
      recorder.onstop = (e) => {
        let blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        chunks = [];
        // download video
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'voice-to-emoji.webm';
        a.click();
        URL.revokeObjectURL(url);
      }
    
      recorder.onstart = (e) => {
        console.log('recording started')
      }
      recorder.start();
    } else {
      if(mediaRecorder)
      mediaRecorder.stop();
    }

  }, [isListening])



  return (
    <>
      <Head>
        <title>Voice to Emoji</title>
        <meta name="description" content="A simple voice to emoji converter." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <a href='/' className={styles.home}>🏠</a>
        <h1>Voice to Emoji</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '12px'
        }}>
          A simple voice to emoji converter. Click the play button and start speaking. The text will appear in the text area.

        </span>
        {/* <textarea
          value={transcript}
          onChange={(e) => {
            setVoiceInput(e.target.value)
          }}
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
        /> */}
        <button onClick={() => {
          if (isListening) {
            handleStop()
          } else {
            handleListen()
          }

        }}
        >
          {isListening ? 'Stop' : 'Record'}
        </button>
        <canvas 
        width={1000}
        height={1000}
        style={{
          width: '500px',
          height: '500px',
          background: 'black',
          display: 'block',
        
        }}
          id='video-container'
        >
          {/* <span style={{
            width: '100%',
            height: '50%',
          }}>
            {currentChar || '😐'}
          </span>
          <span style={{
            width: '100%',
            height: '50%',
            fontSize: '120px',
          }}>
            {currentWord}
          </span> */}
        </canvas>
      </main>
    </>
  )
}
