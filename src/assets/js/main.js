/**
 * Main
 */

'use strict';
var uidcomma = '';
let menu, animate;

// Spinner
var spinner = function () {
  setTimeout(function () {
    if ($('#spinner').length > 0) {
      $('#spinner').removeClass('show');
    }
  }, 500);
};
spinner();


// Initiate the wowjs
new WOW().init();


// Sticky Navbar
$(window).scroll(function () {
  if ($(this).scrollTop() > 45) {
    $('.navbar').addClass('sticky-top shadow-sm');
  } else {
    $('.navbar').removeClass('sticky-top shadow-sm');
  }
});

// Dropdown on mouse hover
const $dropdown = $(".dropdown");
const $dropdownToggle = $(".dropdown-toggle");
const $dropdownMenu = $(".dropdown-menu");
const showClass = "show";

$(window).on("load resize", function () {
  if (this.matchMedia("(min-width: 992px)").matches) {
    $dropdown.hover(
      function () {
        const $this = $(this);
        $this.addClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "true");
        $this.find($dropdownMenu).addClass(showClass);
      },
      function () {
        const $this = $(this);
        $this.removeClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "false");
        $this.find($dropdownMenu).removeClass(showClass);
      }
    );
  } else {
    $dropdown.off("mouseenter mouseleave");
  }
});


// Facts counter
$('[data-toggle="counter-up"]').counterUp({
  delay: 10,
  time: 2000
});


// Back to top button
$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $('.back-to-top').fadeIn('slow');
  } else {
    $('.back-to-top').fadeOut('slow');
  }
});
$('.back-to-top').click(function () {
  $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
  return false;
});


// Testimonials carousel
$(".testimonial-carousel").owlCarousel({
  autoplay: true,
  smartSpeed: 1500,
  dots: true,
  loop: true,
  center: true,
  responsive: {
    0: {
      items: 1
    },
    576: {
      items: 1
    },
    768: {
      items: 2
    },
    992: {
      items: 3
    }
  }
});


// Vendor carousel
$('.vendor-carousel').owlCarousel({
  loop: true,
  margin: 45,
  dots: false,
  loop: true,
  autoplay: true,
  smartSpeed: 1000,
  responsive: {
    0: {
      items: 2
    },
    576: {
      items: 4
    },
    768: {
      items: 6
    },
    992: {
      items: 8
    }
  }
});

function loadAdminJs() {
  // Button & Pagination Waves effect
  if (typeof Waves !== 'undefined') {
    Waves.init();
    Waves.attach(
      ".btn[class*='btn-']:not(.position-relative):not([class*='btn-outline-']):not([class*='btn-label-'])",
      ['waves-light']
    );
    Waves.attach("[class*='btn-outline-']:not(.position-relative)");
    Waves.attach('.pagination .page-item .page-link');
    Waves.attach('.dropdown-menu .dropdown-item');
    Waves.attach('.light-style .list-group .list-group-item-action');
    Waves.attach('.dark-style .list-group .list-group-item-action', ['waves-light']);
    Waves.attach('.nav-tabs:not(.nav-tabs-widget) .nav-item .nav-link');
    Waves.attach('.nav-pills .nav-item .nav-link', ['waves-light']);
    Waves.attach('.menu-vertical .menu-item .menu-link.menu-toggle');
  }

  // Window scroll function for navbar
  function onScroll() {
    var layoutPage = document.querySelector('.layout-page');
    if (layoutPage) {
      if (window.pageYOffset > 0) {
        layoutPage.classList.add('window-scrolled');
      } else {
        layoutPage.classList.remove('window-scrolled');
      }
    }
  }
  // On load time out
  setTimeout(() => {
    onScroll();
  }, 200);

  // On window scroll
  window.onscroll = function () {
    onScroll();
  };

  // Initialize menu
  //-----------------

  let layoutMenuEl = document.querySelectorAll('#layout-menu');
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: 'vertical',
      closeChildren: false
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll('.layout-menu-toggle');
  menuToggler.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
    });
  });

  // Display menu toggle (layout-menu-toggle) on hover with delay
  let delay = function (elem, callback) {
    let timeout = null;
    elem.onmouseenter = function () {
      // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
      if (!Helpers.isSmallScreen()) {
        timeout = setTimeout(callback, 300);
      } else {
        timeout = setTimeout(callback, 0);
      }
    };

    elem.onmouseleave = function () {
      // Clear any timers set to timeout
      document.querySelector('.layout-menu-toggle').classList.remove('d-block');
      clearTimeout(timeout);
    };
  };
  if (document.getElementById('layout-menu')) {
    delay(document.getElementById('layout-menu'), function () {
      // not for small screen
      if (!Helpers.isSmallScreen()) {
        document.querySelector('.layout-menu-toggle').classList.add('d-block');
      }
    });
  }

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName('menu-inner'),
    menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
      if (this.querySelector('.ps__thumb-y').offsetTop) {
        menuInnerShadow.style.display = 'block';
      } else {
        menuInnerShadow.style.display = 'none';
      }
    });
  }

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
      e.target.closest('.accordion-item').classList.add('active');
    } else {
      e.target.closest('.accordion-item').classList.remove('active');
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
    accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
  });

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Nav tabs animation
  window.Helpers.navTabsAnimation();

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  window.Helpers.setCollapsed(true, false);
}


function setCaptcha(captchacode, captcha, captchaInput) {
  var c = document.getElementById(captcha);
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.font = "26px Arial";
  ctx.fillText(captchacode, 0, 30);
  $(captchaInput).val('');
  setSpeakCaptcha(captchacode);
}

function setSpeakCaptcha(captchacode) {
  while (/(\d+)(\d{1})/.test(captchacode)) {
    captchacode = captchacode.toString().replace(/(\d+)(\d{1})/, '$1' + ', ' + '$2');
  }
  uidcomma = captchacode;
}
function speakCaptcha() {
  //$('.reload').hide();
  var length = uidcomma.length;
  var commaSeparated = [];
  for (var i = 0; i < length; i++) {
    commaSeparated.push(uidcomma[i] + (i === length - 1 ? '' : ','));
  }
  var commaString = commaSeparated.join('');
  var commaSeparatedArray = commaString.split(",");

  var array = Array.from(commaSeparatedArray);
  for (i = 0; i <= array.length; i++) {
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(array[i]);
    synth.speak(utterThis);
  }
  //setTimeout(() => { $('.reload').show(); }, 4000);
}