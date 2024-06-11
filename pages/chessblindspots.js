// find blindspots in your chess games
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'


export default function Home() {
  const [text, setText] = useState('')
  const [sensationalizedText, setSensationalizedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState(false)

  function pgnToJson(pgnText, username) {
    // remove comments and unnecessary whitespace
    pgnText = pgnText.replace(/{[^}]*}/g, '').replace(/\s+/g, ' ');

    // split each each game by [Event
    const games = pgnText.split('[Event').slice(1);
    // process each game to extract moves
    const gamesArray = games.map(gameText => {
      // find the color of the player
      const playerColor = gameText.includes(`White "${username}"`) ? 'white' : 'black';
      let gameUrl = gameText.match(/https:\/\/lichess\.org\/[a-zA-Z0-9]{6,}/);
      let result = gameText.match(/1-0|0-1|1\/2-1\/2/);
      // if i am white, and i won, i should have 1-0, if i am black and i won, i should have 0-1, if it is a draw, i should have 1/2-1/2
      let didIwin = (playerColor === 'white' && result === '1-0') || (playerColor === 'black' && result === '0-1');
      // find the moves
      const movesStart = gameText.lastIndexOf('1.');
      let movesEnd = '';
      // const movesEnd = gameText.lastIndexOf('#') ?? gameText.lastIndexOf('1-0') ?? gameText.lastIndexOf('0-1') ?? gameText.lastIndexOf('1/2-1/2');
      // find value that is not -1
      [gameText.lastIndexOf('#'), gameText.lastIndexOf('1-0'), gameText.lastIndexOf('0-1'), gameText.lastIndexOf('1/2-1/2')].forEach(index => {
        if (index !== -1) {
          movesEnd = index;
        }
      });
      let movesText = gameText.substring(movesStart, movesEnd).trim();


      return {
        moves: movesText,
        myColor: playerColor,
        result : didIwin ? 'won' : 'lost',
        gameUrl: gameUrl ? gameUrl[0] : null,
      };

    });

    return gamesArray;
  }


  const formatSensationalizedText = (text) => {
    // there might be urls in the text, so we need to replace them with a clickable link
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedText = text.replace(urlRegex, (url) => {
      // replace commas and periods at the end of the url

      url = url.replace(/[,\.]+$/, '');
      
    let gameNumber = url.match(/https:\/\/lichess\.org\/[a-zA-Z0-9]{6,}/);
    gameNumber = gameNumber ? gameNumber[0].split('/').pop() : null;

      return `<iframe src="https://lichess.org/embed/game/${gameNumber}?theme=auto&bg=auto"
width=600 height=397 frameborder=0></iframe>
`;
    }
    );
    return formattedText;
  }


  const sensationalize = async () => {
    // make api call to /api/gpt?prompt
    setLoadingText(true)
    setSensationalizedText('Fetching games...')
    fetch(`https://lichess.org/api/games/user/${text}?max=50`)
      .then(res => res.body)
      .then(body => {
        // get text and return a promise
        const reader = body.getReader();
        let text = '';
        return reader.read().then(function processText({ done, value }) {
          if (done) {
            return text;
          }
          text += new TextDecoder("utf-8").decode(value || new Uint8Array, { stream: true });
          return reader.read().then(processText);
        });

      })
      .then(async data => {
        console.log(data)
        const games = pgnToJson(data)
        // get all moves from all games
        setSensationalizedText('Fetched games. Analyzing...')
        setLoadingText(false)

        let prompt = `This is my lichess username: ${text}. Here are some of my games: ${JSON.stringify(games)}

        Based on this, give me a detailed analysis of my games. Here are some things you can do:
        1. Analyze my games and find my blindspot patterns, these are the moves I miss most often.
        2. Find the most common mistakes I make.
        3. Suggest improvements to my game.
        4. Recommend a training plan to improve my game.
        5. Analyze when I blunder and suggest ways to avoid it.
        6. Find my weak lines.
        7. Highlight my strong moves.
        8. Reference my games where I played well.
        9. Find my best games.
        10. Find my worst games.
        11. Find my most exciting games.
        12. Find my most boring games.
        13. Find my most instructive games.
        14. Be specific in your analysis, don't be vague. For e.g., you miss skewers is not good enough, show me where I missed a skewer and what the best move was.
        15. Use game urls to reference my games. For e.g., in game ${games[0].gameUrl} I missed a fork.
        16. Don't hallucinate, be accurate in your analysis.
        `


        const res = await fetch(`/api/gpt?prompt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt })
        })
        const resjson = await res.json()
        setSensationalizedText(resjson.response)
        setLoading(false)

      }).catch(err => {
        console.error(err)
        setLoadingText(false)
        setSensationalizedText('Error fetching games. Make sure you entered a valid lichess username.')
      })
    // setLoading(true)

  }

  return (
    <>
      <Head>
        <title>Chess Blindspots</title>
        <meta name="description" content="Find blindspots in your chess games" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{width: '100%', maxWidth: 600}}>
        <h1 className={styles.title}>
          Chess Blindspots
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Find blindspots in your chess games
        </span>


        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your lichess username"
          style={{
            width: '100%',
            border: '1px solid #333',
            borderRadius: 10,
            background: '#000',
            color: '#fff',
            padding: '10px',
            outline: 'none',
            fontSize: 16
          }}
        />

        <button onClick={sensationalize} className={styles.button}>
          {loading ? 'Compressing...' : 'Compress'}
        </button>

        {sensationalizedText && (
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', lineHeight: 1.5, borderRadius: 10 }}>
            {loadingText ? 'Fetching games...' : <span dangerouslySetInnerHTML={{ __html: formatSensationalizedText(sensationalizedText) }} />}
          </div>
        )}
      </main>
    </>
  )
}
