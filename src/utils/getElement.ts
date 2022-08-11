export type Selector<T = HTMLElement> = string | T | null;
export type SelectorMultiple<T = HTMLElement> = string | T[] | NodeList | null;

const getElement = (selector?: Selector, fallback?: () => Selector): HTMLElement | null => {
  if (!selector) {
    if (fallback) return getElement(fallback());
    return null;
  }

  if (selector instanceof HTMLElement) return selector;

  return getElement(document.querySelector(selector) as HTMLElement);
};

const getElements = <T = HTMLElement>(
  selector?: SelectorMultiple<T>,
  fallback?: () => SelectorMultiple<T>,
): T[] => {
  if (!selector) {
    if (fallback) return getElements<T>(fallback());
    return [];
  }

  if (selector instanceof NodeList) {
    return [...selector] as T[];
  }

  if (Array.isArray(selector)) return selector;

  return getElements(document.querySelectorAll(selector));
};

export { getElements };
export default getElement;
