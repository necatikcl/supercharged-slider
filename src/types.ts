export type SlideChangeHandler = (slider: Slider) => void;

export interface Slider {
  element: HTMLElement
  wrapper: HTMLElement,
  wrapperPosition: number,
  slides: HTMLElement[]
  slideWidth: number
  slideHeight?: number
  activeView: number
  slidesPerView: number
  spaceBetween: number
  direction?: 'vertical'
  next: () => void
  prev: () => void
  slideTo: (index: number) => void
  resizeSlideElements: () => void
  scrollWrapperTo: (y: number) => void,
  onSlideChange: (callback: SlideChangeHandler) => void
  onBeforeSlideChange: (callback: SlideChangeHandler) => void
  runBeforeSlideChangeHooks: (slider: Slider) => void
  runSlideChangeHooks: (slider: Slider) => void
}

export type Middleware = {
  name: string
  callback: (slider: Slider) => void
};
