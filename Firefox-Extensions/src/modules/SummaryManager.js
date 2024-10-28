// src/modules/SummaryManager.js

import Logger from './Logger.js';
import DOMUtils from './DOMUtils.js';
import APIUtils from './APIUtils.js';
import UIUtils from './UIUtils.js';

export default class SummaryManager {
  constructor () {
    this.debounceTimer = null;
    this.debounceInterval = 500; // 500ms
  }

  /**
   * Inserts the summary box into the YouTube page with debouncing.
   */
  async insertSummary() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      const bottomRowSelector = '#bottom-row';

      try {
        const bottomRowElement = await DOMUtils.waitForElement(bottomRowSelector, 30);
        const videoID = DOMUtils.getVideoID();

        if (!videoID) {
          Logger.warn('No video ID found in the URL.');
          return;
        }

        Logger.log(`Fetching summary for video ID: ${videoID}`);

        // Remove existing summary container if present
        UIUtils.removeSummaryContainer();

        // Insert summary container
        const summaryContainer = UIUtils.insertSummaryContainer(bottomRowElement);
        if (!summaryContainer) {
          Logger.warn('Failed to insert summary container.');
          return;
        }

        // Fetch summary from API
        const fullSummary = await APIUtils.fetchSummary(videoID);

        if (fullSummary) {
          await UIUtils.updateSummary(summaryContainer, fullSummary);
        } else {
          // Handle API failure
          const summaryTextElement = summaryContainer.querySelector('.summary-text');
          const loadingSpinner = summaryContainer.querySelector('.loading-spinner');
          loadingSpinner.style.display = 'none';
          summaryTextElement.textContent = 'Unable to generate summary.';
          summaryTextElement.style.display = 'block';
        }
      } catch (error) {
        Logger.error(error.message);
      }
    }, this.debounceInterval);
  }
}
