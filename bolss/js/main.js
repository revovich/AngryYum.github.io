if(document.querySelector('.slider_wrap')){
  var userFeed = new Instafeed({
    get: 'user',
    userId: '8987997106',
    clientId: '924f677fa3854436947ab4372ffa688d',
    accessToken: '8987997106.924f677.8555ecbd52584f41b9b22ec1a16dafb9',
    resolution: 'standard_resolution',
    template: '<div class="item"><a href="{{link}}" target="_blank" id="{{id}}"><img src="{{image}}" /></a></div>',
    sortBy: 'most-recent',
    limit: 6,
    links: false
  });
  userFeed.run();
  window.onload = function() {
    var instagram = document.querySelectorAll('.instagram .item');
    var i = 0;
    instagram[0].classList.add('item_slider_active');


    var next = document.querySelector('.next');
    next.onclick = function(){
      instagram[i].classList.remove('item_slider_active');
      i++;
      if(i >= instagram.length){
        i = 0;
      }
      instagram[i].classList.add('item_slider_active');
    }
    var prev = document.querySelector('.prev');
    prev.onclick = function(){
      instagram[i].classList.remove('item_slider_active');
      i--;
      if(i < 0){
       i = instagram.length -1;
      }
      instagram[i].classList.add('item_slider_active');
    }
  };
  var linkNav = document.querySelectorAll('[href^="#"]'), 
    V = 0.4;  
for (var i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function(e) { 
        e.preventDefault(); 
        var w = window.pageYOffset, 
            hash = this.href.replace(/[^#]*(.*)/, '$1');  
        t = document.querySelector(hash).getBoundingClientRect().top, 
            start = null;
        requestAnimationFrame(step);
        function step(time) {
            if (start === null) start = time;
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
            window.scrollTo(0,r);
            if (r != w + t) {
                requestAnimationFrame(step)
            } else {
                location.hash = hash 
            }
        }
    }, false);
}
var Wrap = document.querySelector('.WrapContent');
var WrapEmail = document.querySelector('.WrapEmail');
function WrapContact(){
 Wrap.style.display='block';
 WrapEmail.style.top='50%';
 body.classList.remove('noScroll');
}
function clase(){
  Wrap.style.display='none';
  WrapEmail.style.top='-150%';
}

var btn_active = document.querySelector('.header_btn');
var header_btn_line = document.querySelector('.header_btn_line');
var header_active = document.querySelector('header');
var close_menu = document.querySelectorAll('.header_nav a');
var body = document.querySelector('body');
for(var i = 0; i < close_menu.length; i++){
  close_menu[i].onclick = function(){

   header_btn_line.classList.remove('header_btn_acive');
    header_active.classList.remove('active_header');
    body.classList.remove('noScroll');
  }
};
btn_active.onclick = function () {
  header_btn_line.classList.toggle('header_btn_acive');
  header_active.classList.toggle('active_header');
  body.classList.toggle('noScroll');
};
}

if(document.querySelector('.myShops')){
  var Wrap = document.querySelector('.WrapContent');
  var actShop = document.querySelector('.shops');
  var MyShop = document.querySelector('.shop_wrap_top');
  var closeShops = document.querySelector('.closeShops');
  closeShops.onclick = function closeShop(){
    MyShop.style.display="none";
    Wrap.style.display="none";
  }
  actShop.onclick = function(){
    Wrap.style.display='flex';
    MyShop.style.display='flex';
  };
 Wrap.onclick = function(){
   this.style.display="none";
   MyShop.style.display="none";
 }
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains("increase")) {
      ++e.target.parentElement.querySelector("input").value;
    } else if (e.target.classList.contains("decrease")) {
      --e.target.parentElement.querySelector("input").value;
    }
  });
  var filter_shop = document.querySelector('.filter_shop');
  var sidebar_wrap = document.querySelector('.sidebar_wrap');
  filter_shop.onclick = function(){
    sidebar_wrap.classList.toggle('sidebar_wrap_active');
  }
}