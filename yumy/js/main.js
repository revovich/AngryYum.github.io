window.onload = function() {
  var mySwiper = new Swiper('.swiper-container-lending', {
    speed: 400,
    spaceBetween: 0,
    slidesPerView: 1,
    lazy: true,
    pagination: {
        el: '.swiper-pagination',
        type: 'bulvars',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
});

var mySwiper = new Swiper('.cards-slider', {
  speed: 400,
  spaceBetween: 0,
  slidesPerView: 1,
  lazy: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

});
var mySwiper = new Swiper('.cards-slider-wrap', {
  speed: 400,
  spaceBetween: 10,
  slidesPerView: 1,
  lazy: true,
  navigation: {
    nextEl: '.swiper-button-next-home',
    prevEl: '.swiper-button-prev-home',
  },
  pagination: {
    el: '.swiper-pagination-home',
    type: 'bulvars',
    clickable: true,
  },
    breakpoints: {
      1500: {
        slidesPerView: 4,
      },
      1100: {
        slidesPerView: 3,

      },
      700: {
        slidesPerView: 2,
      },



    }
});
  

  
var mySwiper = new Swiper('.cards-slider-product', {
  speed: 400,
  spaceBetween: 0,
  slidesPerView: 1,
  lazy: true,
    navigation: {
      nextEl: '.swiper-button-next-home',
      prevEl: '.swiper-button-prev-home',
    },
    breakpoints: {
      1500: {
        slidesPerView: 3,
      },
      1100: {
        slidesPerView: 3,

      },
      700: {
        slidesPerView: 2,
      },



    }
});
var mySwiper = new Swiper('.cards-slider-product-footer', {
  speed: 400,
  spaceBetween: 10,
  slidesPerView: 1,
  lazy: true,
    navigation: {
      nextEl: '.swiper-button-next-home',
      prevEl: '.swiper-button-prev-home',
    },
    breakpoints: {
      1390: {
        slidesPerView: 3,
      },
      660: {
        slidesPerView: 2,

      },



    }
});






/**
 * 
 * 
$(window).scroll(function(event){
  let yum = $('.tame-line-wrap').offset().top;
  let yum3 = $('.tame-line-wrap').height();
  let yum2 = $(document).scrollTop();
let yum4 = yum + yum3;

console.log(yum);
console.log(yum2);


  if( yum < yum2 ){
    console.log('еще вижу"""!!!')

  }
})

 */























 let filtersMe =  document.querySelector('#slider-limit-two');
let filtersMee =  document.querySelector('#slider-limit');
if(filtersMe){
let limitSliderTwo = document.querySelector('#slider-limit-two');
 var minTwo = Number($('#slider-limit-value-bot').attr('data-left-bot'));
var maxTwo = Number($('#slider-limit-value-top').attr('data-right-bot'));

noUiSlider.create(limitSliderTwo, {
    start: [minTwo, maxTwo],
    connect: true,
    range: {
        'min': minTwo,
        'max': maxTwo,
    },
    format: wNumb({
      decimals: 0,
      thousand: ' ',
      prefix: '$'
  }),
});

var limitFieldMinTwo = document.querySelector('#slider-limit-value-bot');
var limitFieldMaxTwo = document.querySelector('#slider-limit-value-top');

limitSliderTwo.noUiSlider.on('update', function (values, handle) {
    (handle ? limitFieldMaxTwo : limitFieldMinTwo).innerHTML = values[handle];
});

}
if(filtersMee){
  let limitSlider = document.querySelector('#slider-limit');
  var min = Number($('#slider-limit-value-min').attr('data-left'));
  var max = Number($('#slider-limit-value-max').attr('data-right'));
  ;
  noUiSlider.create(limitSlider, {
      start: [min, max],
      connect: true,
      range: {
          'min': min,
          'max': max,
      },
      format: wNumb({
        decimals: 0,
        thousand: ' ',
        prefix: '$'
    }),
  });
  
  var limitFieldMin = document.querySelector('#slider-limit-value-min');
  var limitFieldMax = document.querySelector('#slider-limit-value-max');
  
  limitSlider.noUiSlider.on('update', function (values, handle) {
      (handle ? limitFieldMax : limitFieldMin).innerHTML = values[handle];
  });
}
 

























    $('.popap').click(function () {
        $('body').css({'overflow': 'hidden'}) 
        $(".popap-content").fadeIn(800);
        $(".main-wrap").fadeIn(700);
        $(".mob-menu").removeClass('show');
        var title = $(this).attr("data-title");
        var content = $(this).attr("data-content");
        var infoBtn = $(this).attr("data-btn");
        var info = $(this).attr("data-info");
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
      var st = $(this).scrollTop();
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

 var test = $('.header-animate-item');
 var li_array = $.makeArray(test);
var textVis = $('.header-animate');
 var current = 0;
setInterval(function(){
      var text = $(li_array[current]).text();
      textVis.text(text)
      current++;
      if(current >= li_array.length) current = 0;
}, 3000);





  $('.faq-item  h3').click(function(e) {
    var $this = $(this);



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
$(".books .tab-title").click(function() {
    $(".books .tab-title").removeClass("red").eq($(this).index()).addClass("red");
    $(".tab_item").fadeOut(500).eq($(this).index()).delay(500).fadeIn(1000)
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












   /* 1 of 2 : SWIPER ################################### */
   let area = document.querySelector('.swiper-container-area');
   let condominium = document.querySelector('.swiper-container-condominium');
   let product = this.document.querySelector('.swiper-container-product');
 if (area) {
  var mySwiper = new Swiper(".swiper-container-area", {
    // If swiper loop is true set photoswipe counterEl: false (line 175 her)
    loop: true,
 
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    slideToClickedSlide: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        980: {
          slidesPerView: 3,
        },
      }
  });
} else if (condominium) {
 var mySwiper = new Swiper(".swiper-container-condominium", { 
    slidesPerView: 1,
    spaceBetween: 20,
    height: 1100,
    autoHeight: true,
    setWrapperSize: true,
    watchOverflow: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        980: {
          slidesPerView: 3,
        },
        600: {
          slidesPerView: 2,
        },
      }
  });

} else if(product){
  
  var galleryThumb = new Swiper('.gallery-thumbs-product', {
    spaceBetween: 20,
    slidesPerView: 'auto',
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    breakpoints: {
      1210: {
        spaceBetween: 0,
        slidesPerColumn: 2,
        direction: 'vertical',
      },
    }
  });
  var galleryTop = new Swiper('.swiper-container-product', {
    spaceBetween: 10,
    slidesPerView: 1,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: galleryThumb
    },
  });  

} 




// 2 of 2 : PHOTOSWIPE #######################################

var initPhotoSwipeFrom = function(gallerySelector) {
  // parse slide data (url, title, size ...) from DOM elements
  // (children of gallerySelector)
  var parseThumbnailElements = function(el) {
    var thumbElements = el.childNodes,
      numNodes = thumbElements.length,
      items = [],
      figureEl,
      linkEl,
      size,
      item;

    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i]; // <figure> element

      // include only element nodes
      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element

      size = linkEl.getAttribute("data-size").split("x");

      // create slide object
      item = {
        src: linkEl.getAttribute("href"),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };

      if (figureEl.children.length > 1) {
        // <figcaption> content
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute("src");
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }

    return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function(el) {
      return el.tagName && el.tagName.toUpperCase() === "LI";
    });

    if (!clickedListItem) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    var clickedGallery = clickedListItem.parentNode,
      childNodes = clickedListItem.parentNode.childNodes,
      numChildNodes = childNodes.length,
      nodeIndex = 0,
      index;

    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }

    if (index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
      params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split("&");
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split("=");
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function(
    index,
    galleryElement,
    disableAnimation,
    fromURL
  ) {
    var pswpElement = document.querySelectorAll(".pswp")[0],
      gallery,
      options,
      items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)

    options = {
      /* "showHideOpacity" uncomment this If dimensions of your small thumbnail don't match dimensions of large image */
      //showHideOpacity:true,

      // Buttons/elements
      closeEl: true,
      captionEl: true,
      fullscreenEl: true,
      zoomEl: true,
      shareEl: false,
      counterEl: false,
      arrowEl: true,
      preloaderEl: true,
      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute("data-pswp-uid"),
      getThumbBoundsFn: function(index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = items[index].el.getElementsByTagName("img")[0], // find thumbnail
          pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }
    };  

    // PhotoSwipe opened from URL
    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

    /* EXTRA CODE (NOT FROM THE CORE) - UPDATE SWIPER POSITION TO THE CURRENT ZOOM_IN IMAGE (BETTER UI) */

    // photoswipe event: Gallery unbinds events
    // (triggers before closing animation)
    gallery.listen("unbindEvents", function() {
      // This is index of current photoswipe slide
      var getCurrentIndex = gallery.getCurrentIndex();
      // Update position of the slider
      mySwiper.slideTo(getCurrentIndex, false);
    });
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll(gallerySelector);

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute("data-pswp-uid", i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};

// execute above function
initPhotoSwipeFrom(".my-gallery"); 




var initPhotoSwipeFromDOM = function(gallerySelector) {

  // parse slide data (url, title, size ...) from DOM elements 
  // (children of gallerySelector)
  var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;

      for(var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // <figure> element

          // include only element nodes 
          if(figureEl.nodeType !== 1) {
              continue;
          }

          linkEl = figureEl.children[0]; // <a> element

          size = linkEl.getAttribute('data-size').split('x');

          // create slide object
          item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
          };



          if(figureEl.children.length > 1) {
              // <figcaption> content
              item.title = figureEl.children[1].innerHTML; 
          }

          if(linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src');
          } 

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
      }

      return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });

      if(!clickedListItem) {
          return;
      }

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

      for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
              continue; 
          }

          if(childNodes[i] === clickedListItem) {
              index = nodeIndex;
              break;
          }
          nodeIndex++;
      }



      if(index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe( index, clickedGallery );
      }
      return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};

      if(hash.length < 5) {
          return params;
      }

      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
              continue;
          }
          var pair = vars[i].split('=');  
          if(pair.length < 2) {
              continue;
          }           
          params[pair[0]] = pair[1];
      }

      if(params.gid) {
          params.gid = parseInt(params.gid, 10);
      }

      return params;
  };

  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {

          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),

          getThumbBoundsFn: function(index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                  pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                  rect = thumbnail.getBoundingClientRect(); 

              return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          }

      };

      // PhotoSwipe opened from URL
      if(fromURL) {
          if(options.galleryPIDs) {
              // parse real index when custom PIDs are used 
              // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
              for(var j = 0; j < items.length; j++) {
                  if(items[j].pid == index) {
                      options.index = j;
                      break;
                  }
              }
          } else {
              // in URL indexes start from 1
              options.index = parseInt(index, 10) - 1;
          }
      } else {
          options.index = parseInt(index, 10);
      }

      // exit if index not found
      if( isNaN(options.index) ) {
          return;
      }

      if(disableAnimation) {
          options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll( gallerySelector );

  for(var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
  }
};


initPhotoSwipeFromDOM(".my-gallery-two");
















































 };