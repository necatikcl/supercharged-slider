import { Middleware } from '../types';
interface Props {
    interval: number;
}
declare const autoplay: (props: Props) => Middleware;
export default autoplay;
