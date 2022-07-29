export interface Slider {
  element: HTMLElement
  wrapper: HTMLElement
  slides: HTMLElement[]
  slideWidth: number
  activeIndex: number
  slidesPerView: number
  spaceBetween: number
  next: () => void
  prev: () => void
  slideTo: (index: number) => void
  resizeSlideElements: () => void
  scrollWrapperTo: (y: number) => void
}

export type Middleware = {
  name: string
  callback: (slider: Slider) => void
};
