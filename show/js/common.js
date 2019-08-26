$(function() {

  svg4everybody();

  (function() {
    var controller = new ScrollMagic.Controller();
    var sliderElement = $(".js-case-banner-slider");

    sliderElement.on("init", function() {
      var $slides = $(this).find(".slick-slide"),
        resizeTimeout = null; //чтобы функция срабатывала только когда ресайз окончен
      setMaxH($slides);
      $(window).on("resize orientationchange", function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          setMaxH($slides);
        }, 500);
      });
    });

    function setMaxH($elements) {
      $elements.height("");
      var maxH = Math.max.apply(
        Math,
        $.map($elements, function(el) {
          return $(el).height();
        })
      );
      $elements.height(maxH);
    }

    sliderElement.slick({
      slidesToShow: 1,
      autoplay: true,
      dots: true,
      prevArrow: $(".case-slider-arrow--left"),
      nextArrow: $(".case-slider-arrow--right")
    });

    new ScrollMagic.Scene({
      triggerElement: ".case-about-section"
    })
      .setClassToggle(".case-phone", "transform")
      .on("enter", function() {
        sliderElement.slick("slickPlay");
      })
      .on("leave", function() {
        sliderElement.slick("slickGoTo", 0);
        sliderElement.slick("slickPause");
      })
      .addTo(controller);
  })();

  //other animations
  (function() {
    var controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
      triggerElement: ".js-transform-block--01-trigger",
      reverse: false
    })
      .setClassToggle(".js-transform-block--01", "transform")
      .addTo(controller);
  })();
});
