import { Middleware } from '../types';
import { Selector } from '../utils/getElement';
interface Props {
    prev?: Selector;
    next?: Selector;
}
declare const navigation: (props: Props) => Middleware;
export default navigation;
