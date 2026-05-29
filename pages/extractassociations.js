import Head from 'next/head';
import { useState, useMemo, useEffect, useRef } from 'react';

const defaultStopwords = [
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "a",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "able",
  "abst",
  "accordance",
  "according",
  "accordingly",
  "across",
  "act",
  "actually",
  "added",
  "adj",
  "affected",
  "affecting",
  "affects",
  "afterwards",
  "ah",
  "almost",
  "alone",
  "along",
  "already",
  "also",
  "although",
  "always",
  "among",
  "amongst",
  "announce",
  "another",
  "anybody",
  "anyhow",
  "anymore",
  "anyone",
  "anything",
  "anyway",
  "anyways",
  "anywhere",
  "apparently",
  "approximately",
  "aren",
  "arent",
  "arise",
  "around",
  "aside",
  "ask",
  "asking",
  "auth",
  "available",
  "away",
  "awfully",
  "b",
  "back",
  "became",
  "become",
  "becomes",
  "becoming",
  "beforehand",
  "begin",
  "beginning",
  "beginnings",
  "begins",
  "behind",
  "believe",
  "beside",
  "besides",
  "beyond",
  "biol",
  "brief",
  "briefly",
  "c",
  "ca",
  "came",
  "can",
  "cause",
  "causes",
  "certain",
  "certainly",
  "co",
  "com",
  "come",
  "comes",
  "contain",
  "containing",
  "contains",
  "couldnt",
  "d",
  "date",
  "different",
  "done",
  "downwards",
  "due",
  "e",
  "ed",
  "edu",
  "effect",
  "eg",
  "eight",
  "eighty",
  "either",
  "else",
  "elsewhere",
  "end",
  "ending",
  "enough",
  "especially",
  "et",
  "et-al",
  "etc",
  "even",
  "ever",
  "every",
  "everybody",
  "everyone",
  "everything",
  "everywhere",
  "ex",
  "except",
  "f",
  "far",
  "ff",
  "fifth",
  "first",
  "five",
  "fix",
  "followed",
  "following",
  "follows",
  "former",
  "formerly",
  "forth",
  "found",
  "four",
  "furthermore",
  "g",
  "gave",
  "get",
  "gets",
  "getting",
  "give",
  "given",
  "gives",
  "giving",
  "go",
  "goes",
  "gone",
  "got",
  "gotten",
  "h",
  "happens",
  "hardly",
  "hed",
  "hence",
  "hereafter",
  "hereby",
  "herein",
  "heres",
  "hereupon",
  "hes",
  "hi",
  "hid",
  "hither",
  "home",
  "howbeit",
  "however",
  "hundred",
  "id",
  "ie",
  "im",
  "immediate",
  "immediately",
  "importance",
  "important",
  "inc",
  "indeed",
  "index",
  "information",
  "instead",
  "invention",
  "inward",
  "itd",
  "it'll",
  "j",
  "just",
  "k",
  "keep",
  "keeps",
  "kept",
  "kg",
  "km",
  "know",
  "known",
  "knows",
  "l",
  "largely",
  "last",
  "lately",
  "later",
  "latter",
  "latterly",
  "least",
  "less",
  "lest",
  "let",
  "lets",
  "like",
  "liked",
  "likely",
  "line",
  "little",
  "'ll",
  "look",
  "looking",
  "looks",
  "ltd",
  "m",
  "made",
  "mainly",
  "make",
  "makes",
  "many",
  "may",
  "maybe",
  "mean",
  "means",
  "meantime",
  "meanwhile",
  "merely",
  "mg",
  "might",
  "million",
  "miss",
  "ml",
  "moreover",
  "mostly",
  "mr",
  "mrs",
  "much",
  "mug",
  "must",
  "n",
  "na",
  "name",
  "namely",
  "nay",
  "nd",
  "near",
  "nearly",
  "necessarily",
  "necessary",
  "need",
  "needs",
  "neither",
  "never",
  "nevertheless",
  "new",
  "next",
  "nine",
  "ninety",
  "nobody",
  "non",
  "none",
  "nonetheless",
  "noone",
  "normally",
  "nos",
  "noted",
  "nothing",
  "now",
  "nowhere",
  "o",
  "obtain",
  "obtained",
  "obviously",
  "often",
  "oh",
  "ok",
  "okay",
  "old",
  "omitted",
  "one",
  "ones",
  "onto",
  "ord",
  "others",
  "otherwise",
  "outside",
  "overall",
  "owing",
  "p",
  "page",
  "pages",
  "part",
  "particular",
  "particularly",
  "past",
  "per",
  "perhaps",
  "placed",
  "please",
  "plus",
  "poorly",
  "possible",
  "possibly",
  "potentially",
  "pp",
  "predominantly",
  "present",
  "previously",
  "primarily",
  "probably",
  "promptly",
  "proud",
  "provides",
  "put",
  "q",
  "que",
  "quickly",
  "quite",
  "qv",
  "r",
  "ran",
  "rather",
  "rd",
  "re",
  "readily",
  "really",
  "recent",
  "recently",
  "ref",
  "refs",
  "regarding",
  "regardless",
  "regards",
  "related",
  "relatively",
  "research",
  "respectively",
  "resulted",
  "resulting",
  "results",
  "right",
  "run",
  "s",
  "said",
  "saw",
  "say",
  "saying",
  "says",
  "sec",
  "section",
  "see",
  "seeing",
  "seem",
  "seemed",
  "seeming",
  "seems",
  "seen",
  "self",
  "selves",
  "sent",
  "seven",
  "several",
  "shall",
  "shed",
  "shes",
  "show",
  "showed",
  "shown",
  "showns",
  "shows",
  "significant",
  "significantly",
  "similar",
  "similarly",
  "since",
  "six",
  "slightly",
  "somebody",
  "somehow",
  "someone",
  "somethan",
  "something",
  "sometime",
  "sometimes",
  "somewhat",
  "somewhere",
  "soon",
  "sorry",
  "specifically",
  "specified",
  "specify",
  "specifying",
  "still",
  "stop",
  "strongly",
  "sub",
  "substantially",
  "successfully",
  "sufficiently",
  "suggest",
  "sup",
  "sure",
  "t",
  "take",
  "taken",
  "taking",
  "tell",
  "tends",
  "th",
  "thank",
  "thanks",
  "thanx",
  "that'll",
  "thats",
  "that've",
  "thence",
  "thereafter",
  "thereby",
  "thered",
  "therefore",
  "therein",
  "there'll",
  "thereof",
  "therere",
  "theres",
  "thereto",
  "thereupon",
  "there've",
  "theyd",
  "theyre",
  "think",
  "thou",
  "though",
  "thoughh",
  "thousand",
  "throug",
  "throughout",
  "thru",
  "thus",
  "til",
  "tip",
  "together",
  "took",
  "toward",
  "towards",
  "tried",
  "tries",
  "truly",
  "try",
  "trying",
  "ts",
  "twice",
  "two",
  "u",
  "un",
  "unfortunately",
  "unless",
  "unlike",
  "unlikely",
  "unto",
  "upon",
  "ups",
  "us",
  "use",
  "used",
  "useful",
  "usefully",
  "usefulness",
  "uses",
  "using",
  "usually",
  "v",
  "value",
  "various",
  "'ve",
  "via",
  "viz",
  "vol",
  "vols",
  "vs",
  "w",
  "want",
  "wants",
  "wasnt",
  "way",
  "wed",
  "welcome",
  "went",
  "werent",
  "whatever",
  "what'll",
  "whats",
  "whence",
  "whenever",
  "whereafter",
  "whereas",
  "whereby",
  "wherein",
  "wheres",
  "whereupon",
  "wherever",
  "whether",
  "whim",
  "whither",
  "whod",
  "whoever",
  "whole",
  "who'll",
  "whomever",
  "whos",
  "whose",
  "widely",
  "willing",
  "wish",
  "within",
  "without",
  "wont",
  "words",
  "world",
  "wouldnt",
  "www",
  "x",
  "y",
  "yes",
  "yet",
  "youd",
  "youre",
  "z",
  "zero",
  "'tis",
  "'twas",
  "10",
  "39",
  "a's",
  "ableabout",
  "abroad",
  "ad",
  "adopted",
  "ae",
  "af",
  "ag",
  "ago",
  "ahead",
  "ai",
  "ain't",
  "aint",
  "al",
  "allow",
  "allows",
  "alongside",
  "amid",
  "amidst",
  "amoungst",
  "amount",
  "ao",
  "apart",
  "appear",
  "appreciate",
  "appropriate",
  "aq",
  "ar",
  "area",
  "areas",
  "arpa",
  "asked",
  "asks",
  "associated",
  "au",
  "aw",
  "az",
  "ba",
  "backed",
  "backing",
  "backs",
  "backward",
  "backwards",
  "bb",
  "bd",
  "began",
  "beings",
  "best",
  "better",
  "bf",
  "bg",
  "bh",
  "bi",
  "big",
  "bill",
  "billion",
  "bj",
  "bm",
  "bn",
  "bo",
  "bottom",
  "br",
  "bs",
  "bt",
  "buy",
  "bv",
  "bw",
  "bz",
  "c'mon",
  "c's",
  "call",
  "cant",
  "caption",
  "case",
  "cases",
  "cc",
  "cd",
  "cf",
  "cg",
  "ch",
  "changes",
  "ci",
  "ck",
  "cl",
  "clear",
  "clearly",
  "click",
  "cm",
  "cmon",
  "cn",
  "co.",
  "computer",
  "con",
  "concerning",
  "consequently",
  "consider",
  "considering",
  "copy",
  "corresponding",
  "could've",
  "couldn",
  "course",
  "cr",
  "cry",
  "cs",
  "cu",
  "currently",
  "cv",
  "cx",
  "cy",
  "cz",
  "dare",
  "daren't",
  "darent",
  "de",
  "dear",
  "definitely",
  "describe",
  "described",
  "despite",
  "detail",
  "didn",
  "didnt",
  "differ",
  "differently",
  "directly",
  "dj",
  "dk",
  "dm",
  "doesn",
  "doesnt",
  "don",
  "dont",
  "doubtful",
  "downed",
  "downing",
  "downs",
  "dz",
  "early",
  "ec",
  "ee",
  "eh",
  "eleven",
  "empty",
  "ended",
  "ends",
  "entirely",
  "er",
  "es",
  "evenly",
  "evermore",
  "exactly",
  "example",
  "face",
  "faces",
  "fact",
  "facts",
  "fairly",
  "farther",
  "felt",
  "fewer",
  "fi",
  "fifteen",
  "fifty",
  "fify",
  "fill",
  "find",
  "finds",
  "fire",
  "fj",
  "fk",
  "fm",
  "fo",
  "forever",
  "forty",
  "forward",
  "fr",
  "free",
  "front",
  "full",
  "fully",
  "furthered",
  "furthering",
  "furthers",
  "fx",
  "ga",
  "gb",
  "gd",
  "ge",
  "general",
  "generally",
  "gf",
  "gg",
  "gh",
  "gi",
  "gl",
  "gm",
  "gmt",
  "gn",
  "going",
  "good",
  "goods",
  "gov",
  "gp",
  "gq",
  "gr",
  "great",
  "greater",
  "greatest",
  "greetings",
  "group",
  "grouped",
  "grouping",
  "groups",
  "gs",
  "gt",
  "gu",
  "gw",
  "gy",
  "hadnt",
  "half",
  "hasn",
  "hasnt",
  "haven",
  "havent",
  "hell",
  "hello",
  "help",
  "herse”",
  "high",
  "higher",
  "highest",
  "himse”",
  "hk",
  "hm",
  "hn",
  "homepage",
  "hopefully",
  "how'd",
  "how'll",
  "hr",
  "ht",
  "htm",
  "html",
  "http",
  "hu",
  "i.e.",
  "ignored",
  "ii",
  "il",
  "ill",
  "inasmuch",
  "inc.",
  "indicate",
  "indicated",
  "indicates",
  "inner",
  "inside",
  "insofar",
  "int",
  "interest",
  "interested",
  "interesting",
  "interests",
  "io",
  "iq",
  "ir",
  "isn",
  "isnt",
  "it'd",
  "itll",
  "itse”",
  "ive",
  "je",
  "jm",
  "jo",
  "join",
  "jp",
  "ke",
  "keys",
  "kh",
  "ki",
  "kind",
  "kn",
  "knew",
  "kp",
  "kr",
  "kw",
  "ky",
  "kz",
  "la",
  "large",
  "latest",
  "lb",
  "lc",
  "length",
  "li",
  "likewise",
  "lk",
  "ll",
  "long",
  "longer",
  "longest",
  "low",
  "lower",
  "lr",
  "ls",
  "lt",
  "lu",
  "lv",
  "ly",
  "ma",
  "making",
  "man",
  "mayn't",
  "maynt",
  "mc",
  "md",
  "member",
  "members",
  "men",
  "mh",
  "microsoft",
  "might've",
  "mightn't",
  "mightnt",
  "mil",
  "mill",
  "mine",
  "minus",
  "mk",
  "mm",
  "mn",
  "mo",
  "move",
  "mp",
  "mq",
  "ms",
  "msie",
  "mt",
  "mu",
  "must've",
  "mustnt",
  "mv",
  "mw",
  "mx",
  "myse”",
  "mz",
  "nc",
  "ne",
  "needed",
  "needing",
  "needn't",
  "neednt",
  "net",
  "netscape",
  "neverf",
  "neverless",
  "newer",
  "newest",
  "nf",
  "ng",
  "ni",
  "nl",
  "no-one",
  "notwithstanding",
  "novel",
  "np",
  "nr",
  "nu",
  "null",
  "number",
  "numbers",
  "nz",
  "older",
  "oldest",
  "om",
  "one's",
  "open",
  "opened",
  "opening",
  "opens",
  "opposite",
  "order",
  "ordered",
  "ordering",
  "orders",
  "org",
  "oughtn't",
  "oughtnt",
  "pa",
  "parted",
  "parting",
  "parts",
  "pe",
  "pf",
  "pg",
  "ph",
  "pk",
  "pl",
  "place",
  "places",
  "pm",
  "pmid",
  "pn",
  "point",
  "pointed",
  "pointing",
  "points",
  "pr",
  "presented",
  "presenting",
  "presents",
  "presumably",
  "problem",
  "problems",
  "provided",
  "pt",
  "puts",
  "pw",
  "py",
  "qa",
  "reasonably",
  "reserved",
  "ring",
  "ro",
  "room",
  "rooms",
  "round",
  "ru",
  "rw",
  "sa",
  "sb",
  "sc",
  "sd",
  "se",
  "second",
  "secondly",
  "seconds",
  "sees",
  "sensible",
  "serious",
  "seriously",
  "seventy",
  "sg",
  "sh",
  "shant",
  "shell",
  "should've",
  "shouldn",
  "shouldnt",
  "showing",
  "si",
  "side",
  "sides",
  "sincere",
  "site",
  "sixty",
  "sj",
  "sk",
  "sl",
  "sm",
  "small",
  "smaller",
  "smallest",
  "sn",
  "someday",
  "sr",
  "st",
  "state",
  "states",
  "su",
  "sv",
  "sy",
  "system",
  "sz",
  "t's",
  "tc",
  "td",
  "ten",
  "test",
  "text",
  "tf",
  "tg",
  "thatll",
  "thatve",
  "there'd",
  "there're",
  "therell",
  "thereve",
  "theyll",
  "theyve",
  "thick",
  "thin",
  "thing",
  "things",
  "thinks",
  "third",
  "thirty",
  "thorough",
  "thoroughly",
  "thought",
  "thoughts",
  "three",
  "till",
  "tis",
  "tj",
  "tk",
  "tm",
  "tn",
  "today",
  "top",
  "tp",
  "tr",
  "trillion",
  "tt",
  "turn",
  "turned",
  "turning",
  "turns",
  "tv",
  "tw",
  "twas",
  "twelve",
  "twenty",
  "tz",
  "ua",
  "ug",
  "uk",
  "um",
  "underneath",
  "undoing",
  "upwards",
  "uucp",
  "uy",
  "uz",
  "va",
  "vc",
  "ve",
  "versus",
  "vg",
  "vi",
  "vn",
  "vu",
  "wanted",
  "wanting",
  "wasn",
  "ways",
  "web",
  "webpage",
  "website",
  "well",
  "wells",
  "weren",
  "weve",
  "wf",
  "what'd",
  "what've",
  "whatll",
  "whatve",
  "when'd",
  "when'll",
  "where'd",
  "where'll",
  "whichever",
  "whilst",
  "who'd",
  "wholl",
  "why'd",
  "why'll",
  "width",
  "will",
  "won",
  "wonder",
  "work",
  "worked",
  "working",
  "works",
  "would've",
  "wouldn",
  "ws",
  "ye",
  "yeah",
  "year",
  "years",
  "youll",
  "young",
  "younger",
  "youngest",
  "youve",
  "yt",
  "yu",
  "za",
  "zm",
  "zr",
  "I",
  "herse",
  "himse",
  "yond",
  "yonder",
  "yon",
  "zillion",
  "umpteen",
  "username",
  "uponed",
  "upons",
  "uponing",
  "upping",
  "upped",
  "unliker",
  "unlikest",
  "usedest",
  "rath",
  "rathest",
  "rathe",
  "relate",
  "res",
  "respecting",
  "qua",
  "neaths",
  "neath",
  "nethe",
  "nethermost",
  "necessariest",
  "necessarier",
  "nigh",
  "nighest",
  "nigher",
  "nobodies",
  "nowheres",
  "noes",
  "nothings",
  "nathless",
  "natheless",
  "tills",
  "tilled",
  "tilling",
  "towardest",
  "towarder",
  "thy",
  "thyself",
  "thous",
  "thouses",
  "thoroughest",
  "thorougher",
  "thruer",
  "thruest",
  "thro",
  "throughest",
  "througher",
  "thine",
  "thises",
  "thee",
  "thenest",
  "thener",
  "therer",
  "therest",
  "owt",
  "owning",
  "owned",
  "owns",
  "otherwisest",
  "otherwiser",
  "oftener",
  "oftenest",
  "offs",
  "offest",
  "oughts",
  "ourself",
  "outest",
  "outed",
  "outwith",
  "outs",
  "overallest",
  "overaller",
  "overalls",
  "overs",
  "orer",
  "orest",
  "oneself",
  "onest",
  "ons",
  "atween",
  "athwart",
  "atop",
  "afore",
  "afterward",
  "afterest",
  "afterer",
  "ain",
  "anent",
  "anear",
  "andor",
  "ares",
  "aest",
  "aer",
  "abaft",
  "abafter",
  "abaftest",
  "abovest",
  "abover",
  "abouter",
  "aboutest",
  "aid",
  "apartest",
  "aparter",
  "appeared",
  "appears",
  "appearing",
  "appropriating",
  "appropriatest",
  "appropriates",
  "appropriater",
  "appropriated",
  "allest",
  "aller",
  "allyou",
  "alls",
  "albeit",
  "asides",
  "aslant",
  "ases",
  "astrider",
  "astride",
  "astridest",
  "astraddlest",
  "astraddler",
  "astraddle",
  "availablest",
  "availabler",
  "aughts",
  "aught",
  "variousest",
  "variouser",
  "vis-a-vis",
  "vis-a-viser",
  "vis-a-visest",
  "veriest",
  "verier",
  "gotta",
  "byandby",
  "by-and-by",
  "bist",
  "buts",
  "becomings",
  "becominger",
  "becomingest",
  "behinds",
  "beforehandest",
  "beforehander",
  "bettered",
  "betters",
  "bettering",
  "betwixt",
  "beneath",
  "mucher",
  "muchest",
  "musts",
  "musths",
  "musth",
  "main",
  "mayest",
  "mauger",
  "maugre",
  "meanwhiles",
  "mights",
  "midst",
  "midsts",
  "huh",
  "humph",
  "hereafters",
  "hadst",
  "haves",
  "hast",
  "hae",
  "hath",
  "hitherest",
  "hitherer",
  "how-do-you-do",
  "howdoyoudo",
  "hoos",
  "hoo",
  "woulded",
  "woulding",
  "woulds",
  "wast",
  "wert",
  "withal",
  "whateverer",
  "whateverest",
  "whatsoeverer",
  "whatsoeverest",
  "whatsoever",
  "whencesoever",
  "whensoever",
  "whenas",
  "wheen",
  "whereto",
  "whereon",
  "whereof",
  "wherewithal",
  "wherewith",
  "whereinto",
  "wheresoever",
  "wherefrom",
  "whichsoever",
  "whiles",
  "whithersoever",
  "whosoever",
  "whoso",
  "syne",
  "syn",
  "shalling",
  "shalled",
  "shalls",
  "shoulding",
  "shoulded",
  "shoulds",
  "sayyid",
  "sayid",
  "saider",
  "saidest",
  "samest",
  "sames",
  "samer",
  "saved",
  "sans",
  "sanses",
  "sanserifs",
  "sanserif",
  "soer",
  "soest",
  "sobeit",
  "sometimest",
  "sometimer",
  "severaler",
  "severalest",
  "seriousest",
  "seriouser",
  "senza",
  "send",
  "seemingest",
  "seeminger",
  "seemings",
  "summat",
  "sups",
  "supping",
  "supped",
  "sine",
  "sines",
  "sith",
  "stopped",
  "plaintiff",
  "plenty",
  "plenties",
  "pleased",
  "pleases",
  "particulars",
  "particularest",
  "particularer",
  "pro",
  "providing",
  "provide",
  "layabout",
  "layabouts",
  "latterest",
  "latterer",
  "latters",
  "lots",
  "lotting",
  "lotted",
  "lot",
  "ifs",
  "info",
  "idem",
  "idemer",
  "idemest",
  "immediatest",
  "immediater",
  "inwards",
  "inwardest",
  "inwarder",
  "indicating",
  "fs",
  "figupon",
  "figupons",
  "figupon…"
]

