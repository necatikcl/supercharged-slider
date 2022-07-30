import { Middleware } from '~/types';

const touch = (): Middleware => ({
  name: 'touch',
  callback: (slider) => {
    let isDragging = false;
    const isTargetValid = (e: MouseEvent) => e.composedPath().includes(slider.element);

    let lastPositionBeforeMove = 0;
    let lastMovePosition = 0;
    const onMouseMove = (e: MouseEvent) => {
      if (lastMovePosition === 0) {
        lastMovePosition = e.screenX;
        return;
      }

      const mousePosition = (e.screenX - lastMovePosition) * -1;

      const newPosition = slider.wrapperPosition + mousePosition;
      if (newPosition < 0) return;

      lastMovePosition = e.screenX;
      slider.scrollWrapperTo(newPosition);
    };

    document.addEventListener('mousedown', (e) => {
      const valid = isTargetValid(e);
      if (!valid) return;

      console.log('mousedown');
      isDragging = true;
      lastPositionBeforeMove = slider.wrapperPosition;

      slider.wrapper.style.transitionDuration = '0ms';
      document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;

      console.log('mouseup');
      isDragging = false;

      document.removeEventListener('mousemove', onMouseMove);

      const positionDiff = lastPositionBeforeMove - slider.wrapperPosition;
      console.log({
        lastMovePosition,
        lastPositionBeforeMove,
        slideWidth: slider.slideWidth,
        positionDiff,
      });

      const isMoreThanHalf = Math.abs(positionDiff) > slider.slideWidth / 4;

      if (positionDiff < 0) {
        if (isMoreThanHalf && slider.activeView < slider.slides.length - 1) {
          slider.next();
        } else {
          slider.scrollWrapperTo(lastPositionBeforeMove);
        }
      } else if (isMoreThanHalf) {
        slider.prev();
      } else {
        slider.scrollWrapperTo(lastPositionBeforeMove);
      }

      slider.wrapper.style.transitionDuration = '';
      lastMovePosition = 0;
    });
  },
});

export default touch;
