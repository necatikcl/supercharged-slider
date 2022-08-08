export declare type Selector = string | HTMLElement | null;
export declare type SelectorMultiple = string | HTMLElement[] | NodeList | null;
declare const getElement: (selector?: Selector | undefined, fallback?: (() => Selector) | undefined) => HTMLElement | null;
declare const getElements: (selector?: SelectorMultiple | undefined, fallback?: (() => SelectorMultiple) | undefined) => HTMLElement[];
export { getElements };
export default getElement;
