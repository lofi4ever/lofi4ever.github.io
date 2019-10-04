$(function() {

  $(".countdown").final_countdown({
    start: moment("2018-01-01 00:00:00"),
    end: moment("2031-06-15 12:00:00"),
    now: moment()
  });

  (function() {
    var $sliderContainer = $('.js__case-slider-wrapper'),
      $slider = $sliderContainer.find('.js__case-slider');

      $slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        appendArrows: $('.case-slider-arrows'),
        appendDots: $('.case-slider-dots'),
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>'
      });
  })();

});

function declOfNum(t, e) {
  return e[t % 10 == 1 && t % 100 != 11 ? 0 : 2 <= t % 10 && t % 10 <= 4 && (t % 100 < 10 || 20 <= t % 100) ? 1 : 2]
}