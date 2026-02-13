'use strict';

/**
 * Helpers
 */
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const addEventOnElements = (elements, eventType, callback, options) => {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback, options);
  }
};

/**
 * PRELOADER
 */
const preloader = qs('[data-preloader]');
window.addEventListener('DOMContentLoaded', () => {
  if (preloader) preloader.classList.add('loaded');
  document.body.classList.add('loaded');
});

/**
 * Mobile navbar toggle
 */
const navbar = qs('[data-navbar]');
const navTogglers = qsa('[data-nav-toggler]');
const navLinks = qsa('[data-nav-link]');
const overlay = qs('[data-overlay]');

const toggleNav = () => {
  if (!navbar || !overlay) return;
  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.classList.toggle('nav-active');
};

addEventOnElements(navTogglers, 'click', toggleNav);

addEventOnElements(navLinks, 'click', () => {
  if (!navbar || !overlay) return;
  navbar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('nav-active');
});

/**
 * Header active (use passive scroll)
 */
const header = qs('[data-header]');
window.addEventListener(
    'scroll',
    () => {
      if (!header) return;
      header.classList[window.scrollY > 100 ? 'add' : 'remove']('active');
    },
    { passive: true }
);

/**
 * Element tilt effect
 * - Disabled on touch devices and for users who prefer reduced motion (better for mobile performance).
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

if (!prefersReducedMotion && !isTouch) {
  const tiltElements = qsa('[data-tilt]');

  const initTilt = function (event) {
    const centerX = this.offsetWidth / 2;
    const centerY = this.offsetHeight / 2;

    const tiltPosY = ((event.offsetX - centerX) / centerX) * 10;
    const tiltPosX = ((event.offsetY - centerY) / centerY) * 10;

    this.style.transform =
        `perspective(1000px) rotateX(${tiltPosX}deg) rotateY(${tiltPosY - tiltPosY * 2}deg)`;
  };

  addEventOnElements(tiltElements, 'mousemove', initTilt);

  addEventOnElements(tiltElements, 'mouseout', function () {
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/**
 * Tab content
 */
const tabBtns = qsa('[data-tab-btn]');
const tabContents = qsa('[data-tab-content]');

if (tabBtns.length && tabContents.length) {
  let lastActiveTabBtn = tabBtns[0];
  let lastActiveTabContent = tabContents[0];

  const filterContent = function () {
    if (lastActiveTabBtn === this) return;

    lastActiveTabBtn.classList.remove('active');
    lastActiveTabContent.classList.remove('active');

    this.classList.add('active');
    lastActiveTabBtn = this;

    const currentTabContent = qs(`[data-tab-content="${this.dataset.tabBtn}"]`);
    if (!currentTabContent) return;

    currentTabContent.classList.add('active');
    lastActiveTabContent = currentTabContent;
  };

  addEventOnElements(tabBtns, 'click', filterContent);
}

/**
 * Custom cursor
 * - Disabled on touch devices & reduced motion to keep mobile smooth.
 */
if (!prefersReducedMotion && !isTouch) {
  const cursors = qsa('[data-cursor]');
  const hoveredElements = [...qsa('button'), ...qsa('a')];

  if (cursors.length >= 2) {
    window.addEventListener('mousemove', (event) => {
      const posX = event.clientX;
      const posY = event.clientY;

      cursors[0].style.left = `${posX}px`;
      cursors[0].style.top = `${posY}px`;

      setTimeout(() => {
        cursors[1].style.left = `${posX}px`;
        cursors[1].style.top = `${posY}px`;
      }, 80);
    });

    addEventOnElements(hoveredElements, 'mouseover', () => {
      for (let i = 0; i < cursors.length; i++) cursors[i].classList.add('hovered');
    });

    addEventOnElements(hoveredElements, 'mouseout', () => {
      for (let i = 0; i < cursors.length; i++) cursors[i].classList.remove('hovered');
    });
  }
}
