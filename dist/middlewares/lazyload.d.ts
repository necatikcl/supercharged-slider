import { Middleware, Slider } from '../types';
interface Props {
    slider: Slider;
    image: HTMLImageElement;
}
declare type OnLoad = (props: Props) => void;
declare const lazyload: (onLoad: OnLoad) => Middleware;
export default lazyload;
