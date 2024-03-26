import styles from '@/styles/Tool.module.css'
import { useState } from 'react'

const Tool = () => {
  let tool = {
    title: '🔍 Boolean Search',
    description: 'Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find.',
    publishDate: '26th March 2024',
  };
  const [query, setQuery] = useState('');
  return (
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
              fetch(`/api/gpt?prompt=${encodeURI(`Generate a boolean search query that signals ${e.target.value}`)}`).then(res => res.json())
                .then(data => {
                  let query = data.response;
                  // remove . from the end of the query
                  if (query.endsWith('.')) {
                    query = query.slice(0, -1);
                  }
                  setQuery(data.response);
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
  );
}

export default Tool;