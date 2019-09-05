$(function() {

  svg4everybody();

  (function() {
    var controller = new ScrollMagic.Controller();
    var sliderElement = $(".js-case-banner-slider");

    sliderElement.slick({
      slidesToShow: 1,
      autoplay: true,
      dots: true,
      arrows: false
    });

    new ScrollMagic.Scene({
      triggerElement: ".js-transform-block--00-trigger"
    })
      .setClassToggle(".js-transform-block--00", "transform")
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

    new ScrollMagic.Scene({
      triggerElement: ".js-transform-block--02-trigger",
      reverse: false
    })
      .setClassToggle(".js-transform-block--02", "transform")
      .addTo(controller);
  })();
});
