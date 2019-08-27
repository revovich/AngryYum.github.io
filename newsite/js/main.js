$(function() {
    
    $('.alt-gallery').slick({
        accessibility: false,
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        nextArrow: $('.alt-switch .btn.forward'),
        prevArrow: $('.alt-switch .btn.back')
    });
    
    $('.alt-gallery').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $('#alt_gallery_counter').html(nextSlide + 1);
    });
    
    $('.slick-container').slick({
        accessibility: false,
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        nextArrow: $('#gallery .switch .btn.back'),
        prevArrow: $('#gallery .switch .btn.forward')
    });
    
    $('.slick-container').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $('#gallery_counter').html(nextSlide + 1);
    });
    
    
    $('#directions .mob').slick({
        accessibility: false,
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        nextArrow: $('#directions .dir.right'),
        prevArrow: $('#directions .dir.left')
    });
    
});