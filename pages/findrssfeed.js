// Find RSS feed for any website
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiRss } from 'react-icons/fi';

export default function FindRSSFeed() {
  const [url, setUrl] = useState('');
  const [rssFeeds, setRssFeeds] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchRSSFeed = async () => {
    console.log('fetching RSS feed', url)
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
    let rssLinks = Array.from(document.querySelectorAll('link[type="application/rss+xml"]'));
    console.log('rssLinks', rssLinks)
    // make all urls relative url 
    rssLinks = rssLinks.map(link => {
      let href = link.href;
      let urlObj = new URL(href);
      console.log('urlObj', urlObj)
      return { href: urlObj.pathname };
    })
    console.log('rssLinks', rssLinks)
      const rssRegex = /<link[^>]+href=["'][^"']*\.rss["'][^>]*>|<a[^>]+href=["'][^"']*\.rss["'][^>]*>|<link[^>]+href=["'][^"']*\/rss["'][^>]*>|<a[^>]+href=["'][^"']*\/rss["'][^>]*>|<a[^>]+href=["'][^"']*rss["'][^>]*>/g;
      const matches = res.match(rssRegex);
      if (matches && matches.length > 0) {
        const hrefRegex = /href=["']([^"']+)["']/;
        for (let match of matches) {
          const hrefMatch = match.match(hrefRegex);
          if (hrefMatch && hrefMatch[1]) {
            let href = hrefMatch[1];
            console.log('href', href)
            if (href.startsWith('/')) {
              console.log('relative url', href, url)
              const urlObj = new URL(url);
              href = `${urlObj.origin}${href}`;
            }
            console.log('absolute url', href)
            rssLinks.push({ href: href });
          }
        }
      }
  

    console.log('rssLinks', rssLinks)
    if (rssLinks.length > 0) {
      rssLinks.forEach(link => {
        // if relative url, make it absolute
        // if using current url, replace with the url url
        console.log('link', link.href)
        if (link.href.startsWith('/')) {
          link.href = `${url}${link.href}`;
          // add https:// to the beginning of the url
          link.href = `https://${link.href}`;
        }
      })
      setRssFeeds(rssLinks.map(link => link.href));
    } else {
      setRssFeeds(['No RSS feed found']);
    }
    setFetching(false)
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!url) return;
      console.log('getting RSS feed')
      fetchRSSFeed(url)
    }, 500); // wait for 500ms after user stops typing

    return () => clearTimeout(timeoutId); // clear timeout if user types again
  }, [url])

  return (
    <>
      <Head>
        <title>Find RSS feed for any website</title>
        <meta name="description" content="Find RSS feed for any website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center', fontFamily: 'monospace' }}><FiRss /> Find RSS Feed</h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>Find RSS feed for any website</h2>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff', fontSize: 20 }} placeholder="Paste website url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className={styles.row} style={{ gap: '20px', width: '100%' }}>
          <div style={{ flexBasis: '100%', height: '500px', display: 'flex', flexDirection: 'column', fontSize: 20 }}>
            <div style={{ flexBasis: '92%', height: '400px', padding: '10px', overflow: 'auto' }}>
              {fetching ? <p>Fetching RSS feed...</p> : rssFeeds.map((feed, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: 20 }}>
                  <p style={{ color: '#fff', flexBasis: '95%', fontFamily: 'monospace', fontSize: '20px', whiteSpace: 'pre-wrap', marginRight: '10px' }}>{feed}</p>
                  <button 
                    style={{ fontSize: '20px', padding: '5px', cursor: 'pointer' }} 
                    onClick={() => {
                      navigator.clipboard.writeText(feed);
                      const button = document.getElementById(`copy-button-${index}`);
                      button.innerText = 'Copied!';
                      setTimeout(() => {
                        button.innerText = 'Copy';
                      }, 1000);
                    }}
                    id={`copy-button-${index}`}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}