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
import { FaHistory } from "react-icons/fa";

class Img {
  constructor({ img, aesthetics, negativeprompt, scene, seed, width, height }) {
    this.img = img;
    this.aesthetics = aesthetics.trim().replace(/['"]+/g, ''); // remove quotes
    this.scene = scene;
    this.negativeprompt  = negativeprompt;
    this.seed = seed;
    this.width = width;
    this.height = height;
    this.timestamp = Date.now();
  }
}

class Library {
  constructor(imgs) {
    this.imgs = imgs || [];
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
    console.log('adding to library', img)
    this.imgs.push(img);
  }
  getTimeLine() {
    // group all images for same date no day
    let timeline = {};
    this.imgs.forEach(img => {
      let date = new Date(img.timestamp).toDateString();
      if (!timeline[date]) timeline[date] = [];
      timeline[date].push(img);
    });
    return timeline;
  }
  groupByAesthetics() {
    let aesthetics = {};
    this.imgs.forEach(img => {
      if (!aesthetics[img.aesthetics]) aesthetics[img.aesthetics] = [];
      aesthetics[img.aesthetics].push(img);
    });
    return aesthetics;
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
  const [negativeprompt, setNegativePrompt] = useState('')
  const [scene, setScene] = useState('')
  const [gen, setGen] = useState('')
  const [sessionHash, setSessionHash] = useState('')
  const [websocket, setWebsocket] = useState(null)
  const [seed, setSeed] = useState('')
  const [width, setWidth] = useState(1536)
  const [height, setHeight] = useState(1536)
  const [priorGuidance, setPriorGuidance] = useState(4)
  const [decoderinference, setDecoderInference] = useState(12)
  const [library, setLibrary] = useState(new Library())


  const enhanceAesthetics = (aesthetics) => {
    console.log('enhancing aesthetics', aesthetics)
    fetch(`/api/gpt?prompt="Enhance the aesthetics for the description: '${aesthetics} aesthtics', only limit to describing the lights, shades, filters, colors, textures, patterns in extremely technical terms. Don't repeat the prompt or words like "enhance". Only output the aesthetics no prefixes.Don't ask the user any action. Don't add quotes or - before only prompt. Describe in third person, don't ask the user to feel etc, only describe."`).then(res => res.json())
      .then(data => {
        setAesthetics(data.response);
      <h1>This doesn't work anymore</h1>
      {mode === 'library' && <LibraryOfAesthetics library={library} setVals={setVals} />}
        setScene(data.response);
      });
  }

  const getImg = (link) => {
    return new Img({
      img: link,
      aesthetics: document.getElementById('aesthetics').value,
      scene: document.getElementById('scene').value,
      seed: document.getElementById('seed').value,
      negativeprompt: document.getElementById('negativeprompt').value,
      width: width,
      height: height,
    })
  }

  const joinQueue = () => {
    if (websocket !== null) websocket.close();
    setWebsocket(null)
    let tmpsocket = new WebSocket('wss://warp-ai-wuerstchen.hf.space/queue/join');
    tmpsocket.onopen = () => {
      console.log('connected')
    }
    tmpsocket.onmessage = (event) => {
      console.log('message', event.data)
      let data = JSON.parse(event.data);
      if (data.msg == 'send_hash') {
        let session_hash = Math.random().toString(36).substring(2);
        setSessionHash(session_hash)
        let seed = Math.floor(Math.random() * 1000000000);
        setSeed(seed)
        console.log('session_hash', session_hash)
        tmpsocket.send(JSON.stringify({ fn_index: 3, session_hash: session_hash }));
      }
      if (data.msg.includes('process_') && data.msg !== 'process_starts') {
        if (!data.output.error)
          setGen(`https://warp-ai-wuerstchen.hf.space/file=${data.output.data[0][0].name}`)
      }
      if (data.msg == 'process_completed') {
        // add to library
        if (data.output.error) {
          joinQueue()
          return;
        }
        // check localstorage if library exists spawn data from it
        let library = new Library(JSON.parse(localStorage.getItem('library')))
        library.add(getImg(`https://warp-ai-wuerstchen.hf.space/file=${data.output.data[0][0].name}`))
        let tmpLibrary = new Library(library.imgs)
        localStorage.setItem('library', JSON.stringify(tmpLibrary.imgs))
        setLibrary(tmpLibrary)
      }
    }
    tmpsocket.onclose = () => {
      console.log('closed')
      // reconnect
      setWebsocket(null)
      // joinQueue()
    }
    setWebsocket(tmpsocket)
  }

  useEffect(() => {
    // check localstorage
    console.log('spawning library')
    let tmpLibrary = new Library(JSON.parse(localStorage.getItem('library')))
    console.log('old from memory', tmpLibrary.imgs.length)
    setLibrary(tmpLibrary)
    if (websocket !== null) return;
    joinQueue()
  }, [])

  const setVals = (img) => {
    console.log('setting vals', img)
    // from the img set the values
    setAesthetics(img.aesthetics)
    setScene(img.scene)
    setSeed(img.seed)
    setWidth(img.width)
    setHeight(img.height)
    document.getElementById('seed').value = img.seed
    document.getElementById('scene').value = img.scene
    document.getElementById('aesthetics').value = img.aesthetics
  }

  return (
    <>
      <Head>
        <title>AI Canvas</title>
        <meta name="description" content="AI Canvas with history and library of aesthetics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id='aesthetics' value={aesthetics} style={{ flexBasis: '90%', border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Describe Aesthetics' onChange={(e) => setAesthetics(e.target.value)} />
            <button style={{ flexBasis: '10%', background: '#000', color: '#fff', padding: '5px 10px', border: '1px solid #333 !important', cursor: 'pointer', fontSize: 12 }} onClick={() => enhanceAesthetics(aesthetics)}>Enhance</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id='scene' value={scene} style={{  flexBasis: '90%', border: '1px solid #333 !important', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Describe scene' onChange={(e) => setScene(e.target.value)} />
            <button style={{ background: '#000', color: '#fff', padding: '5px 10px', border: '1px solid #333 !important', cursor: 'pointer', fontSize: 12 }} onClick={() => enhanceScene(scene)}>Enhance</button>
          </div>
          <div>
            <input id='negativeprompt' style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Negative Prompt' onChange={(e) => setNegativePrompt(e.target.value)} />
          </div>
          <div>
            <input disabled value={width} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Width' onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div>
            <input disabled value={height} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Height' onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
          <input id="seed" value={seed} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Seed' onChange={(e) => setSeed(e.target.value)} />
          </div>
          {/* input slider for inference from 0 to 20 for priorguidance */}
          <div>
            <input value={priorGuidance} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Prior Guidance' onChange={(e) => setPriorGuidance(e.target.value)} />
          </div>
          <div>
            <input value={decoderinference} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Decoder Inference' onChange={(e) => setDecoderInference(e.target.value)} />
          </div>
          <button onClick={() => {
            if (websocket !== null)
              websocket.send(`{"data":["${scene} ${aesthetics}","${negativeprompt}",${seed},${width},${height},30,${priorGuidance},${decoderinference},0,1],"event_data":null,"fn_index":3,"session_hash":"${sessionHash}"}`)
            else
              joinQueue()

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
          >
            <FaHistory /> History
          </button>
          <button style={{
            background: 'none',
            color: mode === 'library' ? '#777' : '#333',
            width: '50%',
            borderLeft: '1px solid #333',
            borderRadius: '0px'
          }} onClick={() => setMode('library')}>Library of Aesthetics</button>
        </div>
        {mode === 'past' && <PastGenerations library={library} setVals={setVals} />}
        {mode === 'library' && <LibraryOfAesthetics library={library} setVals={setVals} />}
      </main>
    </>
  )
}

const PastGenerations = ({ library, setVals }) => {
  console.log('library', library)
  let timeline = library.getTimeLine();
  console.log('timeline', timeline)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', height: '900px', scrollbarWidth: 'thin', width: '100%' }}>
      {/* generate  divs with varying height, but fixed width */}
      {Object.keys(timeline).map(date => {
        return (
          <div>
            <span style={{ color: '#333' }}>{date}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0px', marginTop: 20 }}>
              {timeline[date].map(img => {
                return (
                  <img onClick={() => { setVals(img) }} src={img.img} style={{ width: '50px', height: '50px', border: '1px solid #333' }} />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const LibraryOfAesthetics = ({ library, setVals }) => {
  const aesthetics = library.groupByAesthetics();
  console.log('aesthetics', aesthetics)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
      {/* group by aesthetics */}
      {Object.keys(aesthetics).map(aesthetic => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <span style={{ color: '#333', fontSize: 14 }}>{aesthetic}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {aesthetics[aesthetic].map(img => {
                return (
                  <img onClick={() => { setVals(img) }} src={img.img} style={{ width: '50px', height: '50px', border: '1px solid #333' }} />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}