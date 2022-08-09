export declare type SlideChangeHandler = (slider: Slider) => void;
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
    slideTo: (index: number) => void;
    updateSlideStyles: () => void;
    scrollWrapperTo: (y: number) => void;
    onSlideChange: (callback: SlideChangeHandler) => void;
    onBeforeSlideChange: (callback: SlideChangeHandler) => void;
    runBeforeSlideChangeHooks: (slider: Slider) => void;
    runSlideChangeHooks: (slider: Slider) => void;
}
export declare type Middleware = {
    name: string;
    callback: (slider: Slider) => void;
};
