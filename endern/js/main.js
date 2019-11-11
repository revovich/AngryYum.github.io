  var wow = new WOW( {
    boxClass:     'wow',
    animateClass: 'animated',
    offset:       350
  }
    );
  wow.init();
  document.querySelector('.wrap_burger').onclick = function(){
    document.querySelector('header').classList.toggle('header_bottom');
    document.querySelector('.nav_wrapper').classList.toggle('nav_wrapper_active');
    document.querySelector('header').classList.toggle('mob-menu-acive');
    document.querySelector('footer').classList.toggle('item-none');
    document.querySelector('.burger_menu').classList.toggle('borger_menu-active');
    document.querySelector('.color-ff').classList.toggle('text-color');
    document.querySelector('.color-f').classList.toggle('text-color');
    document.querySelector('.burger_menu').classList.toggle('borger-fff');
    document.querySelector('main').classList.toggle('menu-scroll')
  };

  var mySwiper = new Swiper ('.swiper-container', {
    allowTouchMove: false,
    centeredSlides: true,
    loop: true,
     speed: 2000,
    autoplay: {
     delay: 5000,
     disableOnInteraction: false, 
    }, 
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
        renderBullet: function (index, className) {
               return `<span class="${className}"><svg class="circ" width="50" height="50" class="circ">
        <circle class="circ1" cx="25" cy="25" r="12" stroke="#fff" stroke-width="1" fill="none"/>
        </svg></span>`;
        },
    },

  });
  var mySwiper = new Swiper ('.swiper-container-two', {
    allowTouchMove: false,
    centeredSlides: true,
    loop: true,
     speed: 2000,
   autoplay: {
     delay: 5000,
     disableOnInteraction: false, 
    }, 
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
        renderBullet: function (index, className) {
               return `<span class="${className}"><svg class="circ" width="50" height="50" class="circ">
        <circle class="circ1" cx="25" cy="25" r="12" stroke="#fff" stroke-width="1" fill="none"/>
        </svg></span>`;
        },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  setTimeout(function(){
    BackgroundCheck.init({
      targets: '.target',
      images: '.thumbnails , img'
    });
        },1000);
        $.jInvertScroll(['.scroll'], 
        i = 800 + 'px',       // an array containing the selector(s) for the elements you want to animate
            {
            height: i,                   // optional: define the height the user can scroll, otherwise the overall length will be taken as scrollable height
            onScroll: function(percent) {   //optional: callback function that will be called when the user scrolls down, useful for animating other things on the page
                console.log(percent);
            }
        });
        document.addEventListener("DOMContentLoaded", function () {
          var X = Y = 0;
      
          function move() {
              document.getElementById('cursors').style.left = X + 'px';
              document.getElementById('cursors').style.top = Y + 'px';
          }
          document.addEventListener("mousemove", function (e) {
              X = e.clientX;
              Y = e.clientY;
          }, false);
      
          setInterval(move, 100);
      });

      $('.swiper-button-next').hover(function(){
        $('#cursors').addClass( "scr" );
      })
      $('.swiper-button-prev').hover(function(){
        $('#cursors').removeClass( "scr" );
      });
      
$('.wrap_burger').click(function(){
  var scrollTop = $(window).scrollTop();
  $('.la').mouseenter(function(){
    $('html').scrollTop(la);
  })
  $('.la').mouseleave(function(){
    if($(this).hasClass('current')){
     return false
      }else{
        $('html').scrollTop(scrollTop);
      }
   
  })
  
  $('.chef').mouseenter(function(){
    $('html').scrollTop(chef);
  })
  $('.chef').mouseleave(function(){
    if($(this).hasClass('current')){
      return false
       }else{
        $('html').scrollTop(scrollTop);
       }
    
  })
  
  $('.fate').mouseenter(function(){
    $('html').scrollTop(fate);
  })
  $('.fate').mouseleave(function(){
    if($(this).hasClass('current')){
      return false
       }else{
        $('html').scrollTop(scrollTop);
       }
  })
  
  
  $('.menu').mouseenter(function(){
    $('html').scrollTop(menu);
  })
  $('.menu').mouseleave(function(){
    if($(this).hasClass('current')){
      return false
       }else{
        $('html').scrollTop(scrollTop);
       }
  })
  
  $('.pre').mouseenter(function(){
    $('html').scrollTop(pre);
  })
  $('.pre').mouseleave(function(){
    if($(this).hasClass('current')){
      return false
       }else{
        $('html').scrollTop(scrollTop);
       }
  })
  
  $('.conact').mouseenter(function(){
    $('html').scrollTop(conact);
  })
  $('.conact').mouseleave(function(){
    if($(this).hasClass('current')){
      return false
       }else{
        $('html').scrollTop(scrollTop);
       }
  })
})

var off = $("#la").offset();
la = off.left;
var sect1 = $("#chef").offset();
chef = sect1.left;
var sect2 = $("#fate").offset();
fate = sect2.left;
var sect3 = $("#menu").offset();
menu = sect3.left;
var sect4 = $("#pre").offset();
pre = sect4.left;
var sect5 = $("#conact").offset();
conact = sect5.left;
console.log(la);
$('.la').click(function(){
  $('html').scrollTop(la);
})
$('.chef').click(function(){
  $('html').scrollTop(chef);

})
$('.fate').click(function(){
  $('html').scrollTop(fate);

})
$('.menu').click(function(){
  $('html').scrollTop(menu);

})
$('.pre').click(function(){
  $('html').scrollTop(pre);

})
$('.conact').click(function(){
  $('html').scrollTop(conact);

})
let offMenu = document.querySelectorAll('.nav_wrapper ul a');
console.log(offMenu);
for(i = 0; i<offMenu.length; i++){
  offMenu[i].onclick = function(){
    document.querySelector('header').classList.remove('mob-menu-acive' , 'header_bottom');
    document.querySelector('.nav_wrapper').classList.remove('nav_wrapper_active');
  }
}
$(".nav_wrapper ul a").click(function(e) {
  e.preventDefault();
  $(".nav_wrapper ul a").removeClass('current');
  $(this).addClass('current');
})
let reservation = document.querySelectorAll('.reservation-btn');
for(i = 0; i<reservation.length; i++){
  reservation[i].onclick = function(){
    document.querySelector('.reservation').classList.add('reservation-act')
  }
}
let wrapOf = document.querySelector('.full-wrapper-screen');

wrapOf.onclick = function(){
  document.querySelector('.reservation').classList.remove('reservation-act')
}

