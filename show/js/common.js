$(function() {
  
  var controller = new ScrollMagic.Controller();

  // var tween = new TimelineMax()
  //   .add([
  //     TweenMax.fromTo('.js-case-phone', 1, {y: '10%'}, {y: getSliderPosition(), ease: Power2.easeInOut}),
  //     TweenMax.fromTo('.js-case-slider-wrapper', 0.5, {opacity: '0'}, {opacity: '1', ease: Power2.easeInOut, delay: 0.7})
  //   ]);

  new ScrollMagic.Scene({
    triggerElement: '.case-about-section'
  })
  .setClassToggle('.case-phone', 'transform')
  //.setTween(tween)
  .addTo(controller);

  function getSliderPosition() {
    var result;
    if(window.matchMedia("(max-width: 1200px)").matches) {
      result = '110%';
    } else {
      result = '90%';
    }
    return result;
  }

  $('.js-case-banner-slider').slick({
    slidesToShow: 1,
    autoplay: true,
    dots: true,
    prevArrow: $('.case-slider-arrow--left'),
    nextArrow: $('.case-slider-arrow--right')
  });

});