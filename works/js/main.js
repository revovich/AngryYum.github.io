if(document.querySelector('.home_slider')){
  $(document).ready(function(){
    $('.home_slider').slick({
      slidesToShow: 1,
      dots: true,
    });
  });
}

new WOW().init();  