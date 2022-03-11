
var tstates = 0;
var running;
var event_next_event;
var breakpointHit = false;

function loadRomData(name) {
    "use strict";
    console.log(name);
    var path = "roms/getrom.php?game=" + name;
    console.log("Loading ROM from " + path);
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.send(null);
    if (request.status != 200) return [];
    return request.response;
}

function loadGame()
{
document.getElementById('instructions').style.display = 'none';
document.getElementById('screen').style.display = 'none';
setTimeout(go, 100);
}

function go() {
    var i;
    window.focus();
    z80_init();
    miracle_init();
    miracle_reset();
    const defaultRom = getDefaultRom();
    loadRom(defaultRom, loadRomData(defaultRom));
    start();
    
    
	    joystick = 65503;
	    setTimeout("joystick = 65535;", 2000);
	    setTimeout(showScreen, 1000);}

function showScreen()
{
document.getElementById('screen').style.display = 'block';
}

function getDefaultRom() {
    return 'SonicTheHedgehog.sms';
}

function toggleAudio()
{
keyDown({keyCode:84});
document.getElementById('audio_icon').style.opacity = audio_on ? 1 : 0.5;
}

function embedCode()
{
document.getElementById('embed_code').style.display = document.getElementById('embed_code').style.display == 'block' ? 'none' : 'block';
if (!is_mobile)
	{
	document.getElementById('keys_help').style.display = document.getElementById('embed_code').style.display == 'block' ? 'none' : 'block';
	}
}

function toggleMenu()
{
if (document.getElementById('menu_popup').style.display == 'block')
	{
	breakpointHit = !1,
    running || (running = !0,
    audio_enable(audio_on),
    run());
    document.getElementById('menu_popup').style.display = 'none';
	}
	else
	{
	stop();
	document.getElementById('menu_popup').style.display = 'block';
	document.getElementById('keys_help').style.display = is_mobile ? 'none' : 'block';
	document.getElementById('embed_button').style.display = is_mobile ? 'none' : 'block';
	}
}