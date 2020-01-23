window.onload = function() {
  var mySwiper = new Swiper('.swiper-container-lending', {
    speed: 400,
    spaceBetween: 0,
    slidesPerView: 1,
    lazy: true,
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        820: {
            width: 550,
            height: 310,
        },
      }
});

var mySwiper = new Swiper('.cards-slider', {
  speed: 400,
  spaceBetween: 0,
  slidesPerView: 1,
  lazy: true,
  width: 380,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      820: {
          width: 400,
          height: 208,
      },
    }
});
var mySwiper = new Swiper('.cards-slider-wrap', {
  speed: 400,
  spaceBetween: 10,
  slidesPerView: 1,
  lazy: true,
  width: 1700,
  navigation: {
    nextEl: '.swiper-button-next-home',
    prevEl: '.swiper-button-prev-home',
  },
  pagination: {
    el: '.swiper-pagination-home',
    type: 'bullets',
  },
    breakpoints: {
      1800: {
        slidesPerView: 4,
      },
      1500: {
        slidesPerView: 4,
        width: 1400,
      },
      1305: {
        slidesPerView: 3,
        width: 1200,

      },
      1100: {
        slidesPerView: 3,
        width: 1000,

      },
      890: {
        slidesPerView: 2,
        width: 800,
      },
      697: {
        slidesPerView: 2,
        width: 600,
      },
      480: {
        spaceBetween: 0,
        slidesPerView: 1,
        width: 450,
      },
      1: {
        spaceBetween: 0,
        slidesPerView: 1,
        width: 310,
      },
    }
});
  

    $('.popap').click(function () {
        $('body').css({'overflow': 'hidden'}) 
        $(".popap-content").fadeIn(800);
        $(".main-wrap").fadeIn(700);
        $(".mob-menu").removeClass('show');
        let title = $(this).attr("data-title");
        let content = $(this).attr("data-content");
        let infoBtn = $(this).attr("data-btn");
        let info = $(this).attr("data-info");
        $('.new-title').html(title);
        $('.new-text').html(content);
        $('.new-submit').val(infoBtn);
        $('.input-info').val(info);

        });
        $('.popap-content-close').click(function () {
          $('body').attr('style', '');
            $(".main-wrap").fadeOut(800);
            $(".popap-content").fadeOut(700);
            });
        $('.btn-mob-menu').click(function(){
            $('.btn-mob-menu-line').addClass('btn-mob-menu-line-active');
            $('.mob-menu').fadeIn(700);
        })
        $('.mob-close').click(function(){
            $('.mob-menu').fadeOut(700);
            $('.btn-mob-menu-line').removeClass('btn-mob-menu-line-active');
        })
        $('.left-blog-header-filter-item').click(function(){
          $('.left-blog-header-filter').toggle(700)
        })
        $('.sub-menu').mouseenter(function(){
          $(this).children().fadeIn(500)
        })
        $('.sub-menu').mouseleave(function(){
          $('.sub-menu ul').delay(1000).fadeOut(500);
        })
      if(this.document.querySelector('#myVideo')){
        var options = {
          url: "https://player.vimeo.com/368183969",
          portrait: false,
          title: false,
          color: 'bd242b',
          byline: false,
        };
      
        var videoPlayer = new Vimeo.Player('myVideo', options);
      
        videoPlayer.on('play', function() {
          console.log('Played the video');
        });
      }

     $(window).scroll(function(){
      let st = $(this).scrollTop();
      $('*[data-type="parallax"]').css({
        "transform" : "translate(0%, " + st / 80 + "%"
      })
     })


     var $page = $('html, body');
     $('a[href*="#"]').click(function() {
         $page.animate({
             scrollTop: $($.attr(this, 'href')).offset().top
         }, 400);
         return false;
     });



     $('select').each(function(){
      var $this = $(this), numberOfOptions = $(this).children('option').length;
    
      $this.addClass('select-hidden'); 
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="select-styled"></div>');
  
      var $styledSelect = $this.next('div.select-styled');
      $styledSelect.text($this.children('option').eq(0).text());
    
      var $list = $('<ul />', {
          'class': 'select-options'
      }).insertAfter($styledSelect);
    
      for (var i = 0; i < numberOfOptions; i++) {
          $('<li />', {
              text: $this.children('option').eq(i).text(),
              rel: $this.children('option').eq(i).val()
          }).appendTo($list);
      }
    
      var $listItems = $list.children('li');
    
      $styledSelect.click(function(e) {
          e.stopPropagation();
          $('div.select-styled.active').not(this).each(function(){
              $(this).removeClass('active').next('ul.select-options').hide();
          });
          $(this).toggleClass('active').next('ul.select-options').toggle();
      });
    
      $listItems.click(function(e) {
          e.stopPropagation();
          $styledSelect.text($(this).text()).removeClass('active');
          $this.val($(this).attr('rel'));
          $list.hide();
          //console.log($this.val());
      });
    
      $(document).click(function() {
          $styledSelect.removeClass('active');
          $list.hide();
      });
  
  });

 let test = $('.header-animate-item');
 let li_array = $.makeArray(test);
