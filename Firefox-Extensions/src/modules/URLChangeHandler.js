// src/modules/URLChangeHandler.js

import Logger from './Logger.js';

export default class URLChangeHandler {
  constructor () {
    this.callbacks = [];
    this.init();
  }

  /**
   * Invokes all registered callbacks on URL change.
   */
  urlChange() {
    this.callbacks.forEach(callback => callback());
  }

  /**
   * Overrides history methods to detect URL changes.
   */
  overrideHistoryMethod(method) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event('historyChange'));
      return result;
    };
  }

  /**
   * Initializes URL change detection by overriding history methods and listening to popstate.
   */
  init() {
    // Override pushState and replaceState
    this.overrideHistoryMethod('pushState');
    this.overrideHistoryMethod('replaceState');

    // Listen to popstate event
    window.addEventListener('popstate', () => this.urlChange());

    // Listen to custom historyChange event
    window.addEventListener('historyChange', () => this.urlChange());

    // Optionally, listen to YouTube-specific navigation events
    document.addEventListener('yt-navigate-finish', () => this.urlChange());
  }

  /**
   * Registers a callback to be invoked on URL change.
   * @param {Function} callback - The function to execute on URL change.
   */
  onUrlChange(callback) {
    this.callbacks.push(callback);
  }
}
