import { Middleware, SlideChangeHandler, Slider } from '../types';
import { Selector, SelectorMultiple } from './getElement';
interface Props {
    element: Selector;
    wrapper?: Selector;
    slides?: SelectorMultiple;
    middlewares?: Middleware[];
    onSlideChange?: SlideChangeHandler;
}
declare const createSlider: ({ element: elementSelector, wrapper: wrapperSelector, slides: slidesSelector, middlewares, onSlideChange, }: Props) => Slider | null;
export default createSlider;