let textVis = $('.header-animate');
 var current = 0;
setInterval(function(){
      let text = $(li_array[current]).text();
      textVis.text(text)
      current++;
      if(current >= li_array.length) current = 0;
}, 3000);





  $('.faq-item  h3').click(function(e) {
    let $this = $(this);



    if ($this.next().hasClass('show')) {
        $this.next().removeClass('show');
        $this.next().slideUp(350);
        $this.removeClass('faq-header-active')
    } else {
      $this.parent().parent().find('.faq-content').removeClass('show');
      $this.parent().parent().find('.faq-item  h3').removeClass('faq-header-active');
        $this.parent().parent().find('.faq-content').slideUp(350);
        $this.next().toggleClass('show');
        $this.next().slideToggle(350);
        $this.addClass('faq-header-active')
    }
});


$(".tab_item").not(":first").hide();
$(".books .tab-title").hover(function() {
    $(".books .tab-title").removeClass("red").eq($(this).index()).addClass("red");
    $(".tab_item").hide().eq($(this).index()).fadeIn(100)
}).eq(0).addClass("red");


$('.vacancies-popap').click(function(){
  $('body').css({'overflow': 'hidden'}) 
  $(".main-wrap").fadeIn(700);
  $(".vacancies-popap-content").fadeIn(800);
})

$('.vacancies-popap-close').click(function(){
  $('body').css({'overflow': 'auto'}) 
  $(".main-wrap").fadeOut(800);
  $(".vacancies-popap-content").fadeOut(700);
})


$(document).mouseup(function (e){ 
  var div = $( ".popap-content"); 
  if (!div.is(e.target) 
      && div.has(e.target).length === 0) { 
    div.fadeOut(700); 
    $('body').css({'overflow': 'auto'}) 
    $(".main-wrap").fadeOut(800);
    $(".vacancies-popap-content").fadeOut(700);
    $(".popap-content").fadeOut(700);
  }
});





	  // Browser supports HTML5 multiple file?
    var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
    isIE = /msie/i.test( navigator.userAgent );

$.fn.customFile = function() {

  return this.each(function() {

    var $file = $(this).addClass('custom-file-upload-hidden'), // the original file input
        $wrap = $('<div class="file-upload-wrapper">'),
        $input = $('<input type="text" class="file-upload-input" />'),
        // Button that will be used in non-IE browsers
        $button = $('<button type="button" class="file-upload-button">Выбрать файлы</button>'),
        // Hack for IE
        $label = $('<label class="file-upload-button" for="'+ $file[0].id +'">Выбрать файлы</label>');

    // Hide by shifting to the left so we
    // can still trigger events
    $file.css({
      position: 'absolute',
      left: '-9999px'
    });

    $wrap.insertAfter( $file )
      .append( $file, $input, ( isIE ? $label : $button ) );

    // Prevent focus
    $file.attr('tabIndex', -1);
    $button.attr('tabIndex', -1);

    $button.click(function () {
      $file.focus().click(); // Open dialog
    });

    $file.change(function() {

      var files = [], fileArr, filename;

      // If multiple is supported then extract
      // all filenames from the file array
      if ( multipleSupport ) {
        fileArr = $file[0].files;
        for ( var i = 0, len = fileArr.length; i < len; i++ ) {
          files.push( fileArr[i].name );
        }
        filename = files.join(', ');

      // If not supported then just take the value
      // and remove the path to just show the filename
      } else {
        filename = $file.val().split('\\').pop();
      }

      $input.val( filename ) // Set the value
        .attr('title', filename) // Show filename in title tootlip
        .focus(); // Regain focus

    });

    $input.on({
      blur: function() { $file.trigger('blur'); },
      keydown: function( e ) {
        if ( e.which === 13 ) { // Enter
          if ( !isIE ) { $file.trigger('click'); }
        } else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
          // On some browsers the value is read-only
          // with this trick we remove the old input and add
          // a clean clone with all the original events attached
          $file.replaceWith( $file = $file.clone( true ) );
          $file.trigger('change');
          $input.val('');
        } else if ( e.which === 9 ){ // TAB
          return;
        } else { // All other keys
          return false;
        }
      }
    });

  });

};

