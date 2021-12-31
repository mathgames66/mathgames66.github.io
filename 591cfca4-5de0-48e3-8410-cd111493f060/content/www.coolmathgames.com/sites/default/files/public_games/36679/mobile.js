
(function() {

  // strip vendor prefixes
  window.AudioContext = window.AudioContext
    || window.webkitAudioContext
    || window.mozAudioContext
    || window.oAudioContext
    || window.msAudioContext

  // make AudioContext a singleton so we control it
  var ctx = new window.AudioContext
  window.AudioContext = function() { return ctx }

  // create overlay
  var o = document.createElement('div')
  o.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'right: 0',
    'bottom: 0',
		'z-index: 99999999',
    'color: white',
    'background-color: black',
    'text-align: center',
    'overflow-y: scroll'
  ].map(function(p) { return p + ';' }).join('');
  o.id = "mobile-overlay";
  
  let p = document.createElement("button");
  p.id = "play-btn";

  o.appendChild(p);
  document.body.appendChild(o);

  // disable scrolling
  // document.body.style.overflow = 'hidden'

  let isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
!window.MSStream
  if(
       navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    || isIOS
  ) {
    var navIsMobile = true;
  } else {
    var navIsMobile = false;
  }
  
  if (!navIsMobile) {
    startGame();
  } else {
    p.onclick = startGame;
  }
  
  function startGame() {

    if (navIsMobile) {
      updateBtns();
    }

    // ...until overlay is clicked
    // document.body.style.overflow = ''

    // then unlock AudioContext on iOS
    var buffer = ctx.createBuffer(1, 1, 22050)
    var source = ctx.createBufferSource()
    source.connect(ctx.destination)
    if (source.noteOn) source.noteOn(0)
    else source.start(0)

    // dynamically load original script
    var s = document.createElement('script')

    const file = navIsMobile ? 'dodge-mobile.js' : 'dodge.js';
    
    s.setAttribute('src', file)
    document.body.appendChild(s)

    // and delete overlay div
    o.style.display = "none";
  }
})();