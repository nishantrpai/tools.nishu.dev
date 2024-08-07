// listen to pdf
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

class SpeechSynthesisRecorder {
  constructor({ text = "", utteranceOptions = {}, recorderOptions = {}, dataType = "" }) {
    if (text === "") throw new Error("no words to synthesize");
    this.dataType = dataType;
    this.text = text;
    this.mimeType = MediaRecorder.isTypeSupported("audio/webm; codecs=opus")
      ? "audio/webm; codecs=opus" : "audio/ogg; codecs=opus";
    this.utterance = new SpeechSynthesisUtterance(this.text);
    this.speechSynthesis = window.speechSynthesis;
    this.mediaStream_ = new MediaStream();
    this.mediaSource_ = new MediaSource();
    this.mediaRecorder = new MediaRecorder(this.mediaStream_, {
      mimeType: this.mimeType,
      bitsPerSecond: 256 * 8 * 1024
    });
    this.audioContext = new AudioContext();
    this.audioNode = new Audio();
    this.chunks = Array();
    if (utteranceOptions) {
      if (utteranceOptions.voice) {
        this.speechSynthesis.onvoiceschanged = e => {
          const voice = this.speechSynthesis.getVoices().find(({
            name: _name
          }) => _name === utteranceOptions.voice);
          this.utterance.voice = voice;
          console.log(voice, this.utterance);
        }
        this.speechSynthesis.getVoices();
      }
      let {
        lang, rate, pitch
      } = utteranceOptions;
      Object.assign(this.utterance, {
        lang, rate, pitch
      });
    }
    this.audioNode.controls = "controls";
    document.body.appendChild(this.audioNode);
  }
  start(text = "") {
    if (text) this.text = text;
    if (this.text === "") throw new Error("no words to synthesize");
    return navigator.mediaDevices.getUserMedia({
      audio: true
    })
      .then(stream => new Promise(resolve => {
        const track = stream.getAudioTracks()[0];
        this.mediaStream_.addTrack(track);
        // return the current `MediaStream`
        if (this.dataType && this.dataType === "mediaStream") {
          resolve({ tts: this, data: this.mediaStream_ });
        };
        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
          };
        };
        this.mediaRecorder.onstop = () => {
          track.stop();
          this.mediaStream_.getAudioTracks()[0].stop();
          this.mediaStream_.removeTrack(track);
          console.log(`Completed recording ${this.utterance.text}`, this.chunks);
          resolve(this);
        }
        this.mediaRecorder.start();
        this.utterance.onstart = () => {
          console.log(`Starting recording SpeechSynthesisUtterance ${this.utterance.text}`);
        }
        this.utterance.onend = () => {
          this.mediaRecorder.stop();
          console.log(`Ending recording SpeechSynthesisUtterance ${this.utterance.text}`);
        }
        this.speechSynthesis.speak(this.utterance);
      }));
  }
  blob() {
    if (!this.chunks.length) throw new Error("no data to return");
    return Promise.resolve({
      tts: this,
      data: this.chunks.length === 1 ? this.chunks[0] : new Blob(this.chunks, {
        type: this.mimeType
      })
    });
  }
  arrayBuffer(blob) {
    if (!this.chunks.length) throw new Error("no data to return");
    return new Promise(resolve => {
      const reader = new FileReader;
      reader.onload = e => resolve(({
        tts: this,
        data: reader.result
      }));
      reader.readAsArrayBuffer(blob ? new Blob(blob, {
        type: blob.type
      }) : this.chunks.length === 1 ? this.chunks[0] : new Blob(this.chunks, {
        type: this.mimeType
      }));
    });
  }
  audioBuffer() {
    if (!this.chunks.length) throw new Error("no data to return");
    return this.arrayBuffer()
      .then(ab => this.audioContext.decodeAudioData(ab))
      .then(buffer => ({
        tts: this,
        data: buffer
      }))
  }
  mediaSource() {
    if (!this.chunks.length) throw new Error("no data to return");
    return this.arrayBuffer()
      .then(({
        data: ab
      }) => new Promise((resolve, reject) => {
        this.mediaSource_.onsourceended = () => resolve({
          tts: this,
          data: this.mediaSource_
        });
        this.mediaSource_.onsourceopen = () => {
          if (MediaSource.isTypeSupported(this.mimeType)) {
            const sourceBuffer = this.mediaSource_.addSourceBuffer(this.mimeType);
            sourceBuffer.mode = "sequence"
            sourceBuffer.onupdateend = () =>
              this.mediaSource_.endOfStream();
            sourceBuffer.appendBuffer(ab);
          } else {
            reject(`${this.mimeType} is not supported`)
          }
        }
        this.audioNode.src = URL.createObjectURL(this.mediaSource_);
      }));
  }
  readableStream({ size = 1024, controllerOptions = {}, rsOptions = {} }) {
    if (!this.chunks.length) throw new Error("no data to return");
    const src = this.chunks.slice(0);
    const chunk = size;
    return Promise.resolve({
      tts: this,
      data: new ReadableStream(controllerOptions || {
        start(controller) {
          console.log(src.length);
          controller.enqueue(src.splice(0, chunk))
        },
        pull(controller) {
          if (src.length = 0) controller.close();
          controller.enqueue(src.splice(0, chunk));
        }
      }, rsOptions)
    });
  }
}




