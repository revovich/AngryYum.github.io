var wow=new WOW({boxClass:"wow",animateClass:"animated",offset:350});wow.init(),document.querySelector(".wrap_burger").onclick=function(){document.querySelector("header").classList.toggle("header_bottom"),document.querySelector(".nav_wrapper").classList.toggle("nav_wrapper_active")},$(document).ready(function(){$("html, body").mousewheel(function(t,e){this.scrollLeft-=80*e,t.preventDefault()})});var thisLeft,thisWidth,windowWidth=$(window).width();function animateBlocks(){$(".animated").each(function(){thisLeft=$(this).offset().left,thisWidth=$(this).width(),thisLeft<windowWidth&&thisLeft>-thisWidth?$(this).addClass("fadeInUp"):$(this).removeClass("fadeInUp")})}$(document).ready(function(){new Swiper(".swiper-container",{centeredSlides:!0,pagination:{el:".swiper-pagination",type:"bullets",bulletElement:"div",clickable:!0,bulletActiveClass:"cir-act",bulletClass:"cir"}})}),setTimeout(function(){BackgroundCheck.init({targets:".target",images:".thumbnails"})},1e3);