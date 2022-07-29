import runMiddlewares from '~/utils/runMiddlewares';
import { Middleware } from '~/types';

interface Props {
  [key: number | string]: Middleware[]
}

const breakpoints = (props: Props): Middleware => ({
  name: 'breakpoints',
  callback(slider) {
    const allBreakpoints = Object.keys(props)
      .map(Number)
      .sort((a, b) => a - b);

    let currentBreakpoint = null;

    for (const breakpoint of allBreakpoints) {
      if (window.innerWidth < breakpoint) {
        currentBreakpoint = breakpoint;
        break;
      }
    }

    if (!currentBreakpoint) return;

    const middlewares = props[currentBreakpoint];
    runMiddlewares(middlewares, slider);
  },
});

export default breakpoints;
