export type SlideChangeHandler = (slider: Slider) => void;

export interface Slider {
  element: HTMLElement
  wrapper: HTMLElement,
  wrapperPosition: number,
  slides: HTMLElement[]
  slideWidth: number
  activeView: number
  slidesPerView: number
  spaceBetween: number
  next: () => void
  prev: () => void
  slideTo: (index: number) => void
  resizeSlideElements: () => void
  scrollWrapperTo: (y: number) => void,
  onSlideChange: (callback: SlideChangeHandler) => void
  onBeforeSlideChange: (callback: SlideChangeHandler) => void
}

export type Middleware = {
  name: string
  callback: (slider: Slider) => void
};