// Words that break phrase segments AND become their own individual nodes.
// Unlike stopwords (which are dropped), these appear in the graph as standalone terms.
const isolatorWords = [
  // Comparison
  'better', 'worse', 'best', 'worst', 'similar', 'similarly', 'faster', 'slower',
  'cheaper', 'easier', 'harder', 'higher', 'lower', 'larger', 'smaller',
  'vs', 'versus', 'compared', 'unlike', 'like',
  // Recommendation / suggestion
  'recommended', 'recommend', 'suggest', 'suggested', 'alternative', 'instead',
  'try', 'use', 'switch', 'replace', 'prefer', 'preferred',
  // Quality / sentiment
  // 'free', 'paid', 'cheap', 'expensive', 'fast', 'slow', 'easy', 'hard',
  // 'fully', 'powerful', 'simple', 'popular', 'great', 'good', 'bad',
  // Connective / contrast
  // 'but', 'however', 'although', 'though', 'while', 'whereas', 'yet',
  // 'still', 'otherwise',
]

const GRAPH_WIDTH = 1000;
const GRAPH_HEIGHT = 1000;
const GRAPH_PADDING = 40;
const MIN_NODE_DISTANCE = 34;

function buildKeywordUnits(text, stopwordSet, isolatorSet) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, ' | ')
    .split(/\s+/)
    .map(word => {
      if (isolatorSet && isolatorSet.has(word)) return `|${word}|`;
      if (stopwordSet.has(word)) return '|';
      return word;
    })
    .join(' ')
    .split('|')
    .map(segment => segment.trim())
    .filter(segment => segment.length > 0);
}