export default function Home() {
  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);
  const [currPage, setCurrPage] = useState(0);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [vidx, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    setVoices(window.speechSynthesis.getVoices());
    if (!voice)
      setVoice(window.speechSynthesis.getVoices()[0]);

  }, [text]);

  const speak = () => {
    window.speechSynthesis.cancel();
    console.log(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice || window.speechSynthesis.getVoices()[0];
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    // on utterance end speak the next chunk
    utterance.onend = () => {
      if (currPage < texts.length - 1) {
        setCurrPage(currPage + 1);
        console.log(currPage, texts.length, texts[currPage+1]);
        setText(texts[currPage + 1]);
      }
    }
    window.speechSynthesis.speak(utterance);
  }

  const stop = () => {
    // stop the speech
    window.speechSynthesis.cancel();
  }


  const download = () => {
    // download the voice as mp3 file
    console.log(voice);
    const recorder = new SpeechSynthesisRecorder({ text, utteranceOptions: { voice: voice.name, rate, pitch, lang: voice.lang } });
    recorder.start().then(() => {
      recorder.blob().then(({ data }) => {
        console.log(data);
        const url = URL.createObjectURL(data);
        // download audio/webm file 
        const a = document.createElement('a');
        a.href = url;
        a.download = 'speech.webm';
        a.click();
      });
    });

  }

  useEffect(() => {
    if(currPage == 0) return;
    stop();
    speak();
  }, [currPage, text])

  async function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const { text, chunks } = await extractTextFromPDF(pdf);
      setText(chunks[0]);
      setCurrPage(0);
      setTexts(chunks);
    };

    reader.readAsArrayBuffer(file);
  }

  async function extractTextFromPDF(pdf) {
    let text = '';
    const numPages = pdf.numPages;

    for (let i = 2; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(' ');
    }

    // format text to remove extra spaces
    text = text.replace(/\s+/g, ' ');

    // now divide the text into batches of 200 word chunks so its easier for speech
    const chunks = splitTextIntoChunks(text, 10);

    return { text, chunks };
  }


  function splitTextIntoChunks(text, chunkSize) {

    const sentences = text.match(/[^.!?]*[.!?]/g) || [];
    const chunks = [];

    for (let i = 0; i < sentences.length; i += 2) {
      chunks.push(sentences.slice(i, i + 2).join(' '));
    }

    return chunks;
}



  return (
    <div className={styles.container}>
      <Head>
        <title>PDF to Audio</title>
        <meta name="description" content="Convert pdf to audio" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js"></script>

      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pdf to Audio
        </h1>
        <h2 className={styles.description}>
          Listen to pdf while you work
        </h2>
        <div>
          {/* input pdf file */}
          <input type="file" accept="application/pdf" onChange={handleFileChange} style={{
            marginBottom: 20
          }} />
          <textarea style={{ background: '#000', border: '1px solid #333', width: '500px', height: '200px' }}
            value={text}
            onChange={e => setText(e.target.value)}></textarea>
        </div>
        <div>
          {voices.length > 0 &&
            <select value={vidx} onChange={e => { setVoice(voices[e.target.value]); setVoiceIndex(e.target.value) }}>
              {voices.map((voice, index) => (
                <option key={index} value={index}>{voice.name}</option>
              ))}
            </select>}
        </div>
        <div>
          <h3>Rate: {rate}</h3>
          <input type="range" min="0" max="2" step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <h3>Pitch: {pitch}</h3>
          <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(e.target.value)} />
        </div>
        <div>
          <h3>Volume {volume}</h3>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(e.target.value)} />
        </div>
        <div style={{
          display: 'flex',
          gap: '30px'
        }}>
          <button onClick={speak}>Speak</button>
          <button onClick={(e) =>{
            // go to next chunk
            if (currPage < texts.length - 1) {
              setCurrPage(currPage + 1);
              setText(texts[currPage + 1]);
            }
          }}>Next</button>

          <button onClick={(e) =>{
            // go to previous chunk
            if (currPage > 0) {
              setCurrPage(currPage - 1);
              setText(texts[currPage - 1]);
            }
          }}>
            Previous
          </button>

          <button onClick={stop}>Stop</button>
          <button onClick={download}>Download</button>

        </div>
      </main>
    </div>
  )
}
