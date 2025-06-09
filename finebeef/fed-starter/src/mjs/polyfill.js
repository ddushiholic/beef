/**
 * @license MIT, GPL, do whatever you want
 * @requires polyfill: Array.prototype.slice fix {@link https://gist.github.com/brettz9/6093105}
 */
if (!Array.from) {
  Array.from = function (object) {
    'use strict';
    return [].slice.call(object);
  };
}

if (!Element.prototype.matches)
  Element.prototype.matches =
    Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };

(function () {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
