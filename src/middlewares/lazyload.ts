import { Middleware, Slider } from '~/types';
import { getElements } from '~/utils/getElement';

interface Props {
  slider: Slider,
  indexesLoaded: number[]
}

type OnLoad = (props: Props) => void;

const loadImage = (image: HTMLImageElement) => {
  const src = image.getAttribute('data-src');

  if (!src) return false;

  image.removeAttribute('data-src');
  image.src = src;

  return true;
};

const lazyload = (onLoad: OnLoad = () => { }): Middleware => ({
  name: 'lazyload',
  callback: (slider) => {
    let indexesLoaded: number[] = [];

    const loadImages = (newSlider: Slider) => {
      const start = Math.max(newSlider.activeView - 1, 0);

      let end = newSlider.activeView + newSlider.slidesPerView;
      end = Math.min(end + 1, newSlider.slides.length);

      const slides = newSlider.slides.slice(start, end);

      for (let i = start; i < end; i += 1) {
        indexesLoaded.push(i);
      }

      indexesLoaded = [...new Set(indexesLoaded)];

      const images = slides.flatMap(
        (slide) => getElements<HTMLImageElement>(slide.querySelectorAll('img')),
      );

      images.forEach((image) => {
        const loaded = loadImage(image);
        if (loaded) onLoad({ slider: newSlider, indexesLoaded });
      });
    };

    const onSlideChange = (newSlider: Slider) => loadImages(newSlider);

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
