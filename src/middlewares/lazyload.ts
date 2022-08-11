import { Middleware, Slider } from '~/types';
import { getElements } from '~/utils/getElement';

const loadImage = (img: HTMLImageElement) => {
  const src = img.getAttribute('data-src');

  if (!src) return;

  img.removeAttribute('data-src');
  img.src = src;
};

const loadImages = (newSlider: Slider) => {
  const slides = newSlider.slides
    .slice(
      newSlider.activeView, newSlider.activeView + newSlider.slidesPerView,
    );

  const images = slides.flatMap(
    (slide) => getElements<HTMLImageElement>(slide.querySelectorAll('img')),
  );

  images.forEach(loadImage);
};

const lazyload = (): Middleware => ({
  name: 'lazyload',
  callback: (slider) => {
    const onSlideChange = (newSlider: Slider) => {
      loadImages(newSlider);
    };

    slider.onSlideChange(onSlideChange);
    slider.onCleanUp(() => slider.removeSlideChangeHook(onSlideChange));
  },
});

export default lazyload;
