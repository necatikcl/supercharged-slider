import type { Middleware, Slider } from '~/types';

import debounce from './debounce';
import runMiddlewares from './runMiddlewares';

interface Props {
  element: string | HTMLElement
  middlewares?: Middleware[]
}

const createSlider = ({ element: _element, middlewares = [] }: Props): Slider | null => {
  const element = (
    _element instanceof HTMLElement ? _element : document.querySelector(_element)
  ) as HTMLElement;

  if (!element) return null;

  const wrapper = element.querySelector('.s-wrapper') as HTMLElement;
  const slides = element.querySelectorAll('.s-slide') as unknown as HTMLElement[];

  const instance: Slider = {
    element,
    wrapper,
    slides,
    slideWidth: element.clientWidth,
    activeIndex: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    slideTo: (index: number) => {
      if (index > instance.slides.length - instance.slidesPerView || index < 0) {
        return;
      }

      const y = index * (instance.slideWidth + instance.spaceBetween);

      instance.scrollWrapperTo(y);
      instance.activeIndex = index;
    },
    next: () => instance.slideTo(instance.activeIndex + 1),
    prev: () => instance.slideTo(instance.activeIndex - 1),
    resizeSlideElements: () => {
      slides.forEach((slide, index) => {
        slide.style.width = `${instance.slideWidth}px`;

        if (index === instance.slides.length - 1) return;
        slide.style.marginRight = `${instance.spaceBetween}px`;
      });
    },
    scrollWrapperTo: (y) => {
      wrapper.style.transform = `translate3d(-${y}px, 0, 0)`;
    },
  };

  const processMiddlewares = () => {
    runMiddlewares(middlewares, instance);
    instance.resizeSlideElements();
  };

  processMiddlewares();
  window.addEventListener('resize', debounce(processMiddlewares, 300));

  return instance;
};
export default createSlider;
