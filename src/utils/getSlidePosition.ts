import { Slider } from '~/types';

const getSlideX = (
  index: number,
  slider: Slider,
) => {
  const calc = index * (slider.slideWidth + slider.spaceBetween);

  return Math.min(calc, slider.wrapper.scrollWidth - slider.element.clientWidth);
};

const getSlideY = (
  index: number,
  slider: Slider,
) => {
  if (slider.slideHeight) {
    return index * (slider.slideHeight + slider.spaceBetween);
  }

  return -1;
};

export { getSlideX, getSlideY };
