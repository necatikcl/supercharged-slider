import { Middleware } from '~/types';
import { getSlideY } from '~/utils/getSlidePosition';

const vertical = (): Middleware => ({
  name: 'vertical',
  callback: (slider) => {
    slider.direction = 'vertical';
    slider.element.classList.add('s-slider-vertical');
    slider.slideHeight = slider.element.clientHeight;

    slider.slideStyles.width = '100%';
    slider.slideStyles.height = `${slider.slideHeight}px`;
    slider.slideStyles.marginBottom = slider.slideStyles.marginRight;
    slider.slideStyles.marginRight = '0px';

    slider.scrollWrapperTo = (y) => {
      slider.wrapperPosition = y;
      slider.wrapper.style.transform = `translate3d(0, -${y}px, 0)`;
    };

    slider.slideTo = (index) => {
      const max = slider.slides.length - slider.slidesPerView;

      if (index > max || index < 0) {
        return;
      }

      slider.hooks.beforeSlideChange.run(slider);

      const y = getSlideY(index, slider);

      slider.scrollWrapperTo(y);
      slider.activeView = index;

      slider.hooks.slideChange.run(slider);
    };
  },
});

export default vertical;
