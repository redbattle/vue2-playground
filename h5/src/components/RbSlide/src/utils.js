export function on(target, event, handler) {
  target.addEventListener(event, handler, false);
}

export function off(target, event, handler) {
  target.removeEventListener(event, handler);
}

export function stopPropagation(event) {
  event.stopPropagation();
}

export function preventDefault(event, isStopPropagation) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== "boolean" || event.cancelable) {
    event.preventDefault();
  }
  if (isStopPropagation) {
    event.stopPropagation();
  }
}

export function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

