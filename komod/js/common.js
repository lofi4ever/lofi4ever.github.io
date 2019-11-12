var ellipsis = function(options) {
  var $elements = options.elements,
    length = options.length,
    readMoreClassName = options.readMoreClassName || "ellipsis-more";

  if (!length || !$elements || !$elements.length) {
    return;
  }

  $elements.each(function(_, one) {
    var text = $(one).text();
      initialized = false;

    //check if responsive
    if (Object.prototype.toString.call(length) === "[object Array]") {
      length.sort(function(a, b) {
        return a - b;
      });
      var result = initResponsive(one, length, text);
      if(result !== false) {
        initialized = true;
      }
      $(window).on("resize orientationchange", function() {
        if (initialized) {
          destroy(one, text);
        }
        var result = initResponsive(one, length, text);
        if(result !== false) {
          initialized = true;
        }
      });
    } else {
      init(one, length, text);
      initialized = true;
    }
  });

  function initResponsive(el, length, text) {
    for (var i = 0; i < length.length; i++) {
      if (checkQuery(length[i].media)) {
        init(el, length[i].length, text);
        return i;
      }
    }
    return false; // if doesn't match any condition
  }

  function checkQuery(query) {
    return window.matchMedia('(max-width:' + query + 'px)').matches
      ? true
      : false;
  }

  function init(el, length, text) {
    var $elem = $(el);
    //check if text should be truncated at the first place
    if (text.length < length) {
      return;
    }

    var split = splitString(text, length);

    //check if there is content to work with
    if (!split) {
      return;
    }

    var visiblePart = $("<span/>", {
        class: "ellipsis__visible",
        text: split.visible
      }),
      hiddenPart = $("<span/>", {
        class: "ellipsis__hidden",
        text: split.hidden,
        css: {
          display: "none"
        }
      }),
      readMore = $("<span />", {
        class: readMoreClassName,
        html:
          '<span class="ellipsis--hide">Читать дальше...</span><span class="ellipsis--show" style="display: none">Скрыть</span>'
      }),
      isTruncated = true; //save current state

    //show/hide handler
    readMore.on("click", function() {
      !isTruncated ? truncate.call(this) : restore.call(this);
    });

    $elem
      .addClass("ellipsis-initialized")
      .addClass("ellipsis--truncated")
      .html("")
      .append(visiblePart)
      .append(hiddenPart)
      .append(readMore);

    function restore() {
      hiddenPart.css("display", "inline");
      isTruncated = false;
      $elem.removeClass("ellipsis--truncated");
      $(this)
        .find(".ellipsis--show")
        .show();
      $(this)
        .find(".ellipsis--hide")
        .hide();
    }

    function truncate() {
      hiddenPart.css("display", "none");
      isTruncated = true;
      $elem.addClass("ellipsis--truncated");
      $(this)
        .find(".ellipsis--hide")
        .show();
      $(this)
        .find(".ellipsis--show")
        .hide();
    }

    //split string in two according to given length, returns two substrings: visible one and hidden one
    function splitString(string, length) {
      var index = length;

      //find first space character and set split point to its position
      while (string.charAt(index) !== " " && index !== 0) {
        index--;
      }

      //return false if there's nothing to split
      if (index === 0) {
        return false;
      }

      return {
        visible: string.substring(0, index),
        hidden: string.substring(index)
      };
    }
  }

  function destroy(el, text) {
    $(el).html(text);
  }
};

