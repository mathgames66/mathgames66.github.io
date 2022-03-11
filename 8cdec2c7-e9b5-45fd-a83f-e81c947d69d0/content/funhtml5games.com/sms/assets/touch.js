document.getElementById('dpad_left').addEventListener ('touchstart', touchStart);
document.getElementById('dpad_left').addEventListener ('touchend', touchEnd);
document.getElementById('dpad_left').addEventListener ('touchcancel', touchEnd);
document.getElementById('dpad_left').addEventListener ('touchmove', touchStart);

var is_mobile = false;

function show_dpad()
{
document.getElementById('instructions').style.display = 'none';
document.getElementById('dpad_area').style.display = 'block';
}

function touchStart(e)
{
is_mobile = true;

var touch_x = e.touches[0].pageX - document.getElementById('dpad_left').getBoundingClientRect().left;	//$('#dpad_left').offset().left;
var touch_y = e.touches[0].pageY - document.getElementById('dpad_left').getBoundingClientRect().top;	//$('#dpad_left').offset().top;

var radius = document.getElementById('dpad').width / 2;

var dX = touch_x - radius;
var dY = touch_y - radius;
var dist = Math.sqrt (dX*dX + dY*dY) / radius;

var direction = [false, false, false, false];

if (dist > 0.25 && dist < 1.00)
	{
	var theta = Math.atan2 (dY, dX);
	var PI = Math.PI;
	while (theta < 0.00) theta += PI*2;
	while (theta >= PI*2) theta -= PI*2;

	if (theta >= PI*1.15 && theta < PI*1.85) direction[0] = true;
	if (theta >= PI*1.65 || theta < PI*0.35) direction[1] = true;
	if (theta >= PI*0.15 && theta < PI*0.85) direction[2] = true;
	if (theta >= PI*0.65 && theta < PI*1.35) direction[3] = true;

	if (direction[0]) dpadDown(38); else dpadUp(38);
	if (direction[1]) dpadDown(39); else dpadUp(39);
	if (direction[2]) dpadDown(40); else dpadUp(40);
	if (direction[3]) dpadDown(37); else dpadUp(37);
	}

e.preventDefault();
}

function touchEnd(e)
{
dpadUp(38);
dpadUp(40);
dpadUp(37);
dpadUp(39);
}

function touchMove(e)
{
e.preventDefault();
}