if($(document).ready(function(){document.querySelector(".home_slider")&&$(document).ready(function(){$(".home_slider").slick({slidesToShow:1,dots:!0,responsive:[{breakpoint:900,settings:{arrows:!1,autoplay:!0,autoplaySpeed:3e3}}]})})}),$(".nav_btn").click(function(){$(".nav_menu").toggleClass("nav_menu_active"),$(".nav_btn_line").toggleClass("nav_btn_line_active"),$(".header").toggleClass("header_active_menu"),$("main").toggleClass("dn"),$("footer").toggleClass("dn"),$(this).toggleClass("shows")}),$(".news_wrap_btn").click(function(){$(".sidebar_wrap").toggleClass("sidebar_wrap_active"),$(".sidebar").toggleClass("sidebar_wrap_active"),$(this).toggleClass("news_wrap_btn_active")}),$(".yandexMap_adress_btn").click(function(){$(this).toggleClass("yandexMap_adress_btn_active"),$(".yandexMap_adress").toggleClass("yandexMap_adress_wrap")}),$(".contact_item_title").click(function(){$(".yandexMap_adress_btn").toggleClass("yandexMap_adress_btn_active"),$(".yandexMap_adress").toggleClass("yandexMap_adress_wrap")}),$(".menu_item").has(".subMenu").hover(function(){$(this).addClass("subMenu_active")}),$(".menu_item").has(".subMenu").addClass("menu_arrow"),$(document).mouseup(function(e){var o=$(".subMenu_active");o.is(e.target)||0!==o.has(e.target).length||o.removeClass("subMenu_active")}),document.querySelector("#map")&&ymaps.ready(function(){var e=new ymaps.Map("map",{center:[55.73973206899513,37.60550799999995],zoom:13},{searchControlProvider:"yandex#search"}),o=new ymaps.ObjectManager({clusterize:!0,gridSize:32,clusterDisableClickZoom:!0});o.objects.options.set("preset","islands#greenDotIcon"),o.clusters.options.set("preset","islands#greenClusterIcons"),e.geoObjects.add(o),$.ajax({url:"js/data.json"}).done(function(e){o.add(e)}),e.controls.remove("geolocationControl"),e.controls.remove("searchControl"),e.controls.remove("trafficControl"),e.controls.remove("typeSelector"),e.controls.remove("fullscreenControl"),e.controls.remove("rulerControl"),e.behaviors.disable(["scrollZoom"]),$("#Moscow").click(function(){e.setCenter([55.73973206899513,37.60550799999995],13,{checkZoomRange:!0})}),$("#Buzuluk").click(function(){e.setCenter([53.75672207079035,41.02551099999998],14,{checkZoomRange:!0})}),$("#Tyumen").click(function(){e.setCenter([52.93639757143206,102.79593349999993],14,{checkZoomRange:!0})}),e.behaviors.disable("scrollZoom"),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&e.behaviors.disable("drag")}),document.querySelector(".wow")){var wow=new WOW({boxClass:"wow",animateClass:"animated",offset:170,mobile:!1,live:!0,callback:function(e){},scrollContainer:null});wow.init()}$(window).scroll(function(){var e=$(".timeLine_item_footer");if(!e.hasClass("TimeLineEnd")){var o=$(this).height(),s=e.offset().top-$(this).scrollTop();s<=o&&s+e.height()>0&&(e.addClass("timeLine_item_footer_anim"),console.log("Visible!!!"))}});