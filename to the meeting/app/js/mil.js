var btn_prev = document.querySelector('.slider .btn .prev');
var btn_next = document.querySelector('.slider .btn .next');
var img = document.querySelectorAll('.slider .items img');
console.log([btn_next])
var i = 0; 

btn_next.onclick = function() {
	img[i].className = '';
	i++
	if(i >= img.length){
		i = 0;
	}
	img[i].className = 'active-slide';
}
btn_prev.onclick = function() {
	img[i].className = '';
	i--
		if(i < 0){
		i = img.length -1;
	}
	img[i].className = 'active-slide';
}