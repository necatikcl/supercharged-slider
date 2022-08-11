import { Middleware, Hook, Slider } from '~/types';

import debounce from './debounce';
import getElement, { getElements, Selector, SelectorMultiple } from './getElement';
import { getSlideX } from './getSlidePosition';
import runMiddlewares from './runMiddlewares';
import useHooks from './useHooks';

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

  const {
    addHook: addSlideChangeHook,
    removeHook: removeSlideChangeHook,
    runHooks: runSlideChangeHooks,
  } = useHooks<Slider>();
  const {
    addHook: addBeforeSlideChangeHook,
    removeHook: removeBeforeSlideChangeHook,
    runHooks: runBeforeSlideChangeHooks,
  } = useHooks<Slider>();
  const {
    addHook: addCleanUpHook,
    runHooks: runCleanUpHooks,
    removeHook: removeCleanUpHook,
  } = useHooks<void>();

  if (onSlideChange) addSlideChangeHook(onSlideChange);

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
    onCleanUp: addCleanUpHook,
    onSlideChange: addSlideChangeHook,
    onBeforeSlideChange: addBeforeSlideChangeHook,
    removeCleanUpHook,
    removeSlideChangeHook,
    removeBeforeSlideChangeHook,
    runBeforeSlideChangeHooks,
    runSlideChangeHooks,
    slideTo: (index, silent = false) => {
      const max = instance.slides.length - instance.slidesPerView;

      if (index > max || index < 0) {
        return;
      }

      if (!silent) {
        runBeforeSlideChangeHooks(instance);
      }

      const x = getSlideX(index, instance);

      instance.scrollWrapperTo(x);
      instance.activeView = index;

      if (!silent) {
        runSlideChangeHooks(instance);
      }
    },
    next: () => instance.slideTo(instance.activeView + 1),
    prev: () => instance.slideTo(instance.activeView - 1),
    render: () => {
      runCleanUpHooks();

      instance.slideWidth = instance.element.clientWidth;
      instance.slideStyles.width = `${instance.slideWidth}px`;
      instance.spaceBetween = 0;

      runMiddlewares(middlewares, instance);

      instance.updateSlideStyles();

      instance.slideTo(instance.activeView, true);
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
