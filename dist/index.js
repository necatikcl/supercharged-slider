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
const getSlideY = (index2, slider) => index2 * (slider.slideWidth + slider.spaceBetween);
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
  const runHooks = (...args) => hooks.forEach((hook) => hook(...args));
  return {
    addHook,
    runHooks,
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
  const { addHook: addSlideChangeHook, runHooks: runSlideChangeHooks } = useHooks();
  const { addHook: addBeforeSlideChangeHook, runHooks: runBeforeSlideChangeHooks } = useHooks();
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
    onSlideChange: addSlideChangeHook,
    onBeforeSlideChange: addBeforeSlideChangeHook,
    slideTo: (index2) => {
      if (index2 > instance.slides.length - instance.slidesPerView || index2 < 0) {
        return;
      }
      runBeforeSlideChangeHooks(instance);
      const y = getSlideY(index2, instance);
      instance.scrollWrapperTo(y);
      instance.activeView = index2;
      runSlideChangeHooks(instance);
    },
    next: () => instance.slideTo(instance.activeView + 1),
    prev: () => instance.slideTo(instance.activeView - 1),
    resizeSlideElements: () => {
      slides.forEach((slide, index2) => {
        slide.style.width = `${instance.slideWidth}px`;
        if (index2 === instance.slides.length - 1)
          return;
        slide.style.marginRight = `${instance.spaceBetween}px`;
      });
    },
    scrollWrapperTo: (y) => {
      instance.wrapperPosition = y;
      wrapper.style.transform = `translate3d(-${y}px, 0, 0)`;
    }
  };
  const processMiddlewares = () => {
    instance.slideWidth = instance.element.clientWidth;
    instance.spaceBetween = 0;
    runMiddlewares(middlewares, instance);
    instance.resizeSlideElements();
  };
  processMiddlewares();
  window.addEventListener("resize", debounce(processMiddlewares, 300));
  return instance;
};
export { createSlider };
