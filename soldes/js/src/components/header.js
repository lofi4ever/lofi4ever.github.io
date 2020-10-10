let isPassiveSupported = checkIfSupportsPassive();
const FIRST_SCREEN_HEIGHT = 1080;
const classes = {
  headerFixed: 'header--fixed',
  headerMenuOpen: 'header--menu-open',
  burgerActive: 'burger--active'
}

let isMenuOpen = false;

export default function initHeader() {
  const header = document.querySelector('.js__header');
  const burger = document.querySelector('.js__burger');

  if(header) {
    initHeaderScroll(header);
  }
  if(burger) {
    initHeaderBurger(burger, header);
  }  
}

function initHeaderScroll(header) {
  window.addEventListener('scroll', function() {
    let offsetTop = window.pageYOffset;
    if(offsetTop > FIRST_SCREEN_HEIGHT) {
      header.classList.add(classes.headerFixed);
    } else {
      header.classList.remove(classes.headerFixed);
    }
  }, isPassiveSupported ? { passive: true } : false);
}

function initHeaderBurger(burger, header) {
  burger.addEventListener('click', function() {
    if(isMenuOpen) {
      this.classList.remove(classes.burgerActive);
      header.classList.remove(classes.headerMenuOpen);
      isMenuOpen = false;
    } else {
      this.classList.add(classes.burgerActive);
      header.classList.add(classes.headerMenuOpen);
      isMenuOpen = true;
    }
  });
}

function checkIfSupportsPassive() {
  let result = false;
  try {
    let options = Object.defineProperty({}, 'passive', {
      get() {
        result = true;
      }
    });

    window.addEventListener('test', null, options);
  } catch(err) {};

  return result;
}