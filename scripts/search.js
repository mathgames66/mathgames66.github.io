//Hi there! - Diamond

//Mobile check via
let hasTouchScreen = false;
if ("maxTouchPoints" in navigator) {
	hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
	hasTouchScreen = navigator.msMaxTouchPoints > 0;
} else {
	let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
	if (mQ && mQ.media === "(pointer:coarse)") {
		hasTouchScreen = !!mQ.matches;
	} else if ("orientation" in window) {
		hasTouchScreen = true; // deprecated, but good fallback
	} else {
		// Only as a last resort, fall back to user agent sniffing
		let UA = navigator.userAgent;
		hasTouchScreen =
			/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
			/\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
	}
}
// "pDepth" or periodDepth gets how far it should go back o get the json
// Built with being a subdomain in mind
let pDepth =
	document.URL.includes("/search") || document.URL.includes("/p/")
		? ".."
		: ".";
// Request the game json file
let gameDataRequest = new Request(pDepth + "/gamedata.json");
// Declares gameDataObject (for later use)
// let gameDataObj;

function validateInputs(form) {
	let validValues = false;
	for (let i = 0, l = form.length; i < l; i++) {
		let input = form[i];
		if (input.type == "text") {
			if (input.value != "") {
				validValues = true;
			} else {
				input.disabled = true;
			}
		}
	}
	if (!validValues) {
		for (let i = 0, l = form.length; i < l; i++) {
			let input = form[i];
			input.disabled = false;
		}

		document.getElementsByTagName("form")[0][0].focus();
	}
	return validValues;
}

const baseCard = (function () {
	let returnVal = document.createElement("a");
	let di = returnVal.appendChild(document.createElement("div"));
	di.className = "card";
	di.appendChild(document.createElement("img"));
	di.appendChild(document.createElement("h3"));
	di.appendChild(document.createElement("p"));
	return returnVal;
})();
function makeFakeCards() {
	for (let i = 0; i < 8; i++) {
		clone = baseCard.cloneNode(true);
		clone.className = "fake-card";
		document.getElementById("container").appendChild(clone);
	}
}

//Checks to see if the HTML is finished loading
if (document.readyState === "loading") {
	// Wait until load to run makeFakeCards
	document.addEventListener("DOMContentLoaded", makeFakeCards);
} else {
	// just run it
	makeFakeCards();
}

// Set searchString to the urls search parameter but slice the "?"
// Also, replace all the "+" (default space placeholder) with URI encoded space.
// Then it will decode the URI
// For example, if the url is mathgames66.github.io/search?search=hi&tags=2dANDscratch, it grabs "search=hi&tags=2dANDscratch")
let searchString = decodeURI(
	document.location.search.slice(1).replaceAll("+", "%20")
);
// Split the searchString at every & symbol into an array ("search=hi&tags=2dANDscratch" becomes ["search=hi", "tags=2dANDscratch"])
let searchQuery = searchString.split("&");
// Create an empty object called searchQueryObject
let searchQueryObject = {};

// Check if there are actually defined variables
if (searchString.includes("="))
	// Run this for every object in the searchQuery array
	for (let index = searchQuery.length - 1; index >= 0; index--) {
		// Split the search query into an array consisting of [Variable name, Value]
		let searchQueryVars = searchQuery[index].split("=");
		// Anywhere they have "AND", split it into an array (for example, "2dANDscratch" becomes ["2d", "scratch"])
		searchQueryVars[1] = searchQueryVars[1].split("AND");
		searchQueryVars[1].forEach((str, i) => {
			// Trim the empty space off and make lowercase
			searchQueryVars[1][i] = str.toLowerCase();
			searchQueryVars[1][i] = str.trim();
		});
		// Add the values to the object
		// Example: set searchQueryObject[key:"search"] to "hi"
		/* 
		Following the example, searchQueryObject is now 
			{
				"search": ["hi"],
				"tags": ["2d", "scratch"]
			} 
		*/
		searchQueryObject[searchQueryVars[0]] = searchQueryVars[1];
	}

// Splits search query by spaces if it exists
if (Array.isArray(searchQueryObject.search))
	searchQueryObject["search"] = searchQueryObject["search"].join("AND");

