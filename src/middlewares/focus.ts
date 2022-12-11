import { Middleware } from '~/types';
import { getActiveSlides } from './activeClass';

interface Props {
  focusClassName?: string;
  immediate?: boolean;
  onSlideFocus?: (slide: HTMLElement) => void;
}

const focus = ({
  focusClassName = 's-slide-focus',
  immediate = false,
  onSlideFocus = () => null,
}: Props): Middleware => ({
  name: 'focus',
  callback: (slider) => {
    let focusedSlide: HTMLElement | null = null;

    const onClick = (slide: HTMLElement) => {
      if (focusedSlide === slide) return;

      if (focusedSlide) {
        focusedSlide.classList.remove(focusClassName);
      }

      focusedSlide = slide;
      slide.classList.add('s-slide-focus');
      onSlideFocus(slide);
    };

    if (immediate) {
      onClick(slider.slides[0]);
    }

    const listeners = new Map();

    slider.slides.forEach((slide) => {
      const fn = () => onClick(slide);

      listeners.set(slide, fn);

      slide.addEventListener('click', fn);
    });

    const onSlideChange = () => {
      if (!focusedSlide) return;

      const activeSlides = getActiveSlides(slider);

      const focusedSlideIsInView = activeSlides.includes(focusedSlide);

      if (!focusedSlideIsInView) {
        onClick(activeSlides[0]);
      }
    };

    const onCleanUp = () => {
      slider.slides.forEach((slide) => {
        if (!listeners.has(slide)) return;

        const fn = listeners.get(slide);

        slide.removeEventListener('click', fn);
      });

      listeners.clear();
      focusedSlide?.classList.remove(focusClassName);
    };

    slider.hooks.slideChange.add(onSlideChange);
    slider.hooks.cleanUp.add(onCleanUp);
  },
});

export default focus;
