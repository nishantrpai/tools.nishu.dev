```jsx
<>
      <Head>
        <title>AI Canvas</title>
        <meta name="description" content="AI Canvas with history and library of aesthetics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id='aesthetics' value={aesthetics} style={{ flexBasis: '90%', border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Describe Aesthetics' onChange={(e) => setAesthetics(e.target.value)} />
            <button style={{ flexBasis: '10%', background: '#000', color: '#fff', padding: '5px 10px', border: '1px solid #333 !important', cursor: 'pointer', fontSize: 12 }} onClick={() => enhanceAesthetics(aesthetics)}>Enhance</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id='scene' value={scene} style={{  flexBasis: '90%', border: '1px solid #333 !important', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Describe scene' onChange={(e) => setScene(e.target.value)} />
            <button style={{ background: '#000', color: '#fff', padding: '5px 10px', border: '1px solid #333 !important', cursor: 'pointer', fontSize: 12 }} onClick={() => enhanceScene(scene)}>Enhance</button>
          </div>
          <div>
            <input id='negativeprompt' style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Negative Prompt' onChange={(e) => setNegativePrompt(e.target.value)} />
          </div>
          <div>
            <input disabled value={width} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Width' onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div>
            <input disabled value={height} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Height' onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
          <input id="seed" value={seed} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Seed' onChange={(e) => setSeed(e.target.value)} />
          </div>
          {/* input slider for inference from 0 to 20 for priorguidance */}
          <div>
            <input value={priorGuidance} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Prior Guidance' onChange={(e) => setPriorGuidance(e.target.value)} />
          </div>
          <div>
            <input value={decoderinference} type="number" style={{ border: '1px solid #333', background: '#000', width: '100%', padding: '5px 10px' }} placeholder='Decoder Inference' onChange={(e) => setDecoderInference(e.target.value)} />
          </div>
          <button onClick={() => {
            if (websocket !== null)
              websocket.send(`{"data":["${scene} ${aesthetics}","${negativeprompt}",${seed},${width},${height},30,${priorGuidance},${decoderinference},0,1],"event_data":null,"fn_index":3,"session_hash":"${sessionHash}"}`)
            else
              joinQueue()

          }}>
            Generate
          </button>
          <div>
            <img src={gen} style={{ width: '100%', height: 'auto', minWidth: 500, minHeight: 500, border: '1px solid #333' }} />
          </div>
        </div>

        {/* one div will be for past generations and one will be library of aesthetics, on click it'll filter past generations and fill the input */}
        <div style={{ display: 'flex', gap: '20px', width: '100%', padding: '10px' }}>
          <button onClick={() => setMode('past')}
            style={{
              background: 'none',
              color: mode === 'past' ? '#777' : '#333',
              width: '50%'
            }}
          >
            <FaHistory /> History
          </button>
          <button style={{
            background: 'none',
            color: mode === 'library' ? '#777' : '#333',
            width: '50%',
            borderLeft: '1px solid #333',
            borderRadius: '0px'
          }} onClick={() => setMode('library')}>Library of Aesthetics</button>
        </div>
        {mode === 'past' && <PastGenerations library={library} setVals={setVals} />}
        {mode === 'library' && <LibraryOfAesthetics library={library} setVals={setVals} />}
      </main>
    </>
```