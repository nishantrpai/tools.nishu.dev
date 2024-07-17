// tweetdeck like interface with the ability to add multiple search columns, but the api calls will be to searchcaster.xyz which is a client of warpcast
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import Deck from '@/components/deck'
import { FiPlus } from 'react-icons/fi'

export default function WarpDeck() {
  const [queries, setQueries] = useState([])
  const [results, setResults] = useState([])
  const [decks, setDecks] = useState([1])
  useEffect(() => {
    queries.forEach(query => {
      // if query has username from:username add that in params
      let params = ''
      if (query.includes('from:')) {
        params = `q=${query.split('from:')[0]}&username=${query.split('from:')[1]}`
      } else {
        params = `q=${query}`
      }
      fetch(`https://searchcaster.xyz/api/search?q=${params}`)
        .then(response => response.json())
        .then(data => {
          setResults([...results, data])
        })
    })
  }, [queries])
  return (
    // search results from columns and the ability to add more columns
    <div className={styles.container}>
      <Head>
        <title>WarpDeck</title>
        <meta name="description" content="WarpDeck: A tweetdeck like interface for Warpcast" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{
        display: 'flex',
        width: '100%',
        padding: '20px',
        fontSize: '1rem',
        fontWeight: '100',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '10px'
      }}>
        <a style={{
          width: 'max-content',
          fontSize: '1rem',
        }} href='/' className={styles.home}>🏠</a>
        <h1 style={{
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>WarpDeck</h1>
      </div>
      <main style={{
        width: '100%',
        maxWidth: '100vw',
        border: '1px solid #111',
        alignItems: 'flex-start',
        padding: '0px',
        overflowX: 'scroll'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          {decks.map((deck, index) => (
            <Deck key={index} />
          ))}
          {/* {queries.map((query, index) => (
            <div key={index} style={{
              border: '1px solid red',
              width: '300px',
            }}>
              <h2>{query}</h2>
              {results[index] && results[index].map((result, i) => (
                <div key={i}>
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                </div>
              ))}
            </div>
          ))} */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            height: '100vh',
            width: '100px',
          }}>
            <button style={{
              height: '50px',
              margin: 'auto',
              border: 'none',
              background: 'none',
            }}
              onClick={() => {
                setDecks([...decks, decks.length + 1])
              }}
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
