// src/modules/DOMUtils.js

import Logger from './Logger.js';

export default class DOMUtils {
  /**
   * Recursively traverses Shadow DOM to find an element matching the selector.
   * @param {Element} element - The root element to start searching from.
   * @param {string} selector - The CSS selector of the target element.
   * @returns {Element|null} - The found element or null.
   */
  static traverseShadows(element, selector) {
    if (!element.shadowRoot) return null;

    const found = element.shadowRoot.querySelector(selector);
    if (found) return found;

    for (const child of element.shadowRoot.children) {
      const result = DOMUtils.traverseShadows(child, selector);
      if (result) return result;
    }
    return null;
  }

  /**
    * Waits for an element to appear in the DOM using MutationObserver.
    * @param {string} selector - The CSS selector of the desired element.
    * @param {number} maxAttempts - Maximum number of mutation observations before failing.
    * @returns {Promise<HTMLElement>} - Resolves with the found element or rejects after max attempts.
    */
  static waitForElement(selector, maxAttempts = 30) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const observer = new MutationObserver(() => {
        let element = document.querySelector(selector);

        if (!element) {
          // Traverse Shadow DOM if necessary
          const appElement = document.querySelector('ytd-app');
          if (appElement) {
            element = DOMUtils.traverseShadows(appElement, selector);
          }
        }

        if (element) {
          Logger.log(`Element found: ${selector}`);
          resolve(element);
          observer.disconnect();
        } else {
          attempts++;
          Logger.log(`Attempt ${attempts}: Element ${selector} not found.`);
          if (attempts >= maxAttempts) {
            Logger.warn(`Element ${selector} not found after ${maxAttempts} attempts.`);
            reject(new Error(`Element ${selector} not found after ${maxAttempts} attempts.`));
            observer.disconnect();
          }
        }
      });

      observer.observe(document, { childList: true, subtree: true });
    });
  }
  
  /**
   * Extracts the video ID from the current URL.
   * @returns {string|null} - The video ID or null if not found.
   */
  static getVideoID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
  }
}
