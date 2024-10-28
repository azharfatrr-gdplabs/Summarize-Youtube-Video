// src/modules/APIUtils.js

import Logger from './Logger.js';

export default class APIUtils {
  /**
   * Fetches the summary for a given video ID directly from the API.
   * @param {string} videoID - The YouTube video ID.
   * @returns {Promise<string|null>} - The summary text or null on failure.
   */
  static async fetchSummary(videoID) {
    try {
      const response = await fetch(process.env.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoID }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const summary = data.summary;

      if (summary) {
        Logger.log('Summary fetched successfully.');
        return summary;
      } else {
        Logger.warn('No summary found in the API response.');
        return null;
      }
    } catch (error) {
      Logger.error(`Error fetching summary: ${error}`);
      return null;
    }
  }
}
