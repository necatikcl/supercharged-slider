const useHooks = <T extends any[]>() => {
  type Hook = (...args: T) => void;

  const hooks: Hook[] = [];

  const addHook = (hook: Hook) => hooks.push(hook);
  const runHooks = (...args: T) => hooks.forEach((hook) => hook(...args));

  return {
    addHook,
    runHooks,
    hooks,
  };
};

export default useHooks;
