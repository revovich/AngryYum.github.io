window.onload=function(){new Swiper(".swiper-container",{speed:400,spaceBetween:0,slidesPerView:1,lazy:!0,pagination:{el:".swiper-pagination",type:"bullets"},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},breakpoints:{820:{width:550,height:310}}}),$(".popap").click(function(){$(".main-wrap").addClass("show"),$(".popap-content").addClass("show"),$(".mob-menu").removeClass("show");let t=$(this).attr("data-title"),e=$(this).attr("data-content"),n=$(this).attr("data-btn"),o=$(this).attr("data-info");$(".popap-content-title").html(t),$(".popap-content-text").html(e),$(".popap-content-submit").val(n),$(".input-info").val(o)}),$(".popap-content-close").click(function(){$(".main-wrap").removeClass("show"),$(".popap-content").removeClass("show")}),$(".btn-mob-menu").click(function(){$(".btn-mob-menu-line").addClass("btn-mob-menu-line-active"),$(".mob-menu").addClass("show-mob")}),$(".mob-close").click(function(){$(".mob-menu").removeClass("show-mob"),$(".btn-mob-menu-line").removeClass("btn-mob-menu-line-active")}),new Vimeo.Player("myVideo",{url:"https://player.vimeo.com/368183969",portrait:!1,title:!1,color:"bd242b",byline:!1}).on("play",function(){console.log("Played the video")})};