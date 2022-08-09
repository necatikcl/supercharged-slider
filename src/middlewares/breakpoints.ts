import runMiddlewares from '~/utils/runMiddlewares';
import { Middleware } from '~/types';

interface Props {
  [key: number | string]: Middleware[]
}

const middlewaresToRerun = ['slidesPerView', 'spaceBetween'];

const breakpoints = (props: Props): Middleware => ({
  name: 'breakpoints',
  callback(slider) {
    const allBreakpoints = Object.keys(props)
      .map(Number)
      .sort((a, b) => b - a);

    const middlewares: { [key: string]: Middleware } = {};
    let currentBreakpoint = null;

    for (const breakpoint of allBreakpoints) {
      if (window.innerWidth <= breakpoint) {
        currentBreakpoint = breakpoint;

        props[breakpoint].forEach((middleware) => {
          middlewares[middleware.name] = middleware;
        });
      }
    }

    slider.middlewares
      .filter((middleware) => middlewaresToRerun.includes(middleware.name))
      .forEach((middleware) => {
        if (middlewares[middleware.name]) return;

        middlewares[middleware.name] = middleware;
      });

    if (!currentBreakpoint) return;

    console.log({ middlewares, currentBreakpoint });

    runMiddlewares(Object.values(middlewares), slider);
  },
});

export default breakpoints;
