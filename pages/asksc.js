// ask a smart contract code any questions
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { JsonRpcProvider, EtherscanProvider as Provider } from 'ethers';
import { Contract } from 'sevm';
import 'sevm/4bytedb'

export default function AskSC() {
  const [question, setQuestion] = useState('');

  const [contract, setContract] = useState(null)
  const [functions, setFunctions] = useState([])
  const [address, setAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [chat, setChat] = useState([]);

  async function getContract() {
    setContract('Loading...')
    setFunctions(['Loading...'])
    const provider = new JsonRpcProvider('https://eth.llamarpc.com')
    const bytecode = await provider.getCode(address)
    console.log(bytecode.length)
    const contract = new Contract(bytecode).patchdb();
    setFunctions(contract.getFunctions())
    setContract(contract.solidify())
  }

  const getAnswer = () => {
    // get answer from contract

    // 4 characters is 1 token, max limit is 16k tokens
    // 16k / 4 = 4000 characters
    let tmptranscript = contract.slice(0, 3000);
    setChat([...chat, { question, answer: 'loading...' }]);
    fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `I will send you a smart contract code please respond on the basis of that contract. 
        The smart contract is generated from the bytecode of the contract address so it may not be accurate.
        You have to speculate the answers based on the contract provided.
        Please try your best to answer the questions.
        Don't be unsure, be confident.
        Interpret the contract as if you are a developer.
        Keep the answers concise and to the point. Only answer on the contract provided. This is the smart contract: \n\n${tmptranscript}. \n\Based on the contract and your understanding: ${question}.`,
        model: `gpt-3.5-turbo`
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        // remove loading and replace with answer
        setChat(chat.slice(0, chat.length - 1));
        setChat([...chat, { question, answer: data.response }]);
        document.getElementById('chat').scrollTo(0, document.getElementById('chat').scrollHeight)
      })
  }

  useEffect(() => {
    getContract()
  }, [address])

  return (
    <>
      <Head>
        <title>Read Smart Contract</title>
        <meta name="description" content="Read Smart Contract, regardless whether it is verified or not" />
      </Head>
      <main style={{ maxWidth: 1200 }}>
        <h1>Read Smart Contract</h1>
        <p style={{ color: '#333', fontSize: 12 }}>Enter the contract address to read the smart contract</p>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }} placeholder="Paste youtube video url" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className={styles.row} style={{ gap: '20px', width: '100%', margin: 'auto' }}>
          <div style={{ flexBasis: '60%', border: '1px solid #333', height: '500px' }}>
            <p style={{ whiteSpace: 'pre-wrap', overflow: 'scroll', maxHeight: '460px', fontSize: '10px', fontFamily: 'monospace', color: '#888' }}>{contract}</p>
          </div>
          <div style={{ flexBasis: '40%', border: '1px solid #333', height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexBasis: '92%', height: '400px', padding: '10px', overflow: 'auto' }} id="chat">
              {chat.map((item, index) => (
                <div key={index} style={{ padding: '20px 0px', borderBottom: '1px solid #333' }}>
                  <p style={{
                    color: '#ccc',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    marginBottom: '5px',
                    whiteSpace: 'pre-wrap'
                  }}>Q: {item.question}</p>
                  <p style={{
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap'
                  }}
                  >A: {item.answer}</p>
                </div>
              ))}
            </div>
            <div style={{ flexBasis: '8%', width: '100%', display: 'flex', fontSize: '12px' , boxShadow: '0px -1px 0px #333'
          }}>
              <input style={{ flexBasis: '85%', width: '100%', height: '100%', background: '#111', border: 'none', outline: 'none', padding: '10px', fontSize: '12px' }} type="text" placeholder="Enter your question" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // if shift + enter then add new line else send message
                  if (e.shiftKey) {
                    setQuestion(question + '\n');
                    return;
                  }
                  getAnswer();
                }
              }} />
              <button style={{borderLeft: '1px solid #333 !important', flexBasis: '15%', width: '100%', height: '100%', background: '#111', outline: 'none', padding: '10px', fontSize: '12px' }} onClick={getAnswer}>Ask</button>
            </div>
          </div>


          {/* <div style={{ flexBasis: '40%', border: '1px solid #333', height: '500px', display: 'flex', overflow: 'scroll', flexDirection: 'column' }}>
            {functions.map((func, index) => (
              <div key={index} style={{ padding: '20px 0px', borderBottom: '1px solid #333', color: '#333' }}>
                <p style={{
                  color: '#888',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
                >{func}</p>
              </div>
            ))}
          </div> */}
        </div>
      </main>
    </>
  )
}