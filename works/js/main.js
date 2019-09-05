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


ymaps.ready(init);

function init () {
  var Y = 55.76;
  var X = 37.64;

    var myMap = new ymaps.Map('map', {
            center: [Y, X],
            zoom: 10
        },
        $('#One').click(function(){
         var X =+  30;
         alert(X)
        }),
        {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });  

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    $.ajax({
        url: "js/data.json"
    }).done(function(data) {
        objectManager.add(data);
    });
  }
