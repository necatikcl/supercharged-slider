import { Middleware } from '~/types';

const spaceBetween = (size: number): Middleware => ({
  name: 'spaceBetween',
  callback: (slider) => {
    slider.spaceBetween = size;
    if (slider.slidesPerView === 1) return;

    const marginPerView = size * (slider.slidesPerView - 1);

    slider.slideWidth = (slider.element.clientWidth - marginPerView) / slider.slidesPerView;
  },
});

export default spaceBetween;
