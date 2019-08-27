/*var map = document.querySelector('.castom-map');
var active_class = ('active');
var burger = document.querySelector('.burger');
var line = document.querySelector('.burger-line');
var menu = document.querySelector('.menu-burger');
var btn_map_left = document.querySelector('.map_left');
var btn_map_righ = document.querySelector('.map_right');
var map_slider = document.querySelectorAll('.slider-map');
var horizontal = document.querySelector(".brands");
var filter = document.querySelectorAll('.filter_castom');
var like = document.querySelectorAll('.like');
var reg = document.querySelector('#card-reg');
var cardReg = document.querySelector('.card-brand');
var ymaps = document.querySelector('#map');
var i = 0;

if (document.querySelector('.slider-map')) {
	btn_map_righ.onclick = function () {
		map_slider[i].classList.remove("active");
		i++
		if (i >= map_slider.length) {
			i = 0;
		}
		map_slider[i].classList.add("active");
	}
	btn_map_left.onclick = function () {
		map_slider[i].classList.remove("active");
		i--
		if (i < 0) {
			i = map_slider.length - 1;
		}
		map_slider[i].classList.add("active");
	}
	setInterval(function () {
		var x = Math.floor(Math.random() * (100) + 1);
		var y = Math.floor(Math.random() * (100) + 1);
		map.style.backgroundPosition = x + '%' + y + '%';
	}, 5000);
	document.querySelectorAll('.js-toggle').forEach((item, index) => {
		item.addEventListener('mouseover', () => {
			document.querySelector(`.${active_class}`).classList.remove(active_class)

			document.getElementById(`slide-${index}`).classList.add(active_class)
		})
	});
	horizontal.addEventListener('wheel', function (event) {
		if (event.deltaMode == event.DOM_DELTA_PIXEL) {
			var modifier = 1;
		} else if (event.deltaMode == event.DOM_DELTA_LINE) {
			var modifier = parseInt(getComputedStyle(this).lineHeight);
		} else if (event.deltaMode == event.DOM_DELTA_PAGE) {
			var modifier = this.clientHeight;
		}
		if (event.deltaY != 0) {
			this.scrollLeft += modifier * event.deltaY;
			event.preventDefault();
		}
	});
}
burger.onclick = function () {
	line.classList.toggle('active-burger');
	menu.classList.toggle('menu-burger_active');
};
if (document.querySelector('.filter')) {
var select = document.querySelectorAll('.select');
var index = 1;
select.forEach(function(e) {
	e.querySelector('.selectBtn').addEventListener('click', function() {
		this.nextElementSibling.classList.toggle('toggle');
		this.classList.toggle('toggle');
	});
	e.querySelectorAll('.option').forEach(function(b) {
		b.addEventListener('click', function() {
			this.parentElement.classList.remove('toggle');
			this.closest('.select').children[0].classList.remove('toggle');
			this.closest('.select').children[0].setAttribute('data-type', this.getAttribute('data-type'));
			this.closest('.select').children[0].innerText = this.innerText;
		});
	});
});
};


if (document.querySelector('.like')){
for (var i = 0; i < like.length; i++) {
	like[i].addEventListener('mousedown', function () {
		this.classList.add('like_focus');
	});
	 like[i].addEventListener('mouseup', function(){
         this.classList.remove('like_focus');
			  this.classList.toggle('like_active');})
};	
}
if (document.querySelector('.rating')){
(function(){
	var container = document.querySelector('.rating');
	var items = container.querySelectorAll('.rating-item')
	container.onclick = function(e) {
		if( ! e.target.classList.contains('active') ){
			items.forEach(function(item){
				item.classList.remove('active');
			});
			e.target.classList.add('active');
		}
	}
})();
};*/