// one column that'll be 100% height but 200px width and will have a input at top and a list of results below

import { useEffect, useState } from "react";

const Deck = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setPage(page + 1);
    setLoading(true);
    fetch(`https://searchcaster.xyz/api/search?text=${query}&page=${page}&engagement=reactions`)
      .then(response => response.json())
      .then(data => {
        setResults([...results, ...data.casts])
      });
  }

  useEffect(() => {
    if (!query) return;
    fetch(`https://searchcaster.xyz/api/search?text=${query}&max=200&engagement=reactions`)
      .then(response => response.json())
      .then(data => {
        setResults([...results, ...data.casts])
      })
  }, [query]);
  return (
    <div style={{
      height: 'max-content',
      minHeight: '100vh',
      width: '400px',
      border: '1px solid #333',
      padding: '20px',
    }}>
      <input type="text" placeholder="Enter query" style={{
        width: '100%',
        padding: '5px 5px',
        marginBottom: '20px',
        border: 'none',
        outline: 'none',
        borderRadius: '5px',
        backgroundColor: '#222',
      }} onChange={e => {
        // wait for user to stop typing
        setTimeout(() => {
          setQuery(e.target.value)
        }, 1000)
      }} />
      {loading && !results.length <p>Loading...</p>}
      {results.map((result, index) => (
        <a key={index} style={{
          border: '1px solid #222',
          padding: '10px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          whiteSpace: 'wrap',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        href={`https://warpcast.com/${result.body.username}/${result.merkleRoot.slice(0, 10)}`}
        target="_blank"
        >
          <h2 style={{
            fontSize: '12px',
            marginBottom: '5px',
            fontWeight: '400',
            color: '#666'
          }}>{result.body.username}</h2>
          <span style={{
            fontSize: '10px',
            fontWeight: '100',
            color: '#aaa',
            marginTop: '5px',
            marginBottom: '10px',
          }}>
            {new Intl.DateTimeFormat('en-US').format(new Date(result.body.publishedAt))}
          </span>
          <p style={{
            fontSize: '12px',
            fontWeight: '400',
            color: '#888',
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >{result.body.data.text}</p>
          
        </a>

      ))}
      {results.length > 0 && 
      <div>
        <button onClick={loadMore} style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
        }}>{loading ? 'Loading...' : 'Load more'}</button>
      </div>
      }
    </div>
  )
};

export default Deck;