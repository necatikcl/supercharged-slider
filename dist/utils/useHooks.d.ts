import type { Hook } from '..';
declare const useHooks: <T extends unknown>() => {
    addHook: (hook: Hook<T>) => number;
    runHooks: (props: T) => void;
    removeHook: (hook: Hook<T>) => void;
    hooks: Hook<T>[];
};
export default useHooks;
