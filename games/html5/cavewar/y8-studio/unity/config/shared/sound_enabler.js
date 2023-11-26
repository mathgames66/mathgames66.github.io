// Leaving just for page to not throw error on body click
function enableSound() {
  return;
}

!function() {
  function buildSoundOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('sound-overlay');
    overlay.setAttribute('id', 'sound-overlay');
    return overlay;
  }

  function buildSoundText() {
    const textNode = document.createTextNode('Click here to enable sound');
    const textSpan = document.createElement('span');
    textSpan.classList.add('sound-text');
    textSpan.appendChild(textNode);
    return textSpan;
  }

  if (BrowserDetector.chrome && BrowserDetector.version >= 66) {
    const soundOverlay = buildSoundOverlay();
    soundOverlay.appendChild(buildSoundText());

    document.addEventListener('DOMContentLoaded', function() {
      var root = document.getElementsByClassName('webgl-content')[0];

      if (!root) {
        root = document.getElementsByClassName('template-wrap')[0];
      }

      if (!root) {
        root = document.getElementsByClassName('unity-desktop')[0];
      }

      root.appendChild(soundOverlay);
    });

    'click removeSoundOverlay'
      .split(' ')
      .forEach(e => document.addEventListener(e, function() {
        soundOverlay.style.display = 'none';
      }, false));
  }
}();
