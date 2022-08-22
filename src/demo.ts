import './demo.scss';

import { createSlider, lazyload } from '.';

import breakpoints from './middlewares/breakpoints';
import slidesPerView from './middlewares/slidesPerView';
import spaceBetween from './middlewares/spaceBetween';
import touch from './middlewares/touch';
import activeClass from './middlewares/activeClass';
import vertical from './middlewares/vertical';
import navigation from './middlewares/navigation';

const instance1 = createSlider({
  element: '.s-slider-1',
  middlewares: [
    vertical(),
  ],
});

const instance2 = createSlider({
  element: '.s-slider-2',
  middlewares: [
    spaceBetween(16),
    slidesPerView(6),

    breakpoints({
      768: [slidesPerView(1)],
    }),
  ],
});

const instance3 = createSlider({
  element: '.s-slider-3',
  middlewares: [slidesPerView(3.25), lazyload(), touch(), activeClass(), navigation({
    prev: '.s-slider-2 .s-navigation-button-prev',
    next: '.s-slider-2 .s-navigation-button-next',
  })],
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
