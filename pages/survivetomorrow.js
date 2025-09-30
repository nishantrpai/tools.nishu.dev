import Head from 'next/head';
import { useState } from 'react';

export default function SurviveTomorrow() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const checkSurvival = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gpt?prompt='Can the world survive till tomorrow? Answer with a big YES or NO only.'`);
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Survive Tomorrow</title>
        <meta name="description" content="Check if the world can survive till tomorrow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Can the world survive till tomorrow?</h1>
        <button onClick={checkSurvival}>
          {loading ? 'Checking...' : 'Check'}
        </button>
        {response && (
          <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
            {response}
          </div>
        )}
      </main>
    </>
  );
}