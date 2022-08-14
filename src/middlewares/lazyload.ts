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

const loadImages = (slider: Slider, onLoad: OnLoad) => {
  const start = Math.max(slider.activeView - 1, 0);

  let end = slider.activeView + slider.slidesPerView;
  end = Math.min(end + 1, slider.slides.length);

  const slides = slider.slides.slice(start, end);

  const images = slides.flatMap(
    (slide) => getElements<HTMLImageElement>(slide.querySelectorAll('img')),
  );

  images.forEach((image) => {
    const loaded = loadImage(image);
    if (loaded) onLoad({ slider, image });
  });
};

const lazyload = (onLoad: OnLoad = () => { }): Middleware => ({
  name: 'lazyload',
  callback: (slider) => {
    const onSlideChange = (newSlider: Slider) => loadImages(newSlider, onLoad);

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
