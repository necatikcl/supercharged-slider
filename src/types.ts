import { HookHandler } from './utils/createHooks';

export type Hook<T extends unknown> = (props: T) => void;
export interface Slider {
  element: HTMLElement
  wrapper: HTMLElement,
  wrapperPosition: number,
  slides: HTMLElement[]
  slideStyles: Record<string, string | number>
  slideWidth: number
  slideHeight?: number
  activeView: number
  slidesPerView: number
  spaceBetween: number
  direction?: 'vertical'
  middlewares: Middleware[],
  next: () => void
  prev: () => void
  render: () => void
  slideTo: (index: number, silent?: boolean) => void
  updateSlideStyles: () => void
  scrollWrapperTo: (y: number) => void,
  hooks: {
    slideChange: HookHandler<Slider>,
    beforeSlideChange: HookHandler<Slider>,
    cleanUp: HookHandler<void>
  },
}

export type Middleware = {
  name: string
  callback: (slider: Slider) => void
};
