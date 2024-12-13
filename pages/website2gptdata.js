// Website content to text file
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiPlus, FiGlobe, FiDownload } from 'react-icons/fi';

export default function Website2GPTData() {
  const [urls, setUrls] = useState(['']); // Array of URLs
  const [contents, setContents] = useState({}); // Map of URL to content
  const [fetching, setFetching] = useState(false);

  const addUrlInput = () => {
    setUrls([...urls, '']);
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const fetchContent = async (url) => {
    console.log('fetching content', url)
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
    let text = document.body.textContent;
    text = text.replace(/<script.*?<\/script>/g, '');
    text = text.replace(/<style.*?<\/style>/g, ''); 
    text = text.replace(/\s+/g, ' ');
    return text;
  };

  const fetchAllContent = async () => {
    setFetching(true);
    const newContents = {};
    for (let url of urls) {
      if (url) {
        try {
          newContents[url] = await fetchContent(url);
        } catch (err) {
          newContents[url] = `Error fetching ${url}: ${err.message}`;
        }
      }
    }
    setContents(newContents);
    setFetching(false);
  };

  const downloadContent = () => {
    const text = Object.entries(contents)
      .map(([url, content]) => (
        `URL: ${url}\n\n` +
        `Content:\n${content}\n\n` +
        `---\n\n`
      ))
      .join('');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-contents.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>Website to GPT Data</title>
        <meta name="description" content="Convert website content to GPT training data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{  }}>
        <h1 style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          alignContent: 'center', 
          fontFamily: 'monospace' 
        }}>
          <FiGlobe /> Website to GPT Data
        </h1>
        <h2 style={{ 
          fontFamily: 'monospace', 
          fontSize: 12, 
          fontWeight: 200, 
          color: '#888', 
          marginBottom: '20px' 
        }}>
          Convert multiple websites into a text file for GPT training
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', width: '100%' }}>
          {urls.map((url, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              width: '100%', 
              border: '1px solid #333', 
              borderRadius: '5px' 
            }}>
              <input 
                type="text" 
                style={{ 
                  flexBasis: '100%', 
                  padding: '10px', 
                  border: 'none', 
                  outline: 'none', 
                  background: 'none', 
                  color: '#fff' 
                }}
                placeholder="Paste website url" 
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
              />
            </div>
          ))}
          <button 
            onClick={addUrlInput}
            style={{ 
              padding: '10px', 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: '5px', 
              color: '#fff', 
              cursor: 'pointer' 
            }}
          >
            <FiPlus /> Add Another URL
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={fetchAllContent}
            disabled={fetching}
            style={{ 
              padding: '10px', 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: '5px', 
              color: '#fff', 
              cursor: 'pointer', 
              flex: 1 
            }}
          >
            {fetching ? 'Fetching...' : 'Fetch'}
          </button>
          <button 
            onClick={downloadContent}
            disabled={Object.keys(contents).length === 0}
            style={{ 
              display: 'flex',
              gap: '10px',
              padding: '10px', 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: '5px', 
              color: '#fff', 
              cursor: 'pointer', 
              flex: 1 
            }}
          >
            <FiDownload /> Download
          </button>
        </div>

        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '5px', width: '100%' }}>
          <h3 style={{ fontFamily: 'monospace', marginBottom: '10px', color: '#ccc' }}>Preview:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#fff', fontSize: '12px' }}>
            {Object.entries(contents).map(([url, content]) => (
              `URL: ${url}\n\n` +
              `Content: ${content.slice(0, 50)}...\n\n`
            ))}
          </pre>
        </div>
      </main>
    </>
  )
}
