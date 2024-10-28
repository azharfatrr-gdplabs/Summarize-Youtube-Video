// src/modules/UIUtils.js

import Logger from './Logger.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default class UIUtils {
  // Define constants for DOM IDs
  static DOM_IDS = {
    SUMMARY_BOX: 'custom-summary-box',
    LOADING_SPINNER: 'loading-spinner',
    SUMMARY_TEXT: 'summary-text',
    TOGGLE_INDICATOR: 'toggle-indicator',
    SUMMARY_HEADER: 'summary-header', // Optional: For customizable header text
    // Add more IDs as necessary
  };

  // Define constants for CSS class names
  static CSS_CLASSES = {
    SUMMARY_BOX: 'custom-summary-box', // For styling
    LOADING_SPINNER: 'loading-spinner', // For spinner styling
    SUMMARY_TEXT: 'summary-text', // For summary text styling
    TOGGLE_INDICATOR: 'toggle-indicator', // For toggle arrow styling
    // Add more classes as necessary
  };

  /**
   * Generates a truncated version of the summary.
   * @param {string} summary - The full summary text.
   * @param {number} [maxLength=300] - Maximum length before truncation.
   * @returns {string} - The truncated summary.
   */
  static generateTruncatedSummary(summary, maxLength = 300) {
    return summary.length <= maxLength ? summary : `${summary.substring(0, maxLength)}...`;
  }

  /**
   * Creates the summary container element with initial loading state.
   * @returns {HTMLElement} - The summary container element.
   */
  static createSummaryContainer() {
    const container = document.createElement('div');
    container.id = UIUtils.DOM_IDS.SUMMARY_BOX;
    container.classList.add(UIUtils.CSS_CLASSES.SUMMARY_BOX); // For styling
    container.setAttribute('role', 'button'); // Accessibility
    container.setAttribute('tabindex', '0'); // Make focusable
    container.setAttribute('aria-expanded', 'false'); // Accessibility state
    container.setAttribute('aria-label', 'YouTube Summary Box'); // Enhanced Accessibility
    container.innerHTML = `
      <h3 id="${UIUtils.DOM_IDS.SUMMARY_HEADER}">Summary</h3>
      <div id="${UIUtils.DOM_IDS.LOADING_SPINNER}" class="${UIUtils.CSS_CLASSES.LOADING_SPINNER}"></div>
      <div id="${UIUtils.DOM_IDS.SUMMARY_TEXT}" class="${UIUtils.CSS_CLASSES.SUMMARY_TEXT}" style="display: none;"></div>
      <div id="${UIUtils.DOM_IDS.TOGGLE_INDICATOR}" class="${UIUtils.CSS_CLASSES.TOGGLE_INDICATOR}" style="display: none;" aria-label="Toggle Summary"></div>
    `;
    return container;
  }

  /**
   * Inserts the summary container into the DOM after the specified element.
   * @param {HTMLElement} bottomRowElement - The reference element after which the summary container will be inserted.
   * @returns {HTMLElement|null} - The inserted summary container or null if insertion fails.
   */
  static insertSummaryContainer(bottomRowElement) {
    if (!bottomRowElement) {
      Logger.warn('Bottom row element not found. Cannot insert summary container.');
      return null;
    }
    const container = UIUtils.createSummaryContainer();
    bottomRowElement.insertAdjacentElement('afterend', container);
    Logger.log('Summary container inserted successfully.');
    return container;
  }

  /**
   * Updates the summary container with the fetched summary.
   * Converts Markdown to HTML and sanitizes it before rendering.
   * @param {HTMLElement} container - The summary container element.
   * @param {string} fullSummary - The full summary text in Markdown.
   */
  static async updateSummary(container, fullSummary) {
    const summaryTextElement = container.querySelector(`#${UIUtils.DOM_IDS.SUMMARY_TEXT}`);
    const toggleIndicator = container.querySelector(`#${UIUtils.DOM_IDS.TOGGLE_INDICATOR}`);
    const loadingSpinner = container.querySelector(`#${UIUtils.DOM_IDS.LOADING_SPINNER}`);

    const truncatedSummary = UIUtils.generateTruncatedSummary(fullSummary);

    try {
      // Convert Markdown to HTML using Marked.js
      const truncatedHTML = marked.parse(truncatedSummary);
      const fullHTML = marked.parse(fullSummary);

      // Sanitize the HTML using DOMPurify
      const sanitizedTruncatedHTML = DOMPurify.sanitize(truncatedHTML);
      const sanitizedFullHTML = DOMPurify.sanitize(fullHTML);

      // Initially show truncated summary
      summaryTextElement.innerHTML = sanitizedTruncatedHTML;
      summaryTextElement.style.display = 'block';

      // Hide loading and show summary
      loadingSpinner.style.display = 'none';
      toggleIndicator.style.display = 'block';

      // Add toggle indicator arrow
      toggleIndicator.innerHTML = '▼'; // Down arrow

      // Bind toggle events
      UIUtils.bindToggleEvents(container, summaryTextElement, sanitizedTruncatedHTML, sanitizedFullHTML, toggleIndicator);
    } catch (error) {
      Logger.error(`Error updating summary: ${error}`);
      // Handle rendering error
      loadingSpinner.style.display = 'none';
      summaryTextElement.textContent = 'Error rendering summary.';
      summaryTextElement.style.display = 'block';
    }
  }

  /**
   * Handles API failure by updating the summary container with an error message.
   * @param {HTMLElement} container - The summary container element.
   */
  static handleSummaryFailure(container) {
    const summaryTextElement = container.querySelector(`#${UIUtils.DOM_IDS.SUMMARY_TEXT}`);
    const loadingSpinner = container.querySelector(`#${UIUtils.DOM_IDS.LOADING_SPINNER}`);

    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }

    if (summaryTextElement) {
      summaryTextElement.textContent = 'Unable to generate summary.';
      summaryTextElement.style.display = 'block';
    }

    Logger.warn('API failed to fetch summary. Displayed error message in summary box.');
  }

  /**
   * Binds click and keyboard events to toggle the summary view.
   * @param {HTMLElement} container - The summary container element.
   * @param {HTMLElement} summaryTextElement - The element displaying the summary text.
   * @param {string} truncatedHTML - The truncated summary in HTML.
   * @param {string} fullHTML - The full summary in HTML.
   * @param {HTMLElement} toggleIndicator - The toggle indicator element.
   */
  static bindToggleEvents(container, summaryTextElement, truncatedHTML, fullHTML, toggleIndicator) {
    const toggleSummary = () => {
      const isExpanded = container.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // Collapse to truncated summary
        summaryTextElement.innerHTML = truncatedHTML;
        container.setAttribute('aria-expanded', 'false');
        container.classList.remove('expanded');
        toggleIndicator.innerHTML = '▼'; // Down arrow
      } else {
        // Expand to full summary
        summaryTextElement.innerHTML = fullHTML;
        container.setAttribute('aria-expanded', 'true');
        container.classList.add('expanded');
        toggleIndicator.innerHTML = '▲'; // Up arrow
      }
    };

    container.addEventListener('click', toggleSummary);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSummary();
      }
    });
  }

  /**
   * Removes the existing summary container if present.
   */
  static removeSummaryContainer() {
    const existingContainer = document.getElementById(UIUtils.DOM_IDS.SUMMARY_BOX);
    if (existingContainer) {
      existingContainer.remove();
      Logger.log('Existing summary container removed.');
    }
  }
}
