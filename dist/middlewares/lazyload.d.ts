import { Middleware, Slider } from '../types';
interface Props {
    slider: Slider;
    indexesLoaded: number[];
}
declare type OnLoad = (props: Props) => void;
declare const lazyload: (onLoad?: OnLoad) => Middleware;
export default lazyload;
