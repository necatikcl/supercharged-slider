import { Slider } from '~/types';

const getSlideY = (
  index: number,
  slider: Slider,
) => index * (slider.slideWidth + slider.spaceBetween);

export default getSlideY;
