import { Middleware, Hook, Slider } from '../types';
import { Selector, SelectorMultiple } from './getElement';
interface Props {
    element: Selector;
    wrapper?: Selector;
    slides?: SelectorMultiple;
    middlewares?: Middleware[];
    onSlideChange?: Hook<Slider>;
}
declare const createSlider: ({ element: elementSelector, wrapper: wrapperSelector, slides: slidesSelector, middlewares, onSlideChange, }: Props) => Slider | null;
export default createSlider;
