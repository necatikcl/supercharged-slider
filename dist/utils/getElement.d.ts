export declare type Selector<T extends HTMLElement = HTMLElement> = string | T | null;
export declare type SelectorMultiple<T extends HTMLElement = HTMLElement> = string | T[] | NodeList | null;
declare const getElement: <T extends HTMLElement = HTMLElement>(selector?: Selector<T> | undefined, fallback?: (() => Selector<T>) | undefined) => HTMLElement | null;
declare const getElements: <T extends HTMLElement = HTMLElement>(selector?: SelectorMultiple<T> | undefined, fallback?: (() => SelectorMultiple<T>) | undefined) => T[];
export { getElements };
export default getElement;
