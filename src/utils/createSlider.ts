import { Middleware, Hook, Slider } from '~/types';

import debounce from './debounce';
import getElement, { getElements, Selector, SelectorMultiple } from './getElement';
import { getSlideX } from './getSlidePosition';
import runMiddlewares from './runMiddlewares';
import createHooks from './createHooks';

interface Props {
  element: Selector,
  wrapper?: Selector,
  slides?: SelectorMultiple,
  middlewares?: Middleware[],
  onSlideChange?: Hook<Slider>
}

const createSlider = ({
  element: elementSelector,
  wrapper: wrapperSelector,
  slides: slidesSelector,
  middlewares = [],
  onSlideChange,
}: Props): Slider | null => {
  const element = getElement(elementSelector);

  if (!element) return null;

  const wrapper = getElement(wrapperSelector, () => element.querySelector('.s-wrapper') as HTMLElement);

  if (!wrapper) {
    throw new Error('[supercharged-slider] Wrapper element not found');
  }

  const slides = getElements(slidesSelector, () => wrapper.querySelectorAll('.s-slide'));

  if (!slides) {
    throw new Error('[supercharged-slider] Slides are not found');
  }

  const slideChangeHook = createHooks<Slider>();
  const beforeSlideChangeHook = createHooks<Slider>();
  const cleanUpHook = createHooks<void>();

  const addHooksFromProps = () => {
    if (onSlideChange) slideChangeHook.add(onSlideChange);
  };

  addHooksFromProps();

  const instance: Slider = {
    element,
    wrapper,
    wrapperPosition: 0,
    slides: [...slides],
    slideWidth: element.clientWidth,
    activeView: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    middlewares,
    slideStyles: {},
    hooks: {
      beforeSlideChange: slideChangeHook,
      slideChange: beforeSlideChangeHook,
      cleanUp: cleanUpHook,
    },
    slideTo: (index, silent = false) => {
      const max = instance.slides.length - instance.slidesPerView;

      if (max < 0) return;

      if (index > max) {
        instance.slideTo(max);
        return;
      }

      if (index < 0) {
        instance.slideTo(0);
        return;
      }

      if (index !== max && !Number.isInteger(index)) {
        instance.slideTo(Math.round(index));
        return;
      }

      if (!silent) {
        beforeSlideChangeHook.run(instance);
      }

      const x = getSlideX(index, instance);

      instance.scrollWrapperTo(x);
      instance.activeView = index;

      if (!silent) {
        slideChangeHook.run(instance);
      }
    },
    next: () => instance.slideTo(instance.activeView + 1),
    prev: () => instance.slideTo(instance.activeView - 1),
    render: () => {
      cleanUpHook.run();

      instance.slideWidth = instance.element.clientWidth;
      instance.slideStyles.width = `${instance.slideWidth}px`;
      instance.spaceBetween = 0;

      runMiddlewares(middlewares, instance);

      instance.updateSlideStyles();

      instance.slideTo(instance.activeView, true);

      cleanUpHook.clear();
      addHooksFromProps();
    },
    updateSlideStyles: () => slides.forEach(
      (slide) => Object.assign(slide.style, instance.slideStyles),
    ),
    scrollWrapperTo: (x) => {
      instance.wrapperPosition = x;
      wrapper.style.transform = `translate3d(-${x}px, 0, 0)`;
    },
  };

  instance.render();
  window.addEventListener('resize', debounce(instance.render, 300));

  return instance;
};
export default createSlider;
