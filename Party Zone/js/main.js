$(document).ready(function() {

	$("html").niceScroll({
		horizrailenabled : false,
		"verge" : "500"
	});	
    $('.owl-carousel').owlCarousel({
    loop:true,
    items:1,
    nav: false,
    dots: false,
    autoplay: true, // включает или выключает автопрокутку (true - вкл, false - выкл)
    autoplayTimeout: 3500, // интервал между прокруткой указывать в миллисекундах
})
});
