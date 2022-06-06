//import * as flsFunctions from "./modules/functions.js";
//flsFunctions.thisTest();
'use strict';

let user_icon = document.querySelector('.user-header__icon');
user_icon.addEventListener('click', function (e) {
  let user_menu = document.querySelector('.user-header__menu');
  user_menu.classList.toggle('_active');
});

let burger_icon = document.querySelector('.icon-menu');
burger_icon.addEventListener('click', function (e) {
  let header_menu = document.querySelector('.menu__body');
  header_menu.classList.toggle('_active');
  burger_icon.classList.toggle('_active');
});

document.documentElement.addEventListener('click', function (e) {
  if (!e.target.closest('.user-header')) {
    let user_menu = document.querySelector('.user-header__menu');
    user_menu.classList.remove('_active');
  }
});

function ibg() {
  let ibg = document.querySelectorAll('._ibg');
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
    }
  }
}

ibg();

function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  const _this = this;
  // массив объектов
  this.оbjects = [];
  this.daClassname = '_dynamic_adapt_';
  // массив DOM-элементов
  this.nodes = document.querySelectorAll('[data-da]');

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const data = node.dataset.da.trim();
    const dataArray = data.split(',');
    const оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
    оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects);

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(
    this.оbjects,
    function (item) {
      return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint;
    },
    this
  );
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index;
  });

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i];
    const mediaSplit = String.prototype.split.call(media, ',');
    const matchMedia = window.matchMedia(mediaSplit[0]);
    const mediaBreakpoint = mediaSplit[1];

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint;
    });
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });
    this.mediaHandler(matchMedia, оbjectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
    }
  }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);
  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element);
    return;
  }
  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element);
    return;
  }
  destination.children[place].insertAdjacentElement('beforebegin', element);
};

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parent.insertAdjacentElement('beforeend', element);
  }
};

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === 'min') {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === 'first' || b.place === 'last') {
          return -1;
        }

        if (a.place === 'last' || b.place === 'first') {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === 'first' || b.place === 'last') {
          return 1;
        }

        if (a.place === 'last' || b.place === 'first') {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

const da = new DynamicAdapt('max');
da.init();

//slider

let main_slider = new Swiper('.main-slider', {
  navigation: {
    nextEl: '.control-main-slider__arrow_next',
    prevEl: '.control-main-slider__arrow_prev',
  },
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  spaceBetween: 0,
  autoHeight: false,
  speed: 800,
});

let lots_slider = new Swiper('.lots__slider', {
  navigation: {
    nextEl: '.control-slider-lots__arrow_next',
    prevEl: '.control-slider-lots__arrow_prev',
  },
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView: 3,
  spaceBetween: 0,
  autoHeight: false,
  speed: 800,
  // on: {
  //   lazyImageReady: function () {
  //     ibg();
  //   },
  // },

  //mobile first
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    550: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
  },
});

let quote_slider = new Swiper('.slider-quotes', {
  navigation: {
    nextEl: '.control-slider-quotes__circle',
  },
  loop: true,
  observer: true,
  observeParents: true,
  slidesPerView: 1,
  speed: 800,
  effect: 'fade',

  on: {
    lazyImageReady: function () {
      ibg();
    },
  },
  autoplay: {
    delay: 4000,
    stopOnLastSlide: false,
    disableOnInteraction: true,
  },
  breakpoints: {
    320: {
      autoHeight: true,
    },
    570: {
      autoHeight: false,
    },
  },
});
