import { middlewareOrder } from '~/middlewares/constants';
import type { Slider, Middleware } from '../types';

const runMiddlewares = (middlewares: Middleware[], slider: Slider) => {
  const othersIndex = middlewareOrder.indexOf('others');

  const sortedMiddlewares = middlewares.sort((a, b) => {
    const aIndex = middlewareOrder.indexOf(a.name);
    const bIndex = middlewareOrder.indexOf(b.name);

    return (aIndex === -1 ? othersIndex : aIndex) - (bIndex === -1 ? othersIndex : bIndex);
  });

  sortedMiddlewares.forEach((middleware) => middleware.callback(slider));
};

export default runMiddlewares;
