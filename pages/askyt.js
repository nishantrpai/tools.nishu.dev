// ask youtube video any question you have
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiPlus, FiYoutube } from 'react-icons/fi';


export default function AskYT() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const getAnswer = () => {
    // get answer from youtube video transcript

    // 4 characters is 1 token, max limit is 16k tokens
    // 16k / 4 = 4000 characters
    let tmptranscript = transcript.slice(0, 3000);
    setChat([...chat, { question, answer: 'loading...' }]);
    fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `I will send you a transcript please respond on the basis of that transcript. Keep the answers concise and to the point. Only answer on the transcript provided. This is the transcript of the youtube video: \n\n${tmptranscript}. \n\Based on the transcript and your understanding: ${question}.`,
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

  const getYoutubeVideo = (url) => {
    const videoId = url.split('v=')[1];
    // get youtube video transcript 
    fetch(`https://vid.puffyan.us/api/v1/captions/${videoId}?label=English%20(auto-generated)&hmac_key=7d08353429cc95b7e8c8a56e5407b31d727a41ee`)
      .then(res => res.text())
      .then(data => {
        console.log(data);
        setTranscript(data);
      })
  }

  useEffect(() => {
    if(!url) return;
    console.log('getting transcript')
    getYoutubeVideo(url)
  }, [url])

  return (
    <>
      <Head>
        <title>Ask a youtube video any question you have</title>
        <meta name="description" content="Ask a youtube video any question you have" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center', fontFamily: 'monospace' }}><FiYoutube /> Ask YT</h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>Ask a youtube video any question you have</h2>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }} placeholder="Paste youtube video url" value={url} onChange={(e) => setUrl(e.target.value)} />
          {/* <button style={{ borderLeft: '1px solid #333 !important', background: 'none', borderRadius: 'initial', flexBasis: '5%' }} onClick={() => getYoutubeVideo(url)}>
            <FiPlus />
          </button> */}
        </div>
        <div className={styles.row} style={{ gap: '20px', width: '100%' }}>
          {/* youtube video on one side and chat on other */}
          <div style={{ flexBasis: '60%', border: '1px solid #333', height: '500px' }}>
            {/* embed video */}
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${url.split('v=')[1]}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div style={{ flexBasis: '40%', border: '1px solid #333', height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexBasis: '92%', height: '400px', padding: '10px', overflow: 'auto' }}>
              {chat.map((item, index) => (
                <div key={index} style={{ padding: '20px 0px', borderBottom: '1px solid #333' }}>
                  <p style={{
                    color: '#ccc',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    marginBottom: '5px'
                  }}>Q: {item.question}</p>
                  <p style={{
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                  >A: {item.answer}</p>
                </div>
              ))}
            </div>
            <div style={{ flexBasis: '8%', width: '100%', display: 'flex', fontSize: '12px' , boxShadow: '0px -1px 0px #333'
          }}>
              <input style={{ flexBasis: '85%', width: '100%', height: '100%', background: '#111', border: 'none', outline: 'none', padding: '10px', fontSize: '12px' }} type="text" placeholder="Enter your question" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => {
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
