import { Middleware } from '~/types';

interface Props {
  interval: number,
}

const autoplay = (props: Props): Middleware => ({
  name: 'autoplay',
  callback: (slider) => {
    let timeout = 0;

    const start = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (slider.activeView + slider.slidesPerView >= slider.slides.length) {
          slider.slideTo(0);
        } else {
          slider.next();
        }
      }, props.interval);
    };

    start();

    slider.onSlideChange(start);
    slider.onCleanUp(() => clearTimeout(timeout));
  },
});

export default autoplay;