// Old browser fallback
if ( !multipleSupport ) {
  $( document ).on('change', 'input.customfile', function() {

    var $this = $(this),
        // Create a unique ID so we
        // can attach the label to the input
        uniqId = 'customfile_'+ (new Date()).getTime(),
        $wrap = $this.parent(),

        // Filter empty input
        $inputs = $wrap.siblings().find('.file-upload-input')
          .filter(function(){ return !this.value }),

        $file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

    // 1ms timeout so it runs after all other events
    // that modify the value have triggered
    setTimeout(function() {
      // Add a new input
      if ( $this.val() ) {
        // Check for empty fields to prevent
        // creating new inputs when changing files
        if ( !$inputs.length ) {
          $wrap.after( $file );
          $file.customFile();
        }
      // Remove and reorganize inputs
      } else {
        $inputs.parent().remove();
        // Move the input so it's always last on the list
        $wrap.appendTo( $wrap.parent() );
        $wrap.find('input').focus();
      }
    }, 1);

  });
}	  // Browser supports HTML5 multiple file?
		  var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
		      isIE = /msie/i.test( navigator.userAgent );

		  $.fn.customFile = function() {

		    return this.each(function() {

		      var $file = $(this).addClass('custom-file-upload-hidden'), // the original file input
		          $wrap = $('<div class="file-upload-wrapper">'),
		          $input = $('<input type="text" class="file-upload-input" />'),
		          // Button that will be used in non-IE browsers
		          $button = $('<button type="button" class="file-upload-button">Загрузить файлы</button>'),
		          // Hack for IE
		          $label = $('<label class="file-upload-button" for="'+ $file[0].id +'">Загрузить файлы</label>');

		      // Hide by shifting to the left so we
		      // can still trigger events
		      $file.css({
		        position: 'absolute',
		        left: '-9999px'
		      });

		      $wrap.insertAfter( $file )
		        .append( $file, $input, ( isIE ? $label : $button ) );

		      // Prevent focus
		      $file.attr('tabIndex', -1);
		      $button.attr('tabIndex', -1);

		      $button.click(function () {
		        $file.focus().click(); // Open dialog
		      });

		      $file.change(function() {

		        var files = [], fileArr, filename;

		        // If multiple is supported then extract
		        // all filenames from the file array
		        if ( multipleSupport ) {
		          fileArr = $file[0].files;
		          for ( var i = 0, len = fileArr.length; i < len; i++ ) {
		            files.push( fileArr[i].name );
		          }
		          filename = files.join(', ');

		        // If not supported then just take the value
		        // and remove the path to just show the filename
		        } else {
		          filename = $file.val().split('\\').pop();
		        }

		        $input.val( filename ) // Set the value
		          .attr('title', filename) // Show filename in title tootlip
		          .focus(); // Regain focus

		      });

		      $input.on({
		        blur: function() { $file.trigger('blur'); },
		        keydown: function( e ) {
		          if ( e.which === 13 ) { // Enter
		            if ( !isIE ) { $file.trigger('click'); }
		          } else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
		            // On some browsers the value is read-only
		            // with this trick we remove the old input and add
		            // a clean clone with all the original events attached
		            $file.replaceWith( $file = $file.clone( true ) );
		            $file.trigger('change');
		            $input.val('');
		          } else if ( e.which === 9 ){ // TAB
		            return;
		          } else { // All other keys
		            return false;
		          }
		        }
		      });

		    });

		  };

		  // Old browser fallback
		  if ( !multipleSupport ) {
		    $( document ).on('change', 'input.customfile', function() {

		      var $this = $(this),
		          // Create a unique ID so we
		          // can attach the label to the input
		          uniqId = 'customfile_'+ (new Date()).getTime(),
		          $wrap = $this.parent(),

		          // Filter empty input
		          $inputs = $wrap.siblings().find('.file-upload-input')
		            .filter(function(){ return !this.value }),

		          $file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

		      // 1ms timeout so it runs after all other events
		      // that modify the value have triggered
		      setTimeout(function() {
		        // Add a new input
		        if ( $this.val() ) {
		          // Check for empty fields to prevent
		          // creating new inputs when changing files
		          if ( !$inputs.length ) {
		            $wrap.after( $file );
		            $file.customFile();
		          }
		        // Remove and reorganize inputs
		        } else {
		          $inputs.parent().remove();
		          // Move the input so it's always last on the list
		          $wrap.appendTo( $wrap.parent() );
		          $wrap.find('input').focus();
		        }
		      }, 1);

		    });
		  }



      $('input[type=file]').customFile();




 };