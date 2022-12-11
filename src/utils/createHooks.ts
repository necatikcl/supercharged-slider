import type { Hook } from '..';

export interface HookHandler<T extends unknown> {
  add: (hook: Hook<T>) => void;
  remove: (hook: Hook<T>) => void;
  run: (props: T) => void;
  clear: () => void;
}

const createHooks = <T extends unknown>(): HookHandler<T> => {
  type HookType = Hook<T>;
  type HandlerType = HookHandler<T>;

  const hooks = new Map<HookType, HookType>();

  const add: HandlerType['add'] = (hook) => hooks.set(hook, hook);
  const remove: HandlerType['remove'] = (hook) => hooks.delete(hook);
  const run: HandlerType['run'] = (props) => hooks.forEach((hook) => hook(props));
  const clear: HandlerType['clear'] = () => hooks.clear();

  return {
    add,
    run,
    remove,
    clear,
  };
};

export default createHooks;
