import type { Hook } from '..';

const useHooks = <T extends unknown>() => {
  type HookType = Hook<T>;

  const hooks: HookType[] = [];

  const addHook = (hook: HookType) => hooks.push(hook);
  const removeHook = (hook: HookType) => {
    const index = hooks.indexOf(hook);
    if (index > -1) hooks.splice(index, 1);
  };
  const runHooks = (props: T) => hooks.forEach((hook) => hook(props));

  return {
    addHook,
    runHooks,
    removeHook,
    hooks,
  };
};

export default useHooks;
