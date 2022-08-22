export const throttle = <TParameters extends unknown[]>(
  fn: (this: unknown, ...args: TParameters) => void,
  wait = 250,
): ((this: unknown, ...args: TParameters) => void) => {
  let inThrottle: boolean, timeoutId: ReturnType<typeof setTimeout>, lastTime: number;

  return function (this: unknown, ...args: TParameters) {
    if (!inThrottle) {
      fn.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
