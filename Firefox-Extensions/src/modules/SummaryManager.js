// src/modules/SummaryManager.js

import Logger from './Logger.js';
import DOMUtils from './DOMUtils.js';
import APIUtils from './APIUtils.js';
import UIUtils from './UIUtils.js';

export default class SummaryManager {
  // Define constants for selectors
  static SELECTORS = {
    BOTTOM_ROW: '#bottom-row',
    // Add more selectors here if needed in the future
  };

  constructor() {
    this.debounceTimer = null;
    this.debounceInterval = 500; // 500ms
  }

  /**
   * Inserts the summary box into the YouTube page with debouncing.
   */
  async insertSummary() {
    // Clear any existing debounce timer
    clearTimeout(this.debounceTimer);

    // Set a new debounce timer
    this.debounceTimer = setTimeout(async () => {
      const { BOTTOM_ROW } = SummaryManager.SELECTORS;

      try {
        // Wait for the bottom row element to appear in the DOM
        const bottomRowElement = await DOMUtils.waitForElement(BOTTOM_ROW, 30);
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
          // Update the summary container with the fetched summary
          await UIUtils.updateSummary(summaryContainer, fullSummary);
        } else {
          // Delegate API failure handling to UIUtils
          UIUtils.handleSummaryFailure(summaryContainer);
        }
      } catch (error) {
        Logger.error(`Error inserting summary: ${error.message}`);
      }
    }, this.debounceInterval);
  }
}
