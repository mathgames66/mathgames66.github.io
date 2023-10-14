let tags = [];
let defaultParams = {
	searchQuery: "",
	exactWords: "off",
	filters: ["title", "desc", "tags", "urls", "create", "series"],
	tags: [],
	creator: "",
	uploader: "",
	series: "",
};
function checkValues() {
	let filterList = [];
	let failedChecks = 0;
	document
		.querySelectorAll('#search-filters input[type="checkbox"]')
		.forEach(function (input) {
			let value = input.value;
			if (input.checked) filterList.push(value);
		});
	if (filterList.toString() == defaultParams.filters.toString()) {
		document.getElementById("filters").disabled = true;
	} else {
		document.getElementById("filters").value = filterList.join("AND");
	}
	if (
		document.getElementById("search-bar").value.trim() ==
		defaultParams.searchQuery
	) {
		document.getElementById("search-bar").disabled = true;
		failedChecks++;
	}
	if (
		document.getElementById("creator").value.trim() == defaultParams.creator
	) {
		document.getElementById("creator").disabled = true;
		failedChecks++;
	}
	if (
		document.getElementById("uploader").value.trim() ==
		defaultParams.searchQuery
	) {
		document.getElementById("uploader").disabled = true;
		failedChecks++;
	}
	if (
		document.getElementById("series").value.trim() == defaultParams.series
	) {
		document.getElementById("series").disabled = true;
		failedChecks++;
	}
	if (tags.toString() == defaultParams.tags.toString()) {
		document.getElementById("tags").disabled = true;
		failedChecks++;
	}
	if (failedChecks == 5) {
		document.getElementById("filters").disabled = false;
		document.getElementById("search-bar").disabled = false;
		document.getElementById("tags").disabled = false;
		document.getElementById("search-bar").classList.add("failedSearch")
		alert('Please submit at least one text input')
		document.getElementById("search-bar").focus();
		return false;
	}
	return true;
}
function checkTagList() {
	let tagList = document.getElementById("tag-list");
	document.getElementById("tags").value = tags.join("AND");
	if (tagList.childElementCount) {
		tagList.style.display = "initial";
	} else {
		tagList.style.display = "none";
	}
}
function addTag() {
	let tagSearch = document.getElementById("tag-search");
	let tagList = document.getElementById("tag-list");
	let val = tagSearch.value;
	tagSearch.value = "";
	if (val.trim()) {
		let span = document.createElement("span");
		span.classList = "tag-query tag-block";
		span.innerText = val;
		tags.push(val);
		span.onclick = e => {
			span.remove();
			tags.splice(tags.indexOf(span.innerText), 1);
			document.getElementById("tags").value = tags.join("AND");
		};
		tagList.append(span);
	}
	checkTagList();
}

onload = syncQueryToSearch;

function syncQueryToSearch() {
	if (searchQueryObject.search) {
		document.getElementById("search-bar").value =
			searchQueryObject["search"]
	}
	if (searchQueryObject.tags) {
		let tagList = document.getElementById("tag-list");
		tags = searchQueryObject["tags"];
		for (let index = 0; index < tags.length; index++) {
			let span = document.createElement("span");
			span.classList = "tag-query tag-block";
			span.innerText = tags[index];
			span.onclick = e => {
				span.remove();
				tags.splice(tags.indexOf(span.innerText), 1);
				document.getElementById("tags").value = tags.join("AND");
			};
			tagList.append(span);
		}
		checkTagList();
	}
	document.getElementById("exact").checked = searchQueryObject.exact;
	if (searchQueryObject.include) {
		document
			.querySelectorAll('#search-filters input[type="checkbox"]')
			.forEach(function (input) {
				input.checked = searchQueryObject["include"].includes(
					input.value
				);
			});
	}
	if (searchQueryObject.series) {
		document.getElementById("series").value =
			searchQueryObject["series"].join(" ");
	}
	if (searchQueryObject.create) {
		document.getElementById("creator").value =
			searchQueryObject["create"].join(" ");
	}
	if (searchQueryObject.uploader) {
		document.getElementById("uploader").value =
			searchQueryObject["uploader"].join(" ");
	}
}
