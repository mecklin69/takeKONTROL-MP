/**
 * Express 4 does not catch a rejected promise returned by an async
 * handler: the request hangs until the client gives up. Every async
 * route in this codebase is wrapped in this, which forwards the
 * rejection to the error middleware instead.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
