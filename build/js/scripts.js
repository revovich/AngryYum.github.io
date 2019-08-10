$(function () {

	// var options = { videoId: '71WHYoqic2Y' };
	// $('header').tubular(options);

	$('.mini-menu').click(function(){
		$(this).toggleClass('mini-menu-active');
		$('.menu').toggleClass('menu-active');
	});
	$('.product-desc a').hover(function(){
		$(this).toggleClass('line_active');
  });
	$(".menu a").click(function (e) {
		e.preventDefault();
	
		$(".mini-menu").removeClass('mini-menu-active');
		$('.menu').removeClass('menu-active')
		let href = $(this).attr("href");
		$("html,body").animate({ scrollTop: $(href).offset().top }, 1000);
		
	})
});
