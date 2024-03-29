// user will input food and get the breakdown of the food in terms of protein, carbs, and fats from gpt api
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


const FoodBreakdown = () => {
  const [food, setFood] = useState('');
  const [breakdown, setBreakdown] = useState('');


  return (
    <>
      <Head>
        <title>Food Breakdown</title>
        <meta name="description" content="Get the breakdown of food in terms of protein, carbs, and fats." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>Food Breakdown</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Get the breakdown of food in terms of protein, carbs, and fats.
          Enter the food, press enter and see the magic happen.
          <br/>
          <br/>

          PS: This tool uses the GPT-3.5-turbo model from OpenAI. Might not be accurate.
        </span>
        <input
          placeholder="Enter the food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          style={{
            border: 'none',
            background: '#333',
            outline: 'none',
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              // fetch the breakdown
              setBreakdown('Loading...');
              fetch(`/api/gpt?prompt=${encodeURI(`Get the breakdown of ${food} in a list of protein, carbs, and fats and other nutrients if possible.
              . Don't add any prefixes. Add \n(newline) after each nutrient. For e.g., Proteins: 5g\n Carbs: 20g. If there are multiple tell the aggregate, don't mention which food just tell the overall 
          .`)}`).then(res => res.json())
                .then(data => {
                  setBreakdown(data.response);
                });
            }
          }}
        />
        {breakdown && <pre
          style={{
            background: '#111',
            color: '#eee',
            padding: '10px',
            borderRadius: '5px',
            width: '100%',
            whiteSpace: 'pre-wrap',
            marginTop: '10px'
          
          }}
        >{breakdown}</pre>}
      </main>
    </>
  )
}

export default FoodBreakdown;