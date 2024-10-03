import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';

export default function LichessGif() {
  const [gameId, setGameId] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (event) => {
    const url = event.target.value;
    const idMatch = url.match(/lichess\.org\/([^#]+)/);
    console.log(idMatch);
    if (idMatch) {
      setGameId(idMatch[1].split('/')[1]);
      console.log(gameId);
    } else {
      setGameId('');
    }
  };

  const generateGifUrl = () => {
    console.log('click');
    console.log(gameId);
    const gameUrl = document.getElementById('game-url').value;
    console.log(gameUrl);
    const idMatch = gameUrl.match(/lichess\.org\/([^#]+)/);
    console.log(idMatch);
    let finalGameId = ''; // Initialize finalGameId
    if (idMatch) {
      finalGameId = idMatch[1];
      console.log(finalGameId);
    } else {
      finalGameId = '';  
    }
    console.log(finalGameId);
    if (finalGameId) {
      setIsGenerating(true);
      setGifUrl(`https://lichess1.org/game/export/gif/${finalGameId}.gif`);
      setIsGenerating(false);
    }
  };

  const downloadGif = async () => {
    // create new a element
    let a = document.createElement('a');
    // get image as blob
    let proxy = 'https://api.codetabs.com/v1/proxy/?quest=' 
    let response = await fetch(proxy + gifUrl);
    let file = await response.blob();
    // use download attribute
    a.download = 'lichess_game.gif';
    a.href = window.URL.createObjectURL(file);
    // store download url in javascript
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    // click on element to start download
    a.click();
  };
  return (
    <>
      <Head>
        <title>Lichess Gif</title>
        <meta name="description" content="Generate a GIF of a Lichess game." />
        <meta name="keywords" content="Lichess, GIF, Game, Preview, Download" />
      </Head>
      <main>
        <h1 className={styles.title}>Lichess Game GIF Preview</h1>
        <h2 className={styles.description}>Generate a GIF of a Lichess game.</h2>
        <input
          type="text"
          placeholder="Enter Lichess Game URL (e.g., https://lichess.org/game/lHXMhnGo)"
          onChange={handleInputChange}
          id='game-url'
        />
        {gameId}
       <button onClick={() => {generateGifUrl()}}>Generate GIF URL</button>
        {gifUrl && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <h2>Preview:</h2>
            <img src={gifUrl} alt="Lichess Game GIF" style={{ maxWidth: '100%' }} />
            <button onClick={downloadGif}>Download GIF</button>
          </div>
        )}
      </main>
    </>
  );
}