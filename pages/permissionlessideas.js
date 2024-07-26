// generate ideas for permissionless apprenticeship from jackbutchers data
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function PermissionlessIdeas() {

const DATASET = [
    {
        "IS": "Interests: Design. Innovation management.\n\nSkills: Writing. Near-zero performance anxiety.\n",
        "Response": "Thought about a format for contextualizing innovation management?\n\nCould be short video presentations if you're a great speaker.\n\nWould imagine this could be sold as a service into B2B either as an internal tool for aligning people, or external for pitching new product/services.\n\n120 second video case study on how GE managed to do x, y, z in 10 years.\n\n"
    },
    {
        "IS": "Skill: Social Strategy\n\nPersonal Interest: Electronic music\n",
        "Response": "Produce content that explains how electronic music travels through culture?\n@JoePompliano, but for music.\n\nWhy artist x scales and y doesn't.\nWhere sound trend x came from.\nHow electronic music is adapting post-covid.\n\nTurn it into a consulting play to help get artists exposure.\n"
    },
    {
        "IS": "A bit more abstract, I think. But it’s what I’m into.\n\nSkill: confident decision making as it pertains to Entrepreneurship\n\nPersonal Interest: realization of personal power, potential, philosophy etc\n",
        "Response": "I think documentation is the key to revealing opportunity here.\n\nWhat kinds of decisions?\nWhere/to who do those decisions apply?\nHow have you applied them?\nHow have others? What are great examples?\n\nFeels like a content play that could easily become product.\n"
    },
    {
        "IS": "Skill to monetize: Copywriting\n\nPersonal interest: Tech in general (coding to build a SaaS)\n",
        "Response": "I'd niche down into copywriting as it relates to SaaS:\n\nUser interface copy\nCustomer support copy\nSEO for discoverability\n\nDo this for SaaS businesses that already exist in exchange for a couple of testimonials, then package into an offer and sell it. \"SaaS Copy Accelerator\"\n"
    },
    {
        "IS": "Skill: Video Editing\n\nInterest: How companies have gone from Seed to IPO\n",
        "Response": "Make video trailers/timelines that document the journey for companies that have already been through the process.\n\nPull comments/tweets from founders, interview early team members, grab press coverage/milestones.\n\n90/120 second format that you can repeat for different businesses.\n"
    },
    {
        "IS": "Skill: Design\nInterest: Helping people\n",
        "Response": "The answer lies in what people need help with.\n\nDesign as a tool for:\n\nCommunicating more clearly\nAccomplishing something faster\nPreventing someone from worrying about something\nAnd a million other things\n\nThe more obvious the ROI, the easier it will be to monetize.\n"
    },
    {
        "IS": "Skill: Event Planning:\n\nPersonal Interest: Cannabis, Crypto, Budding Generational Wealth\n",
        "Response": "Can you start organizing digital events around some of the above?\n\n'Generational Wealth in Crypto'\n\nBuild an agenda, find speakers, manage signups & marketing, etc.\n\nDo a few for free, invite people who would be potential future clients.\n"
    }
]
const [text, setText] = useState('')
const [sensationalizedText, setSensationalizedText] = useState('')
const [loading, setLoading] = useState(false)

const sensationalize = async () => {
  // make api call to /api/gpt?prompt
  setLoading(true)
  let prompt = `Given this skill, interests ${text}, list atleast 20-30 (bullet points) ideas for permissionless apprenticeship and ways to monetize them.
  Only limit to skills, interests provided.
  Keep readability grade as low as possible.
  Don't use numbers please, format it correctly so each block is readable.
  Mention ways to monetize them in every block.
  Here are some examples of suggestions for permissionless apprenticeship:
  ${DATASET.map((d, i) => `${i + 1}. ${d.IS}\n${d.Response}`).join('\n\n')}
  `

  const res = await fetch(`/api/gpt?prompt`, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()
  setSensationalizedText(data.response)
  setLoading(false) 
  
}

return (
  <>
    <Head>
      <title>Permissionless Ideas</title>
      <meta name="description" content="Get permissionless ideas from your skills and interests and ways to monetize from Jack Butcher's data" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.container}>
      <h1 className={styles.title}>
        Permissionless Ideas
      </h1>
      <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
        Input your skills and interests to get permissionless ideas and ways to monetize them from 
        <a href="https://x.com/jackbutcher/status/1316389782868635656" target='_blank' rel='noopener noreferrer' style={{ color: '#fff', textDecoration: 'none', marginLeft: 5 }}>Jack Butcher</a>
      </span>


      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your skills, interests, and personal interest"
        style={{
          width: '100%',
          border: '1px solid #333',
          padding: '10px',
          outline: 'none',
          borderRadius: 10
        }}
      />

      <button onClick={sensationalize} className={styles.button}>
        {loading ? 'Checking...' : 'Check'}
      </button>

      {sensationalizedText && (
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', background: '#000', width: '100%', lineHeight: 1.5, borderRadius: 10, fontSize: 16}}>
          {sensationalizedText}
        </div>
      )}
    </main>
  </>
)


}