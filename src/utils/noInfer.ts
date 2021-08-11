/* eslint-disable @typescript-eslint/ban-types */

/**
 * Creates a "lower-priority" inference site for `T`
 * https://github.com/microsoft/TypeScript/issues/14829#issuecomment-320754731
 */
export type NoInfer<T> = T & {};
