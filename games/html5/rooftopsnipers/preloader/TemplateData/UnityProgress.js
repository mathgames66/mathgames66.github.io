function UnityProgress (dom) {
  var root_path = '../preloader/TemplateData';
  this.progress = 0.0;
  this.message = "";
  this.dom = dom;

  var parent = dom.parentNode;

  var background = document.createElement("div");
  background.setAttribute('id', 'background');
  parent.appendChild(background);
  this.background = background;

  var screen = document.createElement("div");
  screen.setAttribute('id', 'screen');
  background.appendChild(screen);

  var logoImage = document.createElement("div");
  logoImage.setAttribute('id', 'logo');
  screen.appendChild(logoImage);
  this.logoImage = logoImage;

  var progressFrameLoader = document.createElement("div");
  progressFrameLoader.setAttribute('id', 'progress-frame-loader');
  screen.appendChild(progressFrameLoader);

  var progressFrame = document.createElement("img");
  progressFrame.setAttribute('id', 'progress-frame');
  progressFrame.src = root_path + "/loadingbar.png"; 
  progressFrameLoader.appendChild(progressFrame);
  this.progressFrame = progressFrame;

  var progressBarLoader = document.createElement("div");
  progressBarLoader.setAttribute('id', 'progress-bar-loader');
  screen.appendChild(progressBarLoader);

  var progressBar = document.createElement("img");
  progressBar.setAttribute('id', 'progress-bar');
  progressBar.src = root_path + "/fullbar.png"; 
  progressBarLoader.appendChild(progressBar);
  this.progressBar = progressBar;

  var messageArea = document.createElement("p");
  messageArea.setAttribute('id', 'message-area');
  screen.appendChild(messageArea);
  this.messageArea = messageArea;


  this.SetProgress = function (progress) { 
    if (this.progress < progress) {
      this.progress = progress;
    }
    if (progress == 1) {
      this.SetMessage('Preparing...');
    }
    this.progressFrame.style.visibility = "visible";
    this.progressBar.style.display = "inline";			
    this.Update();
  }

  this.SetMessage = function (message) {
    if (message == "Loading WebGL Player, Please wait...") {
      message += '<img src="' + root_path + '/gears.gif" />'
    } else if ((m = message.match(/^Downloading data... \(([0-9]+)\/([0-9]+)\)/)) !== null) {
      message = this.RewriteMessage(m);
    }

    this.message = message; 
    this.background.style.display = "inline";
    this.progressFrame.style.visibility = "hidden";
    this.progressBar.style.display = "none";			
    this.Update();
  }

  this.RewriteMessage = function (m) {
    var downloaded = this.FormatBytes(parseInt(m[1]), 2);
    var total = this.FormatBytes(parseInt(m[2]), 2);
    var message = m[0].replace(m[1], downloaded);
    return message.replace(m[2], total);
  }

  this.FormatBytes = function(bytes,decimals) {
    if(bytes == 0) { return '0 Byte'; }
    var k = 1000;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'Mo', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
  }

  this.Clear = function() {
    this.background.style.display = "none";
    this.logoImage.style.display = "none";
    this.progressFrame.style.display = "none";
    this.progressBar.style.display = "none";
  }

  this.Update = function() {
    this.background.style.top = this.dom.offsetTop + 'px';
    this.background.style.left = this.dom.offsetLeft + 'px';
    this.background.style.width = this.dom.offsetWidth + 'px';
    this.background.style.height = this.dom.offsetHeight + 'px';

    var progressFrameImg = new Image();
    progressFrameImg.src = this.progressFrame.src;

    this.progressBar.style.top = this.progressFrame.style.top;
    this.progressBar.style.left = this.progressFrame.style.left;
    this.progressBar.width = progressFrameImg.width * Math.min(this.progress, 1);

    this.messageArea.innerHTML = this.message;
  }
  this.Update ();
}

window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if([8, 32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

document.onmousedown = function() {window.focus();};

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}


