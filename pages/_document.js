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
            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>
          <a href="https://www.blockchain.com/explorer/addresses/btc/BC1QD3ADA3NSL86FR33YTJL372QH63HX9R0APULGLE" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>
          <a href="https://explorer.solana.com/address/9dPN7gdN9cyGhjiQn5gBU9DQDBxUJafvS873BcW3mpFT" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>

          <a href="https://twitter.com/PaiNishant" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="https://abs.twimg.com/favicons/twitter.3.ico" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>

          <a href="https://warpcast.com/nishu" target="_blank" style={{
            display: 'flex',
          }}>
            <img src="https://warpcast.com/favicon.png" style={{
              width: 25,
              height: 25,
              borderRadius: 20
            }}/>
          </a>

        </div>
      </body>
    </Html>
  )
}
