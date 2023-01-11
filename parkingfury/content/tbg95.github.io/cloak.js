function addCss(){
    const e = document.createElement('style');
    e.innerHTML = `
    button.in-game-button {
        position: absolute;
        z-index: 9999;
        top: 61px;
        left: 0;
        width: 75px;
        height: 50px;
        background: #fff;
        border-radius: 0 290486px 290486px 0;
        color: #000;
        padding: 0 10px;
        line-height: 50px;
        min-height: 50px;
        border: none;
        border-bottom: 3px solid #b5b5b5;
        will-change: transform;
        animation: bounceY 2s .5s;
        transition: transform .5s cubic-bezier(.55,0,.1,1);
        display: flex;
        align-items: center;
        justify-content: center
    }
    
    button.in-game-button svg {
        pointer-events: none;
        color: #b5b5b5;
        margin-right: .625rem;
        display: inline-block
    }
    
    button.in-game-button img {
        pointer-events: none;
        width: 30px
    }
    
    button.in-game-button:active {
        background: #1ec2e5
    }
    
    button.in-game-button[attr-active=true] {
        transform: translateX(0)
    }
    
    @media(max-height: 350px) and (orientation:landscape) {
        button.in-game-button[attr-active=true] {
            transform:translateX(-75px)
        }
    }
    
    button.in-game-button[attr-snapped=true] svg {
        display: none
    }
    
    button.in-game-button[attr-snapped=true] img {
        transform: translate(-5px)
    }
    
    i.in-game-trash {
        z-index: 1;
        bottom: 0;
        left: 0;
        height: 50px;
        width: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff
    }
    
    i.in-game-trash,i.in-game-trash svg {
        transform: scale(0);
        position: absolute
    }
    
    i.in-game-trash svg {
        z-index: 2;
        left: 20px;
        bottom: 20px;
        fill: #fff;
        will-change: transform;
        transition: transform .1s cubic-bezier(.55,0,.1,1)
    }
    
    i.in-game-trash:before {
        content: " ";
        position: absolute;
        z-index: 1;
        bottom: -100px;
        left: -100px;
        width: 200px;
        height: 200px;
        transform: scale(0);
        border-radius: 100%;
        background-color: transparent;
        will-change: transform,background-color;
        transition: transform .5s cubic-bezier(.55,0,.1,1),background-color .2s cubic-bezier(.55,0,.1,1)
    }
    
    i.in-game-trash[attr-active=true] {
        transform: scale(1)
    }
    
    i.in-game-trash[attr-active=true] svg {
        transition-duration: .8s;
        transform: scale(1)
    }
    
    i.in-game-trash[attr-active=true]:before {
        transform: scale(1);
        background-color: #ed1c24
    }
    
    i.in-game-trash[attr-inrange=true] svg {
        transition-duration: .2s;
        transform: scale(0)
    }
    
    i.in-game-trash[attr-inrange=true]:before {
        transform: scale(1.2);
        background-color: #ed1c24
    }
    .main-nav {
        z-index: 999;
        overflow-y: auto;
        will-change: transform;
        backface-visibility: hidden;
        transform: translateX(105%);
        height: 100%;
        transition: .3s ease-in-out;
        background: #f5f5f5;
        width: 39.5rem;
        position: fixed;
        top: 0;
        right: 0;
        padding:20px;
        color:black;
    }
    .main-nav.open {
        transform: translateX(0);
    }
    #post{
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        color: #3f3424;
    }
    #claimBtn{right:0;border-radius: 290486px 0 0 290486px;left:auto}
    `;  
    document.getElementsByTagName('head')[0].appendChild(e);
}
function addBtnHome(){
    var e = document.createElement('button');
    e.className = 'in-game-button';
    e.id = 'inGame';
    e.innerHTML = `
    <svg class="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg><!-- <i class="fas fa-chevron-left"></i> Font Awesome fontawesome.com -->
    <img src="https://tbg95.github.io/icon36.png" width="36" height="36" alt="Logo">`;
    document.getElementsByTagName('body')[0].appendChild(e);
}
function loadGA(){
    var  r = document.createElement("script");
	r.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=UA-231937852-1"), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"),  r.onload = function (){
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'UA-231937852-1');
        var ads = document.createElement('script');
        ads.setAttribute("src", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7889675448259925"), ads.setAttribute("type", "text/javascript"), ads.setAttribute("crossOrigin", "anonymous"), document.head.appendChild(ads);
    },document.head.appendChild(r);
}

function addHourGlass(){
   
    var glass = document.createElement('button');
    glass.id = "claimBtn";
    glass.className = "in-game-button";
    // glass.onclick = openInfo();
    glass.innerHTML = `<div id="gift" class="fa-stack fa-4x" style="display:flex"> <img src="https://tbg95.github.io/info.png">
</div>`;
    document.getElementsByTagName('body')[0].appendChild(glass);
    // document.getElementById("gift").style.display = none;
}
function loadFirebase(){
    var  r = document.createElement("script");
	r.setAttribute("src", "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"),  r.onload = function (){
        var  database = document.createElement("script");
        database.setAttribute("src", "https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"), database.setAttribute("type", "text/javascript"), database.setAttribute("crossOrigin", "anonymous"),  database.onload = function (){
            var  authsc = document.createElement("script");
            authsc.setAttribute("src", "https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"), authsc.setAttribute("type", "text/javascript"), authsc.setAttribute("crossOrigin", "anonymous"),  authsc.onload = function (){    
                var firestoresc =  document.createElement("script");
                firestoresc.setAttribute("src", "https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"), firestoresc.setAttribute("type", "text/javascript"), firestoresc.setAttribute("crossOrigin", "anonymous"),  firestoresc.onload = function (){    
                    var  loginsc = document.createElement("script");
                    loginsc.setAttribute("src", "/mainsite/login.js"), loginsc.setAttribute("type", "text/javascript"), document.head.appendChild(loginsc);
                },document.head.appendChild(firestoresc);
                
            }, document.head.appendChild(authsc);
        },document.head.appendChild(database);
    },document.head.appendChild(r);
}
window.addEventListener('load', function() {
    addCss();
    addBtnHome();
    addHourGlass();
    loadGA();
    // loadFirebase();
    var btn = document.getElementById("inGame");
    btn.addEventListener("click", returnHome);
    dragElement(document.getElementById("inGame"));
    dragElement(document.getElementById("claimBtn"));
    var btn = document.getElementById("claimBtn");
    btn.addEventListener("click", openInfo);
    
});
var hold = false;
var click = 0;
function openInfo(){
    var  e = document.getElementById("post");
    console.log(window.hold);
    if(window.hold == true){
        return;
    }
    if(!e.classList.contains("open")){
        console.log(1);
        e.classList.add('open');
    } else {
        e.classList.remove('open');
    }
    window.hold = false;

}
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
        
    
    
}

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    window.click = 1;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

}

function closeDragElement() {

    document.onmouseup = null;
    document.onmousemove = null;
    //window.hold = true;
    if(window.click == 1){
        window.hold = true;
        window.click = 0;
    }
    setTimeout(function (){ window.hold = false}, 100);
    console.log(window.hold);
}
}
function returnHome(){
    if(window.hold == true){
        return;
    }
    location.href = "https://tbg95.github.io";
}
function opendiscord(){
    window.open("https://discord.gg/qgHr9T2Vu6");
}
window.alert = function() {};

// or simply
alert = function() {};

