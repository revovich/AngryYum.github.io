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
$('#form_popap').click(function(){
  $('.content_wrpper').addClass('content_wrpper_active')
  $('.wrap_form').addClass('wrap_form_active');
})
$('.wrap_form_header_close').click(function(){
  $('.content_wrpper').removeClass('content_wrpper_active')
  $('.wrap_form').removeClass('wrap_form_active');
});
$('.wrap_form_form_btn').click(function(){
  $('.content_wrpper').removeClass('content_wrpper_active')
  $('.wrap_form').removeClass('wrap_form_active');
});
$('.content_wrpper').click(function(){
  $('.content_wrpper').removeClass('content_wrpper_active')
  $('.wrap_form').removeClass('wrap_form_active');
});

$('.team_wrap_card_item_btn').click(function(){
  $('.content_wrpper').addClass('content_wrpper_active');
  $('.top_wrap_team').addClass('wrap_form_active');
})
$('.wrap_form_header_close').click(function(){
  $('.top_wrap_team').removeClass('wrap_form_active');
});
$('.wrap_team_btn').click(function(){
  $('.top_wrap_team').removeClass('wrap_form_active');
  $('.content_wrpper').removeClass('content_wrpper_active');
});
$('.content_wrpper').click(function(){
  $('.top_wrap_team').removeClass('wrap_form_active');
  $('.content_wrpper').removeClass('content_wrpper_active');
});

$('.btn_nav_wrapper').click(function(){
  $('.btn_nav').toggleClass('btn_nav_active');
  $('.header_bot').toggleClass('header_bot_active')
})