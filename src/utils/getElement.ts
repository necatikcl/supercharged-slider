export type Selector = string | HTMLElement | null;
export type SelectorMultiple = string | HTMLElement[] | NodeList | null;

const getElement = (selector?: Selector, fallback?: () => Selector): HTMLElement | null => {
  if (!selector) {
    if (fallback) return getElement(fallback());
    return null;
  }

  if (selector instanceof HTMLElement) return selector;

  return getElement(document.querySelector(selector) as HTMLElement);
};

const getElements = (
  selector?: SelectorMultiple,
  fallback?: () => SelectorMultiple,
): HTMLElement[] => {
  if (!selector) {
    if (fallback) return getElements(fallback());
    return [];
  }

  if (selector instanceof NodeList) {
    return [...selector] as HTMLElement[];
  }

  if (Array.isArray(selector)) return selector;

  return getElements(document.querySelectorAll(selector));
};

export { getElements };
export default getElement;
