// generate md5, sha and other hash outputs for a given input
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
const crypto = require('crypto');

const md5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');  
}

const sha1 = (text) => {
  return crypto.createHash('sha1').update(text).digest('hex');
}

const sha256 = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const sha512 = (text) => {
  return crypto.createHash('sha512').update(text).digest('hex');
}


const EncryptDecrypt = () => {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  
  
  useEffect(() => {
    if (input) {
      // fetch the breakdown
      setOutputs({
        md5: md5(input),
        sha1: sha1(input),
        sha256: sha256(input),
        sha512: sha512(input)
      });
    }
  }
  , [input]);

  return (
    <>
      <Head>
        <title>Encrypt your text</title>
        <meta name="description" content="Encrypt text using md5, sha1, sha256, sha512." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>Encrypt your text</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Encrypt text using md5, sha1, sha256, sha512.
        </span>
        <input
          placeholder="Enter the text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            border: 'none',
            background: '#111',
            outline: 'none',
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
          }}
        />
        <div style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexWrap: 'wrap'
        }}
        >
          {Object.keys(outputs).map((key, index) => (
            <div key={index} style={{
              padding: '10px',
              borderRadius: '5px',
              width: '100%',
              margin: '10px 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              // show ... if the text is too long
              overflow: 'hidden',
            }}>
              <span>{key}</span>
              <span
                style={{
                  color: 'gray',
                  fontSize: '14px'
                }}
              >{outputs[key]}</span>
              <button
              id={`copy-${key}`}
              style={{
                color: '#ccc',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                margin: 'auto',
                marginTop: '30px',
              }}
               onClick={() => {
                navigator.clipboard.writeText(outputs[key]);
                // select this button and set it to true
                document.getElementById(`copy-${key}`).innerText = 'Copied!';
                setTimeout(() => {
                  document.getElementById(`copy-${key}`).innerText = 'Copy';
                }, 2000);
              }
              }>
                Copy
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default EncryptDecrypt