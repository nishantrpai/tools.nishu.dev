import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [markdownText, setMarkdownText] = useState('')
  const [telegramMarkdown, setTelegramMarkdown] = useState('')
  
  const convertToTelegramMarkdown = () => {
    // Perform the conversion from Markdown to Telegram Markdown
    let result = markdownText;
    
    // Handle bold: replace **text** or __text__ with *text*
    result = result.replace(/(\*\*|__)(.*?)(\*\*|__)/g, '*$2*');
    
    // Handle italic: replace *text* or _text_ with _text_
    result = result.replace(/(\*|_)(.*?)(\*|_)/g, '_$2_');
    
    // Handle code blocks: replace ```text``` with ```text```
    // Telegram already uses ```text``` for code blocks, so keep as is
    
    // Handle inline code: replace `text` with `text`
    // Telegram already uses `text` for inline code, so keep as is
    
    // Handle links: replace [text](url) with [text](url)
    // Telegram doesn't support markdown links in the same way, so we'll convert them to plain text
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)');
    
    // Handle headers: replace # text with bold text
    result = result.replace(/^#+\s+(.*?)$/gm, '*$1*');
    
    // Handle lists: keep as is
    
    // Handle blockquotes: replace > text with text
    result = result.replace(/^\s*>\s(.*?)$/gm, '$1');
    
    setTelegramMarkdown(result);
  }

  return (
    <>
      <Head>
        <title>Markdown to Telegram</title>
        <meta name="description" content="Convert Markdown to Telegram Markdown format" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ maxWidth: 1200, flexWrap: 'wrap', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className={styles.title}>
          Markdown to Telegram
        </h1>
        <span className={styles.description}>Convert your markdown text to Telegram markdown format</span>

        <div  style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%', margin: 'auto', alignContent: 'center', justifyContent: 'center' }}>
            <textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              cols={50}
              style={{ height: 500, width: 400 }}
              placeholder="Paste your Markdown here"
              className={styles.textarea}
            />
            <textarea
              value={telegramMarkdown}
              cols={50}
              style={{ height: 500, width: 400 }}
              readOnly
              placeholder="Telegram Markdown will appear here"
              className={styles.textarea}
            />
        </div>

        <button onClick={convertToTelegramMarkdown} className={styles.button}>
          Convert to Telegram Markdown
        </button>
      </main>
    </>
  )
}