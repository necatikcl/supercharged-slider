import { Middleware, Slider } from '~/types';
import { getElements } from '~/utils/getElement';

interface Props {
  slider: Slider,
  image: HTMLImageElement
}

type OnLoad = (props: Props) => void;

const loadImage = (image: HTMLImageElement) => {
  const src = image.getAttribute('data-src');

  if (!src) return false;

  image.removeAttribute('data-src');
  image.src = src;

  return true;
};

const loadImages = (newSlider: Slider, onLoad: OnLoad) => {
  const slides = newSlider.slides
    .slice(
      newSlider.activeView, newSlider.activeView + newSlider.slidesPerView,
    );

  const images = slides.flatMap(
    (slide) => getElements<HTMLImageElement>(slide.querySelectorAll('img')),
  );

  images.forEach((image) => {
    const loaded = loadImage(image);
    if (loaded) onLoad({ slider: newSlider, image });
  });
};

const lazyload = (onLoad: OnLoad): Middleware => ({
  name: 'lazyload',
  callback: (slider) => {
    const onSlideChange = (newSlider: Slider) => {
      loadImages(newSlider, onLoad);
    };

    const onCleanUp = () => {
      slider.removeSlideChangeHook(onSlideChange);
      slider.removeCleanUpHook(onCleanUp);
    };

    onSlideChange(slider);

    slider.onSlideChange(onSlideChange);
    slider.onCleanUp(onCleanUp);
  },
});

export default lazyload;
