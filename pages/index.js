import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'


export const tools = [
  {
    title: 'Boolean Search',
    description: 'Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find.',
    publishDate: '26th March 2024',
    icon: '🔍',
    url: '/booleansearch'
  },
  {
    title: 'Day Difference Calculator',
    description: 'Calculate the difference between two dates in days.',
    publishDate: '27th March 2024',
    icon: '⏳',
    url: '/daydiff'
  },
  {
    title: 'NFT v/s NFT',
    description: 'Compare two NFTs side by side.',
    publishDate: '28th March 2024',
    icon: '🖼️/🖼️',
    url: '/nftcompare'
  },
  {
    title: 'Voice to Text',
    description: 'Convert your voice to text.',
    publishDate: '29th March 2024',
    icon: '🎤',
    url: '/voice2txt'
  },
  {
    title: 'Food Breakdown',
    description: 'Get the breakdown of food in terms of protein, carbs, and fats.',
    publishDate: '30th March 2024',
    icon: '🍔',
    url: '/foodbreakdown'
  },
  {
    title: 'Draw',
    description: 'Simple tool for drawing and copying that image to clipboard',
    publishDate: '31st March 2024',
    icon: '✏️',
    url: '/draw'
  },
  {
    title: 'QR Code Generator',
    description: 'Generate QR code for any text.',
    publishDate: '1st April 2024',
    icon: '🔲',
    url: '/qrcode'
  },
  {
    title: 'Prompt Enhancer',
    description: 'Enhance your image prompt with more details.',
    publishDate: '2nd April 2024',
    icon: '🖼️',
    url: '/promptenhancer'
  },
  {
    title: 'What Are People Asking',
    description: 'What are people asking on the internet for your idea.',
    publishDate: '3rd April 2024',
    icon: '❓',
    url: '/peopleasking'
  },
  {
    title: 'Encrypt',
    description: 'Encrypt text using MD5, SHA1, SHA256, SHA512.',
    publishDate: '4th April 2024',
    icon: '🔐',
    url: '/encrypt'
  },
  {
    title: 'Website speed',
    description: 'Check the speed of a website.',
    publishDate: '5th April 2024',
    icon: '🚀',
    url: '/websitespeed'
  },
  {
    title: 'Multiplayer Drawing',
    description: 'Draw with your friends in real-time.',
    publishDate: '6th April 2024',
    icon: '🎨',
    url: '/multidraw'
  },
  {
    title: 'Simple Timer',
    description: 'Set a timer for your tasks.',
    publishDate: '7th April 2024',
    icon: '⏱️',
    url: '/timer'
  },
  {
    title: 'Random Number Generator',
    description: 'Generate random numbers.',
    publishDate: '8th April 2024',
    icon: '🎲',
    url: '/random'
  },
  {
    title: 'Workout for each muscle',
    description: 'Get a workout for each muscle in your body.',
    publishDate: '9th April 2024',
    icon: '💪',
    url: '/workout'
  },
  {
    title: 'Tweetdeck for Warpcast',
    description: 'Tweetdeck for Warpcast',
    publishDate: '10th April 2024',
    icon: '📁',
    url: '/warpdeck',
    publishDate: '10th April 2024',
  },
  {
    title: 'What time is it right now in ___',
    description: 'Get the current time in any city.',
    publishDate: '11th April 2024',
    icon: '⏰',
    url: '/whattime'
  },
  {
    title: 'Text to Speech',
    description: 'Convert text to speech.',
    publishDate: '12th April 2024',
    icon: '🔊',
    url: '/tts'
  },
  {
    title: 'Voice to Todo List',
    description: 'Convert your voice to a todo list.',
    publishDate: '13th April 2024',
    icon: '🗒️',
    url: '/voicetodo'
  },
  {
    title: 'WarpSpaces',
    description: 'WarpSpaces: Twitter Spaces for Warpcast',
    publishDate: '14th April 2024',
    icon: '🎤',
    url: '/warpspaces'
  },
  {
    title: 'Pick random winner from a list',
    description: 'Pick a random winner from a list of names.',
    publishDate: '15th April 2024',
    icon: '🎉',
    url: '/randomwinner'
  },
  {
    title: 'WarpCanvas',
    description: 'WarpCanvas: Draw with your friends in real-time.',
    publishDate: '16th April 2024',
    icon: '🎨',
    url: '/warpcanvas'
  },
  {
    title: 'Higher',
    description: 'Add "↑" on any image',
    publishDate: '17th April 2024',
    url: '/higher',
    icon: '↑',
  },
  {
    title: 'Rep Aloud',
    description: 'Tell reps aloud',
    publishDate: '18th April 2024',
    url: '/repaloud',
    icon: '🔊',
  },
  {
    title: 'Infinite Canvas',
    description: 'Browse the internet on an infinite canvas',
    publishDate: '19th April 2024',
    url: '/infinitecanvas',
    icon: '🌐',
  },
  {
    title: 'Duplicate Photos',
    description: 'Duplicate your photos 100s or 1000s of times',
    publishDate: '20th April 2024',
    url: '/duplicatephotos',
    icon: '📸',
  },
  {
    title: 'Voice to Emoji style voiceover',
    description: 'Convert your voice to emoji style voiceover',
    publishDate: '22nd April 2024',
    url: '/voicetoemoji',
    icon: '🎤',
  },
  {
    title: 'Interval Timer',
    description: 'Set a fixed timer and beeps at different intervals',
    publishDate: '23rd April 2024',
    url: '/intervaltimer',
    icon: '🔊',
  },
  {
    title: 'NFT Music Player',
    description: 'Play music from NFTs',
    publishDate: '24th April 2024',
    url: '/mus1c',
    icon: '🎵',
  },
  {
    title: 'Blend layer onto image',
    description: 'Blend a layer onto an image',
    publishDate: '25th April 2024',
    url: '/blend',
    icon: '🎨',
  },
  {
    title: 'Bulk blend layer onto image',
    description: 'Bulk blend a layer onto images',
    publishDate: '26th April 2024',
    url: '/bulkblend',
    icon: '🎨',
  },
  {
    title: 'Reframe a sentence',
    description: 'Reframe a sentence to paint the picture you want',
    publishDate: '27th April 2024',
    url: '/reframe',
    icon: '🖼️',
  },
  {
    title: 'Know your farcaster',
    description: 'Know your farcaster',
    publishDate: '28th April 2024',
    url: '/kyf',
    icon: '🧑'
  },
  {
    title: 'Idea to problem',
    description: 'Find problems that are solved with your idea',
    publishDate: '29th April 2024',
    url: '/idea2problem',
    icon: '❓'
  },
  {
    title: 'Similar Phrases',
    description: 'Find similar phrases to your phrase',
    publishDate: '30th April 2024',
    url: '/similarphrases',
    icon: '🔍'
  },
  {
    title: 'Sensationalize',
    description: 'Sensationalize your text',
    publishDate: '1st May 2024',
    url: '/sensationalize',
    icon: '🔥',
  },
  {

    title: 'Ask youtube video',
    description: 'Ask questions in a youtube video',
    publishDate: '2nd May 2024',
    url: '/askyt',
    icon: '🎥',
  },
  {
    title: 'Valid email',
    description: 'Check if an email is valid',
    publishDate: '3rd May 2024',
    url: '/validemail',
  },
  {
    title: 'Poll Best Time',
    description: 'Poll your friends for the best time for an event',
    publishDate: '4th May 2024',
    url: '/besttime',
  },
  {
    title: 'Compress Text',
    description: 'Make your text precise and concise',
    publishDate: '6th May 2024',
    url: '/compresstext',
  },
  {
    title: 'AI Canvas',
    description: 'Draw with AI, save aesthetics and style',
    publishDate: '8th May 2024',
    url: '/aicanvas',
  },
  {
    title: 'Grade Text',
    description: 'Grade your text based on readability',
    publishDate: '8th May 2024',
    url: '/gradetext',
  },
  {
    title: 'Flex NFT',
    description: 'Flex your NFTs',
    publishDate: '9th May 2024',
    url: '/flexnft',
  },
  {
    title: 'NFT Tier List',
    description: 'Create a tier list of NFTs',
    publishDate: '10th May 2024',
    url: '/nfttierlist',
  },
  {
    title: 'Lovecaster',
    description: 'Find love on warpcast',
    publishDate: '11th May 2024',
    url: '/lovecaster',
  },
  {
    title: 'Read Smart Contract',
    description: 'Read a smart contract, regardless of whether it is verified or not',
    publishDate: '13th May 2024',
    url: '/readsc',
  },
  {
    title: 'Get ideas from subreddit',
    description: 'Get frequently asked questions from a subreddit',
    publishDate: '14th May 2024',
    url: '/subredditideas',
  },
  {
    title: 'Is there a tool for that',
    description: 'Find tools for your idea',
    publishDate: '17th May 2024',
    url: '/isthereatool',
  },
  {
    title: 'Is it gpt?',
    description: 'Check if a text is generated by gpt',
    publishDate: '18th May 2024',
    url: '/isitgpt',
  },
  {
    title: 'Word for',
    description: 'Find words for a given word',
    publishDate: '19th May 2024',
    url: '/wordfor',
  },
  {
    title: 'Extract Images from PDF/DOCX/PPTX',
    description: 'Extract images from PDF/DOCX/PPTX',
    publishDate: '20th May 2024',
    url: '/extractimages',
  }
  // {
  //   title: 'Elaborate',
  //   description: 'Elaborate on your text to provide more context',
  //   publishDate: '17th May 2024',
  //   url: '/elaborate',
  // }
  // {
  //   title: 'Best Time',
  //   description: 'Pick the best time for you and your friends across timezones',
  //   publishDate: '3rd May 2024',
  //   url: '/besttime',
  //   icon: '🕒',
  // }
  // {
  //   title: 'Face Swap',
  //   description: 'Swap faces in gifs',
  //   publishDate: '1st May 2024',
  //   url: '/faceswap',
  //   icon: '👥'
  // }

]

