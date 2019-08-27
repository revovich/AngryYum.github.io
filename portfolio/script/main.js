var btn = document.querySelector('.aside_btn')
var aside = document.querySelector('aside');
btn.onclick = function(){
   this.classList.toggle('btn_active');
    aside.classList.toggle('aside_active');
};
$(document).ready(
    function() {
        $("main .works .work_container .work .work_back p").niceScroll();
    }
);