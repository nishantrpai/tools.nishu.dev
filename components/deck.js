import { useEffect, useState } from "react";

const Deck = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);

  const loadMore = () => {
    setPage(page + 1);
    setLoading(true);
    fetch(`https://searchcaster.xyz/api/search?text=${query}&page=${page}&engagement=reactions`)
      .then(response => response.json())
      .then(data => {
        setResults([...results, ...data.casts]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    let params = '';
    if (query.includes('from:')) {
      params = `q=${query.split('from:')[0]}&username=${query.split('from:')[1]}`;
    } else {
      params = `q=${query}`;
    }

    fetch(`https://searchcaster.xyz/api/search?${params}`)
      .then(response => response.json())
      .then(data => {
        setResults(data.casts);
        setLoading(false);
      });
  }, [query]);

  const handleInputChange = (e) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newQuery = e.target.value;
    setTypingTimeout(setTimeout(() => {
      setQuery(newQuery);
      setPage(1);
      setResults([]);
    }, 2000));
  };

  return (
    <div style={{
      height: 'max-content',
      minHeight: '100vh',
      width: '200px',
      border: '1px solid #333',
      padding: '20px',
    }}>
      <input
        type="text"
        placeholder="Enter query"
        style={{
          width: '100%',
          padding: '5px 5px',
          marginBottom: '20px',
          border: 'none',
          outline: 'none',
          borderRadius: '5px',
          backgroundColor: '#222',
        }}
        onChange={handleInputChange}
      />
      {(loading && !results.length) ? <p
        style={{
          fontSize: '12px',
          fontWeight: '400',
          color: '#888',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >Loading...</p> : null}
      {results.map((result, index) => (
        <a
          key={index}
          style={{
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
            color: '#666',
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
          }}>
            {result.body.data.text}
          </p>
        </a>
      ))}
      {results.length > 0 && (
        <div>
          <button
            onClick={loadMore}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#111',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Deck;
