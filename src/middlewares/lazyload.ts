import { Middleware, Slider } from '~/types';
import isElementVisible from '~/utils/elementIsVisible';
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
      if (!isElementVisible(newSlider.element)) {
        return;
      }

      const start = Math.max(newSlider.activeView - 1, 0);

      let end = newSlider.activeView + newSlider.slidesPerView;
      end = Math.min(end + 1, newSlider.slides.length);

      const slides = newSlider.slides.slice(start, end);
      const indexesToLoad = [];

      for (let i = start; i < end; i += 1) {
        indexesToLoad.push(i);
      }

      if (indexesToLoad.every((index) => indexesLoaded.includes(index))) {
        return;
      }

      indexesLoaded = [...new Set([...indexesLoaded, ...indexesToLoad])];

      const images = slides.flatMap(
        (slide) => getElements<HTMLImageElement>(slide.querySelectorAll('img')),
      );

      images.forEach((image) => {
        const loaded = loadImage(image);
        if (loaded) onLoad({ slider: newSlider, indexesLoaded });
      });
    };

    const onSlideChange = (newSlider: Slider) => loadImages(newSlider);
    const onScroll = () => loadImages(slider);

    const onCleanUp = () => {
      slider.removeSlideChangeHook(onSlideChange);
      slider.removeCleanUpHook(onCleanUp);

      document.removeEventListener('scroll', onScroll);
    };

    onSlideChange(slider);

    slider.onSlideChange(onSlideChange);
    slider.onCleanUp(onCleanUp);

    document.addEventListener('scroll', onScroll, { passive: true });
  },
});

export default lazyload;
