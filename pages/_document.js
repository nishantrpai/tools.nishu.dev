import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* to the bottom add twitter hand */}
        <div style={{
          position: 'fixed',
          bottom: '0px',
          right: '0px',
          color: '#888',
          fontSize: '18px',
          border: '1px solid #333',
          borderRadius: '5px 0px 0px 0px',
          background: '#000',
          padding: '10px 20px',
        }}>
          <a href="https://twitter.com/PaiNishant" target="_blank">
            @PaiNishant
          </a>
        </div>
      </body>
    </Html>
  )
}
