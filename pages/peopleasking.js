// Share your idea and we get relevant questions from Reddit that people are asking around that topic to refine the language.
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { RiSparklingFill } from "react-icons/ri";

const PeopleAsking = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [copy, setCopy] = useState(false);

  return (
    <>
      <Head>
        <title>People Asking</title>
        <meta name="description" content="Share your idea and we get relevant questions from Reddit that people are asking around that topic to refine the language." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>People Asking</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Share your idea and we get relevant questions from Reddit that people are asking around that topic to refine the language
        </span>
        <div style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
        }}
        >
          <div style={{
            display: 'flex',
            gap: '10px',
            width: '100%',
          }}
          >

            <input
              placeholder="Enter the idea"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              style={{
                border: 'none',
                background: '#333',
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
                  fetch(`/api/gpt?prompt="Find relevant questions from Reddit around the topic ${encodeURI(inputPrompt)} to refine the language. Don't add quotes to the questions. Include relevant questions that mean the same thing but use different words. The intention is to learn the ways people ask the same thing."`).then(res => res.json())
                    .then(data => {
                      setOutput(data.response);
                    });
                }
              }}
            />
            <button
              style={{
                background: '#d8b4fe',
                color: '#581c87',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => {
                // fetch the breakdown
                setOutput('Loading...');
                fetch(`/api/gpt?prompt="Find relevant questions from Reddit around the topic ${encodeURI(inputPrompt)} to refine the language. Don't add quotes to the questions. Include relevant questions that mean the same thing but use different words. The intention is to learn the ways people ask the same thing."`).then(res => res.json())
                  .then(data => {
                    setOutput(data.response);
                  });
              }}
            >
              <RiSparklingFill />
            </button>
          </div>
        </div>
        {output && <pre
            style={{
              background: '#333',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
              width: '100%',
              overflow: 'auto',
              maxHeight: '300px',
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap'
            }}
          >
            {output}
          </pre>}
      </main>
    </>
  )
}

export default PeopleAsking;