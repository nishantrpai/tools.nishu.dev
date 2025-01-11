import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/router'

export const tools = [
  {
    "title": "Higher",
    "description": "Add \"↑\" on any image",
    "publishDate": "17th April 2024",
    "url": "/higherarrow",
    "icon": "↑",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Hat",
    "description": "Add \"↑\" hat on any image",
    "publishDate": "20th June 2024",
    "url": "/higherhat",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Pilled",
    "description": "Add higher eyes on any image",
    "publishDate": "4th July 2024",
    "url": "/higherpilled",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Scanner",
    "description": "Add Higher Scanner on any image",
    "publishDate": "8th July 2024",
    "url": "/higherscanner",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher TM",
    "description": "Add Higher TM on any image",
    "publishDate": "16th July 2024",
    "url": "/highertm",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Banner",
    "description": "Make your own higher banner",
    "publishDate": "17th July 2024",
    "url": "/higherbanner",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Gifs",
    "description": "Make your gifs higher",
    "publishDate": "25th July 2024",
    "url": "/highergifs",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Athletics",
    "description": "Create higher athletics poster",
    "publishDate": "15th Aug 2024",
    "url": "/higherathletics",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "HigherFM",
    "description": "Add higherfm on any image",
    "publishDate": "6th Sep 2024",
    "url": "/higherfm",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Confessions",
    "description": "Generate higher confessions",
    "publishDate": "13th Sep 2024",
    "url": "/higherconfessions",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Filters",
    "description": "Apply higher filter to your image",
    "publishDate": "18th Oct 2024",
    "url": "/higherfilter",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Filter Gif",
    "description": "Apply higher filter to your gif",
    "publishDate": "23th Oct 2024",
    "url": "/higherfiltergif",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Gradient",
    "description": "Add higher gradient filter on any image",
    "publishDate": "28th Oct 2024",
    "url": "/highergradient",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Italic",
    "description": "Add higher italic on any image",
    "publishDate": "7th Nov 2024",
    "url": "/higheritalic",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Glasses",
    "description": "Add higher glasses on any image",
    "publishDate": "8th Dec 2024",
    "url": "/higherglasses",
    "tags": [
      "higher"
    ]
  },
  {
    "title": "Higher Italic Video",
    "description": "Add higher italic video to any video",
    "publishDate": "10th Dec 2024",
    "url": "/higheritalicvideo",
    "tags": [
      "higher"
    ]
  }
]

export default function Home() {
  const router = useRouter();
  const { tags = 'higher' } = router.query; // Get tags from query params
  const [search, setSearch] = useState('')
  const [filteredTools, setFilteredTools] = useState(tools)

  useEffect(() => {
    const tagArray = tags ? tags.split(',') : []; // Split tags into an array
    setFilteredTools(tools.filter(tool =>
      (tool.title.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())) &&
      (tagArray.length === 0 || tagArray.some(tag => tool.tags.includes(tag)))
    ).reverse());  // reverse to show latest first
  }, [search, tags]) // Add tags to dependency array

  return (
    <>
      <Head>
        <title>Higher Tools</title>
        <meta name="description" content="Higher tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
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
          }} placeholder="Search for tools... for e.g., 'nft'" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', marginBottom: 30 }}>
          {filteredTools.map((tool, index) => (
            <a key={index} href={tool.url}>
              <p style={{
                fontSize: '1rem',
                color: '#eee',
                marginBottom: '10px',
              }}>{filteredTools.length - (index + 1)}. {tool.title}</p>
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
