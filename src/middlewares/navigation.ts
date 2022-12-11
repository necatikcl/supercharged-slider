import { Middleware, Slider } from '~/types';
import getElement, { Selector } from '~/utils/getElement';

const disabledItems = new Map();

const disableElement = (element: HTMLElement) => {
  if (disabledItems.has(element)) return;

  disabledItems.set(element, true);
  element.setAttribute('disabled', 'disabled');
};
const enableElement = (element: HTMLElement) => {
  if (!disabledItems.has(element)) return;

  disabledItems.delete(element);
  element.removeAttribute('disabled');
};

interface Props {
  prev?: Selector,
  next?: Selector
}

const navigation = (props: Props): Middleware => ({
  name: 'navigation',
  callback: (slider) => {
    const prevElement = getElement(props.prev);
    const nextElement = getElement(props.next);

    prevElement?.addEventListener('click', slider.prev);
    nextElement?.addEventListener('click', slider.next);

    const onSlideChange = (newSlider: Slider) => {
      if (prevElement) {
        if (newSlider.activeView === 0) {
          disableElement(prevElement);
        } else {
          enableElement(prevElement);
        }
      }

      if (nextElement) {
        if (
          newSlider.activeView + newSlider.slidesPerView
          >= newSlider.slides.length
        ) {
          disableElement(nextElement);
        } else {
          enableElement(nextElement);
        }
      }
    };

    const onCleanUp = () => {
      prevElement?.removeEventListener('click', slider.prev);
      nextElement?.removeEventListener('click', slider.next);
    };

    onSlideChange(slider);
    slider.hooks.cleanUp.add(onCleanUp);
    slider.hooks.slideChange.add(onSlideChange);
  },
});

export default navigation;
