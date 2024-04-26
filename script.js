'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = Array.from(document.querySelectorAll('.btn--show-modal'));
// console.log(btnsOpenModal);

const openModal = function (e) {
  // to overcome the slide up when user click the links:
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////// LECTURE:

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'Please Enable Cookies to analyze and functionality of browser <button class="btn">Go to</button>';
// document.querySelector('.header').append(message);

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height =
  Number.parseInt(getComputedStyle(message).height) + 30 + 'px';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// target specified which element is triggered: eg: event.targetd
btnScrollTo.addEventListener('click', function (e) {
  const secCords = section1.getBoundingClientRect();
  console.log(secCords);
  // relative the to the document:
  // window.scroll To eppaiyumae top la irundhu than namma kuduthrukka value ku scroll agim:
  window.scrollTo({
    left: secCords.left + window.scrollX,
    top: secCords.top + window.scrollY,
    behavior: 'smooth',
  });
});

////////////////////////////////////
//page Navigation:
// 1.add event listener to the parent element:
//2.determine what element organized at the event:
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
      });
    }
  });

///////////////////////////////////////////
// tabbed Componenet:
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation:

const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      // actually we compare the 2 elements:
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
// we cannot call the function inisde the event listener like this handleHover() -: we do only handleHover
//and also we can do like this:
//addEventListener(mouserover,(e)=>{handleHover(0.5)}) -> normal approach:
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVBAR :
// const initialCords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// sticky Naviagation by Intersection observer:
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};
const navHieght = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHieght}px`,
});
headerObserver.observe(header);

// REVEAL section using intersection observer:::::::::

const revealSection = function (entries, observer) {
  // entries gives you the entry each element status:
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
  }
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('.section');
allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// LAZY LOAD IMAGES:
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  // the image fired early becasue you used transform trasnlate 8 rem for you section:
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) {
    return;
  }
  if (entry.isIntersecting) {
    // replace src with data-src:
    // in this line the javascript should find the image and load it into the src:
    entry.target.src = entry.target.dataset.src;
    // add load Event: ?
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
  }
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.1,
  // if you want to hide the lazy loading to the user you can add rootMargin: like -90 or -200 it shrink the viewport:
});
imgTargets.forEach(img => {
  imgObserver.observe(img);
});

// SLIDER COMPONENT:
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
slider.style.overflow = 'visible';
//////
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(
      ${100 * (i - slide)}%
    )`;
  });
};

goToSlide(0);

let curSlide = 0;
const maxSlides = slides.length;
// -100 0 100 200
const nextSlide = function () {
  if (curSlide == maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  console.log(curSlide);
};
const prevSlide = function () {
  if (curSlide == 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);

  console.log(curSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// document.querySelectorAll('.nav__link').forEach(link => {
//   // by using callback function for every single element is unnecessary , so we add single click event to the parent and check the target it is called event delegation:
//   link.addEventListener('click', function (e) {
//     // to stop the default behaviour of anchor:
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// const random = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };
// const randomColor = () => {
//   return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
// };

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK ', e.target, e.currentTarget);
//   // it not usually not good idea :
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK ', e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK ', e.target, e.currentTarget);
// });
