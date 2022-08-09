import { Middleware, Slider } from '~/types';

const getActiveSlides = (slider: Slider) => slider.slides.slice(
  slider.activeView,
  slider.activeView + slider.slidesPerView,
);

const activeClass = (activeClassName = 's-slide-active'): Middleware => ({
  name: 'activeClass',
  callback: (slider) => {
    slider.onBeforeSlideChange(() => {
      const activeSlides = getActiveSlides(slider);

      activeSlides.forEach((slide) => slide.classList.remove(activeClassName));
    });

    const handleSlideChange = () => {
      const activeSlides = getActiveSlides(slider);

      activeSlides.forEach((slide) => slide.classList.add(activeClassName));
    };

    handleSlideChange();

    const onSlideChange = () => {
      handleSlideChange();

      slider.removeSlideChangeHook(onSlideChange);
    };

    slider.onSlideChange(onSlideChange);
  },
});

export default activeClass;
