import { Middleware } from '~/types';

const spaceBetween = (size: number): Middleware => ({
  name: 'spaceBetween',
  callback: (slider) => {
    slider.spaceBetween = size;
    slider.slideStyles.marginRight = `${size}px`;

    if (slider.slidesPerView === 1) return;

    const marginPerView = size * (slider.slidesPerView - 1);

    slider.slideWidth = (slider.element.clientWidth - marginPerView) / slider.slidesPerView;
    slider.slideStyles.width = `${slider.slideWidth}px`;
  },
});

export default spaceBetween;
