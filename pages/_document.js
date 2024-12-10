import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* to the bottom add twitter hand */}
        <div style={{
          position: 'fixed',
          bottom: '0px',
          right: '0px',
          color: '#eee',
          fontSize: '14px',
          border: '1px solid #333',
          borderRadius: '5px 0px 0px 0px',
          background: '#000',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <a href="https://twitter.com/PaiNishant" target="_blank" style={{
            display: 'flex',
            gap: 5,
            alignContent: 'center'
          }}>
            <img src="https://abs.twimg.com/favicons/twitter.3.ico" style={{
              width: 20,
              height: 20,
              borderRadius: 20
            }}/>
             @PaiNishant
          </a>

          <a href="https://warpcast.com/nishu" target="_blank" style={{
            display: 'flex',
            gap: 5,
            alignContent: 'center'
          }}>
            <img src="https://warpcast.com/favicon.png" style={{
              width: 20,
              height: 20,
              borderRadius: 20
            }}/>
            @nishu
          </a>

        </div>
      </body>
    </Html>
  )
}
