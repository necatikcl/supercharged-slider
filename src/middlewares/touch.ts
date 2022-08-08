import { Middleware } from '~/types';

const touch = (): Middleware => ({
  name: 'touch',
  callback: (slider) => {
    const isVertical = () => slider.direction === 'vertical';
    const isTargetValid = (e: MouseEvent) => e.composedPath().includes(slider.element);

    let isDragging = false;

    let lastPositionBeforeMove = 0;
    let lastCursorPosition = 0;
    let lastWrapperPosition = 0;

    const onMouseMove = (e: MouseEvent) => {
      const mousePosition = isVertical() ? e.clientY : e.clientX;
      const scrollKey = isVertical() ? 'scrollHeight' : 'scrollWidth';
      const clientKey = isVertical() ? 'clientHeight' : 'clientWidth';

      if (lastCursorPosition === 0) {
        lastCursorPosition = mousePosition;
        return;
      }

      const threshold = slider.wrapper[scrollKey] - slider.element[clientKey];
      const distance = (mousePosition - lastCursorPosition) * -1;
      const newPosition = slider.wrapperPosition + distance;

      lastCursorPosition = mousePosition;
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
      const rectKey = isVertical() ? 'slideHeight' : 'slideWidth';

      const threshold = (slider[rectKey] || 0) / 4;
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
