import { Middleware, Slider } from '~/types';

export const getActiveSlides = (slider: Slider) => {
  const activeView = Math.round(slider.activeView);

  return slider.slides.slice(
    activeView,
    activeView + Math.floor(slider.slidesPerView),
  );
};

const activeClass = (activeClassName = 's-slide-active'): Middleware => ({
  name: 'activeClass',
  callback: (slider) => {
    const handleSlideChange = () => {
      const activeSlides = getActiveSlides(slider);

      activeSlides.forEach((slide) => slide.classList.add(activeClassName));
    };

    const handleBeforeSlideChange = () => {
      const activeSlides = getActiveSlides(slider);

      activeSlides.forEach((slide) => slide.classList.remove(activeClassName));
    };

    handleSlideChange();

    slider.hooks.beforeSlideChange.add(handleBeforeSlideChange);
    slider.hooks.slideChange.add(handleSlideChange);
  },
});

export default activeClass;
