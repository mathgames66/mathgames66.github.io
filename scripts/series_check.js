checkSelf = () => {
	let check =  document.getElementById("series-games").childElementCount != 0
	if (!check) {
		document.getElementById("series").style.display = "none";
	}else{
		document.getElementById("series").style = null
	}
}
onload = ()=>{
onscroll = ()=>{checkSelf(); onscroll=null}
}