import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [markdownText, setMarkdownText] = useState('')
  const [telegramMarkdown, setTelegramMarkdown] = useState('')
  
  const convertToTelegramMarkdown = () => {
    // Perform the conversion from Markdown to Telegram Markdown
    let result = markdownText;
    
    // Store all code blocks to prevent formatting inside them
    const codeBlocks = [];
    result = result.replace(/```([\s\S]*?)```/g, (match) => {
      codeBlocks.push(match);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });
    
    // Store all inline code to prevent formatting inside them
    const inlineCodes = [];
    result = result.replace(/`([^`]+)`/g, (match) => {
      inlineCodes.push(match);
      return `__INLINE_CODE_${inlineCodes.length - 1}__`;
    });
    
    // Handle bold: replace **text** or __text__ with *text*
    result = result.replace(/\*\*(.*?)\*\*/g, '*$1*');
    
    // Handle italic: replace *text* or _text_ with _text_
    result = result.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '_$1_');
    result = result.replace(/(?<!_)_(.*?)(?<!_)_(?!_)/g, '_$1_');
    
    // Handle strikethrough: replace ~~text~~ with ~text~
    result = result.replace(/~~(.*?)~~/g, '~$1~');
    
    // Handle underline: use __text__
    // This might conflict with bold in markdown, but in Telegram it's for underline
    result = result.replace(/__([^_]+)__/g, '__$1__');
    
    // Handle spoiler: replace ||text|| with ||text||
    result = result.replace(/\|\|(.*?)\|\|/g, '||$1||');
    
    // Handle links: replace [text](url) with text (linktext)
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '$1 $2');
    
    // Handle headers: replace # text with bold text
    result = result.replace(/^#+\s+(.*?)$/gm, '*$1*');
    
    // Handle blockquotes: keep > text for quotes in Telegram
    // Telegram supports quotes with > prefix
    
    // Restore code blocks
    codeBlocks.forEach((block, i) => {
      result = result.replace(`__CODE_BLOCK_${i}__`, block);
    });
    
    // Restore inline code
    inlineCodes.forEach((code, i) => {
      result = result.replace(`__INLINE_CODE_${i}__`, code);
    });
    
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