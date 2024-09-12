// two elements to tell the story
// one is the story itself
// one is the graph of the story
// you can engineer story by changing the graph
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import html2canvas from 'html2canvas'

export default function StoryEngineering() {

  const [shortStory, setShortStory] = useState('')
  const parentRef = useRef(null)
  // from short story to acts tension v/s time
  const [acts, setActs] = useState([])
  const [storyJson, setStoryJson] = useState({})
  const [mainStory, setMainStory] = useState('')
  const [loading, setLoading] = useState(false)

  const getActs = async (shortStory) => {
    setLoading(true)
    console.log(shortStory)
    let prompt = `Here is a short story: ${shortStory}.
    From this short story, make a json object that represents the acts of the story.
    The json object should have the following structure (tension, time, act, short version of the act):
    [
      {
        "tension": 0,
        "time": 0,
        "act": 0,
        "short": "Introduction",
        "story": ...
      },
      {
        "tension": 0,
        "time": 0,
        "act": 1,
        "short": "Rising Action",
        "story": ...
        
      },
      {
        "tension": 0,
        "time": 0,
        "act": 2,
        "short": "Climax",
        "story": ...
      },
      {
        "tension": 0,
        "time": 0,
        "act": 3,
        "short": "Falling Action"
        "story": ...
      },
      {
        "tension": 0,
        "time": 0,
        "act": 4,
        "short": "Resolution",
        "story": ...
      }
    ]

    Edit the tension and time values to represent the tension and time in the story.
    Time will start from 0.
    Response should be a json object, not a string.
    `
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setLoading(false)
    console.log(data.response)
    setStoryJson(JSON.parse(data.response))
    setActs(JSON.parse(data.response))
  }


  const getStoryFromActs = async (acts) => {
    let prompt = `Here is a json object that represents the acts of the story.

    The json object has tension, time and short version of the act.

    Combine these acts to write a short story in the order of the acts.

    Use tension as a measure of the intensity of the story.

    Use only the story key to write the story, use the tension and time values to write a more detailed story.

    Don't use words like "resolution", "climax", "tension" "time" etc. in the story.

    Write a story that is engaging and interesting and detailed.
    ${JSON.stringify(acts)}

    From this json object, write a short story.
    `
    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, 
        model: 'gpt-3.5-turbo'
      })
    })
    const data = await res.json()
    setMainStory(data.response)
  }

  useEffect(() => {
    if (acts.length) {
      console.log(acts)
      let newActs = [...acts]
      newActs = newActs.map((act, index) => {
        act.time = index * 100
        act.tension = act.act * 100 * -1
        return act
      })
      getStoryFromActs(newActs)
    }
  }, [acts])


  return (
    <>
      <Head>
        <title>Story Engineering</title>
        <meta name="description" content="Tool to make your stories more engaging" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: 1500}}>
        <h1 className={styles.title}> Story Engineering </h1>
        <h2 className={styles.description}>
          Tool to make your stories more engaging
        </h2>
        <textarea style={{
          width: '500px',
          height: '140px',
          padding: '10px',
          border: '1px solid #333',
          borderRadius: '10px',
          backgroundColor: '#000',
          color: '#fff',
        }}
          placeholder='Enter few lines of your story here'
          onChange={(e) => setShortStory(e.target.value)}
        ></textarea>
        <button onClick={() =>
          getActs(shortStory)} className={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, width:'100%', }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          padding: '10px',
          border: '1px solid #333',
          borderRadius: '10px',
          backgroundColor: '#000',
          color: '#fff',
        }}
        ref={parentRef}
        >
          {acts.length ? acts.map((act, index) => (
            // x,y are time and tension
            <Draggable key={index} 
            bounds="parent"
            defaultPosition={{ x: act.time, y: act.tension }}
            onStop={(e, data) => {
              let newActs = [...acts]
              newActs[index].time = data.x
              newActs[index].tension = data.y
              console.log(newActs, 'newActs') 
              setActs(newActs)
            }}
            >
              <div style={{
                width: '140px',
                height: 'max-content',
                padding: '10px',
                border: '1px solid #333',
                borderRadius: '10px',
                backgroundColor: '#000',
                color: '#fff',
                fontSize: '12px',
              }}>
                <h3>{act.short}</h3>
                <br />
                <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', gap: 5, justifyContent: 'space-between', color: '#888', fontSize: 10 }}>
                <span>Time: {act.time}</span>
                <span>Tension: {act.tension * -1}</span>
                <span>{act.story}</span>
                </div>
                {/* <p>{act.story}</p> */}
              </div>
            </Draggable> 
          )) : null}
        </div>
        <div style={{
          width: '100%',
          height: 'max-content',
          padding: '10px',
          border: '1px solid #333',
          borderRadius: '10px',
          backgroundColor: '#000',
          color: '#fff',
        }}>
          <h3>Story</h3>
          <p style={{
            whiteSpace: 'pre-wrap',
            color: '#fff',
            fontSize: '12px',
            marginTop: 10,
          }}
          >{mainStory}</p>
        </div>
        </div>
      </main>
    </>
  )
}