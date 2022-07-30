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
      .sort((a, b) => b - a);

    const middlewares: Middleware[] = [];
    let currentBreakpoint = null;

    for (const breakpoint of allBreakpoints) {
      if (window.innerWidth <= breakpoint) {
        currentBreakpoint = breakpoint;

        props[breakpoint].forEach((middleware) => {
          const middlewareInList = middlewares.findIndex((item) => item.name === middleware.name);

          if (middlewareInList !== -1) {
            middlewares.splice(middlewareInList, 1);
          }

          middlewares.push(middleware);
        });
      }
    }

    if (!currentBreakpoint) return;
    runMiddlewares(middlewares, slider);
  },
});

export default breakpoints;
