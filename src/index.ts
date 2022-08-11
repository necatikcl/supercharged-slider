import './index.scss';

import createSlider from './utils/createSlider';
import breakpoints from './middlewares/breakpoints';
import slidesPerView from './middlewares/slidesPerView';
import spaceBetween from './middlewares/spaceBetween';
import touch from './middlewares/touch';
import activeClass from './middlewares/activeClass';
import vertical from './middlewares/vertical';
import autoplay from './middlewares/autoplay';

export * from './types';

export {
  createSlider,
  breakpoints,
  slidesPerView,
  spaceBetween,
  touch,
  activeClass,
  vertical,
  autoplay,
};
