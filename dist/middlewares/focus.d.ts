import { Middleware } from '../types';
interface Props {
    focusClassName?: string;
    immediate?: boolean;
    onSlideFocus?: (slide: HTMLElement) => void;
}
declare const focus: ({ focusClassName, immediate, onSlideFocus, }: Props) => Middleware;
export default focus;
