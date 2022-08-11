var index = "";
const debounce = (callback, ms) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), ms);
  };
};
const getElement = (selector, fallback) => {
  if (!selector) {
    if (fallback)
      return getElement(fallback());
    return null;
  }
  if (selector instanceof HTMLElement)
    return selector;
  return getElement(document.querySelector(selector));
};
const getElements = (selector, fallback) => {
  if (!selector) {
    if (fallback)
      return getElements(fallback());
    return [];
  }
  if (selector instanceof NodeList) {
    return [...selector];
  }
  if (Array.isArray(selector))
    return selector;
  return getElements(document.querySelectorAll(selector));
};
const getSlideX = (index2, slider) => {
  const calc = index2 * (slider.slideWidth + slider.spaceBetween);
  return Math.min(calc, slider.wrapper.scrollWidth - slider.element.clientWidth);
};
const getSlideY = (index2, slider) => {
  if (slider.slideHeight) {
    return index2 * (slider.slideHeight + slider.spaceBetween);
  }
  return -1;
};
const middlewareOrder = ["slidesPerView", "others", "breakpoints"];
const runMiddlewares = (middlewares, slider) => {
  const othersIndex = middlewareOrder.indexOf("others");
  const sortedMiddlewares = middlewares.sort((a, b) => {
    const aIndex = middlewareOrder.indexOf(a.name);
    const bIndex = middlewareOrder.indexOf(b.name);
    return (aIndex === -1 ? othersIndex : aIndex) - (bIndex === -1 ? othersIndex : bIndex);
  });
  sortedMiddlewares.forEach((middleware) => middleware.callback(slider));
};
const useHooks = () => {
  const hooks = [];
  const addHook = (hook) => hooks.push(hook);
  const removeHook = (hook) => {
    const index2 = hooks.indexOf(hook);
    if (index2 > -1)
      hooks.splice(index2, 1);
  };
  const runHooks = (props) => hooks.forEach((hook) => hook(props));
  return {
    addHook,
    runHooks,
    removeHook,
    hooks
  };
};
const createSlider = ({
  element: elementSelector,
  wrapper: wrapperSelector,
  slides: slidesSelector,
  middlewares = [],
  onSlideChange
}) => {
  const element = getElement(elementSelector);
  if (!element)
    return null;
  const wrapper = getElement(wrapperSelector, () => element.querySelector(".s-wrapper"));
  if (!wrapper) {
    throw new Error("[supercharged-slider] Wrapper element not found");
  }
  const slides = getElements(slidesSelector, () => wrapper.querySelectorAll(".s-slide"));
  if (!slides) {
    throw new Error("[supercharged-slider] Slides are not found");
  }
  const {
    addHook: addSlideChangeHook,
    removeHook: removeSlideChangeHook,
    runHooks: runSlideChangeHooks
  } = useHooks();
  const {
    addHook: addBeforeSlideChangeHook,
    removeHook: removeBeforeSlideChangeHook,
    runHooks: runBeforeSlideChangeHooks
  } = useHooks();
  const {
    addHook: addCleanUpHook,
    runHooks: runCleanUpHooks,
    removeHook: removeCleanUpHook
  } = useHooks();
  if (onSlideChange)
    addSlideChangeHook(onSlideChange);
  const instance = {
    element,
    wrapper,
    wrapperPosition: 0,
    slides: [...slides],
    slideWidth: element.clientWidth,
    activeView: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    middlewares,
    slideStyles: {},
    onCleanUp: addCleanUpHook,
    onSlideChange: addSlideChangeHook,
    onBeforeSlideChange: addBeforeSlideChangeHook,
    removeCleanUpHook,
    removeSlideChangeHook,
    removeBeforeSlideChangeHook,
    runBeforeSlideChangeHooks,
    runSlideChangeHooks,
    slideTo: (index2, silent = false) => {
      const max = instance.slides.length - instance.slidesPerView;
      if (index2 > max || index2 < 0) {
        return;
      }
      if (!silent) {
        runBeforeSlideChangeHooks(instance);
      }
      const x = getSlideX(index2, instance);
      instance.scrollWrapperTo(x);
      instance.activeView = index2;
      if (!silent) {
        runSlideChangeHooks(instance);
      }
    },
    next: () => instance.slideTo(instance.activeView + 1),
    prev: () => instance.slideTo(instance.activeView - 1),
    render: () => {
      runCleanUpHooks();
      instance.slideWidth = instance.element.clientWidth;
      instance.slideStyles.width = `${instance.slideWidth}px`;
      instance.spaceBetween = 0;
      runMiddlewares(middlewares, instance);
      instance.updateSlideStyles();
      instance.slideTo(instance.activeView, true);
    },
    updateSlideStyles: () => slides.forEach(
      (slide) => Object.assign(slide.style, instance.slideStyles)
    ),
    scrollWrapperTo: (x) => {
      instance.wrapperPosition = x;
      wrapper.style.transform = `translate3d(-${x}px, 0, 0)`;
    }
  };
  instance.render();
  window.addEventListener("resize", debounce(instance.render, 300));
  return instance;
};
const middlewaresToRerun = ["slidesPerView", "spaceBetween"];
const breakpoints = (props) => ({
  name: "breakpoints",
  callback(slider) {
    const allBreakpoints = Object.keys(props).map(Number).sort((a, b) => b - a);
    const middlewares = {};
    let currentBreakpoint = null;
    for (const breakpoint of allBreakpoints) {
      if (window.innerWidth <= breakpoint) {
        currentBreakpoint = breakpoint;
        props[breakpoint].forEach((middleware) => {
          middlewares[middleware.name] = middleware;
        });
      }
    }
    slider.middlewares.filter((middleware) => middlewaresToRerun.includes(middleware.name)).forEach((middleware) => {
      if (middlewares[middleware.name])
        return;
      middlewares[middleware.name] = middleware;
    });
    if (!currentBreakpoint)
      return;
    runMiddlewares(Object.values(middlewares), slider);
  }
});
const slidesPerView = (count) => ({
  name: "slidesPerView",
  callback: (slider) => {
    const elementWidth = slider.element.clientWidth;
    const slideWidth = elementWidth / count;
    slider.slidesPerView = count;
    slider.slideWidth = slideWidth;
    slider.slideStyles.width = `${slideWidth}px`;
  }
});
const spaceBetween = (size) => ({
  name: "spaceBetween",
  callback: (slider) => {
    slider.spaceBetween = size;
    slider.slideStyles.marginRight = `${size}px`;
    if (slider.slidesPerView === 1)
      return;
    const marginPerView = size * (slider.slidesPerView - 1);
    slider.slideWidth = (slider.element.clientWidth - marginPerView) / slider.slidesPerView;
    slider.slideStyles.width = `${slider.slideWidth}px`;
  }
});
const touch = () => ({
  name: "touch",
  callback: (slider) => {
    const isVertical = () => slider.direction === "vertical";
    const isTargetValid = (e) => e.composedPath().includes(slider.wrapper);
    let isDragging = false;
    let wrapperPositionBeforeDrag = 0;
    let lastCursorPosition = 0;
    let lastWrapperPosition = 0;
    const onMouseMove = (e) => {
      const mousePosition = isVertical() ? e.clientY : e.clientX;
      const scrollKey = isVertical() ? "scrollHeight" : "scrollWidth";
      const clientKey = isVertical() ? "clientHeight" : "clientWidth";
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
    };
    const onMouseDown = (e) => {
      if (!isTargetValid(e))
        return;
      isDragging = true;
      wrapperPositionBeforeDrag = slider.wrapperPosition;
      slider.wrapper.style.transitionDuration = "0ms";
      document.addEventListener("mousemove", onMouseMove);
    };
    const onMouseUp = () => {
      if (!isDragging)
        return;
      const rectKey = isVertical() ? "slideHeight" : "slideWidth";
      const newIndex = Math.round(lastWrapperPosition / (slider[rectKey] || 0));
      if (slider.activeView !== newIndex) {
        slider.slideTo(newIndex);
      } else {
        slider.scrollWrapperTo(wrapperPositionBeforeDrag);
      }
      lastCursorPosition = 0;
      isDragging = false;
      slider.wrapper.style.transitionDuration = "";
      document.removeEventListener("mousemove", onMouseMove);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    const onCleanUp = () => {
      isDragging = false;
      wrapperPositionBeforeDrag = 0;
      lastCursorPosition = 0;
      lastWrapperPosition = 0;
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      slider.removeCleanUpHook(onCleanUp);
    };
    slider.onCleanUp(onCleanUp);
  }
});
const getActiveSlides = (slider) => slider.slides.slice(
  slider.activeView,
  slider.activeView + slider.slidesPerView
);
const activeClass = (activeClassName = "s-slide-active") => ({
  name: "activeClass",
  callback: (slider) => {
    slider.onBeforeSlideChange(() => {
      const activeSlides = getActiveSlides(slider);
      activeSlides.forEach((slide) => slide.classList.remove(activeClassName));
    });
    const handleSlideChange = () => {
      const activeSlides = getActiveSlides(slider);
      activeSlides.forEach((slide) => slide.classList.add(activeClassName));
    };
    handleSlideChange();
    const onSlideChange = () => {
      handleSlideChange();
      slider.removeSlideChangeHook(onSlideChange);
    };
    slider.onSlideChange(onSlideChange);
  }
});
const vertical = () => ({
  name: "vertical",
  callback: (slider) => {
    slider.direction = "vertical";
    slider.element.classList.add("s-slider-vertical");
    slider.slideHeight = slider.element.clientHeight;
    slider.slideStyles.width = "100%";
    slider.slideStyles.height = `${slider.slideHeight}px`;
    slider.slideStyles.marginBottom = slider.slideStyles.marginRight;
    slider.slideStyles.marginRight = "0px";
    slider.scrollWrapperTo = (y) => {
      slider.wrapperPosition = y;
      slider.wrapper.style.transform = `translate3d(0, -${y}px, 0)`;
    };
    slider.slideTo = (index2) => {
      const max = slider.slides.length - slider.slidesPerView;
      if (index2 > max || index2 < 0) {
        return;
      }
      slider.runBeforeSlideChangeHooks(slider);
      const y = getSlideY(index2, slider);
      slider.scrollWrapperTo(y);
      slider.activeView = index2;
      slider.runSlideChangeHooks(slider);
    };
  }
});
const autoplay = (props) => ({
  name: "autoplay",
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
    const onCleanUp = () => {
      clearTimeout(timeout);
      slider.removeSlideChangeHook(start);
      slider.removeCleanUpHook(onCleanUp);
    };
    slider.onCleanUp(onCleanUp);
    slider.onSlideChange(start);
  }
});
export { activeClass, autoplay, breakpoints, createSlider, slidesPerView, spaceBetween, touch, vertical };
