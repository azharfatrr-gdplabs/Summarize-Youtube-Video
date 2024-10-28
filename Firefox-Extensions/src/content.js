// src/content.js

import Logger from './modules/Logger.js';
import SummaryManager from './modules/SummaryManager.js';
import URLChangeHandler from './modules/URLChangeHandler.js';

(function () {
  Logger.log('YouTube Description Summary extension loaded.');

  // Initialize Summary Manager
  const summaryManager = new SummaryManager();
  summaryManager.insertSummary();

  // Initialize URL Change Handler
  const urlChangeHandler = new URLChangeHandler();
  urlChangeHandler.onUrlChange(() => {
    Logger.log('URL changed. Re-initializing summary insertion.');
    summaryManager.insertSummary();
  });
})();
