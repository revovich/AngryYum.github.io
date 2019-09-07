$(document).ready(function () {
  if (document.querySelector('.home_slider')) {
    $(document).ready(function () {
      $('.home_slider').slick({
        slidesToShow: 1,
        dots: true,
        responsive: [
          {
            breakpoint: 900,
            settings: {
              arrows: false,
              autoplay: true,
              autoplaySpeed: 3000,
            }
          }]
      });
    });
  }
});
$('.nav_btn').click(function () {
  $('nav').toggleClass('nav_btn_active');
  $('.nav_btn_line').toggleClass('nav_btn_line_active');
  $('body').toggleClass('noscroll');
});
$('.news_wrap_btn').click(function () {
  $('.sidebar_wrap').toggleClass('sidebar_wrap_active');
  $('.sidebar').toggleClass('sidebar_wrap_active');
  $(this).toggleClass('news_wrap_btn_active')
});
$('.yandexMap_adress_btn').click(function(){
  $(this).toggleClass('yandexMap_adress_btn_active');
  $('.yandexMap_adress').toggleClass('yandexMap_adress_wrap');
});
$('.contact_item_title').click(function(){
  $('.yandexMap_adress_btn').toggleClass('yandexMap_adress_btn_active');
  $('.yandexMap_adress').toggleClass('yandexMap_adress_wrap');
})
$('.menu_item').has('.subMenu').hover(function(){
  $(this).addClass('subMenu_active')
});
$(document).mouseup(function (e){
  var div = $(".subMenu_active");
  if (!div.is(e.target)
      && div.has(e.target).length === 0) {
        div.removeClass('subMenu_active')
  }
});
if(document.querySelector('#map')){
  ymaps.ready(function () {
  
    var myMap = new ymaps.Map('map', {
            center: [55.73973206899513,37.60550799999995],
            zoom: 13,
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
          // Чтобы метки начали кластеризоваться, выставляем опцию.
          clusterize: true,
          // ObjectManager принимает те же опции, что и кластеризатор.
          gridSize: 32,
          clusterDisableClickZoom: true
      });
  objectManager.objects.options.set('preset', 'islands#greenDotIcon');
  objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
  myMap.geoObjects.add(objectManager);
  $.ajax({
      url: "js/data.json"
  }).done(function(data) {
      objectManager.add(data);
  });
  myMap.controls.remove('geolocationControl');
  myMap.controls.remove('searchControl');
  myMap.controls.remove('trafficControl');
  myMap.controls.remove('typeSelector');
  myMap.controls.remove('fullscreenControl');
  myMap.controls.remove('rulerControl');
  myMap.behaviors.disable(['scrollZoom']);
        $('#Moscow').click(function(){
          myMap.setCenter([ 55.73973206899513,37.60550799999995], 13, {
            checkZoomRange: true
        });
        });
        $('#Buzuluk').click(function(){
          myMap.setCenter([ 53.75672207079035,41.02551099999998], 14, {
            checkZoomRange: true
        });
        });
        $('#Tyumen').click(function(){
          myMap.setCenter([ 52.93639757143206,102.79593349999993], 14, {
            checkZoomRange: true
        });
        });

//отключаем зум колёсиком мышки
myMap.behaviors.disable('scrollZoom');
 
//на мобильных устройствах... (проверяем по userAgent браузера)
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //... отключаем перетаскивание карты
    myMap.behaviors.disable('drag');
}
  });
}
if(document.querySelector('.wow')){
  var wow = new WOW(
    {
      boxClass:     'wow',      // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset:       170,          // distance to the element when triggering the animation (default is 0)
      mobile:       false,       // trigger animations on mobile devices (default is true)
      live:         true,     // act on asynchronously loaded content (default is true)
      callback:     function(box) {
        // the callback is fired every time an animation is started
        // the argument that is passed in is the DOM node being animated
      },
      scrollContainer: null // optional scroll container selector, otherwise use window
    }
  );
  wow.init();
}

jQuery(document).ready(function($) {
  $(window).scroll(function() {
    var cont = $('.timeLine_item_footer');
    if (!cont.hasClass('TimeLineEnd')) {
      var wh = $(this).height();
      var topOffset = cont.offset().top - $(this).scrollTop();
      var visible = (topOffset <= wh) && (topOffset + cont.height() > 0);
      if (visible) {
        cont.addClass('timeLine_item_footer_anim');
        console.log('Visible!!!');
      }
    }
  });
});

