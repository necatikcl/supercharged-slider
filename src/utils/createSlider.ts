import { Middleware, SlideChangeHandler, Slider } from '~/types';

import debounce from './debounce';
import getElement, { getElements, Selector, SelectorMultiple } from './getElement';
import getSlideY from './getSlideY';
import runMiddlewares from './runMiddlewares';
import useHooks from './useHooks';

interface Props {
  element: Selector,
  wrapper?: Selector,
  slides?: SelectorMultiple,
  middlewares?: Middleware[],
  onSlideChange?: SlideChangeHandler
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

  const { addHook: addSlideChangeHook, runHooks: runSlideChangeHooks } = useHooks();
  const { addHook: addBeforeSlideChangeHook, runHooks: runBeforeSlideChangeHooks } = useHooks();

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
    onSlideChange: addSlideChangeHook,
    onBeforeSlideChange: addBeforeSlideChangeHook,
    slideTo: (index) => {
      if (index > instance.slides.length - instance.slidesPerView || index < 0) {
        return;
      }

      runBeforeSlideChangeHooks(instance);

      const y = getSlideY(index, instance);

      instance.scrollWrapperTo(y);
      instance.activeView = index;

      runSlideChangeHooks(instance);
    },
    next: () => instance.slideTo(instance.activeView + 1),
    prev: () => instance.slideTo(instance.activeView - 1),
    resizeSlideElements: () => {
      slides.forEach((slide, index) => {
        slide.style.width = `${instance.slideWidth}px`;

        if (index === instance.slides.length - 1) return;
        slide.style.marginRight = `${instance.spaceBetween}px`;
      });
    },
    scrollWrapperTo: (y) => {
      instance.wrapperPosition = y;
      wrapper.style.transform = `translate3d(-${y}px, 0, 0)`;
    },
  };

  const processMiddlewares = () => {
    instance.slideWidth = instance.element.clientWidth;
    instance.spaceBetween = 0;

    runMiddlewares(middlewares, instance);
    instance.resizeSlideElements();
  };

  processMiddlewares();
  window.addEventListener('resize', debounce(processMiddlewares, 300));

  return instance;
};
export default createSlider;
