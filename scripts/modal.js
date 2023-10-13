document.addEventListener("DOMContentLoaded", () => {
	const dialog = document.querySelector("dialog");
	const openButton = document.querySelector("#show-button");
	const closeButton = document.querySelector("dialog #close");

	// "Close" button closes the dialog
	closeButton.addEventListener("click", () => {
		dialog.close();
		localStorage.seenTrailer = true;
	});

	openButton.addEventListener("click", () => {
		dialog.showModal();
	});

	if (
		typeof localStorage.seenTrailer == "undefined" ||
		!localStorage.seenTrailer
	) {
		dialog.showModal();
	}
});
