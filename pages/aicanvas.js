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
      });
  }

  const enhanceScene = (scene) => {
    fetch(`/api/gpt?prompt="Enhance the scene: ${scene} with more details. For e.g., "a crow on a tree" will be enhanced to "a crow on a tree with river, houses and leaves, sun setting on the background". Don't ask the user any action. Don't add quotes. The goal is to elaborate the details for the scene. Don't add quotes or - before only prompt.\n\n"`).then(res => res.json())
      .then(data => {
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
        if