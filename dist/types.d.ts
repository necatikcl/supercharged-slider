export declare type Hook<T extends unknown> = (props: T) => void;
export interface Slider {
    element: HTMLElement;
    wrapper: HTMLElement;
    wrapperPosition: number;
    slides: HTMLElement[];
    slideStyles: Record<string, string | number>;
    slideWidth: number;
    slideHeight?: number;
    activeView: number;
    slidesPerView: number;
    spaceBetween: number;
    direction?: 'vertical';
    middlewares: Middleware[];
    next: () => void;
    prev: () => void;
    render: () => void;
    slideTo: (index: number, silent?: boolean) => void;
    updateSlideStyles: () => void;
    scrollWrapperTo: (y: number) => void;
    onSlideChange: (callback: Hook<Slider>) => void;
    onBeforeSlideChange: (callback: Hook<Slider>) => void;
    onCleanUp: (callback: Hook<void>) => void;
    removeSlideChangeHook: (hook: Hook<Slider>) => void;
    removeBeforeSlideChangeHook: (hook: Hook<Slider>) => void;
    removeCleanUpHook: (hook: Hook<void>) => void;
    runBeforeSlideChangeHooks: (slider: Slider) => void;
    runSlideChangeHooks: (slider: Slider) => void;
}
export declare type Middleware = {
    name: string;
    callback: (slider: Slider) => void;
};
