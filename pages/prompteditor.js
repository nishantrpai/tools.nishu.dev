// input prompt in the input and gpt will allow the user to change the scene but maintain aesthetics
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { RiSparklingFill } from "react-icons/ri";

const PromptEditor = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [sceneChange, setSceneChange] = useState('');
  const [output, setOutput] = useState('');
  const [copy, setCopy] = useState(false);

  return (
    <>
      <Head>
        <title>Prompt Editor</title>
        <meta name="description" content="Input prompt in the input and GPT will allow the user to change the scene but maintain aesthetics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>Prompt Editor</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Input prompt in the input and GPT will allow the user to change the scene but maintain aesthetics.
        </span>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
        }}
        >
          <input
            placeholder="Enter the original prompt"
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
            }}
          />
          <input
            placeholder="Enter the scene change"
            value={sceneChange}
            onChange={(e) => setSceneChange(e.target.value)}
            style={{
              border: 'none',
              background: '#111',
              color: '#fff',
              outline: 'none',
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // fetch the breakdown
                setOutput('Loading...');
                fetch(`/api/gpt?prompt="Edit the prompt: ${encodeURI(inputPrompt)}, change the scene to ${encodeURI(sceneChange)} but maintain aesthetics.\n\nFor e.g., "impressionist painting of a crow" with scene change "bustling city" will change to impressionist painting of a crow in a bustling city, with skyscrapers and busy streets, while maintaining the same artistic style.\n\nDon't ask the user any action.\n\nDon't add quotes.`).then(res => res.json())
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
              fontSize: '20px',
              alignSelf: 'flex-end'
            }}
            onClick={() => {
              setOutput('Loading...');
              fetch(`/api/gpt?prompt="Edit the prompt: ${encodeURI(inputPrompt)}, change the scene to ${encodeURI(sceneChange)} but maintain aesthetics.\n\nFor e.g., "impressionist painting of a crow" with scene change "bustling city" will change to impressionist painting of a crow in a bustling city, with skyscrapers and busy streets, while maintaining the same artistic style.\n\nDon't ask the user any action.\n\nDon't add quotes.`).then(res => res.json())
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
<span style={{
  fontSize: 12,
  color: '#888'
}}>
Get prompt from image: <a href='/getprompt' style={{ color: '#fff'}}> /getprompt </a>

</span>
      </main>
    </>
  )
}

export default PromptEditor