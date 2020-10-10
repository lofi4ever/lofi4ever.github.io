import 'core-js/es/weak-set';

import initHeader from './components/header';
import MainSlider from './components/mainSlider';

document.addEventListener('DOMContentLoaded', function() {
  console.log('ready');

  try {
    svg4everybody();
  } catch(err) {
    console.log(err);
  }

  initHeader();

  //init main slider
  {
    const mainSliderEl = document.querySelector('.js__main-slider');
    const mainSliderCurrent = mainSliderEl.querySelectorAll(".js__main-slider-current");
    const mainSliderTotal = mainSliderEl.querySelectorAll(".js__main-slider-total");
    if(mainSliderEl) {
      new MainSlider(mainSliderEl, {
        onInit() {
          if(mainSliderTotal?.length) {
            let slidesCount = this.getSlidesCount();
            slidesCount = slidesCount < 10 ?  '0' + slidesCount : slidesCount;
            [].forEach.call(mainSliderTotal, item => {
              item.textContent = slidesCount;
            });
          }
          setCurrentSlideIndex.call(this);
        },
        onChange() {
          setCurrentSlideIndex.call(this);
        }
      });
    }

    function setCurrentSlideIndex() {
      if(mainSliderCurrent?.length) {
        let currentIndex = this.getCurrentSlideIndes() + 1;
        currentIndex = currentIndex < 10 ? '0' + currentIndex : currentIndex;
        [].forEach.call(mainSliderCurrent, item => {
          item.textContent = currentIndex;
        });
      }
    }
  }

});