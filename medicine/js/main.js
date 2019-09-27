$('.home_about_slider_main').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.home_about_slider_row'
});
$('.home_about_slider_row').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '.home_about_slider_main',
  dots: false,
  arrows: false,
  centerMode: true,
  focusOnSelect: true,
    responsive: [
    {
      breakpoint: 1040,
      settings: {
        slidesToShow: 4,
        centerMode: true,
      }
    }
  ],
  responsive: [
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 3,
        centerMode: true,
      }
    }
  ],
  responsive: [
    {
      breakpoint: 350,
      settings: {
        slidesToShow: 2,
        centerMode: true,
      }
    }
  ],
});

$('.home_nav_mob').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  fade: true,
  centerMode: true,
});
$('.btn_wrap_forms').click(function(){
  $('.content_wrpper').addClass('content_wrpper_active')
  $('.wrap_form').addClass('wrap_form_active');
  $('body').css('overflow' , 'hidden');  
})
$('.wrap_form_header_close').click(function(){
  $('.content_wrpper').removeClass('content_wrpper_active');
  $('body').css('overflow' , 'auto');
});
$(document).mouseup(function (e) {
  var container = $(".content_wrpper");
  if (container.has(e.target).length === 0){
      container.removeClass('content_wrpper_active');
      $('body').css('overflow' , 'auto')
  }
});
$('.team_wrap_card_item_btn').click(function(){
  $('.content_wrpper').addClass('content_wrpper_active');
  $('.top_wrap_team').addClass('wrap_form_active');
  $('body').css('overflow' , 'hidden'); 
})


$('.btn_nav_wrapper').click(function(){
  $('.btn_nav').toggleClass('btn_nav_active');
  $('.header_bot').toggleClass('header_bot_active')
});

$(function() {
  $("ul.doctor_caption").on("click", "li:not(.doctor_active)", function() {
    $(this)
      .addClass("doctor_active")
      .siblings()
      .removeClass("doctor_active")
      .closest(".doctor_wrap")
      .find(".doctor_item")
      .removeClass("doctor_active")
      .eq($(this).index())
      .addClass("doctor_active");
  });
});

