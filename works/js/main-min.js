if($(document).ready(function(){document.querySelector(".home_slider")&&$(document).ready(function(){$(".home_slider").slick({slidesToShow:1,dots:!0,responsive:[{breakpoint:900,settings:{arrows:!1,autoplay:!0,autoplaySpeed:3e3}}]})})}),$(".nav_btn").click(function(){$("nav").toggleClass("nav_btn_active"),$(".nav_btn_line").toggleClass("nav_btn_line_active"),$("body").toggleClass("noscroll")}),$(".news_wrap_btn").click(function(){$(".sidebar_wrap").toggleClass("sidebar_wrap_active"),$(".sidebar").toggleClass("sidebar_wrap_active"),$(this).toggleClass("news_wrap_btn_active")}),$(".yandexMap_adress_btn").click(function(){$(this).toggleClass("yandexMap_adress_btn_active"),$(".yandexMap_adress").toggleClass("yandexMap_adress_wrap")}),$(".contact_item_title").click(function(){$(".yandexMap_adress_btn").toggleClass("yandexMap_adress_btn_active"),$(".yandexMap_adress").toggleClass("yandexMap_adress_wrap")}),document.querySelector("#map")&&ymaps.ready(function(){var e=new ymaps.Map("map",{center:[55.73973206899513,37.60550799999995],zoom:13},{searchControlProvider:"yandex#search"}),o=new ymaps.ObjectManager({clusterize:!0,gridSize:32,clusterDisableClickZoom:!0});o.objects.options.set("preset","islands#greenDotIcon"),o.clusters.options.set("preset","islands#greenClusterIcons"),e.geoObjects.add(o),$.ajax({url:"js/data.json"}).done(function(e){o.add(e)}),e.controls.remove("geolocationControl"),e.controls.remove("searchControl"),e.controls.remove("trafficControl"),e.controls.remove("typeSelector"),e.controls.remove("fullscreenControl"),e.controls.remove("rulerControl"),e.behaviors.disable(["scrollZoom"]),$("#Moscow").click(function(){e.setCenter([55.73973206899513,37.60550799999995],13,{checkZoomRange:!0})}),$("#Buzuluk").click(function(){e.setCenter([53.75672207079035,41.02551099999998],14,{checkZoomRange:!0})}),$("#Tyumen").click(function(){e.setCenter([52.93639757143206,102.79593349999993],14,{checkZoomRange:!0})})}),document.querySelector(".wow")){var wow=new WOW({boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:function(e){},scrollContainer:null});wow.init()}