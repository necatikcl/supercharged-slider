import { Middleware, Slider } from '../types';
export declare const getActiveSlides: (slider: Slider) => HTMLElement[];
declare const activeClass: (activeClassName?: string) => Middleware;
export default activeClass;
