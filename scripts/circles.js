new Q5("global");
let radius = 40,
	padding = 20,
	x = padding + radius,
	y = padding + radius,
	loopsX = 32,
	loopsY = 18,
	circles,
	bgGradient,
	bgBase,
	bg,
	threshold = 200,
	mouse = { x: 0, y: 0 },
	shrink = 10;

function preload() {
	bgGradient = loadImage("../images/bitmap/gradient.png");
	bgBase = loadImage("../images/bitmap/background.png");
}
function setup() {
	circles = createGraphics(width, height);
	createCanvas(1920, 1080);
	baseCircles = createGraphics(width, height);
	bg = createGraphics(width, height);
	switch (localStorage.circleDisp) {
		case "s":
			stopScript(true);
			break;
		case "n":
			stopScript(false);
			break;
	}
	document.getElementById("settings").value = localStorage.circleDisp;
	updateCanvas();
	window.onresize = updateCanvas;
}

function draw() {
	// fill("white")
	// text(frameRate(), 0,50)
	localStorage.circleDisp = "i";
	let mX = mouse.x,
		mY = mouse.y;
	clear();
	bg.blendMode(BLEND);
	bg.clear();
	// imageMode(CORNER);
	// image(circles, 0, 0)
	bg.image(bgBase, 0, 0);
	// bg.imageMode(CENTER);
	bg.image(bgGradient, mX - 150, mY - 150);

	// bg.imageMode(CORNER);
	bg.blendMode(REMOVE);
	bg.image(circles, 0, 0);
	image(bg, 0, 0);
	circles.blendMode(BLEND);

	circles.background("rgb(158,158,158)");
	circles.blendMode(REMOVE);
	circles.strokeWeight(6);
	circles.noFill();
	x = padding + radius / 2;
	y = padding + radius / 2;
	loopsX = width / (padding + radius + 1);
	loopsY = height / (padding + radius + 1);
	for (let i = 0; i < loopsY; i++) {
		for (let j = 0; j < loopsX; j++) {
			let bonus = 0;
			if (dist(x, y, mX, mY) <= threshold)
				bonus = max(0, threshold - dist(x, y, mX, mY)) / shrink;
			circles.circle(x, y, radius + bonus);
			x += padding + radius;
		}
		y += padding + radius;
		x = padding + radius / 2;
	}
}
function updateCanvas() {
	resizeCanvas(windowWidth, min(2000, document.getElementsByTagName("body")[0].scrollHeight+200));
	circles.resizeCanvas(width, height);
	bg.resizeCanvas(width, height);
	if (["s"].includes(localStorage.circleDisp)) {
		stopScript(true);
	}
}


function stopScript(drawStatic) {
	noLoop();
	requestAnimationFrame(() => {
		localStorage.circleDisp = drawStatic ? "s" : "n";
		clear();
		if (!drawStatic) return;
		baseCircles.resizeCanvas(width, height);
		x = padding + radius / 2;
		y = padding + radius / 2;
		loopsX = width / (padding + radius + 1);
		loopsY = height / (padding + radius + 1);
		baseCircles.blendMode(BLEND);

		baseCircles.background("rgb(158,158,15  8)");
		baseCircles.blendMode(REMOVE);
		baseCircles.strokeWeight(6);
		baseCircles.noFill();
		for (let i = 0; i < loopsY; i++) {
			for (let j = 0; j < loopsX; j++) {
				baseCircles.circle(x, y, radius);
				x += padding + radius;
			}
			y += padding + radius;
			x = padding + radius / 2;
		}
		bg.blendMode(BLEND);
		bg.clear();
		// imageMode(CORNER);
		// image(circles, 0, 0)
		bg.image(bgBase, 0, 0);
		bg.blendMode(REMOVE);
		bg.image(baseCircles, 0, 0);
		image(bg, 0, 0);
	});
}
function updateMouse(e) {
	mouse = { x: e.pageX, y: e.pageY };
}
ontouchstart = loop;
document.addEventListener("mousemove", updateMouse);

ontouchend = () => {
	stopScript(true);
};
