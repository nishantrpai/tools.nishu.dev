import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import {FiSearch} from 'react-icons/fi'


export default function Home() {

  const tools = [
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
    }
  ]
  
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
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input className={styles.search} onChange={(e) => {
            setSearch(e.target.value)
          }} placeholder="Search for tools..."></input>
        </div>
        <div className='grid'>
        {filteredTools.map((tool, index) => (
          <a key={index} className={styles.card} href={tool.url}>
            <h2>{tool.icon}</h2>
            <p>{tool.title}</p>
            <span className={styles.date}>{tool.publishDate}</span>
          </a>
        ))}
        </div>
        
      </main>
    </>
  )
}
