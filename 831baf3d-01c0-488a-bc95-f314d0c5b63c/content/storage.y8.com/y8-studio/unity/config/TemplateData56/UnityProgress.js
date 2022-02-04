const rootPath = '/config/TemplateData56';

function UnityProgress(gameInstance, progress) {
  if (!gameInstance.Module) {
    return;
  }

  if (!gameInstance.logo) {
    gameInstance.logo = document.createElement("div");
    gameInstance.logo.className = "logo " + gameInstance.Module.splashScreenStyle;
    gameInstance.container.appendChild(gameInstance.logo);
  }

  if (!gameInstance.progress) {
    gameInstance.progress = document.createElement("div");
    gameInstance.progress.className = "progress " + gameInstance.Module.splashScreenStyle;
    gameInstance.progress.empty = document.createElement("div");
    gameInstance.progress.empty.className = "empty";
    gameInstance.progress.appendChild(gameInstance.progress.empty);
    gameInstance.progress.full = document.createElement("div");
    gameInstance.progress.full.className = "full";
    gameInstance.progress.appendChild(gameInstance.progress.full);
    gameInstance.container.appendChild(gameInstance.progress);
    gameInstance.textProgress = document.createElement("div");
    gameInstance.textProgress.className = "text";
    gameInstance.container.appendChild(gameInstance.textProgress);
  }

  gameInstance.progress.full.style.width = (100 * progress) + "%";
  gameInstance.progress.empty.style.width = (100 * (1 - progress)) + "%";
  gameInstance.textProgress.innerHTML = 'Loading: ' + Math.floor(progress * 100) + '%';

  if (progress == 1) {
    gameInstance.textProgress.innerHTML = 'Running... <img src="' + rootPath + '/gears.gif" class="spinner" />';
  }

  if (progress == 'complete') {
    gameInstance.logo.style.display = 'none';
    gameInstance.progress.style.display = 'none';
    gameInstance.textProgress.style.display = 'none';

    // see shared/EnableSound.js
    const event = new Event('removeSoundOverlay');
    document.dispatchEvent(event);
  }
}
