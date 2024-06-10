// copy a website and change text in the new website
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const CopyWebsite = () => {
  const [url, setUrl] = useState('')
  const [htmlContent, setHtml] = useState('')
  async function fetchAndInlineAll(url) {
    try {
      // Fetch the initial HTML
      let proxy = 'https://api.codetabs.com/v1/proxy/?quest='
      const response = await fetch(proxy + url, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Origin': 'https://www.google.com', 
        }
      });
      const res = await response.text();
      console.log(res)
      setHtml(res)
  
      // Inline CSS
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
      for (let link of styleSheets) {
        const cssResponse = await fetch(link.href);
        const cssText = await cssResponse.text();
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
        link.remove(); // Remove the original link element
      }
  
      // Inline JavaScript
      const scripts = document.querySelectorAll('script[src]');
      for (let script of scripts) {
        const scriptResponse = await fetch(script.src);
        const scriptText = await scriptResponse.text();
        const inlineScript = document.createElement('script');
        inlineScript.textContent = scriptText;
        document.body.appendChild(inlineScript);
        script.remove(); // Remove the original script element
      }
  
      // Output the modified HTML as a single file
      // return dom.serialize();
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }
  
  useEffect(() => {
    // fetch the website as html css and js
    if(!url) return
    
    fetchAndInlineAll(url).then(html => {
      setHtml(html)
    })

  }, [url])
  return(
    <>
      <main style={{
        border: '1px solid #111',
      }} className={styles.main}>

      <input type="text" placeholder="Enter URL" style={{
        width: '100%',
        padding: '5px 5px',
        marginBottom: '20px',
        border: 'none',
        outline: 'none',
        borderRadius: '5px',
        backgroundColor: '#222',
      }} onChange={e => {
        setUrl(e.target.value)
      }} />
      <span>
        {JSON.stringify(htmlContent)}
      </span>
      {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
      </main>
      
    </>
  )
}

export default CopyWebsite