export default function Home() {


  const [search, setSearch] = useState('')
  const [filteredTools, setFilteredTools] = useState(tools)

  useEffect(() => {
    setFilteredTools(tools.filter(tool => tool.title.toLowerCase().includes(search.toLowerCase()) || tool.description.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  return (
    <>
      <Head>
        <title>Tools by Nishu</title>
        <meta name="description" content="tools.nishu.dev" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* <input className={styles.search} onChange={(e) => {
          setSearch(e.target.value)
        }}>
        </input> */}
        {/* create an input with search icon */}
        {/* add twitter at the top */}
        <a href='https://twitter.com/PaiNishant' style={{
          top: '10px',
          right: '10px',
          color: '#888',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '10px',
        }}
          target='_blank'
        >
          @PaiNishant
        </a>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input className={styles.search} onChange={(e) => {
            setSearch(e.target.value)
          }} placeholder="Search for tools..."></input>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', marginBottom: 30 }}>
          {filteredTools.map((tool, index) => (
            <a key={index} href={tool.url}>
              <p style={{
                fontSize: '1rem',
                color: '#eee',
                marginBottom: '10px',
              }}>{tool.title}</p>
              <p style={{
                fontSize: '0.8rem',
                display: 'flex',
                color: '#888',
                marginBottom: '10px',
              }}>{tool.description}</p>
              <span className={styles.date}>{tool.publishDate}</span>
            </a>
          ))}
        </div>

      </main>
    </>
  )
}
