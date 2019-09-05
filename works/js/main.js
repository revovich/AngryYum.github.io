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


const items = [
  { coord: [ 55.751244, 37.618423 ], title: 'Moscow' },
  { coord: [ 48.864716, 2.349014 ], title: 'Paris' },
  { coord: [ 34.052235, -118.243683 ], title: 'Los Angeles' },
];

ymaps.ready(function () {
  const map = new ymaps.Map('map', {
    zoom: 9,
    center: items[0].coord,
    controls: [],
  });

  items.forEach(n => map.geoObjects.add(new ymaps.Placemark(n.coord)));


  const buttons = document.querySelector('#buttons');

  buttons.innerHTML = items.map(n =>
    `<button data-coord="${JSON.stringify(n.coord)}">${n.title}</button>`
  ).join('');

  buttons.addEventListener('click', ({ target: { dataset: { coord } } }) => {
    if (coord) {
      map.setCenter(JSON.parse(coord));
    }
  });
});
