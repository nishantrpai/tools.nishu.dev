customElements.define('x-frame-bypass', class extends HTMLIFrameElement {
  static get observedAttributes() {
    return ['src']
  }
  constructor() {
    super()
  }
  attributeChangedCallback() {
    this.load(this.src)
  }
  connectedCallback() {
    this.sandbox = '' + this.sandbox || 'allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation' // all except allow-top-navigation
  }
  load(url, options) {
    console.log('X-Frame-Bypass loading:', url)
    if (!url || !url.startsWith('http'))
      throw new Error(`X-Frame-Bypass src ${url} does not start with http(s)://`)
    console.log('X-Frame-Bypass loading:', url)
    this.srcdoc = `<html>
<head>
	<style>
  *,
  *:after,
  *:before {
    box-sizing: border-box;
    transform-style: preserve-3d;
    background: "black";
  }
  
  body {
    display: grid;
    place-items: center;
    min-height: 100vh;
    font-family:  'Google Sans', sans-serif, system-ui;
    background: #000;
  }
  
  :root {
    --size: 20;
    --coefficient: 1px;
    --timeline: 2.6s;
    --delay: 0.65s;
    --rotation-y: -24;
    --rotation-x: 28;
    --color-one: #3a0ca3;
    --color-two: #4361ee;
    --color-three: #4cc9f0;
  }
  
  .scene {
    position: relative;
    transform: translate3d(0, 0, 100vmin) rotateX(calc(var(--rotation-y, 0) * 1deg)) rotateY(calc(var(--rotation-x, 0) * 1deg)) rotateX(0deg);
  }
  
  body {
    transform-origin: 50% 50%;
    animation: scale var(--timeline) var(--delay) infinite linear;
  }
  
  @keyframes scale {
    0%, 10% {
      transform: scaleX(1) scaleY(1);
    }
    35%, 100% {
      transform: scaleX(0.5) scaleY(0.5);
    }
  }
  
  .shadow {
    width: calc(var(--size) * var(--coefficient));
    position: absolute;
    bottom: 0;
    aspect-ratio: 1;
    transform-origin: 50% 50%;
    background: hsl(210 80% 50% / 0.2);
    transform: rotateX(90deg) translate3d(0, 0, calc((var(--size) * (var(--coefficient) * -0.5)) - 1px)) scale(0.96);
    animation: squish-squosh var(--timeline) var(--delay) infinite, fade var(--timeline) var(--delay) infinite;
    background: black;
  }
  
  .loader {
    --depth: var(--size);
    --color: var(--color-one, #8338EC);
    width: calc(var(--depth) * var(--coefficient));
    aspect-ratio: 1;
    transform-origin: 50% 50%;
    animation: squish-squosh var(--timeline) var(--delay) infinite;
  }
  
  .spinner {
    animation: spin var(--timeline) var(--delay) infinite;
  }
  
  .jumper {
    animation: jump var(--timeline) var(--delay) infinite;
  }
  
  @keyframes squish-squosh {
    0%, 50%, 60% {
      scale:  1 1 1;
    }
    10%, 35% {
      scale: 1.2 0.8 1.2;
    }
    25% {
      scale: 0.8 1.2 0.8;
    }
    70% {
      scale: 1 1 2;
    }
    80% {
      scale: 2 1 2;
    }
    90%, 100% {
      scale: 2 2 2;
    }
  }
  
  
  @keyframes fade {
    0%, 10%, 40%, 50%, 60%, 100% {
      opacity: 1;
    }
    25% {
      opacity: 0.5;
    }
  }
  
  @keyframes spin {
    0%, 10% { rotate: 0deg; }
    30%, 100% { rotate: -360deg; }
  }
  @keyframes jump {
    0%, 10%, 35%, 50% {
      translate: 0 0;
    }
    25% {
      translate: 0 -150%;
    }
  }
  
  /* Cuboid boilerplate code */
  .cuboid {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .cuboid__side {
    background: var(--color);
    position: absolute;
  }
  .cuboid__side:nth-of-type(1) {
    --b: 1.1;
    height: calc(var(--depth, 20) * var(--coefficient));
    width: 100%;
    top: 0;
    transform: translate(0, -50%) rotateX(90deg);
  }
  .cuboid__side:nth-of-type(2) {
    --b: 0.9;
    --color: var(--color-three, #FF006E);
    height: 100%;
    width: calc(var(--depth, 20) * var(--coefficient));
    top: 50%;
    right: 0;
    transform: translate(50%, -50%) rotateY(90deg);
  }
  .cuboid__side:nth-of-type(3) {
    --b: 1;
    width: 100%;
    height: calc(var(--depth, 20) * var(--coefficient));
    bottom: 0;
    transform: translate(0%, 50%) rotateX(90deg);
  }
  .cuboid__side:nth-of-type(4) {
    --b: 1;
    --color: var(--color-three, #FF006E);
    height: 100%;
    width: calc(var(--depth, 20) * var(--coefficient));
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%) rotateY(90deg);
  }
  .cuboid__side:nth-of-type(5) {
    --b: 1;
    --color: var(--color-two, #3A86EF);
    height: 100%;
    width: 100%;
    transform: translate3d(0, 0, calc(var(--depth, 20) * (var(--coefficient) * 0.5)));
    top: 0;
    left: 0;
  }
  .cuboid__side:nth-of-type(6) {
    --b: 1.2;
    height: 100%;
    width: 100%;
    transform: translate3d(0, 0, calc(var(--depth, 20) * (var(--coefficient) * -0.5))) rotateY(180deg);
    top: 0;
    left: 0;
  }
	</style>
</head>
<body>
<div class="scene">
  <div class="shadow"></div>
  <div class="jumper">
    <div class="spinner">
      <div class="scaler">
        <div class="loader">
          <div class="cuboid">
            <div class="cuboid__side"></div>
            <div class="cuboid__side"></div>
            <div class="cuboid__side"></div>
            <div class="cuboid__side"></div>
            <div class="cuboid__side"></div>
            <div class="cuboid__side"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

</body>
</html>`
    this.fetchProxy(url, options, 0).then(res => res.text()).then(data => {
      // if url is missing https://, append it
      if (!url.startsWith('https://') && !url.startsWith('http://')) url = 'https://' + url
      console.log('X-Frame-Bypass loaded:', url)
      if (data)
        this.srcdoc = data.replace(/<head([^>]*)>/i, `<head$1>
	<base href="${url}">
	<script>
	// X-Frame-Bypass navigation event handlers
  window.addEventListener('fetch', e => {
    const {url} = e.request;
    console.log('click', url)
  }
	document.addEventListener('click', e => {
		if (frameElement && document.activeElement && document.activeElement.href) {
			e.preventDefault()
      console.log('document.activeElement.href', document.activeElement.href)
			frameElement.load(document.activeElement.href)
		}
	})
	document.addEventListener('submit', e => {
		if (frameElement && document.activeElement && document.activeElement.form && document.activeElement.form.action) {
			e.preventDefault()
			if (document.activeElement.form.method === 'post')
				frameElement.load(document.activeElement.form.action, {method: 'post', body: new FormData(document.activeElement.form)})
			else
				frameElement.load(document.activeElement.form.action + '?' + new URLSearchParams(new FormData(document.activeElement.form)))
		}
	})
	</script>`)
    }).catch(e => console.error('Cannot load X-Frame-Bypass:', e))
  }
  fetchProxy(url, options, i) {

    if (url.includes('reddit.com')) url = url.replace('www.reddit.com', 'embed.reddit.com')

    const proxies = (options || {}).proxies || [
      '',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.codetabs.com/v1/proxy/?quest=',
    ]
    return fetch(proxies[i] + url, {
      headers: {
        Origin: 'null',
      }
    }).then(res => {
      if (!res.ok)
        throw new Error(`${res.status} ${res.statusText}`);
      return res
    }).catch(error => {
      if (i === proxies.length - 1)
        throw error
      return this.fetchProxy(url, options, i + 1)
    })
  }
}, { extends: 'iframe' })