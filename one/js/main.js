window.onload = function() {
  let menu = [], lis = document.querySelectorAll(".swiper-content-title");
  for(var i=0, im=lis.length; im>i; i++)
  menu.push(lis[i].firstChild.nodeValue);
  console.log(menu)
  let mySwiper = new Swiper('.swiper-container-one', {
    speed: 400,
    spaceBetween: 100,
    loop: true,
    pagination: {
      type: 	'bullets',
      el: '.swiper-pagination',
      clickable: true,
        renderBullet: function (index, className , current, total) {
          return '<div class="' + className + '">' + (menu[index]) + '</div>'
          ;
        },
    },
    navigation: {
      nextEl: '.swiper-custom-next',
      prevEl: '.swiper-custom-prev',
    },
  });
  let mySwiperTwo = new Swiper('.swiper-container-two', {
    speed: 400,
    spaceBetween: 0,
    loop: true,
    autoplay: false,
    pagination: {
      el: '.swiper-namber-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-oreng-next',
      prevEl: '.swiper-oreng-prev',
    },
    breakpoints: {
    
      1277: {
        slidesPerView: 4,
      },
      750: {
        slidesPerView: 3,
      },
      680: {
        slidesPerView: 2,
      },
      680: {
        slidesPerView: 1,
      },
    }
  });
  let mySwiperThree = new Swiper('.swiper-container-three', {
    speed: 400,
    loop: true,
    autoplay: true,
    spaceBetween: 0,
    slidesPerView: 1,
    pagination: {
      el: '.swiper-namber-pagination-two',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-oreng-two-next',
      prevEl: '.swiper-oreng-two-prev',
    },
    breakpoints:{
      685: {
        spaceBetween: 90,
        slidesPerView: 2,
      },
      540: {
        spaceBetween: 20,
        slidesPerView: 2,
      },
    }
  });
};

var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  rangeBullet.style.left = (bulletPosition * 293) + "px";
}
document.getElementById("rs-range-line").oninput = function() {
  this.style.background = 'linear-gradient(to right, #f6dd30 0%, '+this.value /32 +'%, #E5E5E5 ' 
};


var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  if (window.matchMedia("(max-width: 430px)").matches) {
    rangeBullet.style.left = (bulletPosition * 250) + "px";
  } else {
    rangeBullet.style.left = (bulletPosition * 293) + "px";
  }



}
document.getElementById("rs-range-line").oninput = function() {
  this.style.background = 'linear-gradient(to right, #f6dd30 0%, '+this.value /32 +'%, #E5E5E5 ' 
};


var rangeSliderTwo = document.getElementById("rs-range-line-two");
var rangeBulletTwo = document.getElementById("rs-bullet-two");

rangeSliderTwo.addEventListener("input", showSliderValueTwo, false);

function showSliderValueTwo() {
  rangeBulletTwo.innerHTML = rangeSliderTwo.value;
  var bulletPosition = (rangeSliderTwo.value /rangeSliderTwo.max);
  if (window.matchMedia("(max-width: 430px)").matches) {
    rangeBulletTwo.style.left = (bulletPosition * 250) + "px";
  } else {
    rangeBulletTwo.style.left = (bulletPosition * 293) + "px";
  }
}
document.getElementById("rs-range-line-two").oninput = function() {
  this.style.background = 'linear-gradient(to right, #f6dd30 0%, '+this.value /2.1 +'%, #E5E5E5 ' 
};


var rangeSliderThree = document.getElementById("rs-range-line-three");
var rangeBulletThree = document.getElementById("rs-bullet-three");

rangeSliderThree.addEventListener("input", showSliderValueThree, false);

function showSliderValueThree() {
  rangeBulletThree.innerHTML = rangeSliderThree.value;
  var bulletPosition = (rangeSliderThree.value /rangeSliderThree.max);
  if (window.matchMedia("(max-width: 430px)").matches) {
    rangeBulletThree.style.left = (bulletPosition * 250) + "px";
  } else {
    rangeBulletThree.style.left = (bulletPosition * 293) + "px";
  }
}
document.getElementById("rs-range-line-three").oninput = function() {
  this.style.background = 'linear-gradient(to right, #f6dd30 0%, '+this.value *1.6 +'%, #E5E5E5 ' 
};
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
let searchBtn = document.querySelector('.search-btn');
let searcInp = document.querySelector('.header-top .soc .wrap-form input');

searchBtn.onclick = function(){
  searcInp.classList.toggle('db')
}

let mobMenu = document.querySelector('header .nav');
let mobLine = document.querySelector('.line-burger');
document.querySelector('.burger-wrap').onclick = function(){
  mobMenu.classList.toggle('mobMenuActive');
  mobLine.classList.toggle('line-burger-active')
}