function separateOverlappingNodes(nodes, minDistance) {
  if (nodes.length < 2) {
    return;
  }

  for (let iteration = 0; iteration < 30; iteration++) {
    let moved = false;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= minDistance) {
          continue;
        }

        if (distance < 0.001) {
          const angle = ((i + 1) * 37 + (j + 1) * 17) % 360;
          const radians = angle * (Math.PI / 180);
          dx = Math.cos(radians);
          dy = Math.sin(radians);
          distance = 1;
        }

        const push = (minDistance - distance) / 2;
        const offsetX = (dx / distance) * push;
        const offsetY = (dy / distance) * push;

        a.x = Math.max(GRAPH_PADDING, Math.min(GRAPH_WIDTH - GRAPH_PADDING, a.x - offsetX));
        a.y = Math.max(GRAPH_PADDING, Math.min(GRAPH_HEIGHT - GRAPH_PADDING, a.y - offsetY));
        b.x = Math.max(GRAPH_PADDING, Math.min(GRAPH_WIDTH - GRAPH_PADDING, b.x + offsetX));
        b.y = Math.max(GRAPH_PADDING, Math.min(GRAPH_HEIGHT - GRAPH_PADDING, b.y + offsetY));
        moved = true;
      }
    }

    if (!moved) {
      break;
    }
  }
}

