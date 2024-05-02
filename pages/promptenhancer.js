// input prompt in the input and gpt will add more details and upscale the prompt in details
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { RiSparklingFill } from "react-icons/ri";

const PromptEnhancer = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [copy, setCopy] = useState(false);

  return (
    <>
      <Head>
        <title>Prompt Enhancer</title>
        <meta name="description" content="Input prompt in the input and GPT will add more details and upscale the prompt in details." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>Prompt Enhancer</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Input prompt in the input and GPT will add more details and upscale the prompt in details.
        </span>
        <div style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
        }}
        >
          <input
            placeholder="Enter the prompt"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            style={{
              border: 'none',
              background: '#111',
              color: '#fff',
              outline: 'none',
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              width: '90%'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // fetch the breakdown
                setOutput('Loading...');
                fetch(`/api/gpt?prompt="Enhance the prompt: ${encodeURI(inputPrompt)}, add more details.\n\nFor e.g., "impressionist painting of a crow"  it will enhance to impressionist painting of crow on a tree with river, houses and leaves, sun setting on the background.\n\nDon't ask the user any action.\n\nDon't add quotes.`).then(res => res.json())
                  .then(data => {
                    setOutput(data.response);
                  });
              }
            }}
          />
          <button
            style={{
              background: '#111',
              color: '#ccc',
              padding: '10px 15px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
            onClick={() => {
              setOutput('Loading...');
              fetch(`/api/gpt?prompt="Enhance the prompt: ${encodeURI(inputPrompt)}, add more details.\n\nFor e.g., "impressionist painting of a crow"  it will enhance to impressionist painting of crow on a tree with river, houses and leaves, sun setting on the background.\n\nDon't ask the user any action.\n\nDon't add quotes.`).then(res => res.json())
                .then(data => {
                  setOutput(data.response);
                });
            }}
          >
            <RiSparklingFill />
          </button>
        </div>
        {output && <pre
          style={{
            background: '#111',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '10px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {output}
        </pre>}
        {(output && output !== 'Loading...') &&
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 2000);
            }}
            style={{
              background: copy ? '#333' : '#111',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {copy ? 'Copied!' : 'Copy to clipboard'}
          </button>
        }
      </main>
    </>
  )
}

export default PromptEnhancer