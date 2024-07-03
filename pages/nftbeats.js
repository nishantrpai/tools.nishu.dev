import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { ethers } from 'ethers';
import styles from '@/styles/Home.module.css'

export default function Home() {
  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth-pokt.nodies.app',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }
  const [collectionAddress, setCollectionAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('1')
  const [direction, setDirection] = useState('horizontal')

  const getNFTData = async (collection_address, id) => {
    // get metadata of nft and ipfs hash
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider)
      const tokenURI = await contract.tokenURI(id)
      // if tokenURI is a url, fetch the metadata, if it is ipfs replace with ipfs.io
      // if token uri is data:// json parse it
      if (tokenURI.startsWith('data:')) {
        const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
        return metadata
      }
      else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI)
        const metadata = await response.json()
        return metadata
      } else {
        const ipfsHash = tokenURI.split('ipfs://')[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        const response = await fetch(ipfsUrl)
        const metadata = await response.json()
        return metadata
      }
    } catch (e) {
      return '';
    }
  }

  useEffect(() => {
    if (!collectionAddress || !token1) return
    getNFTData(collectionAddress, token1).then((data) => {
      if (!data) return
      let image = new Image();
      image.src = data.image;
      image.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        if (image.width < 600) canvas.width = 600;
        canvas.height = image.height;
        if (image.height < 400) canvas.height = 600;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        setImage(image);
        currentYRef.current = 0; // Reset currentY to 0
        
        const highResCanvas = highResCanvasRef.current;
        highResCanvas.width = image.width * 2;
        highResCanvas.height = image.height * 2;

      }
    })
  }, [token1, collectionAddress])



  const [tempo, setTempo] = useState(80);
  const [minFreq, setMinFreq] = useState(65);
  const [maxFreq, setMaxFreq] = useState(900);
  const [beat, setBeat] = useState('kick, null, snare, null, kick, clap, snare, closedHat');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [image, setImage] = useState(null);

  const canvasRef = useRef(null);
  const highResCanvasRef = useRef(null);
  const synthRef = useRef(null);
  const kickSynthRef = useRef(null);
  const snareSynthRef = useRef(null);
  const clapSynthRef = useRef(null);
  const closedHatSynthRef = useRef(null);
  const openHatSynthRef = useRef(null);
  const lineSweepIntervalRef = useRef(null);
  const currentYRef = useRef(0); // Use ref for currentY


  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 1 },
      volume: -20,
    }).toDestination();

    kickSynthRef.current = new Tone.MembraneSynth({
      envelope: { attack: 0.02, decay: 0.8, sustain: 0.3, release: 1 },
      volume: -10,
    }).toDestination();

    snareSynthRef.current = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
      volume: -20,
    }).toDestination();

    clapSynthRef.current = new Tone.MembraneSynth({
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
      volume: -15,
    }).toDestination();

    closedHatSynthRef.current = new Tone.MetalSynth({
      frequency: 250,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
      volume: -30,
    }).toDestination();

    openHatSynthRef.current = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.01, release: 0.3 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
      volume: -30,
    }).toDestination();
  }, []);

  const pianoFrequencies = [
    65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00,
    116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00,
    207.65, 220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23,
    369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25,
    659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.50, 1108.73,
    1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760.00, 1864.66, 1975.53,
    2093.00, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520.00,
    3729.31, 3951.07, 4186.01
  ];

  const findNearestFrequency = (value) => {
    return pianoFrequencies.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  };

  const getBrightnessValues = (imageData) => {
    const brightnessValues = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const brightness = (r + g + b) / 3;
      brightnessValues.push(brightness);
    }
    return brightnessValues;
  };

  const brightnessToFrequency = (brightness) => {
    const minBrightness = 0;
    const maxBrightness = 255;
    const minFrequency = minFreq;
    const maxFrequency = maxFreq;
    const cappedMaxFrequency = 1200; // Capping the maximum frequency to avoid harsh sounds
    const frequency = ((brightness - minBrightness) / (maxBrightness - minBrightness)) * (maxFrequency - minFrequency) + minFrequency;
    return Math.min(frequency, cappedMaxFrequency);
  };

  const loadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        if (img.width < 600) canvas.width = 600;
        canvas.height = img.height;
        if (img.height < 400) canvas.height = 400;
        ctx.drawImage(img, 0, 0);
        setImage(img);
        currentYRef.current = 0; // Reset currentY to 0
        // Set high resolution canvas size
        const highResCanvas = highResCanvasRef.current;
        highResCanvas.width = img.width * 2;
        highResCanvas.height = img.height * 2;

      }
      img.src = e.target.result;
    }
    reader.readAsDataURL(file);
  };

  const sweepLine = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (currentYRef.current >= canvas.height) {
      currentYRef.current = 0;
      return;
    }

    const imageData = ctx.getImageData(0, currentYRef.current, canvas.width, 1).data;
    const frequencies = [];
    if (direction === 'horizontal') {
      for (let x = 0; x < canvas.width; x++) {
        const index = x * 4;
        const brightness = (imageData[index] + imageData[index + 1] + imageData[index + 2]) / 3;
        frequencies.push(brightnessToFrequency(brightness));
      }
    }
    if (direction === 'vertical') {
      for (let y = 0; y < canvas.height; y++) {
        const index = y * 4;
        const brightness = (imageData[index] + imageData[index + 1] + imageData[index + 2]) / 3;
        frequencies.push(brightnessToFrequency(brightness));
      }
    }

    // Limit polyphony
    const maxPolyphony = 5;
    const step = Math.ceil(frequencies.length / maxPolyphony);
    const limitedFrequencies = frequencies.filter((_, i) => i % step === 0);

    // Insert null values between frequencies
    const frequenciesWithNulls = [];
    for (let i = 0; i < limitedFrequencies.length; i++) {
      frequenciesWithNulls.push(limitedFrequencies[i]);
      if (i < limitedFrequencies.length - 1) {
        frequenciesWithNulls.push(null);
      }
    }

    synthRef.current.triggerAttackRelease(frequenciesWithNulls, '8n');

    // Highlight the line
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.beginPath();

    if (direction === 'horizontal') {
      ctx.moveTo(0, currentYRef.current);
      ctx.lineTo(canvas.width, currentYRef.current);
    }
    if (direction === 'vertical') {
      ctx.moveTo(currentYRef.current, 0);
      ctx.lineTo(currentYRef.current, canvas.height);
    }
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    currentYRef.current += 1;
  };

  const playOrchestra = async () => {
    await Tone.start();
    Tone.Transport.start();

    const sequences = [
      beat.split(',').map(val => val.trim() === 'null' ? null : val.trim()), // Beat
      // [60, 70, 80, 90, 100], // Strings
      // [55, 65, 75, 85, 95], // Brass
      // [60, 70, 80, 90, 100] // Woodwinds
    ];

    const [beatSequence, strings, brass, woodwinds] = sequences;

    const beatPattern = new Tone.Sequence((time, note) => {
      if (note === 'kick') {
        kickSynthRef.current.triggerAttackRelease('C2', '8n', time);
      } else if (note === 'snare') {
        snareSynthRef.current.triggerAttackRelease('8n', time);
      } else if (note === 'clap') {
        clapSynthRef.current.triggerAttackRelease('C3', '8n', time);
      } else if (note === 'closedHat') {
        closedHatSynthRef.current.triggerAttackRelease('16n', time);
      } else if (note === 'openHat') {
        openHatSynthRef.current.triggerAttackRelease('8n', time);
      }

      // Sweep line in sync with the beat
      sweepLine();
    }, beatSequence, "8n").start(0);

    const stringPattern = new Tone.Sequence((time, note) => {
      synthRef.current.triggerAttackRelease(findNearestFrequency(note), "1n", time);
    }, strings, "1m").start("1m");

    const brassPattern = new Tone.Sequence((time, note) => {
      synthRef.current.triggerAttackRelease(findNearestFrequency(note), "1n", time);
    }, brass, "1m").start("2m");

    const woodwindPattern = new Tone.Sequence((time, note) => {
      synthRef.current.triggerAttackRelease(findNearestFrequency(note), "1n", time);
    }, woodwinds, "1m").start("3m");

    // Schedule the line sweep to follow the beat pattern
    lineSweepIntervalRef.current = Tone.Transport.scheduleRepeat(() => {
      sweepLine();
    }, '8n');
  };

  const stopBeats = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  const stopReading = () => {
    clearInterval(lineSweepIntervalRef.current);
    currentYRef.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    if (image) {
      ctx.drawImage(image, 0, 0); // Redraw the image
    }
  };


  const startRecording = () => {
    const canvasStream = canvasRef.current.captureStream(30); // Capture canvas at 30fps
    const audioStream = Tone.context.createMediaStreamDestination();
    synthRef.current.connect(audioStream);
    kickSynthRef.current.connect(audioStream);
    snareSynthRef.current.connect(audioStream);
    clapSynthRef.current.connect(audioStream);
    closedHatSynthRef.current.connect(audioStream);
    openHatSynthRef.current.connect(audioStream);

    const combinedStream = new MediaStream([...canvasStream.getTracks(), ...audioStream.stream.getTracks()]);

    const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
    console.log(recorder.mimeType);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => [...prev, e.data]);
        // runs on stop
      }
    };
    recorder.onstop = () => {
    };

    setMediaRecorder(recorder);
    recorder.start();
  };


  useEffect(() => {
    if (recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    // Create a download link and click it programmatically
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    setRecordedChunks([]);
  }, [recordedChunks])

  const handleRecordButtonClick = () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  return (
    <>
      <Head>
        <title>NFT Beats</title>
        <meta name="description" content="Turn your NFTs into music" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          NFT Beats
        </h1>
        <h2 className={styles.description}>
          Sonify your NFTs
        </h2>
        <div className={styles.container}>
          <canvas id="canvas" ref={canvasRef} width="600" height="400" style={{
            border: '1px solid #333',
            marginBottom: '1rem',
            width: 600
          }}></canvas>
          <canvas id="highResCanvas" ref={highResCanvasRef} style={{ display: 'none' }}></canvas>

          <br />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '100%' }}>
            <label style={{ fontWeight: 'bold' }}>Collection Address</label>

            <div className={styles.searchContainer} style={{ marginTop: 10 }}>
              <input className={styles.search} placeholder="Collection Address"
                onChange={(e) => {
                  setCollectionAddress(e.target.value)
                }}
                value={collectionAddress}
              ></input>
            </div>
            <label style={{ fontWeight: 'bold' }}>Token ID</label>

            <div className={styles.searchContainer} style={{ marginTop: 10 }}>
              <input className={styles.search} placeholder="Token ID"
                onChange={(e) => {
                  setToken1(e.target.value)
                }}
                value={token1}></input>

            </div>

          </div>
          <input type="file" id="imageUpload" accept="image/*" onChange={loadImage} style={{ marginBottom: 20 }} />
          <br />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', fontSize: 20 }}>
            <label htmlFor="direction">Direction:</label>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}>
              <input type="radio" id="horizontal" name="direction" value="horizontal" checked={direction === 'horizontal'} onChange={() => setDirection('horizontal')} />
              <span>
                Horizontal
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}>
              <input type="radio" id="vertical" name="direction" value="vertical" checked={direction === 'vertical'} onChange={() => setDirection('vertical')} />
              <span>
                Vertical
              </span>
            </div>
          </div>
          <span id="tempoValue" style={{
            display: 'block',
            marginBottom: '1rem',
            color: '#888',
            fontSize: '32px',
            fontWeight: 'bold',
          }}>{tempo} BPM</span>
          <label htmlFor="tempoSlider">Tempo:</label>
          <input
            type="range"
            id="tempoSlider"
            min="30"
            max="240"
            value={tempo}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              marginBottom: '1rem',
            }}
            onChange={(e) => {
              setTempo(e.target.value);
              Tone.Transport.bpm.value = e.target.value;
            }}
          />

          <label htmlFor="minFreqSlider">Minimum Frequency: {minFreq} Hz</label>
          <input
            type="range"
            id="minFreqSlider"
            min="30"
            max="240"
            value={minFreq}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              marginBottom: '1rem',
            }}
            onChange={(e) => setMinFreq(e.target.value)}
            />

          <br />
          <label htmlFor="minFreqSlider">Minimum Frequency: {maxFreq} Hz</label>
          <input
            type="range"
            id="minFreqSlider"
            min="30"
            max="1200"
            value={maxFreq}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              marginBottom: '1rem',
            }}
            onChange={(e) => setMaxFreq(e.target.value)}
            />

          <br />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>

            <label htmlFor="beatInput">Beat Sequence (comma-separated):</label>
            <input
              type="text"
              id="beatInput"
              value={beat}
              onChange={(e) => setBeat(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #333',
                padding: '0.5rem',
                fontSize: '16px',
                borderRadius: '5px',
              }}
            />
          </div>
          <br />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}>
            <button id="playButton" onClick={playOrchestra}>Play Orchestra</button>
            <button id="stopBeatsButton" onClick={stopBeats}>Stop Beats</button>
            <button id="stopReadingButton" onClick={stopReading}>Stop Sonify</button>
            <button id="recordButton" onClick={handleRecordButtonClick}>
              {isRecording ? "Stop Recording" : "Record"}
            </button>
          </div>
          <br />
          {recordedChunks.length ? <video id="recording" controls></video> : null}
        </div>
      </main>

    </>
  );
}
