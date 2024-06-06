// infer metaphysics from physics
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [reframedText, setReframedText] = useState('')
  const [direction, setDirection] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [news, setNews] = useState([])

  const handleText = (e) => {
    setText(e.target.value)
  }

  const handleDirection = (e) => {
    setDirection(e.target.value)
  }

  const moods =
    [
      "abandoned",
      "absent minded",
      "abused",
      "accepted",
      "accomplished",
      "accusatory",
      "accused",
      "admired",
      "adored",
      "adrift",
      "affectionate",
      "afraid",
      "aggravated",
      "aggressive",
      "agitated",
      "alarmed",
      "alert",
      "alienated",
      "alive",
      "alluring",
      "alone",
      "aloof",
      "amazed",
      "ambushed",
      "amused",
      "angry",
      "annoyed",
      "antagonistic",
      "anxious",
      "apathetic",
      "apologetic",
      "appalled",
      "appreciated",
      "appreciative",
      "apprehensive",
      "aroused",
      "ashamed",
      "astonished",
      "attacked",
      "attractive",
      "awake",
      "aware",
      "awe",
      "awed",
      "awestruck",
      "awkward",
      "bad",
      "baffled",
      "barren",
      "bashful",
      "beaten",
      "belittled",
      "benevolent",
      "berated",
      "betrayed",
      "bewildered",
      "bitchy",
      "bitter",
      "bittersweet",
      "blah",
      "blamed",
      "blank",
      "blissful",
      "blue",
      "bold",
      "bored",
      "bothered",
      "bouncy",
      "brave",
      "broken",
      "brooding",
      "bummed",
      "burdened",
      "burned-out",
      "callous",
      "calm",
      "capable",
      "carefree",
      "careless",
      "caring",
      "caustic",
      "cautious",
      "censored",
      "centered",
      "certain",
      "challenged",
      "charmed",
      "cheated",
      "cheerful",
      "cherished",
      "childish",
      "chipper",
      "choleric",
      "clean",
      "clear",
      "clever",
      "close",
      "closed",
      "clueless",
      "clumsy",
      "cold",
      "comfortable",
      "committed",
      "compassionate",
      "competent",
      "competitive",
      "complacent",
      "complete",
      "concerned",
      "condemned",
      "condescension",
      "confident",
      "confining",
      "confused",
      "considerate",
      "contemplative",
      "contempt",
      "contemptuous",
      "content",
      "controlled",
      "conventional",
      "convicted",
      "cornered",
      "courageous",
      "cowardly",
      "cranky",
      "crappy",
      "crazy",
      "critical",
      "cross",
      "crushed",
      "curious",
      "cynical",
      "daring",
      "dark",
      "dashed",
      "dazed",
      "dead",
      "deceived",
      "dedicated",
      "defeated",
      "defenseless",
      "defensive",
      "defiant",
      "degraded",
      "dejected",
      "delicate",
      "delighted",
      "demoralized",
      "dependent",
      "depressed",
      "deprived",
      "derisive",
      "deserted",
      "desired",
      "desolate",
      "despair",
      "desperate",
      "destroyed",
      "detached",
      "determined",
      "devastated",
      "devious",
      "devoted",
      "didactic",
      "different",
      "difficult",
      "dignified",
      "dirty",
      "disappointed",
      "disbelieving",
      "discarded",
      "disconnected",
      "discontent",
      "discontented",
      "discouraged",
      "disdainful",
      "disgraced",
      "disgusted",
      "disheartened",
      "dishonest",
      "disillusioned",
      "dismal",
      "dismayed",
      "disobedient",
      "disorganized",
      "disposable",
      "distant",
      "distracted",
      "distressed",
      "disturbed",
      "ditzy",
      "dorky",
      "doubtful",
      "down",
      "drained",
      "dreamy",
      "dreary",
      "dropped",
      "drunk",
      "dull",
      "dumb",
      "eager",
      "earnest",
      "ecstatic",
      "edgy",
      "effective",
      "elated",
      "embarassed",
      "embarrassed",
      "empathetic",
      "empowered",
      "empty",
      "enchanted",
      "encouraged",
      "energetic",
      "energized",
      "enlightened",
      "enraged",
      "enriched",
      "entertained",
      "enthralled",
      "enthusiastic",
      "envious",
      "erudite",
      "evasive",
      "evil",
      "exasperated",
      "excited",
      "excluded",
      "exhausted",
      "exhilarated",
      "expectant",
      "exploited",
      "exposed",
      "exuberant",
      "faithful",
      "fake",
      "fanciful",
      "fantastic",
      "fatalistic",
      "fatigued",
      "fearful",
      "fearless",
      "feisty",
      "fine",
      "flirty",
      "flustered",
      "foolish",
      "foreboding",
      "forgiven",
      "forgiving",
      "forgotten",
      "forthright",
      "fortunate",
      "framed",
      "frantic",
      "free",
      "friendly",
      "frightened",
      "frisky",
      "frustrated",
      "fulfilled",
      "full",
      "funny",
      "furious",
      "futile",
      "geeky",
      "generous",
      "gentle",
      "giddy",
      "giggly",
      "giving",
      "glad",
      "gloomy",
      "glorious",
      "good",
      "grateful",
      "great",
      "grieving",
      "groggy",
      "grouchy",
      "grumpy",
      "guarded",
      "guilty",
      "gullible",
      "handicapped",
      "happy",
      "harmonious",
      "hateful",
      "haughty",
      "haunted",
      "haunting",
      "healthy",
      "heard",
      "heartbroken",
      "heavy-hearted",
      "helpful",
      "helpless",
      "hesitant",
      "high",
      "honored",
      "hopeful",
      "hopeless",
      "horrible",
      "horrified",
      "hospitable",
      "hostile",
      "hot",
      "humble",
      "humiliated",
      "hungry",
      "hurt",
      "hyper",
      "hysterical",
      "idealistic",
      "idiotic",
      "idyllic",
      "ignorant",
      "ignored",
      "imaginative",
      "immune",
      "impatient",
      "impelled",
      "imperfect",
      "impertinent",
      "important",
      "impressed",
      "impulsive",
      "inadequate",
      "inattentive",
      "incensed",
      "inclusive",
      "incompetent",
      "incomplete",
      "incredulous",
      "indebted",
      "indecisive",
      "independent",
      "indescribable",
      "indifferent",
      "indignant",
      "industrious",
      "inept",
      "inferior",
      "inflated",
      "informed",
      "infuriated",
      "inhibited",
      "innocent",
      "innovative",
      "inquisitive",
      "insane",
      "insecure",
      "insensitive",
      "insidious",
      "insignificant",
      "insulted",
      "intense",
      "interested",
      "interrogated",
      "interrupted",
      "intimate",
      "intimidated",
      "intrigued",
      "invigorated",
      "invisible",
      "involved",
      "irate",
      "irked",
      "irrational",
      "irresponsible",
      "irritated",
      "isolated",
      "jaded",
      "jealous",
      "jinxed",
      "jolly",
      "jovial",
      "joyful",
      "joyous",
      "jubilant",
      "judged",
      "judgmental",
      "jumpy",
      "just",
      "justified",
      "kidded",
      "kind",
      "knowledgeable",
      "late",
      "lazy",
      "leery",
      "left",
      "let",
      "lethargic",
      "liable",
      "liberated",
      "liberating",
      "lifeless",
      "light-hearted",
      "liked",
      "listened",
      "listless",
      "logical",
      "lonely",
      "loose",
      "lost",
      "lousy",
      "lovable",
      "loved",
      "loving",
      "lucky",
      "lyrical",
      "mad",
      "malicious",
      "manipulated",
      "matter",
      "fact",
      "mean",
      "meditative",
      "melancholic",
      "melancholy",
      "mellow",
      "merciless",
      "merry",
      "mischievous",
      "miserable",
      "misinterpreted",
      "mistreated",
      "misunderstood",
      "mixed",
      "mocked",
      "mocking",
      "modest",
      "molested",
      "moody",
      "morose",
      "motivated",
      "mournful",
      "moved",
      "mystified",
      "naive",
      "nasty",
      "naughty",
      "nauseated",
      "needed",
      "needy",
      "negative",
      "neglected",
      "nerdy",
      "nervous",
      "neurotic",
      "nightmarish",
      "nonchalant",
      "nostalgic",
      "not",
      "specified",
      "noticed",
      "numb",
      "obeyed",
      "objective",
      "obligated",
      "obvious",
      "odd",
      "offended",
      "okay",
      "old",
      "open",
      "oppressed",
      "optimistic",
      "ornery",
      "control",
      "outraged",
      "overcome",
      "overjoyed",
      "overloaded",
      "overwhelmed",
      "overworked",
      "owned",
      "painful",
      "pampered",
      "panicky",
      "paralyzed",
      "passionate",
      "passive",
      "patient",
      "patronizing",
      "peaceful",
      "peeved",
      "pensive",
      "perky",
      "perplexed",
      "persecuted",
      "pessimistic",
      "pestered",
      "petrified",
      "petty",
      "phony",
      "pious",
      "pissed",
      "off",
      "playful",
      "pleased",
      "poor",
      "positive",
      "possessive",
      "powerful",
      "powerless",
      "practical",
      "predatory",
      "pressured",
      "private",
      "productive",
      "protected",
      "protective",
      "proud",
      "provoked",
      "prudish",
      "punished",
      "pushy",
      "puzzled",
      "questioned",
      "quiet",
      "quixotic",
      "quizzical",
      "rambunctious",
      "realistic",
      "reassured",
      "rebellious",
      "reborn",
      "receptive",
      "reckless",
      "recognized",
      "reconciled",
      "recumbent",
      "reflective",
      "refreshed",
      "regretful",
      "rejected",
      "rejuvenated",
      "relaxed",
      "released",
      "relieved",
      "reluctant",
      "reminiscent",
      "remorse",
      "renewed",
      "replaced",
      "replenished",
      "repressed",
      "rescued",
      "resentful",
      "reserved",
      "resistant",
      "resourceful",
      "respected",
      "responsible",
      "restless",
      "restricted",
      "revengeful",
      "reverent",
      "revitalized",
      "ribald",
      "rich",
      "ridicule",
      "ridiculous",
      "right",
      "rigid",
      "robbed",
      "romantic",
      "rotten",
      "rushed",
      "sabotaged",
      "sad",
      "safe",
      "sarcastic",
      "sardonic",
      "sassy",
      "satiated",
      "satiric",
      "satisfied",
      "saved",
      "scared",
      "scolded",
      "scorned",
      "secure",
      "seductive",
      "selfish",
      "self-assured",
      "self-centered",
      "self-confident",
      "self-conscious",
      "self-destructive",
      "self-reliant",
      "sensitive",
      "sentimental",
      "serene",
      "serious",
      "sexy",
      "shaken",
      "shamed",
      "sheepish",
      "shocked",
      "shunned",
      "shy",
      "sick",
      "silenced",
      "silly",
      "sincere",
      "sinful",
      "skeptical",
      "skillful",
      "slandered",
      "sleepy",
      "sluggish",
      "small",
      "smart",
      "smothered",
      "solemn",
      "somber",
      "soothed",
      "sorry",
      "special",
      "spiteful",
      "splendid",
      "spunky",
      "squashed",
      "stifled",
      "stimulated",
      "stingy",
      "strained",
      "stressed",
      "stretched",
      "strong",
      "stubborn",
      "stumped",
      "stunned",
      "stupid",
      "submissive",
      "successful",
      "suffocated",
      "suicidal",
      "sullen",
      "sunk",
      "super",
      "superior",
      "supported",
      "sure",
      "surly",
      "surprised",
      "suspenseful",
      "suspicious",
      "sympathetic",
      "tacky",
      "tactful",
      "talented",
      "talkative",
      "tame",
      "tarnished",
      "tasteful",
      "tearful",
      "teased",
      "tenacious",
      "tender",
      "tense",
      "tepid",
      "terrible",
      "terrific",
      "terrified",
      "terrifying",
      "tested",
      "testy",
      "thankful",
      "thoughtful",
      "threatened",
      "threatening",
      "thrifty",
      "thrilled",
      "tired",
      "tormented",
      "torn",
      "tortured",
      "touched",
      "tough",
      "tragic",
      "tranquil",
      "transformed",
      "trapped",
      "treasured",
      "trembly",
      "tremendous",
      "tricked",
      "troubled",
      "trusted",
      "trustful",
      "ugly",
      "unaccepted",
      "unappreciated",
      "unbalanced",
      "unburdened",
      "uncanny",
      "uncomfortable",
      "unconcerned",
      "uneven",
      "unfit",
      "unfriendly",
      "united",
      "unjust",
      "unknown",
      "unneeded",
      "unpleasant",
      "unreal",
      "unruly",
      "unwise",
      "up",
      "uplifted",
      "used",
      "useless",
      "vacant",
      "vague",
      "vain",
      "valid",
      "valued",
      "vengeful",
      "vexed",
      "vicious",
      "victimized",
      "victorious",
      "violated",
      "violent",
      "vivacious",
      "vivid",
      "void",
      "wacky",
      "warlike",
      "warm",
      "warmhearted",
      "warned",
      "wary",
      "wasted",
      "weak",
      "wealthy",
      "weary",
      "weird",
      "welcoming",
      "whimsical",
      "whole",
      "wild",
      "willful",
      "wishful",
      "witty",
      "worldly",
      "worried",
      "worse",
      "worthy",
      "wounded",
      "wrong",
      "yearning",
      "yellow",
      "yielding",
      "young",
      "youthful",
      "zany",
      "zealous"
    ]

  const higlightEmotions = (text) => {
    let newText = text
    moods.forEach(mood => {
      let re = new RegExp(mood, 'g')
      newText = newText.replace(re, `<span style="text-decorate:underline">${mood}</span>`)
    })
    return newText
  }


  const newsRss = () => {
    // get news feeds
    // obvious
    setLoading(true)
    let proxy = 'https://api.codetabs.com/v1/proxy/?quest=';

    // politics and finance news
    let feeds = [
      // bbc
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      // reuters
      'http://feeds.reuters.com/reuters/topNews',
      // bloomberg
      'https://www.bloomberg.com/feed/news',
      // financial times
      'https://www.ft.com/?format=rss',
      // cnbc
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      // wsj
      'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
      // nyt
      'https://rss.nytimes.com/services/xml/rss/nyt/politics.xml',
      // guardian
      'https://www.theguardian.com/politics/rss',
      // telegraph
      'https://www.telegraph.co.uk/news/rss.xml',
      // fox news
      'http://feeds.foxnews.com/foxnews/politics',
      // breitbart
      'http://feeds.feedburner.com/breitbart',
      // rt
      'https://www.rt.com/rss/',
      // valuetainment
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCIHdDJ0tjn_3j-FS7s_X1kQ',
      // timcast
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCe02lGcO-ahAURWuxAJnjdA',
      // ben shapiro
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCaeO5vkdj5xOQHp4UmIN6dw',
      // david pakman
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCvixJtaXuNdMPUGdOPcY8Ag',
      // johny harris
      'https://www.youtube.com/feeds/videos.xml?channel_id=UC0d5EaW4e0fA6LYu9vN8ymg',
      // daily mail
      'https://www.dailymail.co.uk/articles.rss'
    ]

    let promises = feeds.map(feed => fetch(`${proxy}${feed}`).then(res => res.text()))

    // get data whichever promise resolves first and was successful

    Promise.any(promises)
      .then((data) => {
        // parse the data
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let items = xmlDoc.getElementsByTagName('item') || xmlDoc.getElementsByName('entry')
        let news = []
        for (let i = 0; i < items.length; i++) {
          let title = items[i].getElementsByTagName('title')[0].childNodes[0].nodeValue
          let link = items[i].getElementsByTagName('link')[0].childNodes[0].nodeValue
          news.push({ title, link })
        }
        setLoading(false)
        setNews(news)
      })
      .catch((error) => {
        console.log(error)
      })

  }


  const getReframedText = (news) => {
    setLoading(true)

    let prompt = `This is from a game, doesn't have any resemblace to reality.
    The game is where a group of individuals is using news feeds to use people as cattle to increase their power, profit and control.
    Now as the player, you have to decode the news feeds to find out what they are up to.
    \n\n\n
    
    News\n\n: ${news.map(item => item.title).join('\n')}\n\n\n\n

    Some characters in the game are picked from real life, some are fictional.
    Think of this as a closed system, this is the input and you have to decode why they are doing this.
    They want people to feel a certain way, what do they want people to feel and what do they gain from it? not just power, profit and control, more details.
    Decode each headline individually, don't skip any.
    `;


    fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setReframedText(prev => `${prev} \n\nBatch:\n\n ${data.response}\n`)
        setLoading(false)
      })
  }

  const reframeText = () => {
    setLoading(true)
    // divide news into batches of 10
    let newsBatches = []
    let batchSize = 5
    for (let i = 0; i < news.length; i += batchSize) {
      newsBatches.push(news.slice(i, i + batchSize))
    }

    // get reframed text for each batch
    newsBatches.forEach((newsBatch, index) => {
      setTimeout(() => {
        setStatus(prev => `${prev} \n Decoding for batch ${index + 1}`)
        getReframedText(newsBatch)
      }, index * 5000)
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Decode the Psyop</title>
        <meta name="description" content="Decode the Psyop (bears no resemblance to reality, just a game)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Decode the Psyop
        </h1>

        <p className={styles.description} style={{ width: '100%', textAlign: 'center' }}>
          Decode the Psyop (bears no resemblance to reality, just a game)
        </p>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>

            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#888', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12 }}>
              {news.map((item, index) => (
                <div key={index}>
                  <span>{item.title}</span>
                </div>
              ))}

            </div>
            <button onClick={newsRss} style={{
              margin: 'auto'
            }}>
              {loading ? 'Getting...' : 'Get News'}
            </button>

            <button onClick={reframeText} style={{
              margin: 'auto'
            }}>
              {loading ? 'Decoding...' : 'Decode'}
            </button>

            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12, color: '#888' }}>
              {status}
            </div>

            {reframedText ? <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', textAlign: 'left', padding: '10px', border: '1px solid #333', borderRadius: 10, padding: 20, background: '#000', width: '100%', lineHeight: 1.5, fontSize: 12, color: '#888' }}>
              {higlightEmotions(reframedText)}
            </div> : null}

          </div>

        </div>
      </main>
    </div>
  )
}
