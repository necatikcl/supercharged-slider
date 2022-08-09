import { Middleware } from '../types';
interface Props {
    [key: number | string]: Middleware[];
}
declare const breakpoints: (props: Props) => Middleware;
export default breakpoints;
