import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://visitoralerts.com/tracker.js"></script>
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
          flexDirection: 'row',
          alignContent: 'center',
          gap: 20
        }}>
          


          <a href="https://twitter.com/PaiNishant" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/twitter.3.ico" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>

          <a href="https://linkedin.com/in/nishantrpai" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/linkedin.ico" style={{
              width: 25,
              height: 25,
              borderRadius: 0
            }}/>
          </a>

        </div>
        <script dangerouslySetInnerHTML={{
          __html: `if(window.navigator.webdriver){
            document.body.innerHTML = '<h1 style="color:red; text-align:center; margin-top:20%;">Access Denied</h1>';
          }`
        }} />
      </body>
    </Html>
  )
}
