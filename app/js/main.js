var map = document.querySelector('.castom-map');
var active_class = 'active';
var burger = document.querySelector('.burger');
var line = document.querySelector('.burger-line');
var menu = document.querySelector('.menu-burger')
var btn_map_left = document.querySelector('.map_left');
var btn_map_righ = document.querySelector('.map_right');
var map_slider = document.querySelectorAll('.slider-map');
var i = 0;

btn_map_righ.onclick = function() {
	map_slider[i].classList.remove("active");
	i++
	if(i >= map_slider.length){
		i = 0;
	}
	map_slider[i].classList.add("active");
}
btn_map_left.onclick = function() {
	map_slider[i].classList.remove("active");
	i--
		if(i < 0){
		i = map_slider.length -1;
	}
	map_slider[i].classList.add("active");
}



burger.onclick = function(){
	line.classList.toggle('active-burger');
	menu.classList.toggle('menu-burger_active');
}
setInterval (function() {
	var x = Math.floor(Math.random() * (100) + 1);
	var y = Math.floor(Math.random() * (100) + 1);
	map.style.backgroundPosition = x+'%' + y+'%';
},  5000);


document.querySelectorAll('.js-toggle').forEach((item, index) => {
	item.addEventListener('mouseover', () => {
		document.querySelector(`.${active_class}`).classList.emove(active_class)
		document.getElementById(`slide-${index}`).classList.add(active_class)
	})
})
