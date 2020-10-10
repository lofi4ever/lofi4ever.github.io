const CLASSES = {
  slidesWrapper: 'js__slider-slides',
  slides: 'js__slider-slide',
  current: 'current',
  prevControl: 'js__slider-prev',
  nextControl: 'js__slider-next'
};

export default class MainSlider {
  #slidesWrapper;
  #slides;
  #currentSlideIndex;
  #prevControl;
  #nextControl;
  #slidesLength;

  constructor(el, options) {
    this.#slidesWrapper = el.querySelector(`.${ CLASSES.slidesWrapper }`);
    this.#slides = el.querySelectorAll(`.${ CLASSES.slides }`);
    this.#slidesLength = this.#slides.length;
    this.#currentSlideIndex = 0;
    this.#prevControl = el.querySelector(`.${ CLASSES.prevControl }`);
    this.#nextControl = el.querySelector(`.${ CLASSES.nextControl }`);

    this.#slides[this.#currentSlideIndex].classList.add(CLASSES.current);

    this.#addListeners(options);

    if(typeof options?.onInit === 'function') {
      options.onInit.call(this);
    }
  }

  #addListeners(options) {
    this.#prevControl.addEventListener('click', () => {
      let slideToGo = this.#currentSlideIndex - 1 >= 0
        ? this.#currentSlideIndex - 1
        : this.#slidesLength - 1;
      this.#changeSlide(slideToGo);
      if(typeof options?.onChange === 'function') {
        options.onChange.call(this);
      }
    });

    this.#nextControl.addEventListener('click', () => {
      let slideToGo = this.#currentSlideIndex + 1 < this.#slidesLength
        ? this.#currentSlideIndex + 1
        : 0;
      this.#changeSlide(slideToGo);
      if(typeof options?.onChange === 'function') {
        options.onChange.call(this);
      }
    });
  }

  #changeSlide(index) {
    this.#currentSlideIndex = index;
    [].forEach.call(this.#slides, (slide, index) => {
      if(index === this.#currentSlideIndex) {
        slide.classList.add(CLASSES.current);
      } else {
        slide.classList.remove(CLASSES.current);
      }
    });
  }

  getSlidesCount() {
    return this.#slidesLength;
  }

  getCurrentSlideIndes() {
    return this.#currentSlideIndex;
  }
}