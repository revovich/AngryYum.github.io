$(document).ready(function(){
  if(document.querySelector('.home_slider')){
    $(document).ready(function(){
      $('.home_slider').slick({
        slidesToShow: 1,
        dots: true,
      });
});
}});
$('.nav_btn').click(function(){
  $('nav').toggleClass('nav_btn_active');
  $('.nav_btn_line').toggleClass('nav_btn_line_active');
});
$('.news_wrap_btn').click(function(){
  $('.sidebar_wrap').toggleClass('sidebar_wrap_active');
  $('.sidebar').toggleClass('sidebar_wrap_active');
  $(this).toggleClass('news_wrap_btn_active')

})