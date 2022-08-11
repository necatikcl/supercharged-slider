export type Selector<T extends HTMLElement = HTMLElement> = string | T | null;
export type SelectorMultiple<T extends HTMLElement = HTMLElement> = string | T[] | NodeList | null;

const getElement = <T extends HTMLElement = HTMLElement>(
  selector?: Selector<T>,
  fallback?: () => Selector<T>,
): HTMLElement | null => {
  if (!selector) {
    if (fallback) return getElement<T>(fallback());
    return null;
  }

  if (selector instanceof HTMLElement) return selector;

  return getElement<T>(document.querySelector<T>(selector) as T);
};

const getElements = <T extends HTMLElement = HTMLElement>(
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

  return getElements<T>(document.querySelectorAll(selector));
};

export { getElements };
export default getElement;
