// Ask website any question you have
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiPlus, FiGlobe } from 'react-icons/fi';

export default function AskWebsite() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  const getAnswer = () => {
    // get answer from website content

    // 4 characters is 1 token, max limit is 16k tokens
    // 16k / 4 = 4000 characters
    let tmpContent = content.slice(0, 3000);
    setChat([...chat, { question, answer: 'loading...' }]);
    fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `I will send you a website content please respond on the basis of that content. Keep the answers concise and to the point. Only answer on the content provided. This is the content of the website: \n\n${tmpContent}. \n\Based on the content and your understanding: ${question}.`,
        model: `gpt-3.5-turbo`
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        // remove loading and replace with answer
        setChat(chat.slice(0, chat.length - 1));
        setChat([...chat, { question, answer: data.response }]);
      })
  }

  const fetchContent = async () => {
    console.log('fetching content', url)
    setFetching(true)
    let proxy = 'https://api.codetabs.com/v1/proxy/?quest='
    const response = await fetch(proxy + url, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Origin': 'https://www.google.com', 
      }
    });
    const res = await response.text();
    let document = new DOMParser().parseFromString(res, 'text/html');
    // remove extra spaces and new lines
    // remove script and style tags
    // allow paragraphs
    let text = document.body.textContent;
    text = text.replace(/<script.*?<\/script>/g, '');
    text = text.replace(/<style.*?<\/style>/g, ''); 
    text = text.replace(/\s+/g, ' ');
    setContent(text);
    setFetching(false)
  };

  useEffect(() => {
    if(!url) return;
    console.log('getting content')
    fetchContent(url)
  }, [url])

  return (
    <>
      <Head>
        <title>Ask a website any question you have</title>
        <meta name="description" content="Ask a website any question you have" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center', fontFamily: 'monospace' }}><FiGlobe /> Ask Website</h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>Ask a website any question you have</h2>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }} placeholder="Paste website url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className={styles.row} style={{ gap: '20px', width: '100%' }}>
          <div style={{ flexBasis: '60%', border: '1px solid #333', height: '500px' }}>
            {fetching ? <p>Fetching content...</p> : <textarea 
              style={{ background: '#000', border: '1px solid #333', width:'100%', minWidth: '300px', height: '100%', color: '#fff' }} 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>}
          </div>
          <div style={{ flexBasis: '40%', border: '1px solid #333', height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexBasis: '92%', height: '400px', padding: '10px', overflow: 'auto' }}>
              {chat.map((item, index) => (
                <div key={index} style={{ padding: '20px 0px', borderBottom: '1px solid #333' }}>
                  <p style={{
                    color: '#ccc',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    marginBottom: '5px',
                    whiteSpace: 'pre-wrap'
                  }}>Q: {item.question}</p>
                  <p style={{
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap'
                  }}
                  >A: {item.answer}</p>
                </div>
              ))}
            </div>
            <div style={{ flexBasis: '8%', width: '100%', display: 'flex', fontSize: '12px' , boxShadow: '0px -1px 0px #333', alignItems: 'center'
          }}>
              <input style={{ flexBasis: '85%', width: '100%', height: '100%', background: '#000', border: 'none', outline: 'none', padding: '10px', fontSize: '12px' }} type="text" placeholder="Enter your question" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // if shift + enter then add new line else send message
                  if (e.shiftKey) {
                    setQuestion(question + '\n');
                    return;
                  }
                  getAnswer();
                }
              }} />
              <button style={{borderLeft: '1px solid #333 !important', flexBasis: '15%', width: '100%', height: '100%', background: '#111', outline: 'none', padding: '10px', fontSize: '12px' }} onClick={getAnswer}>Ask</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
