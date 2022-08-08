import { Middleware } from '~/types';
import { getSlideY } from '~/utils/getSlidePosition';

const vertical = (): Middleware => ({
  name: 'vertical',
  callback: (slider) => {
    slider.direction = 'vertical';
    slider.element.classList.add('s-slider-vertical');
    slider.slideHeight = slider.element.clientHeight;

    slider.resizeSlideElements = () => {
      slider.slides.forEach((slide, index) => {
        slide.style.height = `${slider.slideHeight}px`;

        if (index === slider.slides.length - 1) return;
        slide.style.marginBottom = `${slider.spaceBetween}px`;
      });
    };

    slider.scrollWrapperTo = (y) => {
      slider.wrapperPosition = y;
      slider.wrapper.style.transform = `translate3d(0, -${y}px, 0)`;
    };

    slider.slideTo = (index) => {
      const max = slider.slides.length - slider.slidesPerView;

      if (index > max || index < 0) {
        return;
      }

      slider.runBeforeSlideChangeHooks(slider);

      const y = getSlideY(index, slider);

      slider.scrollWrapperTo(y);
      slider.activeView = index;

      slider.runSlideChangeHooks(slider);
    };
  },
});

export default vertical;
