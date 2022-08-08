import { Middleware } from '~/types';

const touch = (): Middleware => ({
  name: 'touch',
  callback: (slider) => {
    let isDragging = false;
    const isTargetValid = (e: MouseEvent) => e.composedPath().includes(slider.element);

    let lastPositionBeforeMove = 0;
    let lastCursorPosition = 0;
    let lastWrapperPosition = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (lastCursorPosition === 0) {
        lastCursorPosition = e.screenX;
        return;
      }

      const threshold = slider.wrapper.scrollWidth - slider.element.clientWidth;
      const distance = (e.screenX - lastCursorPosition) * -1;
      const newPosition = slider.wrapperPosition + distance;

      lastCursorPosition = e.screenX;
      lastWrapperPosition = Math.min(newPosition, threshold);

      slider.scrollWrapperTo(lastWrapperPosition);
    };

    document.addEventListener('mousedown', (e) => {
      const valid = isTargetValid(e);
      if (!valid) return;

      isDragging = true;
      lastPositionBeforeMove = slider.wrapperPosition;

      slider.wrapper.style.transitionDuration = '0ms';
      document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;

      const threshold = slider.slideWidth / 4;
      const difference = lastPositionBeforeMove - lastWrapperPosition;
      const movedRight = difference < 0;
      const passedThreshold = Math.abs(difference) > threshold;

      if (passedThreshold) {
        if (movedRight) slider.next();
        else slider.prev();
      } else {
        slider.scrollWrapperTo(lastPositionBeforeMove);
      }

      lastCursorPosition = 0;
      isDragging = false;
      slider.wrapper.style.transitionDuration = '';
      document.removeEventListener('mousemove', onMouseMove);
    });
  },
});

export default touch;
