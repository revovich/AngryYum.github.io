window.onload=function(){new Swiper(".swiper-container-lending",{speed:400,spaceBetween:0,slidesPerView:1,lazy:!0,pagination:{el:".swiper-pagination",type:"bullets"},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},breakpoints:{820:{width:550,height:310}}}),new Swiper(".cards-slider",{speed:400,spaceBetween:0,slidesPerView:1,lazy:!0,width:380,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},breakpoints:{820:{width:400,height:208}}}),new Swiper(".cards-slider-wrap",{speed:400,spaceBetween:10,slidesPerView:1,lazy:!0,width:1700,navigation:{nextEl:".swiper-button-next-home",prevEl:".swiper-button-prev-home"},pagination:{el:".swiper-pagination-home",type:"bullets"},breakpoints:{1800:{slidesPerView:4},1500:{slidesPerView:4,width:1400},1305:{slidesPerView:3,width:1200},1100:{slidesPerView:3,width:1e3},890:{slidesPerView:2,width:800},697:{slidesPerView:2,width:600},480:{spaceBetween:0,slidesPerView:1,width:450},1:{spaceBetween:0,slidesPerView:1,width:310}}});if($(".popap").click(function(){$("body").css({overflow:"hidden"}),$(".popap-content").fadeIn(800),$(".main-wrap").fadeIn(700),$(".mob-menu").removeClass("show");let e=$(this).attr("data-title"),t=$(this).attr("data-content"),i=$(this).attr("data-btn"),n=$(this).attr("data-info");$(".new-title").html(e),$(".new-content").html(t),$(".new-submit").val(i),$(".input-info").val(n)}),$(".popap-content-close").click(function(){$("body").attr("style",""),$(".main-wrap").fadeOut(800),$(".popap-content").fadeOut(700)}),$(".btn-mob-menu").click(function(){$(".btn-mob-menu-line").addClass("btn-mob-menu-line-active"),$(".mob-menu").fadeIn(700)}),$(".mob-close").click(function(){$(".mob-menu").fadeOut(700),$(".btn-mob-menu-line").removeClass("btn-mob-menu-line-active")}),$(".left-blog-header-filter-item").click(function(){$(".left-blog-header-filter").toggle(700)}),$(".sub-menu").mouseenter(function(){$(this).children().fadeIn(500)}),$(".sub-menu").mouseleave(function(){$(".sub-menu ul").delay(1e3).fadeOut(500)}),this.document.querySelector("#myVideo")){new Vimeo.Player("myVideo",{url:"https://player.vimeo.com/368183969",portrait:!1,title:!1,color:"bd242b",byline:!1}).on("play",function(){console.log("Played the video")})}$(window).scroll(function(){let e=$(this).scrollTop();$('*[data-type="parallax"]').css({transform:"translate(0%, "+e/80+"%"})});var e=$("html, body");$('a[href*="#"]').click(function(){return e.animate({scrollTop:$($.attr(this,"href")).offset().top},400),!1}),$("select").each(function(){var e=$(this),t=$(this).children("option").length;e.addClass("select-hidden"),e.wrap('<div class="select"></div>'),e.after('<div class="select-styled"></div>');var i=e.next("div.select-styled");i.text(e.children("option").eq(0).text());for(var n=$("<ul />",{class:"select-options"}).insertAfter(i),a=0;a<t;a++)$("<li />",{text:e.children("option").eq(a).text(),rel:e.children("option").eq(a).val()}).appendTo(n);var l=n.children("li");i.click(function(e){e.stopPropagation(),$("div.select-styled.active").not(this).each(function(){$(this).removeClass("active").next("ul.select-options").hide()}),$(this).toggleClass("active").next("ul.select-options").toggle()}),l.click(function(t){t.stopPropagation(),i.text($(this).text()).removeClass("active"),e.val($(this).attr("rel")),n.hide()}),$(document).click(function(){i.removeClass("active"),n.hide()})});let t=$(".header-animate-item"),i=$.makeArray(t),n=$(".header-animate");var a=0;setInterval(function(){let e=$(i[a]).text();n.text(e),++a>=i.length&&(a=0)},3e3),$(".faq-item  h3").click(function(e){let t=$(this);t.next().hasClass("show")?(t.next().removeClass("show"),t.next().slideUp(350),t.removeClass("faq-header-active")):(t.parent().parent().find(".faq-content").removeClass("show"),t.parent().parent().find(".faq-item  h3").removeClass("faq-header-active"),t.parent().parent().find(".faq-content").slideUp(350),t.next().toggleClass("show"),t.next().slideToggle(350),t.addClass("faq-header-active"))}),$(".tab_item").not(":first").hide(),$(".books .tab-title").hover(function(){$(".books .tab-title").removeClass("red").eq($(this).index()).addClass("red"),$(".tab_item").hide().eq($(this).index()).fadeIn(100)}).eq(0).addClass("red"),$(".vacancies-popap").click(function(){$("body").css({overflow:"hidden"}),$(".main-wrap").fadeIn(700),$(".vacancies-popap-content").fadeIn(800)}),$(".vacancies-popap-close").click(function(){$("body").css({overflow:"auto"}),$(".main-wrap").fadeOut(800),$(".vacancies-popap-content").fadeOut(700)});var l=void 0!==$("<input/>")[0].multiple,o=/msie/i.test(navigator.userAgent);$.fn.customFile=function(){return this.each(function(){var e=$(this).addClass("custom-file-upload-hidden"),t=$('<div class="file-upload-wrapper">'),i=$('<input type="text" class="file-upload-input" />'),n=$('<button type="button" class="file-upload-button">Выбрать файлы</button>'),a=$('<label class="file-upload-button" for="'+e[0].id+'">Выбрать файлы</label>');e.css({position:"absolute",left:"-9999px"}),t.insertAfter(e).append(e,i,o?a:n),e.attr("tabIndex",-1),n.attr("tabIndex",-1),n.click(function(){e.focus().click()}),e.change(function(){var t,n,a=[];if(l){for(var o=0,s=(t=e[0].files).length;o<s;o++)a.push(t[o].name);n=a.join(", ")}else n=e.val().split("\\").pop();i.val(n).attr("title",n).focus()}),i.on({blur:function(){e.trigger("blur")},keydown:function(t){if(13===t.which)o||e.trigger("click");else{if(8!==t.which&&46!==t.which)return 9===t.which&&void 0;e.replaceWith(e=e.clone(!0)),e.trigger("change"),i.val("")}}})})},l||$(document).on("change","input.customfile",function(){var e=$(this),t="customfile_"+(new Date).getTime(),i=e.parent(),n=i.siblings().find(".file-upload-input").filter(function(){return!this.value}),a=$('<input type="file" id="'+t+'" name="'+e.attr("name")+'"/>');setTimeout(function(){e.val()?n.length||(i.after(a),a.customFile()):(n.parent().remove(),i.appendTo(i.parent()),i.find("input").focus())},1)});l=void 0!==$("<input/>")[0].multiple,o=/msie/i.test(navigator.userAgent);$.fn.customFile=function(){return this.each(function(){var e=$(this).addClass("custom-file-upload-hidden"),t=$('<div class="file-upload-wrapper">'),i=$('<input type="text" class="file-upload-input" />'),n=$('<button type="button" class="file-upload-button">Загрузить файлы</button>'),a=$('<label class="file-upload-button" for="'+e[0].id+'">Загрузить файлы</label>');e.css({position:"absolute",left:"-9999px"}),t.insertAfter(e).append(e,i,o?a:n),e.attr("tabIndex",-1),n.attr("tabIndex",-1),n.click(function(){e.focus().click()}),e.change(function(){var t,n,a=[];if(l){for(var o=0,s=(t=e[0].files).length;o<s;o++)a.push(t[o].name);n=a.join(", ")}else n=e.val().split("\\").pop();i.val(n).attr("title",n).focus()}),i.on({blur:function(){e.trigger("blur")},keydown:function(t){if(13===t.which)o||e.trigger("click");else{if(8!==t.which&&46!==t.which)return 9===t.which&&void 0;e.replaceWith(e=e.clone(!0)),e.trigger("change"),i.val("")}}})})},l||$(document).on("change","input.customfile",function(){var e=$(this),t="customfile_"+(new Date).getTime(),i=e.parent(),n=i.siblings().find(".file-upload-input").filter(function(){return!this.value}),a=$('<input type="file" id="'+t+'" name="'+e.attr("name")+'"/>');setTimeout(function(){e.val()?n.length||(i.after(a),a.customFile()):(n.parent().remove(),i.appendTo(i.parent()),i.find("input").focus())},1)}),$("input[type=file]").customFile()};