$(function() {
  svg4everybody(); //svg in IE

  /* Smooth scroll to anchor */
  (function() {
    var $links = $('.js__anchor');
    if(!$links.length) return;
    $links.on('click', function(e) {
      e.preventDefault();
      var href = $(this).attr('href'),
          $target = $(href);
          //debugger;
      if(!$target.length) return;
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, 750, function() {
        window.location.hash = href;
      });
    });
  })();
  /* !Smooth scroll to anchor */

  /* Trancate */
  (function() {
    var $elemsSM = $(".js__truncate--sm");
    if ($elemsSM.length) {
      ellipsis({
        elements: $elemsSM,
        length: [
          {
            media: 768,
            length: 125
          }
        ]
      });

      // ellipsis({
      //   elements: $elemsSM,
      //   length: 300
      // });
    }
  })();
  /* !Trancate */

  /* Burger */
  (function() {
    var $burger = $(".js__burger"),
      isOpen = false,
      $layout = $(".layout"),
      $overlay = $(".js__overlay");

    $burger.on("click", function() {
      isOpen ? closeMenu() : openMenu();
    });

    $overlay.on("click", closeMenu);

    function openMenu() {
      $burger.addClass("is-active");
      $layout.addClass("mobile-menu-open");
      isOpen = true;
    }

    function closeMenu() {
      $burger.removeClass("is-active");
      $layout.removeClass("mobile-menu-open");
      isOpen = false;
    }
  })();
  /* !Burger */

  /* Banner slider */
  (function() {
    var $sliderWrappers = $(".js__slider-banner-wrapper");
    if (!$sliderWrappers.length) return;
    $sliderWrappers.each(function(_, one) {
      var $root = $(one),
        $slider = $root.find(".js__slider-banner"),
        $navigation = $root.find(".js__slider-banner--nav"),
        $prevArrow = $root.find(".js__slider-banner--prev"),
        $nextArrow = $root.find(".js__slider-banner--next"),
        $dotsContainer = $root.find(".js__slider-banner--dots"),
        $numBlock = $root.find(".js__slider-banner--num");

      //events
      $slider.on("init", function(e, slick) {
        var $elems = $(slick.$slides[0]).find(".js__slide-delay");
        if ($elems.length) {
          $elems.css("opacity", "1");
        }
      });

      $slider.on("beforeChange", function(e, slick, prev, next) {
        updateTheme(slick, next);
        updateNumber(next);
        var $elems = $(slick.$slides[prev]).find(".js__slide-delay");
        if ($elems.length) {
          $elems.css("opacity", "0");
        }
      });

      $slider.on("afterChange", function(e, slick, current) {
        var $elems = $(slick.$slides[current]).find(".js__slide-delay");
        if ($elems.length) {
          $elems.css("opacity", "1");
        }
      });

      function updateTheme(slick, index) {
        var themeIndex = $(slick.$slides[index])
          .find(".banner")
          .attr("data-slide-theme");
        if (!themeIndex) return;
        $navigation.attr("data-nav-theme", themeIndex);
      }

      function updateNumber(index) {
        var result = index + 1;
        if (result < 10) {
          result = "0" + result;
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

  /* About slider */
  (function() {
    var $sliderWrapper = $(".js__about-slider-wrapper");
    if (!$sliderWrapper.length) return;
    //debugger;
    var $slider = $sliderWrapper.find(".js__about-slider"),
      $prevArrow = $sliderWrapper.find(".js__about-slider--prev"),
      $nextArrow = $sliderWrapper.find(".js__about-slider--next"),
      $dotsContainer = $sliderWrapper.find(".js__about-slider--dots"),
      $numBlock = $sliderWrapper.find(".js__about-slider--num");

    //events
    $slider.on("beforeChange", function(e, slick, prev, next) {
      updateNumber(next);
    });

    function updateNumber(index) {
      var result = index + 1;
      if (result < 10) {
        result = "0" + result;
      }
      $numBlock.text(result);
    }
    //!events

    $slider.slick({
      arrows: true,
      dots: true,
      adaptiveHeight: true,
      prevArrow: $prevArrow,
      nextArrow: $nextArrow,
      appendDots: $dotsContainer
    });
  })();
  /* !About slider */

  /* Gallery slider */
  (function() {
    var $sliderWrapper = $('.js__gallery-slider-wrapper');
    if(!$sliderWrapper.length) return;
    var $slider = $sliderWrapper.find('.js__gallery-slider'),
        $numBlock = $sliderWrapper.find('.js__gallery-slider--num'),
        $dots = $sliderWrapper.find('.js__gallery-slider---dots'),
        $nav = $sliderWrapper.find('.js__gallery-slider--nav');

    //events
    $slider.on("beforeChange", function(e, slick, prev, next) {
      updateNumber(next);
    });

    $slider.on("destroy", function() {
      $nav.hide();
    })

    function updateNumber(index) {
      var result = index + 1;
      if (result < 10) {
        result = "0" + result;
      }
      $numBlock.text(result);
    }
    //!events

    $slider.slick({
      arrows: false,
      dots: true,
      adaptiveHeight: true,
      appendDots: $dots,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 767,
          settings: "unslick"
        }
      ]
    });
  })();
  /* !Gallery slider */

  /* Gallery fancybox */
  (function() {
    var $links = $('[data-fancybox="gallery"]');
    if(!$links.length) return;
    // $links.fancybox({
    //   thumbs : {
    //     autoStart : true,
    //     axis      : 'x'
    //   },
    //   loop: true,
    //   baseClass: 'gallery-popup',
    //   buttons: [
    //     "close"
    //   ],
    //   baseTpl:
    // '<div class="fancybox-container" role="dialog" tabindex="-1">' +
    // '<div class="fancybox-bg"></div>' +
    // '<div class="fancybox-inner">' +
    // '<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>' +
    // '<div class="fancybox-toolbar">{{buttons}}</div>' +
    // '<div class="fancybox-navigation">{{arrows}}</div>' +
    // '<div class="fancybox-stage"></div>' +
    // '<div class="fancybox-caption"><div class=""fancybox-caption__body"></div></div>' +
    // '<div class="gallery-popup__pagination"><div class="gallery-popup__num js__gallery-popup--num"></div><div class="gallery-popup__dots js__gallery-popup--dots"></div></div>' +
    // '</div>' +
    // '</div>',
    //   btnTpl: {
    //     close:
    //   '<button data-fancybox-close class="gallery-popup__close fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
    //   "</button>",

    // // Arrows
    // arrowLeft:
    //   '<button data-fancybox-prev class="gallery-popup__prev" title="{{PREV}}">' +
    //   "</button>",

    // arrowRight:
    //   '<button data-fancybox-next class="gallery-popup__next" title="{{NEXT}}">' +
    //   "</button>",
    //   },
    //   beforeShow: function(instance, current) {
    //     var $root = $(instance.$refs.bg[0]).parent(),
    //         $num = $root.find('.js__gallery-popup--num'),
    //         $dots = $root.find('.js__gallery-popup--dots'),
    //         index = current.index + 1;
    //     if(index < 10) {
    //       $num.text('0' + index);
    //     } else {
    //       $num.text(index);
    //     }
    //     //debugger;
    //   }
    // });
    $links.fancybox({
      thumbs: {
        autoStart: true,
        axis: 'x',
        //parentEl: '.js__gallery-popup--dots'
      },
      loop: true,
      baseClass: 'gallery-popup',
      buttons: [
        "close"
      ],
      baseTpl:
    '<div class="fancybox-container" role="dialog" tabindex="-1">' +
    '<div class="fancybox-bg"></div>' +
    '<div class="fancybox-inner">' +
    '<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>' +
    '<div class="fancybox-toolbar">{{buttons}}</div>' +
    '<div class="fancybox-navigation">{{arrows}}</div>' +
    '<div class="fancybox-stage"></div>' +
    '<div class="fancybox-caption"><div class=""fancybox-caption__body"></div></div>' +
    '<div class="gallery-popup__pagination"><div class="gallery-popup__num js__gallery-popup--num"></div><div class="gallery-popup__dots js__gallery-popup--dots"></div></div>' +
    '</div>' +
    '</div>',
      btnTpl: {
        close:
      '<button data-fancybox-close class="gallery-popup__close fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
      "</button>",

    // Arrows
    arrowLeft:
      '<button data-fancybox-prev class="gallery-popup__prev" title="{{PREV}}">' +
      "</button>",

    arrowRight:
      '<button data-fancybox-next class="gallery-popup__next" title="{{NEXT}}">' +
      "</button>",
      },
      beforeShow: function(instance, current) {
        var $root = $(instance.$refs.bg[0]).parent(),
            $num = $root.find('.js__gallery-popup--num'),
            $dots = $root.find('.js__gallery-popup--dots'),
            index = current.index + 1;
        if(index < 10) {
          $num.text('0' + index);
        } else {
          $num.text(index);
        }
        //debugger;
      }
    });
  })();
  /* !Gallery fancybox */

  /* More/less */
  (function() {
    var $links = $(".js__more-less");
    if (!$links.length) return;
    $links.each(function(_, link) {
      var isActive = false,
        $items = $(link)
          .parent()
          .find(".js__more-less--item"),
        $slider = $(this).closest(".js__about-slider");
      if (!$items.length) return;
      $(link).on("click", function(e) {
        e.preventDefault();
        if (!isActive) {
          $items.removeClass("hidden-xs");
          $(this)
            .find(".more")
            .hide();
          $(this)
            .find(".less")
            .show();
          isActive = true;
        } else {
          $items.addClass("hidden-xs");
          $(this)
            .find(".more")
            .show();
          $(this)
            .find(".less")
            .hide();
          isActive = false;
        }
        if ($slider.length) {
          //$slider.slick('slickSetOption', null, null, true);
          $slider.find(".slick-list").height("auto");
        }
      });
    });
  })();
  /* !More/less */

  /* Product slider */
  (function() {
    var $sliderWrappers = $(".js__products-slider-wrapper");
    if (!$sliderWrappers.length) return;
    $sliderWrappers.each(function(_, one) {
      var $root = $(one),
        $slider = $root.find(".js__products-slider");

      $slider.slick({
        slidesToShow: 3,
        arrows: true,
        dotts: false,
        useTransform: false, //fix IE overflow bug
        prevArrow: $root.find(".js__products-slider--prev"),
        nextArrow: $root.find(".js__products-slider--next"),
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

  /* Contacts map */
  (function() {
    if (!$("#map").length) return;

    var $addressItems = $(".js__map-item"),
      initialCoords = null;

    if ($addressItems.length) {
      initialCoords = [
        +$($addressItems.eq(0)).attr("data-lat"),
        +$($addressItems.eq(0)).attr("data-lng")
      ];
    }

    initialCoords = initialCoords ? initialCoords : [50.577519, 36.592855];

    ymaps.ready(init);

    function init() {
      var map = new ymaps.Map("map", {
        center: initialCoords,
        zoom: 16,
        controls: []
      });

      $addressItems.on("click", function() {
        var lat = +$(this).attr("data-lat"),
          lng = +$(this).attr("data-lng");
        if (!lat || !lng) return;
        map.panTo([lat, lng]);
        $addressItems.removeClass("active");
        $(this).addClass("active");
      });
    }
  })();
  /* !Contacts map */

  /* Select */
  (function() {
    var $selects = $(".js__select");
    if (!$selects.length) return;

    $selects.each(function(_, select) {
      initSelect(select);
    });

    function initSelect(el) {
      setWidth(el);
      el.addEventListener("click", function(e) {
        e.preventDefault();
        this.classList.toggle("open");
        if (e.target.classList.contains("js__select--option")) {
          var value = e.target.getAttribute("data-select"),
            text = e.target.textContent;
          this.querySelector(".js__select--result").value = value;
          this.querySelector(".js__select--insert").textContent = text;
          [].forEach.call(
            this.querySelectorAll(".js__select--option"),
            function(option) {
              option === e.target
                ? option.classList.add("active")
                : option.classList.remove("active");
            }
          );
          setWidth(el);
        }
        document.body.addEventListener("click", function closeSelect(e) {
          if (el.contains(e.target)) return;
          el.classList.remove("open");
          document.body.removeEventListener("click", closeSelect);
        });
      });

      function setWidth(el) {
        var width = el.offsetWidth;
        el.style.width = width + "px";
        el.querySelector(".js__select--body").style.width = width + "px";
      }
    }
  })();
  /* !Select */

  /* Accordeon */
  (function() {
    var $items = $(".js__accordeon");
    if (!$items.length) return;
    $items.on("click", function(e) {
      if ($(e.target).closest(".js__accordeon--item").lenght) return; //TODO
      //debugger;
      $(this)
        .find(".js__accordeon--item")
        .toggleClass("hidden");
      $(this).toggleClass("open");
    });
  })();
  /* !Accordeon */
});
