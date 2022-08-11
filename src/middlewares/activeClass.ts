import { Middleware, Slider } from '~/types';

const getActiveSlides = (slider: Slider) => {
  const activeView = Math.round(slider.activeView);

  return slider.slides.slice(
    activeView,
    activeView + Math.floor(slider.slidesPerView),
  );
};

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

    slider.onCleanUp(() => slider.removeSlideChangeHook(handleSlideChange));
    slider.onSlideChange(handleSlideChange);
  },
});

export default activeClass;
