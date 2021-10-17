/** Takes a `length` and returns an array of numbers from 0 up to, but not including, the `length` */
export const range = (length: number) => [...Array(length).keys()];
