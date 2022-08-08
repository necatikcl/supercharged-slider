declare const useHooks: <T extends any[]>() => {
    addHook: (hook: (...args: T) => void) => number;
    runHooks: (...args: T) => void;
    hooks: ((...args: T) => void)[];
};
export default useHooks;
