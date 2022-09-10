const isElementVisible = (element: HTMLElement, offset = 200) => {
  const bounding = element.getBoundingClientRect();

  return bounding.top >= 0
    && bounding.bottom <= window.innerHeight + offset;
};

export default isElementVisible;
