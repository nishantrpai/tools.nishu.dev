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
          flexDirection: 'row',
          alignContent: 'center',
          gap: 20
        }}>
          <a href="https://etherscan.io/address/0x5A8064F8249D079f02bfb688f4AA86B6b2C65359" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/ethereum-eth-logo.svg" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>
          <a href="https://www.blockchain.com/explorer/addresses/btc/BC1QD3ADA3NSL86FR33YTJL372QH63HX9R0APULGLE" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/bitcoin-btc-logo.svg" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>
          <a href="https://explorer.solana.com/address/9dPN7gdN9cyGhjiQn5gBU9DQDBxUJafvS873BcW3mpFT" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/solana-sol-logo.svg" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>

          <a href="https://twitter.com/PaiNishant" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/twitter.3.ico" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>

          <a href="https://warpcast.com/nishu" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="/farcaster.png" style={{
              width: 25,
              height: 25,
              borderRadius: 20
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
