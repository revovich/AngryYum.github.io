$(document).ready(function() {
        // Transition effect for navbar 
        $(window).scroll(function() {
          // checks if window is scrolled more than 500px, adds/removes solid class
          if($(this).scrollTop() > 20) { 
              $('.header').addClass('solid');
          } else {
              $('.header').removeClass('solid');
          }
        });
});
$('.slider_main').slick({
  dots: true,
  infinite: true,
     arrows: false,
  speed: 2500,
  slidesToShow: 1,
     autoplay: true,
  autoplaySpeed: 2000,
})
$('.slider-advice').slick({
  dots: true,
  infinite: true,
     arrows: false,
  speed: 1300,
  slidesToShow: 1,
     autoplay: true,
  autoplaySpeed: 2000,
    responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                         slidesToShow: 2,
                    }
                },
          {
                    breakpoint: 768,
                    settings: {
                         slidesToShow: 1,
                    }
                }
            ]
    
});
$('.slider-news').slick({
  dots: true,
  infinite: true,
     arrows: false,
  speed: 1300,
  slidesToShow: 3,
     autoplay: true,
  autoplaySpeed: 2000,
                responsive: [
                {
                    breakpoint: 991,
                    settings: {
                         slidesToShow: 2,
                    }
                },
                          {
                    breakpoint: 768,
                    settings: {
                         slidesToShow: 1,
                    }
                }    
            ]
});

$(function () {

    var target_block = $(".price");
    var blockStatus = true;

    $(window).scroll(function () {

        var scrollEvent = ($(window).scrollTop() > (target_block.position().top - $(window).height()));

        if (scrollEvent && blockStatus) {

            blockStatus = false;

            $({
                numberValue: 0
            }).animate({
                numberValue: 5939
            }, {

                duration: 2000,
                easing: "linear",

                step: function (val) {

                    $(".price").html(Math.ceil(val));
                }

            });

        }

    });

});

function menuToggler() {
  const elButton = document.querySelector('.menu-btn');
  const elMenu = document.querySelector('.wrap');
  
  const state = {
  	isOpen: false
  };
  
  function openMenu() {
    elButton.classList.add('menu-btn_active');
    elMenu.classList.add('wrap_active');
  };
  
  function closeMenu() {
    elButton.classList.remove('menu-btn_active');
    elMenu.classList.remove('wrap_active');
  };
  
  function toggleMenu() {
    (state.isOpen = !state.isOpen) ? openMenu() : closeMenu();
  };
  
  function init() {
    state.isOpen ? openMenu() : closeMenu();
  };
  
  init();
  
  return toggleMenu;
}

document.querySelector('.menu-btn').addEventListener('click', menuToggler())
