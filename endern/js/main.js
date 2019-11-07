  var wow = new WOW( {
    boxClass:     'wow',
    animateClass: 'animated',
    offset:       350
  }
    );
  wow.init();
  document.querySelector('.wrap_burger').onclick = function(){
    document.querySelector('header').classList.toggle('header_bottom');
    document.querySelector('.nav_wrapper').classList.toggle('nav_wrapper_active')
  };
  $(document).ready(function() {
    $('html, body').mousewheel(function(e, delta) {
        this.scrollLeft -= (delta * 80);
        e.preventDefault();
    });
  });
  var windowWidth = $(window).width();
  var thisLeft, thisWidth;
  
  function animateBlocks(){
    $('.animated').each(function(){
      thisLeft = $(this).offset().left;
      thisWidth = $(this).width();
      if(thisLeft < windowWidth && thisLeft > -thisWidth){
         $(this).addClass('fadeInUp');
      }else{
        $(this).removeClass('fadeInUp');
      }
    });
  };
  $(document).ready(function() {
    var mySwiper = new Swiper ('.swiper-container', {
      centeredSlides: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        bulletElement	: 'div',
          clickable: true,
          bulletActiveClass: 'cir-act',
          bulletClass: 'cir',
      },
    })
  });
  setTimeout(function(){
    BackgroundCheck.init({
      targets: '.target',
      images: '.thumbnails'
    });
        },1000)
