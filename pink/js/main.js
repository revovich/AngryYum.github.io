let burger = document.querySelector('.burger-wrap');

burger.onclick = function(){
  this.classList.toggle('burger-wrap-active');
  document.querySelector('.burger-line').classList.toggle('burger-active');
  document.querySelector('.header-pink').classList.toggle('header-pink-active');
 let lengBtn = document.querySelectorAll('.header-pink-btn');
  for(i = 0; i<lengBtn.length; i++){
    lengBtn[i].classList.toggle('header-pink-btn-active')
  }
}
var mySwiper = new Swiper('.swiper-one', {
  speed: 400,
  spaceBetween: 100,
  navigation: {
    nextEl: '.swiper-one-next',
    prevEl: '.swiper-one-prev',
  },
  pagination: {
    el: '.swiper-one-pagination',
    type: 'progressbar',
  },
});
var mySwiper = new Swiper('.swiper-three', {
  speed: 400,
  spaceBetween: 30,
  slidesPerView: 5,
  pagination: {
    el: '.swiper-three-pagination',
    type: 'progressbar',
  },
  breakpoints: {
   725: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }
});
var galleryThumbs = new Swiper('.gallery-thumbs-one', {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  direction: 'vertical',
  slideActiveClass: 'gallery-thumbs-one-active',

});
var galleryTop = new Swiper('.gallery-top-one', {
  spaceBetween: 10,
  effect: 'fade',

  fadeEffect: {
    crossFade: true
  },
  navigation: {
    nextEl: '.swiper-button-women-next',
    prevEl: '.swiper-button-women-prev',
  },
  thumbs: {
    swiper: galleryThumbs
  }
});
let inp = document.querySelector('#phone');
inp.addEventListener('focus', _ => {
  if(!/^\+\d*$/.test(inp.value))
    inp.value = '+380';
});

inp.addEventListener('keypress', e => {
  if(!/\d/.test(e.key))
    e.preventDefault();
});
var swiper = new Swiper('.swiper-about', {
  direction: 'vertical',
  slidesPerView: 'auto',
  freeMode: true,
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  mousewheel: true,
});

$('select').each(function(){
  var $this = $(this), numberOfOptions = $(this).children('option').length;

  $this.addClass('select-hidden'); 
  $this.wrap('<div class="select"></div>');
  $this.after('<div class="select-styled"></div>');

  var $styledSelect = $this.next('div.select-styled');
  $styledSelect.text($this.children('option').eq(0).text());

  var $list = $('<ul />', {
      'class': 'select-options'
  }).insertAfter($styledSelect);

  for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
          text: $this.children('option').eq(i).text(),
          rel: $this.children('option').eq(i).val()
      }).appendTo($list);
  }

  var $listItems = $list.children('li');

  $styledSelect.click(function(e) {
      e.stopPropagation();
      $('div.select-styled.active').not(this).each(function(){
          $(this).removeClass('active').next('ul.select-options').hide();
      });
      $(this).toggleClass('active').next('ul.select-options').toggle();
  });

  $listItems.click(function(e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $this.val($(this).attr('rel'));
      $list.hide();
      //console.log($this.val());
  });

  $(document).click(function() {
      $styledSelect.removeClass('active');
      $list.hide();
  });

});

var galleryThumbs = new Swiper('.gallery-thumbs-two', {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  direction: 'vertical',
  slideActiveClass: 'slider-about-active',
  mousewheel: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar',
  },
});
var galleryTop = new Swiper('.gallery-top-two', {
  spaceBetween: 10,
  slidesPerView: 1,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  breakpoints: {
    1250: {
      direction: 'vertical',
    },
  },
  navigation: {
    nextEl: '.swiper-button-end-next',
    prevEl: '.swiper-button-end-prev',
  },
  thumbs: {
    swiper: galleryThumbs
  }
});