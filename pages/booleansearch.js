import Head from 'next/head'
import styles from '@/styles/Tool.module.css'
import { useState } from 'react'

const Tool = () => {
  let tool = {
    title: '🔍 Boolean Search',
    description: 'Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find. The format will verb + noun',
    publishDate: '26th March 2024',
  };
  const [query, setQuery] = useState('');
  return (
    <>
    <Head>
      <title>Boolean Search</title>
      <meta name="description" content="Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      {/* add home button to top left */}
      <a href='/' className={styles.home}>🏠</a>
      <h1>{tool.title}</h1>
      <span className={styles.date}>{tool.publishDate}</span>

      <div className={styles.col}>
        <p className={styles.title}>Generate a boolean search query that signals:</p>
        <input placeholder='Write the words for e.g., reactjs hiring and press enter' className={styles.search}
          onKeyDown={(e) => {
            // if enter press 
            if (e.keyCode === 13) {
              // make api call to /gpt and set query
              setQuery('Loading...');
              fetch('/api/gpt', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  prompt: `Generate a boolean search query that signals ${e.target.value}, the format will be verb + noun. Should be all verb and noun that help in signal. For e.g., ("announce" OR "announcing") AND ("seed round" OR "funding"). Only return the boolean search query and nothing else.`,
                  model: 'gpt-4o-mini'
                })
              }).then(res => res.json())
                .then(data => {
                  let query = data.response;
                  // remove . from the end of the query
                  if (query.endsWith('.')) {
                    query = query.slice(0, -1);
                  }
                  setQuery(query);
                });
            }
          }}
        ></input>

        {(query) && <div className={styles.col}>
          <code>
            {query}
          </code>
          {query !== 'Loading...' &&
            <button className={styles.copy} onClick={() => {
              // copy query to clipboard
              navigator.clipboard.writeText(query);
              // set button text to copied
              let button = document.querySelector(`.${styles.copy}`);
              button.innerText = 'Copied';
              setTimeout(() => {
                button.innerText = 'Copy';
              }, 2000);
            }}>
              Copy
            </button>
          }
        </div>}

      </div>
    </main>
    </>
  );
}

export default Tool;