async function getGameData() {
	await fetch(gameDataRequest, {
		method: "GET",
		credentials: "same-origin",
		mode: "cors",
	})
		.then(response => {
			return response.json();
		})
		.then(obj => {
			gameDataObj = obj;
		})
		.catch(error => {
			alert(
				"Something went wrong trying to get game data. Please refresh and try again"
			);
			document.getElementById("container").replaceChildren();
			document.getElementById(
				"container"
			).outerHTML = `<div style="margin: 60px 20%; padding:60px; border-radius:20px; background:#232323; color:#F00">
		<h1>failed to fetch game data. if problem persists, send the following to <a href="mailto:mathgames66@mail.com">mathgames66@mail.com</a> or include in github issue</h1>
		<p style="text-align:left; color:#F00; background:#111; font-family:monospace;">${error}<br />${
				error.lineNumber
					? "lineNum: " +
					  error.lineNumber +
					  "<br />fileName: " +
					  error.fileName
					: "Firefox contains more details in error messages, such as line number and file name. Due to the fact Chrome doesn't have these features, we can't show those to you"
			}</p>
		  </div>`;
		});
}
const fuseOptions = {
	threshold: 0.2,
	ignoreLocation: true,
	keys: [],
};
let searchTags = false;
if (searchQueryObject.search) {
	if (searchQueryObject.include) {
		if (searchQueryObject.include.includes("title"))
			fuseOptions.keys.push(
				...[
					{ name: "dispName", weight: 1.5 },
					{ name: "name", weight: 2 },
				]
			);
		if (searchQueryObject.include.includes("desc"))
			fuseOptions.keys.push({ name: "description", weight: 0.3 });
		if (searchQueryObject.include.includes("tags")) searchTags = true;
		if (searchQueryObject.include.includes("urls"))
			fuseOptions.keys.push(
				...[
					{ name: "url", weight: 0.2 },
					{ name: "thumbnailURL", weight: 0.2 },
				]
			);
		if (searchQueryObject.include.includes("create"))
			fuseOptions.keys.push({ name: "creator", weight: 0.7 });
		if (searchQueryObject.include.includes("series"))
			fuseOptions.keys.push({ name: "series", weight: 0.8 });
		if (searchQueryObject.include.includes("uploader"))
			fuseOptions.keys.push({ name: "uploader", weight: 0.05 });
	} else {
		fuseOptions.keys = [
			{ name: "dispName", weight: 1.5 },
			{ name: "name", weight: 2 },
			// { name: "description", weight: 0.3 },
			{ name: "url", weight: 0.2 },
			{ name: "thumbnailURL", weight: 0.2 },
			{ name: "creator", weight: 0.7 },
			{ name: "series", weight: 0.8 },
		];
		searchTags = true;
	}
}
//https://stackoverflow.com/questions/41661287/how-to-check-if-an-array-contains-another-array#41661388
function isArrayInArray(arr, item){
	console.log(JSON.stringify(item)==JSON.stringify(item.filter((ele)=>{return arr.includes(ele)})))
	return JSON.stringify(item)==JSON.stringify(item.filter((ele)=>{return arr.includes(ele)}))
  }

let fuseSearch;
getGameData()
.then(searchFunction);
async function searchFunction() {
	console.log("START")
	if (searchQueryObject.search) {
		console.log("hi1");
		fuseSearch = new Fuse(gameDataObj, fuseOptions);
		gameDataObj = fuseSearch.search(searchQueryObject.search);
		gameDataObj.forEach((item, i) => {
			// console.log(item);
			gameDataObj[i] = item.item;
		});
	}
	if (searchQueryObject.series) {
		console.log("hi2");
		gameDataObj = gameDataObj.filter(thing => {
			return thing.series == searchQueryObject.series;
		});
	}
	if (searchQueryObject.tags) {
		gameDataObj = gameDataObj.filter(thing => {
			if(isArrayInArray(thing.siteTags, searchQueryObject.tags)){
				console.log(thing.siteTags, searchQueryObject.tags)
			}
			return isArrayInArray(thing.siteTags, searchQueryObject.tags)
		});
	}
	if (searchQueryObject.create) {
		console.log("hi2");
		gameDataObj = gameDataObj.filter(thing => {
			return thing.creator == searchQueryObject.create;
		});
	}
	if (searchQueryObject.uploader) {
		console.log("hi2");
		gameDataObj = gameDataObj.filter(thing => {
			return thing.uploader == searchQueryObject.uploader;
		});
	}
	document.getElementById("container").replaceChildren();
	if (gameDataObj.length == 0) {
		document.getElementById(
			"container"
		).outerHTML = `<div style="margin: 60px 20%; padding:60px; border-radius:20px; background:#232323;">
    <h1>couldn't find any games like that</h1>
      </div>`;
		return;
	} else {
		for (let i = 0, l = gameDataObj.length; i < l; i++) {
			let obj = gameDataObj[i];
			let card = baseCard.cloneNode(true);
			let children = card.children[0].children;

			card.href = pDepth + `/p/${obj["url"]}.html`;
			children[0].src = `${
				obj["thumbnailURL"] ? pDepth + "/mgthumbnails/" : ""
			}${obj["thumbnailURL"]}`;
			children[1].innerText = obj["dispName"];
			children[2].innerText = `by ${obj["creator"]} [${
				obj["isMobile"] ? "mobile/" : ""
			}pc]`;
			document.getElementById("container").appendChild(card);
		}
	}
}