var mySwiper=new Swiper(".swiper-container",{speed:400,loop:!0,spaceBetween:15,navigation:{nextEl:".swiper-next",prevEl:".swiper-prev"},breakpoints:{1040:{slidesPerView:3},870:{slidesPerView:2},620:{slidesPerView:3},350:{slidesPerView:2}}});const anchors=[].slice.call(document.querySelectorAll('a[href*="#"]')),animationTime=300,framesCount=20;anchors.forEach(function(e){e.addEventListener("click",function(t){t.preventDefault();let i=document.querySelector(e.getAttribute("href")).getBoundingClientRect().top+window.pageYOffset,n=setInterval(function(){let e=i/20;e>window.pageYOffset-i&&window.innerHeight+window.pageYOffset<document.body.offsetHeight?window.scrollBy(0,e):(window.scrollTo(0,i),clearInterval(n))},15)})});let title=document.querySelector(".sections-title-bold");window.matchMedia("(max-width: 400px)").matches&&(title.innerHTML="Обучался у лучших в мире");let visBtn=document.querySelector(".list-vis"),list=document.querySelector(".hide-list");visBtn.onclick=function(){list.classList.toggle("vis-list")};let leadBtn=document.querySelector(".lead-vis"),lead=document.querySelector(".lead-left .stages-list");leadBtn.onclick=function(){lead.classList.toggle("lead-list")};let burger=document.querySelector(".burger-wrap"),wrap=document.querySelector(".wrapper-menu"),nav=document.querySelector("nav");burger.onclick=function(){wrap.classList.toggle("wrap-vis"),nav.classList.toggle("wrap-vis")};