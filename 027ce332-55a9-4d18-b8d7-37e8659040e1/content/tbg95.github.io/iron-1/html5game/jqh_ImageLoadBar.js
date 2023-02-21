function ImageLoadBar_hook(ctx, width, height, total, current, image) {
	// change these to your liking:
	var backgroundColor = "#e7846b";
	var barBackgroundColor = "#f3c2b5";
	var barForegroundColor = "#ffffff";
	var barBorderColor = "#f3c2b5";
	var barWidth = Math.round(width * 0.6);
	var barHeight = 20;
	var barBorderWidth = 2;
	var barOffset = 10;
	// background:
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);
	
	// image:
	var totalHeight, barTop;
	barTop = (height - barHeight) >> 1;
	// bar border:
	var barLeft = (width - barWidth) >> 1;
	ctx.fillStyle = barBorderColor;
	ctx.fillRect(barLeft, barTop, barWidth, barHeight);
	//
	var barInnerLeft = barLeft + barBorderWidth;
	var barInnerTop = barTop + barBorderWidth;
	var barInnerWidth = barWidth - barBorderWidth * 2;
	var barInnerHeight = barHeight - barBorderWidth * 2;
	// bar background:
	ctx.fillStyle = barBackgroundColor;
	ctx.fillRect(barInnerLeft, barInnerTop, barInnerWidth, barInnerHeight);
	// bar foreground:
	var barLoadedWidth = Math.round(barInnerWidth * current / total);
	ctx.fillStyle = barForegroundColor;
	ctx.fillRect(barInnerLeft, barInnerTop, barLoadedWidth, barInnerHeight);

	poki_loading(current/total * 0.75);
	
}