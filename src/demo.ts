import './demo.scss';

import createSlider from '.';

import breakpoints from './middlewares/breakpoints';
import slidesPerView from './middlewares/slidesPerView';
import spaceBetween from './middlewares/spaceBetween';
import touch from './middlewares/touch';
import activeClass from './middlewares/activeClass';

const instance1 = createSlider({
  element: '.s-slider-1',
  middlewares: [
    touch(),
  ],
});

const instance2 = createSlider({
  element: '.s-slider-2',
  middlewares: [
    breakpoints({
      2000: [slidesPerView(2), spaceBetween(16)],
      1500: [slidesPerView(4), spaceBetween(8)],
      1000: [slidesPerView(3)],
    }),
  ],
});

const instance3 = createSlider({
  element: '.s-slider-3',
  middlewares: [slidesPerView(3), activeClass()],
});

const instance4 = createSlider({
  element: '.s-slider-4',
  middlewares: [slidesPerView(4)],
});

const instance5 = createSlider({
  element: '.s-slider-5',
  middlewares: [slidesPerView(5)],
});

const instances = [instance1, instance2, instance3, instance4, instance5];

const prev = document.querySelector('.s-slider-prev');
const next = document.querySelector('.s-slider-next');

prev?.addEventListener('click', () => instances.forEach((instance) => instance?.prev()));
next?.addEventListener('click', () => instances.forEach((instance) => instance?.next()));
