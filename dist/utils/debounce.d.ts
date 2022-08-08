declare const debounce: <T extends (...args: any[]) => unknown>(callback: T, ms: number) => (...args: any[]) => void;
export default debounce;
