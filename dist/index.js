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
      if (max < 0)
        return;
      if (index2 > max) {
        instance.slideTo(max);
        return;
      }
      if (index2 < 0) {
        instance.slideTo(0);
        return;
      }
      if (index2 !== max && !Number.isInteger(index2)) {
        instance.slideTo(Math.round(index2));
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
    slider.element.classList.add("s-slider-touchable");
    const isVertical = () => slider.direction === "vertical";
    const isTargetValid = (e) => e.composedPath().includes(slider.wrapper);
    let isDragging = false;
    let isSelectionDisabled = false;
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
      if (isSelectionDisabled)
        return;
      slider.wrapper.style.pointerEvents = "none";
      slider.wrapper.style.transitionDuration = "0ms";
      slider.slides.forEach((slide) => {
        slide.style.pointerEvents = "none";
      });
      isSelectionDisabled = true;
    };
    const onMouseDown = (e) => {
      if (!isTargetValid(e))
        return;
      isDragging = true;
      wrapperPositionBeforeDrag = slider.wrapperPosition;
      document.addEventListener("mousemove", onMouseMove);
    };
    const onMouseUp = () => {
      if (!isDragging)
        return;
      isSelectionDisabled = false;
      const rectKey = isVertical() ? "slideHeight" : "slideWidth";
      const newIndex = Math.round(lastWrapperPosition / (slider[rectKey] || 0));
      if (slider.activeView !== newIndex) {
        slider.slideTo(newIndex);
      } else {
        slider.scrollWrapperTo(wrapperPositionBeforeDrag);
      }
      lastCursorPosition = 0;
      isDragging = false;
      slider.wrapper.style.pointerEvents = "all";
      slider.slides.forEach((slide) => {
        slide.style.pointerEvents = "all";
      });
      slider.wrapper.style.transitionDuration = "";
      document.removeEventListener("mousemove", onMouseMove);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    slider.slides.forEach((slide) => {
      getElements(slide.querySelectorAll("img")).forEach((img) => {
        img.setAttribute("draggable", "false");
      });
    });
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
const getActiveSlides = (slider) => {
  const activeView = Math.round(slider.activeView);
  return slider.slides.slice(
    activeView,
    activeView + Math.floor(slider.slidesPerView)
  );
};
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
    slider.onCleanUp(() => slider.removeSlideChangeHook(handleSlideChange));
    slider.onSlideChange(handleSlideChange);
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
const isElementVisible = (element, offset = 200) => {
  const bounding = element.getBoundingClientRect();
  return bounding.top >= 0 && bounding.bottom <= window.innerHeight + offset;
};
const loadImage = (image) => {
  const src = image.getAttribute("data-src");
  if (!src)
    return false;
  image.removeAttribute("data-src");
  image.src = src;
  return true;
};
const lazyload = (onLoad = () => {
}) => ({
  name: "lazyload",
  callback: (slider) => {
    let indexesLoaded = [];
    const loadImages = (newSlider) => {
      if (!isElementVisible(newSlider.element)) {
        return;
      }
      const start = Math.max(newSlider.activeView - 1, 0);
      let end = newSlider.activeView + newSlider.slidesPerView;
      end = Math.min(end + 1, newSlider.slides.length);
      const slides = newSlider.slides.slice(start, end);
      const indexesToLoad = [];
      for (let i = start; i < end; i += 1) {
        indexesToLoad.push(i);
      }
      if (indexesToLoad.every((index2) => indexesLoaded.includes(index2))) {
        return;
      }
      indexesLoaded = [.../* @__PURE__ */ new Set([...indexesLoaded, ...indexesToLoad])];
      const images = slides.flatMap(
        (slide) => getElements(slide.querySelectorAll("img"))
      );
      images.forEach((image) => {
        const loaded = loadImage(image);
        if (loaded)
          onLoad({ slider: newSlider, indexesLoaded });
      });
    };
    const onSlideChange = (newSlider) => loadImages(newSlider);
    const onScroll = () => loadImages(slider);
    const onCleanUp = () => {
      slider.removeSlideChangeHook(onSlideChange);
      slider.removeCleanUpHook(onCleanUp);
      document.removeEventListener("scroll", onScroll);
    };
    onSlideChange(slider);
    slider.onSlideChange(onSlideChange);
    slider.onCleanUp(onCleanUp);
    document.addEventListener("scroll", onScroll, { passive: true });
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
      slider.removeCleanUpHook(onCleanUp);
    };
    slider.onCleanUp(onCleanUp);
    slider.onSlideChange(start);
  }
});
const disabledItems = /* @__PURE__ */ new Map();
const disableElement = (element) => {
  if (disabledItems.has(element))
    return;
  disabledItems.set(element, true);
  element.setAttribute("disabled", "disabled");
};
const enableElement = (element) => {
  if (!disabledItems.has(element))
    return;
  disabledItems.delete(element);
  element.removeAttribute("disabled");
};
const navigation = (props) => ({
  name: "navigation",
  callback: (slider) => {
    const prevElement = getElement(props.prev);
    const nextElement = getElement(props.next);
    prevElement == null ? void 0 : prevElement.addEventListener("click", slider.prev);
    nextElement == null ? void 0 : nextElement.addEventListener("click", slider.next);
    slider.onCleanUp(() => {
      prevElement == null ? void 0 : prevElement.removeEventListener("click", slider.prev);
      nextElement == null ? void 0 : nextElement.removeEventListener("click", slider.next);
    });
    const onSlideChange = (newSlider) => {
      if (prevElement) {
        if (newSlider.activeView === 0) {
          disableElement(prevElement);
        } else {
          enableElement(prevElement);
        }
      }
      if (nextElement) {
        if (newSlider.activeView + newSlider.slidesPerView >= newSlider.slides.length) {
          disableElement(nextElement);
        } else {
          enableElement(nextElement);
        }
      }
    };
    onSlideChange(slider);
    const onCleanUp = () => {
      slider.removeSlideChangeHook(onSlideChange);
      slider.removeCleanUpHook(onCleanUp);
    };
    slider.onSlideChange(onSlideChange);
    slider.onCleanUp(onCleanUp);
  }
});
const focus = ({
  focusClassName = "s-slide-focus",
  immediate = false,
  onSlideFocus = () => null
}) => ({
  name: "focus",
  callback: (slider) => {
    let focusedSlide = null;
    const onClick = (slide) => {
      if (focusedSlide === slide)
        return;
      if (focusedSlide) {
        focusedSlide.classList.remove(focusClassName);
      }
      focusedSlide = slide;
      slide.classList.add("s-slide-focus");
      onSlideFocus(slide);
    };
    if (immediate) {
      onClick(slider.slides[0]);
    }
    const listeners = /* @__PURE__ */ new Map();
    slider.slides.forEach((slide) => {
      const fn = () => onClick(slide);
      listeners.set(slide, fn);
      slide.addEventListener("click", fn);
    });
    const onSlideChange = () => {
      if (!focusedSlide)
        return;
      const activeSlides = getActiveSlides(slider);
      const focusedSlideIsInView = activeSlides.includes(focusedSlide);
      if (!focusedSlideIsInView) {
        onClick(activeSlides[0]);
      }
    };
    const onCleanUp = () => {
      slider.slides.forEach((slide) => {
        if (!listeners.has(slide))
          return;
        const fn = listeners.get(slide);
        slide.removeEventListener("click", fn);
      });
      listeners.clear();
      focusedSlide == null ? void 0 : focusedSlide.classList.remove(focusClassName);
      slider.removeSlideChangeHook(onSlideChange);
      slider.removeCleanUpHook(onCleanUp);
    };
    slider.onSlideChange(onSlideChange);
    slider.onCleanUp(onCleanUp);
  }
});
export { activeClass, autoplay, breakpoints, createSlider, focus, lazyload, navigation, slidesPerView, spaceBetween, touch, vertical };
