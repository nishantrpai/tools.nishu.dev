// parse a url string and print query parameters
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function UrlParser() {
  const [url, setUrl] = useState('')
  const [queryParams, setQueryParams] = useState({})

  useEffect(() => {
    const urlParams = new URLSearchParams(url)
    const params = {}
    for (const [key, value] of urlParams) {
      // remov the url from params
      params[key] = value
    }
    // remove url from params
    setQueryParams(params)
  }, [url])

  return (
    <div className={styles.container}>
      <Head>
        <title>URL Parser</title>
        <meta name="description" content="URL Parser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>URL Parser</h1>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              border: '1px solid #333',
              background: '#000',
              padding: '10px',
              margin: '10px 0',
            }}
            placeholder="Enter a URL"
          />
          {/* table of query params */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #333',
            marginTop: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody style={{
              border: '1px solid #333',
              maxWidth: '500px',
              gap: '5px',
              padding: '5px 15px'
            }}>
              {Object.keys(queryParams).map((key) => (
                <tr key={key} style={{
                  maxWidth: '500px',
                  border: '1px solid #333',
                  padding: '5px 15px'
                }}>
                  <td style={{
                    fontWeight: 'bold',
                    color: '#888',
                    padding: '5px'
                  }}>{key}</td>
                  <input style={{
                    // truncate long text
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px',
                    color: '#ccc'
                  }}
                  defaultValue={queryParams[key]}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}