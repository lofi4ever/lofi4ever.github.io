$(function() {

  svg4everybody(); //svg in IE

  /* Banner slider */
  (function() {
    var $sliderWrappers = $('.js__slider-banner-wrapper');
    if(!$sliderWrappers.length) return;
    $sliderWrappers.each(function(_, one) {
      var $root = $(one),
        $slider = $root.find('.js__slider-banner'),
        $navigation = $root.find('.js__slider-banner--nav'),
        $prevArrow = $root.find('.js__slider-banner--prev'),
        $nextArrow = $root.find('.js__slider-banner--next'),
        $dotsContainer = $root.find('.js__slider-banner--dots'),
        $numBlock = $root.find('.js__slider-banner--num');

      //events
      $slider .on('beforeChange', function(e, slick, prev, next) {
        updateTheme(slick, next);
        updateNumber(next);
      });

      function updateTheme(slick, index) {
        var themeIndex = $(slick.$slides[index])
          .find('.banner')
          .attr('data-slide-theme');
        if(!themeIndex) return;
        $navigation.attr('data-nav-theme', themeIndex);
      }

      function updateNumber(index) {
        var result = index + 1;
        if(result < 10) {
          result = '0' + result;
        }
        $numBlock.text(result);
      }
      //!events
      
      $slider.slick({
        arrows: true,
        dots: true,
        prevArrow: $prevArrow,
        nextArrow: $nextArrow,
        appendDots: $dotsContainer
      });
    });
  })();
  /* !Banner slider */

  /* Product slider */
  (function() {
    var $sliderWrappers = $('.js__products-slider-wrapper');
    if(!$sliderWrappers.length) return;
    $sliderWrappers.each(function(_, one) {
      var $root = $(one),
      $slider = $root.find('.js__products-slider');
    
      //events
      $slider.on('init', function() {
        var $elems = $root.find('.product-card__content');
        setEqualHeight($elems);
      });
      //TODO: make adaptive version of setMaxH
      //!events

      function setEqualHeight($elems) {
        var heightArr = $elems.toArray().map(function(el) {
          return $(el).height();
        }),
        maxH = Math.max.apply(Math, heightArr);
        //debugger;
        $elems.height(maxH);
      }

      $slider.slick({
        slidesToShow: 3,
        arrows: true, 
        dotts: false,
        useTransform: false, //fix IE overflow bug
        prevArrow: $root.find('.js__products-slider--prev'),
        nextArrow: $root.find('.js__products-slider--next'),
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    });
  })();
  /* !Product slider */

}); 