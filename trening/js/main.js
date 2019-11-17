var mySwiper = new Swiper('.swiper-container', {
  speed: 400,
  loop: true,
  navigation: {
    nextEl: '.swiper-next',
    prevEl: '.swiper-prev',
  },
  breakpoints: {
    1040: {
      slidesPerView: 3,
      spaceBetween: 12
    },
    870: {
      slidesPerView: 2,
      spaceBetween: 12
    },
    620: {
      slidesPerView: 3,
      spaceBetween: 12
    },
    350: {
      slidesPerView: 2,
      spaceBetween: 12
    },
  }
});

const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
      animationTime = 300,
      framesCount = 20;
anchors.forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    let coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
    let scroller = setInterval(function() {
      let scrollBy = coordY / framesCount;
      if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
        window.scrollBy(0, scrollBy);
      } else {
        window.scrollTo(0, coordY);
        clearInterval(scroller);
      }
    }, animationTime / framesCount);
  });
});
let title = document.querySelector('.sections-title-bold');
if(window.matchMedia('(max-width: 400px)').matches){
  title.innerHTML = 'Обучался у лучших в мире';
};
let visBtn = document.querySelector('.list-vis');
let list = document.querySelector('.hide-list');
visBtn.onclick = function(){
  list.classList.toggle('vis-list')
}
let leadBtn = document.querySelector('.lead-vis');
let lead = document.querySelector('.lead-left .stages-list');
leadBtn.onclick = function(){
  lead.classList.toggle('lead-list')
}

let burger = document.querySelector('.burger-wrap');
let wrap = document.querySelector('.wrapper-menu');
let nav = document.querySelector('nav');
burger.onclick = function(){
  wrap.classList.toggle('wrap-vis');
  nav.classList.toggle('wrap-vis');
}