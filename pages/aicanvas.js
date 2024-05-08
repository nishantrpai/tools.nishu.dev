/**
 * text to image generation
 * text -> image
 * + save aesthetics
 * + save text
 * + save config
 * + img links will be saved in localstorage
 * + search aesthetics and see generations
 */
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

class Img {
  constructor() {
    this.img = null;
    this.aesthetics = '';
    this.scene = '';
    this.seed = '';
    this.width = 0;
    this.height = 0;
    this.config = {};
    this.timestamp = Date.now();
  }
}

class Library {
  constructor() {
    this.imgs = [];
  }
  // search library
  searchAesthetics(aesthetics) {
    return this.imgs.filter(img => img.aesthetics.includes(aesthetics));
  }
  // search scenes
  searchScene(scene) {
    return this.imgs.filter(img => img.scene.includes(scene));
  }
  // add to library
  add(img) {
    this.imgs.push(img);
  }
  // remove from library
  remove(img) {
    this.imgs = this.imgs.filter(i => i !== img);
  }
}

const getRandomDivs = () => {
  let divs = [];
  for (let i = 0; i < 100; i++) {
    // minimum height 100p
    let height = Math.floor(Math.random() * 100) + 200;
    divs.push(<div style={{ height: height, width: '300px', background: '#000', border: '1px solid #333', borderRadius: '5px' }}></div>)
  }
  return divs;
}

const getAllAesthetics = () => {
  let aesthetics = ['Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'blah', 'blah'];
  let divs = [];
  for (let i = 0; i < aesthetics.length; i++) {
    divs.push(<div style={{ cursor: 'pointer', width: '240px', textOverflow: 'ellipsis', border: '1px solid #333', whiteSpace: 'pre-wrap', fontSize: 12, padding: 20, height: 120 }}>{aesthetics[i]}</div>)
  }
  return divs;
}


export default function AICanvas() {

  const [mode, setMode] = useState('past')
  const [aesthetics, setAesthetics] = useState('')
  const [scene, setScene] = useState('')
  const [gen, setGen] = useState('')
  const [sessionHash, setSessionHash] = useState('')
  const [websocket, setWebsocket] = useState(null)
  const [seed, setSeed] = useState('')
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [noOfImages, setNofImages] = useState(1)
  const [guidance, setGuidance] = useState(4)
  const [inference, setInference] = useState(30)
  const [decoderguidance, setDecoderGuidance] = useState(0)
  const [decoderinference, setDecoderInference] = useState(2)
  const [library, setLibrary] = useState(new Library())

  useEffect(() => {
    if(websocket !== null) return;
    let tmpsocket = new WebSocket('wss://warp-ai-wuerstchen.hf.space/queue/join');

    tmpsocket.onopen = () => {
      console.log('connected')
    }
    tmpsocket.onmessage = (event) => {
      console.log('message', event.data)
      let data = JSON.parse(event.data);
      let session_hash = Math.random().toString(36).substring(2);
      console.log('session_hash', session_hash)
      // setSessionHash(session_hash)
      if (data.msg == 'send_hash') {
        tmpsocket.send(JSON.stringify({ fn_index: 3, session_hash: session_hash }));
      }
      if (data.msg.includes('process_') && data.msg !== 'process_starts') {
        // if (!data.output.error)
          setGen(`https://warp-ai-wuerstchen.hf.space/file=${data.output.data[0][0].name}`)
      }
      if(data.msg == 'process_completed') {
        // add to library
        library.add(new Img({
          img: gen,
          aesthetics: aesthetics,
          scene: scene,
          seed: seed,
          width: width,
          height: height,

        }))
      }
    }
    setWebsocket(tmpsocket)
  }, [])

  return (
    <>
      <main style={{ border: '1px solid red' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div>
            <input style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Enter Aesthetics' onChange={(e) => {
              setAesthetics(e.target.value)
            }} />
          </div>
          <div>
            <input style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Describe scene' onChange={(e) => {
              setScene(e.target.value)
            }} />
          </div>
          <button onClick={() => {
            websocket.send(`{"data":["${aesthetics} ${scene}","",1532293626,1024,1024,30,4,12,0,2],"event_data":null,"fn_index":3,"session_hash":"${sessionHash}"}`)
          }}>
            Generate
          </button>
          <div>
            <img src={gen} style={{ width: '100%', height: 'auto', minWidth: 500, minHeight: 500, border: '1px solid #333' }} />
          </div>
        </div>

        {/* one div will be for past generations and one will be library of aesthetics, on click it'll filter past generations and fill the input */}
        <div style={{ display: 'flex', gap: '20px', width: '100%', padding: '10px' }}>
          <button onClick={() => setMode('past')}
            style={{
              background: 'none',
              color: mode === 'past' ? '#777' : '#333',
              width: '50%'
            }}
          >Past Generations</button>
          <button style={{
            background: 'none',
            color: mode === 'library' ? '#777' : '#333',
            width: '50%',
            borderLeft: '1px solid #333',
            borderRadius: '0px'
          }} onClick={() => setMode('library')}>Library of Aesthetics</button>
        </div>
        {mode === 'past' && <PastGenerations />}
        {mode === 'library' && <LibraryOfAesthetics />}
      </main>
    </>
  )
}

const PastGenerations = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', width: '100%', height: '900px', flexFlow: 'column wrap', overflowX: 'scroll', scrollbarWidth: 'thin', overflowY: 'hidden' }}>
      {/* generate  divs with varying height, but fixed width */}
      {getRandomDivs()}
    </div>
  )
}

const LibraryOfAesthetics = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
      {/* generate  divs with varying height, but fixed width */}
      {getAllAesthetics()}
    </div>
  )
}