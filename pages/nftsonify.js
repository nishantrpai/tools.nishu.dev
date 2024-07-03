// play nft image as audio 
// there will be pitch, rate and volume controls
// use canvas to visualize the audio
// use web audio api to play the audio
// when the audio is playing, the canvas will be updated, red color will be used to indicate the current playing position
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import * as Tone from 'tone'

const CANVAS_WIDTH = 300
const CANVAS_HEIGHT = 300
export default function Nftsonify() {

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
  const [img, setImg] = useState('')
  const [direction, setDirection] = useState('horizontal')
  const [minFreq, setFrequency] = useState(20)
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [minMidiNote, setMinMidiNote] = useState(21); // A0
  const [maxMidiNote, setMaxMidiNote] = useState(108); // C8

  const [synths, setSynths] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  const pianoFrequencies = [
    27.5, 29.1352, 30.8677, 32.7032, 34.6478, 36.7081, 38.8909, 41.2034, 43.6535, 46.2493, 48.9994, 51.9131,
    55.0, 58.2705, 61.7354, 65.4064, 69.2957, 73.4162, 77.7817, 82.4069, 87.3071, 92.4986, 97.9989, 103.826,
    110.0, 116.541, 123.471, 130.813, 138.591, 146.832, 155.563, 164.814, 174.614, 184.997, 195.998, 207.652,
    220.0, 233.082, 246.942, 261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305,
    440.0, 466.164, 493.883, 523.251, 554.365, 587.33, 622.254, 659.255, 698.456, 739.989, 783.991, 830.609,
    880.0, 932.328, 987.767, 1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22,
    1760.0, 1864.66, 1975.53, 2093.0, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44,
    3520.0, 3729.31, 3951.07, 4186.01
  ];


  function findNearestFrequency(value) {
    return pianoFrequencies.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  }



  const playChord = (frequencies, volume, duration = 0.5) => {
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
  }

    const synth = new Tone.PolySynth(frequencies.length, Tone.Synth).toDestination();
    synth.volume.value = Tone.gainToDb(volume);
    synth.triggerAttackRelease(frequencies.map(f => findNearestFrequency(f)), duration);
    setSynths([...synths, synth]);
  };


  


  const highlightRow = (y) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = img;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(0, y, canvas.width, 1);
    };
  };

  const sonifyImage = (direction) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    if (direction === 'horizontal') {
      for (let y = 20; y < 30; y++) {
        let timeout = setTimeout(() => {
          let frequencies = [];
          for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const red = data[index];
            const green = data[index + 1];
            const blue = data[index + 2];

            let frequency = ((red + green + blue) / 3); // map to audible range
            frequencies.push(frequency);
            console.log(frequencies);
          }
          const volume = (frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length) / (3 * 255);
          highlightRow(y);
          playChord(frequencies, volume);
        }, y * playbackRate * 200);
        setTimeouts([...timeouts, timeout]);
      }
    } else if (direction === 'vertical') {
      for (let x = 0; x < width; x++) {
        const frequencies = [];
        for (let y = 0; y < height; y++) {
          const index = (y * width + x) * 4;
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];

          const frequency = ((red + green + blue) / 3) * 2; // map to audible range
          frequencies.push(frequency);
        }
        const volume = (frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length) / (3 * 255);
        setTimeout(() => {
          highlightRow(x);
          playChord(frequencies, volume);
        }, x * 500);
      }
    }
  };


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
      setImg(data.image)
    })
  }, [token1, collectionAddress])


  useEffect(() => {
    if (!img) return
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.src = img
    image.onload = () => {
      canvas.width = image.width
      if (canvas.width < CANVAS_WIDTH) canvas.width = CANVAS_WIDTH
      canvas.height = image.height
      if (canvas.height < CANVAS_HEIGHT) canvas.height = CANVAS_HEIGHT
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      // sonifyImage(direction)
    }

  }, [img])

  return (
    <>
      <Head>
        <title>Nftsonify</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Play NFT image as audio" />
      </Head>
      <main>
        <canvas id="canvas" width={`${CANVAS_WIDTH}`} height={`${CANVAS_HEIGHT}`}></canvas>
        <div className={styles.searchContainer} style={{ marginTop: 20 }}>
          <input className={styles.search} placeholder="Collection Address"
            onChange={(e) => {
              setCollectionAddress(e.target.value)
            }}
            value={collectionAddress}
          ></input>
        </div>
        <div className={styles.searchContainer} style={{ marginTop: 10 }}>
          <input className={styles.search} placeholder="Token ID"
            onChange={(e) => {
              setToken1(e.target.value)
            }}
            value={token1}></input>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <label>Frequency</label>
          <input type="range" min="0" max="1000" value={minFreq} onChange={(e) => setFrequency(parseInt(e.target.value))} />
          <label>Volume</label>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(e.target.value)} />
          <label>Playback Rate</label>
          <input type="range" min="0.1" max="2" step="0.1" value={playbackRate} onChange={(e) => setPlaybackRate(e.target.value)} />
          
          <button onClick={() => { sonifyImage(direction) }}>Sonify</button>
          {/* stop btn */}
          <button onClick={() => { 
                        timeouts.forEach(timeout => {
                          clearTimeout(timeout);
                        });
                        setTimeouts([]);
            
            synths.forEach(synth => {
              synth.releaseAll();
            });
            setSynths([]);
          }}>Stop</button>
        </div>
      </main>
    </>
  )
}