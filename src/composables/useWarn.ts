export const useWarn = (silent = false) => {
    return (...args: any[]) => !silent && console.warn(...args);
};
