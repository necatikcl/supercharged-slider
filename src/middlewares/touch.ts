import { Middleware } from '~/types';
import { getElements } from '~/utils/getElement';

// TODO: TOUCH HALA PROBLEMLİ, MOBİLDE!
const touch = (): Middleware => ({
  name: 'touch',
  callback: (slider) => {
    slider.element.classList.add('s-slider-touchable');

    const isVertical = () => slider.direction === 'vertical';
    const isTargetValid = (e: MouseEvent) => e.composedPath().includes(slider.wrapper);

    let isDragging = false;
    let isSelectionDisabled = false;

    let wrapperPositionBeforeDrag = 0;
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
      lastWrapperPosition = Math.max(Math.min(newPosition, threshold), 0);

      slider.scrollWrapperTo(lastWrapperPosition);

      if (isSelectionDisabled) return;

      slider.wrapper.style.pointerEvents = 'none';
      slider.wrapper.style.transitionDuration = '0ms';

      slider.slides.forEach((slide) => {
        slide.style.pointerEvents = 'none';
      });

      isSelectionDisabled = true;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!isTargetValid(e)) return;

      isDragging = true;
      wrapperPositionBeforeDrag = slider.wrapperPosition;

      document.addEventListener('mousemove', onMouseMove);
    };

    const onMouseUp = () => {
      if (!isDragging) return;

      isSelectionDisabled = false;

      const rectKey = isVertical() ? 'slideHeight' : 'slideWidth';
      const newIndex = Math.round(lastWrapperPosition / (slider[rectKey] || 0));

      if (slider.activeView !== newIndex) {
        slider.slideTo(newIndex);
      } else {
        slider.scrollWrapperTo(wrapperPositionBeforeDrag);
      }

      lastCursorPosition = 0;
      isDragging = false;

      slider.wrapper.style.pointerEvents = 'all';
      slider.slides.forEach((slide) => { slide.style.pointerEvents = 'all'; });
      slider.wrapper.style.transitionDuration = '';

      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    slider.slides.forEach((slide) => {
      getElements(slide.querySelectorAll('img')).forEach((img) => {
        img.setAttribute('draggable', 'false');
      });
    });

    slider.hooks.cleanUp.add(() => {
      isDragging = false;
      wrapperPositionBeforeDrag = 0;
      lastCursorPosition = 0;
      lastWrapperPosition = 0;

      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    });
  },
});

export default touch;