export default function Home() {
  const [text, setText] = useState('');
  const [customStopwords, setCustomStopwords] = useState('');
  const [onlyQA, setOnlyQA] = useState(false);
  const [result, setResult] = useState(null);           // full data
  const [searchTerm, setSearchTerm] = useState('');
  const [minWeight, setMinWeight] = useState(1);
  const [fullNodes, setFullNodes] = useState([]);       // with stable positions
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  const [copied, setCopied] = useState(false);

  const copyAssociations = () => {
    if (!result) return;
    let lines;
    if (highlightedData.hasSearch) {
      lines = Array.from(highlightedData.level1Set)
        .map(term => ({ term, weight: highlightedData.connectionWeightMap.get(term) || 0 }))
        .filter(({ weight }) => weight >= minWeight)
        .sort((a, b) => b.weight - a.weight)
        .map(({ term, weight }) => `${highlightedData.term} → ${term} (${weight})`)
        .join('\n');
    } else {
      lines = [...result.edges]
        .filter(e => e.weight >= minWeight)
        .sort((a, b) => b.weight - a.weight)
        .map(e => `${e.source} → ${e.target} (${e.weight})`)
        .join('\n');
    }
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const buildAssociations = () => {
    const stopwordSet = new Set(defaultStopwords);
    customStopwords.split(',').forEach(w => {
      const trimmed = w.trim().toLowerCase();
      if (trimmed) stopwordSet.add(trimmed);
    });
    // Isolator words take precedence — remove from stopwords so they appear as nodes
    const isolatorSet = new Set(isolatorWords);
    isolatorSet.forEach(w => stopwordSet.delete(w));

    const blocks = text.split('---').map(b => b.trim()).filter(Boolean);
    const edgeMap = new Map();

    const addEdge = (source, target, type) => {
      if (source === target) return;
      const key = [source, target].sort().join('||');
      if (edgeMap.has(key)) edgeMap.get(key).weight++;
      else edgeMap.set(key, { source, target, weight: 1, type });
    };

    for (const block of blocks) {
      const qMatch = block.match(/Q\.\s*([\s\S]*?)(?=A\.|$)/i);
      const aMatch = block.match(/A\.\s*([\s\S]*)$/i);

      const qText = qMatch?.[1]?.trim() || '';
      const aText = aMatch?.[1]?.trim() || '';

      const qWords = [...new Set(buildKeywordUnits(qText, stopwordSet, isolatorSet))];
      const aWords = [...new Set(buildKeywordUnits(aText, stopwordSet, isolatorSet))];

      for (const qw of qWords) {
        for (const aw of aWords) addEdge(qw, aw, 'qa');
      }

      if (!onlyQA) {
        for (let i = 0; i < aWords.length; i++) {
          for (let j = i + 1; j < aWords.length; j++) {
            addEdge(aWords[i], aWords[j], 'aa');
          }
        }
      }
    }

    const nodesList = Array.from(new Set(
      Array.from(edgeMap.values()).flatMap(e => [e.source, e.target])
    ));

    // Run force simulation once for stable layout
    const simNodes = nodesList.map((id) => ({
      id,
      x: Math.random() * (GRAPH_WIDTH - GRAPH_PADDING * 2) + GRAPH_PADDING,
      y: Math.random() * (GRAPH_HEIGHT - GRAPH_PADDING * 2) + GRAPH_PADDING,
      vx: 0,
      vy: 0
    }));

    const nodeById = new Map(simNodes.map(n => [n.id, n]));
    const edges = Array.from(edgeMap.values());

    // Simulate forces
    for (let iter = 0; iter < 200; iter++) {
      const alpha = Math.max(0.008, 1 - iter / 140);

      // Repulsion
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const a = simNodes[i], b = simNodes[j];
          const dx = b.x - a.x || 0.1;
          const dy = b.y - a.y || 0.1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = (7600 / (dist * dist)) * alpha;
          a.vx -= (dx / dist) * force;
          a.vy -= (dy / dist) * force;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }
      }

      // Edge attraction
      for (const edge of edges) {
        const a = nodeById.get(edge.source);
        const b = nodeById.get(edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 150) * 0.045 * alpha;
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
        b.vx -= (dx / dist) * force;
        b.vy -= (dy / dist) * force;
      }

      // Center pull
      for (const n of simNodes) {
        n.vx += (GRAPH_WIDTH / 2 - n.x) * 0.0035 * alpha;
        n.vy += (GRAPH_HEIGHT / 2 - n.y) * 0.0035 * alpha;
      }

      // Update
      for (const n of simNodes) {
        n.vx *= 0.8;
        n.vy *= 0.8;
        n.x = Math.max(GRAPH_PADDING / 2, Math.min(GRAPH_WIDTH - GRAPH_PADDING / 2, n.x + n.vx));
        n.y = Math.max(GRAPH_PADDING / 2, Math.min(GRAPH_HEIGHT - GRAPH_PADDING / 2, n.y + n.vy));
      }
    }

    if (simNodes.length > 1) {
      const xs = simNodes.map(node => node.x);
      const ys = simNodes.map(node => node.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const targetWidth = GRAPH_WIDTH - GRAPH_PADDING * 2;
      const targetHeight = GRAPH_HEIGHT - GRAPH_PADDING * 2;

      for (const node of simNodes) {
        node.x = GRAPH_PADDING + ((node.x - minX) / spanX) * targetWidth;
        node.y = GRAPH_PADDING + ((node.y - minY) / spanY) * targetHeight;
      }

      // Radial repositioning: high-degree nodes closer to center
      const degreeMap = new Map(simNodes.map(n => [n.id, 0]));
      for (const edge of edges) {
        degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
        degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
      }
      const degrees = Array.from(degreeMap.values());
      const maxDeg = Math.max(...degrees);
      const minDeg = Math.min(...degrees);
      const cx = GRAPH_WIDTH / 2;
      const cy = GRAPH_HEIGHT / 2;
      const maxRadius = Math.min(GRAPH_WIDTH, GRAPH_HEIGHT) / 2 - GRAPH_PADDING;

      for (const node of simNodes) {
        const deg = degreeMap.get(node.id) || 0;
        const normDeg = maxDeg > minDeg ? (deg - minDeg) / (maxDeg - minDeg) : 0.5;
        const radius = maxRadius * (1 - normDeg * 0.85);
        const angle = Math.atan2(node.y - cy, node.x - cx);
        node.x = Math.max(GRAPH_PADDING, Math.min(GRAPH_WIDTH - GRAPH_PADDING, cx + Math.cos(angle) * radius));
        node.y = Math.max(GRAPH_PADDING, Math.min(GRAPH_HEIGHT - GRAPH_PADDING, cy + Math.sin(angle) * radius));
      }

      separateOverlappingNodes(simNodes, MIN_NODE_DISTANCE);
    }

    setFullNodes(simNodes);
    setResult({ nodes: simNodes, edges });
    setSearchTerm('');
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Highlight logic only (no repositioning)
  const highlightedData = useMemo(() => {
    if (!result || !searchTerm.trim()) {
      return { nodes: fullNodes, edges: result?.edges || [], term: '', termSet: new Set(), connectionWeightMap: new Map(), maxConnWeight: 1, level1Set: new Set(), hasSearch: false };
    }

    const term = searchTerm.trim().toLowerCase();
    // Match any node whose id equals the term OR contains it as a whole word (word-boundary safe)
    const termRegex = new RegExp(`(?:^|\\s)${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`);
    const termSet = new Set(
      result.nodes
        .map(n => n.id)
        .filter(id => id === term || termRegex.test(id))
    );

    if (termSet.size === 0) {
      return { nodes: fullNodes, edges: result.edges, term: '', termSet: new Set(), connectionWeightMap: new Map(), maxConnWeight: 1, level1Set: new Set(), hasSearch: false };
    }

    const directEdges = result.edges.filter(e => termSet.has(e.source) || termSet.has(e.target));

    const connectionWeightMap = new Map();
    directEdges.forEach(e => {
      const isSourceCenter = termSet.has(e.source);
      const neighbor = isSourceCenter ? e.target : e.source;
      if (!termSet.has(neighbor)) {
        connectionWeightMap.set(neighbor, (connectionWeightMap.get(neighbor) || 0) + e.weight);
      }
    });
    const maxConnWeight = Math.max(...Array.from(connectionWeightMap.values()), 1);
    const level1Set = new Set(connectionWeightMap.keys());

    return {
      nodes: fullNodes,
      edges: result.edges,
      term,
      termSet,
      connectionWeightMap,
      maxConnWeight,
      level1Set,
      hasSearch: true
    };
  }, [result, searchTerm, fullNodes]);

  return (
    <>
      <Head><title>Network Graph</title></Head>

      <main style={{ padding: '20px', background: '#000', color: '#fff', fontFamily: 'system-ui', maxWidth: '100%', width: '100%' }}>
        <h1 style={{ textAlign: 'center' }}>Association Network</h1>

        <div style={{ width: '100%' }}>
          {/* Input fields same as before */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Q. High bounce rate, pagespeed issues\nA. pagespeed, bots, hotjar\n---\nQ. checkout friction\nA. reviews, trust signals`}
            style={{ width: '100%', height: '140px', padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }}
          />

          <input
            type="text"
            value={customStopwords}
            onChange={e => setCustomStopwords(e.target.value)}
            placeholder="Custom stopwords (comma separated)"
            style={{ width: '100%', padding: '10px', margin: '10px 0', background: '#111', border: '1px solid #333', color: '#fff' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '10px 0', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={onlyQA} onChange={e => setOnlyQA(e.target.checked)} />
              Only show Q → A associations
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '14px', fontFamily: 'monospace' }}>
              Min weight
              <input
                type="number"
                min="1"
                value={minWeight}
                onChange={e => setMinWeight(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '60px', padding: '4px 8px', background: '#111', border: '1px solid #333', color: '#fff', fontFamily: 'monospace' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
            <button onClick={buildAssociations}>
              Build Network
            </button>
            {result && (
              <button onClick={copyAssociations}>
                {copied ? 'copied!' : 'copy associations'}
              </button>
            )}
          </div>

          {result && (
            <div style={{ marginTop: '30px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search a word or phrase to highlight (e.g. hotjar, pagespeed issues)..."
                style={{ width: '100%', padding: '12px', fontSize: '16px', background: '#111', border: '1px solid #444', color: '#fff', marginBottom: '10px' }}
              />

              {/* Zoom controls */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                <button onClick={() => setZoom(z => Math.min(z + 0.2, 5))} style={{ padding: '6px 14px', background: '#222', border: '1px solid #444', color: '#fff', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}>+</button>
                <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.2))} style={{ padding: '6px 14px', background: '#222', border: '1px solid #444', color: '#fff', cursor: 'pointer', fontFamily: 'monospace', fontSize: '16px' }}>−</button>
                <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ padding: '6px 14px', background: '#222', border: '1px solid #444', color: '#aaa', cursor: 'pointer', fontFamily: 'monospace', fontSize: '13px' }}>reset</button>
                <span style={{ color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>{Math.round(zoom * 100)}%</span>
              </div>

              <div
                style={{ width: '100%', height: '82vh', overflow: 'hidden', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222', cursor: isPanning.current ? 'grabbing' : 'grab', userSelect: 'none' }}
                onMouseDown={e => {
                  isPanning.current = true;
                  panStart.current = { x: e.clientX, y: e.clientY };
                  panOrigin.current = { ...pan };
                }}
                onMouseMove={e => {
                  if (!isPanning.current) return;
                  setPan({
                    x: panOrigin.current.x + (e.clientX - panStart.current.x),
                    y: panOrigin.current.y + (e.clientY - panStart.current.y),
                  });
                }}
                onMouseUp={() => { isPanning.current = false; }}
                onMouseLeave={() => { isPanning.current = false; }}
              >
                <svg
                  width="100%"
                  height="100%"
                  style={{ display: 'block' }}
                >
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Edges */}
                {(() => {
                  const visibleEdges = highlightedData.edges.filter(e => e.weight >= minWeight);
                  const maxWeight = Math.max(...visibleEdges.map(e => e.weight), 1);
                  return visibleEdges.map((edge, i) => {
                    const source = highlightedData.nodes.find(n => n.id === edge.source);
                    const target = highlightedData.nodes.find(n => n.id === edge.target);
                    if (!source || !target) return null;

                    const isConnected = highlightedData.hasSearch &&
                      (highlightedData.termSet?.has(edge.source) || highlightedData.termSet?.has(edge.target));
                    const connRatio = isConnected ? edge.weight / highlightedData.maxConnWeight : 0;
                    const strokeOpacity = !highlightedData.hasSearch
                      ? 0.05 + (edge.weight / maxWeight) * 0.15
                      : isConnected
                        ? 0.15 + connRatio * 0.15
                        : 0.02;
                    const strokeWidth = !highlightedData.hasSearch
                      ? 0.5 + (edge.weight / maxWeight) * 1.5
                      : isConnected
                        ? 0.5 + connRatio * 2
                        : 0.2;

                    return (
                      <line
                        key={i}
                        x1={source.x} y1={source.y}
                        x2={target.x} y2={target.y}
                        stroke="#e5e7eb"
                        strokeOpacity={strokeOpacity}
                        strokeWidth={strokeWidth}
                      />
                    );
                  });
                })()}

                {/* Nodes */}
                {(() => {
                  const activeNodeIds = new Set(
                    highlightedData.edges
                      .filter(e => e.weight >= minWeight)
                      .flatMap(e => [e.source, e.target])
                  );
                  return highlightedData.nodes.filter(n => activeNodeIds.has(n.id));
                })().map((node) => {
                  const isCenter = highlightedData.hasSearch && (highlightedData.termSet?.has(node.id) ?? false);
                  const connWeight = highlightedData.hasSearch ? highlightedData.connectionWeightMap.get(node.id) : undefined;
                  const isConnected = connWeight !== undefined;
                  const connRatio = isConnected ? connWeight / highlightedData.maxConnWeight : 0;
                  const r = isCenter ? 22 : 12;
                  const nodeOpacity = !highlightedData.hasSearch ? 1
                    : isCenter ? 1
                      : isConnected ? 0.2 + connRatio * 0.8
                        : 0.1;
                  const brightness = Math.round(80 + connRatio * 175);
                  const textFill = !highlightedData.hasSearch ? '#888'
                    : isCenter ? '#fff'
                      : isConnected ? `rgb(${brightness},${brightness},${brightness})`
                        : '#333';

                  return (
                    <g key={node.id} opacity={nodeOpacity}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r}
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth={isCenter ? 3.5 : 1.2}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill={textFill}
                        fontSize={isCenter ? "13.5" : isConnected ? "11" : "9.5"}
                        fontFamily="monospace"
                        fontWeight={isCenter || isConnected ? "bold" : "normal"}
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
                </g>
              </svg>
              </div>

              {searchTerm && highlightedData.hasSearch && highlightedData.level1Set.size > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px', fontFamily: 'monospace' }}>
                    Terms associated with <strong style={{ color: '#fff' }}>"{searchTerm}"</strong>
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', color: '#666', fontWeight: 'normal' }}>#</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', color: '#666', fontWeight: 'normal' }}>Term</th>
                        <th style={{ textAlign: 'right', padding: '8px 12px', color: '#666', fontWeight: 'normal' }}>Co-occurrences</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(highlightedData.level1Set)
                        .map(term => ({
                          term,
                          weight: highlightedData.connectionWeightMap.get(term) || 0
                        }))
                        .filter(({ weight }) => weight >= minWeight)
                        .sort((a, b) => b.weight - a.weight)
                        .map(({ term, weight }, i) => (
                          <tr
                            key={term}
                            style={{ borderBottom: '1px solid #1a1a1a', cursor: 'pointer' }}
                            onClick={() => setSearchTerm(term)}
                          >
                            <td style={{ padding: '8px 12px', color: '#555' }}>{i + 1}</td>
                            <td style={{ padding: '8px 12px', color: '#c8c8c8' }}>{term}</td>
                            <td style={{ padding: '8px 12px', color: '#666', textAlign: 'right' }}>{weight}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {searchTerm && (
                <p style={{ textAlign: 'center', marginTop: '12px', color: '#aaa' }}>
                  Highlighting <strong>"{searchTerm}"</strong> and its direct connections
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}