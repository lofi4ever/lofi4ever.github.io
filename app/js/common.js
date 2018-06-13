function initMap() {};
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 55.9216774, lng: 37.8236737},
    zoom: 15
  });
  var marker = new google.maps.Marker({
    position: {lat: 55.9216774, lng: 37.8236737},
    map: map
  });
}
$(function() {

  $('.banner-slider').owlCarousel({
    items: 1,
    dots: true,
    loop: true,
    dotsContainer: '.slider-dots',
    nav: false,
    touchDrag : true,
    mouseDrag: true,
  });

  $('.hamburger').on('click', function() {
    $(this).toggleClass('is-active');
  });

  var catalogPosition=0;
  var catalogItemsNum = $('.catalog-item').length;

  $('#catalog-left').on('click', function() {
    if(catalogPosition!=0) {
      $('.catalog').animate({
        marginLeft: '+=235px'
      });
      catalogPosition--;
    }
  });
  $('#catalog-right').on('click', function() {
    if(catalogPosition!=catalogItemsNum-1) {
      $('.catalog').animate({
        marginLeft: '-=235px'
      });
      catalogPosition++;
    }
  });

  $('.partners').owlCarousel({
    responsive: {
      0: {
        items: 1.4,
      },
      480: {
        items: 3,
      },
      768: {
        items: 5,
      },
    },
    loop: true,
    nav: true,
    touchDrag : false,
    navContainer: '#partners-control-container',
    navText: ['<button class="btn btn--border control-left" id="partners-left"><span class="icon-icon5"></span></button>','<button class="btn btn--border control-right" id="partners-right"><span class="icon-icon-8"></span></button>'],
  });

  //Скрипт удаления лишних разделителей в разделе "Услуги"

  removeDevider();

  $(window).on('resize orientationchange', function() {
    removeDevider();
    thumbSlider();
  });

  function removeDevider() {
    $('.features-item').removeClass('no-pseudo');
    var itemsNum = $('.features-item').length;
    var itemsInRow;
    if(window.matchMedia("only screen and (max-width : 480px)").matches) {
      itemsInRow = 1;
    } else if(window.matchMedia("only screen and (max-width : 992px)").matches) {
      itemsInRow = 2;
    } else {
      itemsInRow = 3;
    }
    var sliceStart;
    if((itemsNum % itemsInRow)!=0) {
      sliceStart = itemsNum - (itemsNum % itemsInRow);
    } else {
      sliceStart = itemsNum - itemsInRow;
    }
    var itemsToRemove = $('.features-item').slice(sliceStart);
    itemsToRemove.addClass('no-pseudo');
  }

  $('.single-slider').owlCarousel({
    items: 1,
    dots: true,
    dotsContainer: '#single-thumbnails',
  });

  //Слайдер превью основного слайдера товара

  var thumbNum = $('.single-pagination .thumbnail').length;
  var paginationPosition = 0
  var sliderContainerWidth;
  var thumbWidth;
  var spaceToMove;
  thumbSlider();

  function thumbSlider() {
    sliderContainerWidth = parseInt($('.single-pagination').width(), 10);
    thumbWidth = (sliderContainerWidth/3 -10) + 'px';
    spaceToMove = (sliderContainerWidth/3) + 'px';
    $('.single-pagination .thumbnail').css('width', thumbWidth);
    $('.thumbs-right').on('click', function() {
      if(paginationPosition!=thumbNum-3) {
        $('.single-pagination .thumbnails').animate({
          marginLeft: '-='+spaceToMove,
        });
        paginationPosition++;
      }   
    });
    $('.thumbs-left').on('click', function() {
      if(paginationPosition!=0) {
        $('.single-pagination .thumbnails').animate({
          marginLeft: '+='+spaceToMove,
        });
        paginationPosition--;
      } 
    });
  }

  //Переключение контента между описанием товара и отзывами

  $('.single-descr-switcher').on('click', function() {
    $('.switched-content').css('display', 'none');
    $('.single-descr-switcher').removeClass('active');
    $(this).addClass('active');
    $('.switched-content').each(function() {
      if($(this).attr('id')==$('.single-descr-switcher.active').attr('data-type')) {
        $(this).css('display', 'block');
      }
    });
  });

  var sideWidth;

  $('.filter-button').on('click', function() {
    sideWidth = parseInt($('.catalog-filter').width(), 10) + 20 + 'px';
    $(this).toggleClass('active');
    if($(this).hasClass('active')) {
      $('#page-wrapper').animate({
        left: sideWidth,
      });
      $('#page-wrapper').addClass('side-shadow');
    } else {
      $('#page-wrapper').animate({
        left: '0',
      });
      $('#page-wrapper').removeClass('side-shadow');
    }
  });

  $('.sortby--type .sortby__link').on('click', function() {
    $('.sortby--type .sortby__link').removeClass('active');
    $(this).addClass('active');
  });
  $('.sortby--amount .sortby__link').on('click', function() {
    $('.sortby--type .sortby__link').removeClass('active');
    $(this).addClass('active');
  });

  //Ползунок

  var range = document.getElementById('range-input');
  var rangeFromField = document.getElementById('price-from');
  var rangeToField = document.getElementById('price-to');
  noUiSlider.create(range, {
    start: [ 0, 500000 ],
    connect: true,
    step: 1000,
    range: {
      // Starting at 500, step the value by 500,
      // until 4000 is reached. From there, step by 1000.
      'min': [ 0 ],
      'max': [ 500000 ]
    }
  });
  var rangeValues = range.noUiSlider.get();
  var rangeFrom = Math.floor(rangeValues[0]);
  var rangeTo = Math.floor(rangeValues[1]);
  rangeFromField.value = rangeFrom;
  rangeToField.value = rangeTo;
  range.noUiSlider.on('end', function() {
    rangeValues = range.noUiSlider.get();
    rangeFrom = Math.floor(rangeValues[0]);
    rangeTo = Math.floor(rangeValues[1]);
    rangeFromField.value = rangeFrom;
    rangeToField.value = rangeTo;

  });
  rangeToField.addEventListener('input', function() {
    var context = this;
    range.noUiSlider.set([null, context.value]);
  });
  rangeFromField.addEventListener('input', function() {
    var context = this;
    range.noUiSlider.set([context.value, null]);
  });

  //Карта

  
});
