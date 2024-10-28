// src/modules/Logger.js

export default class Logger {
  static log(message) {
    console.log(`[YouTube Summary] ${message}`);
  }

  static warn(message) {
    console.warn(`[YouTube Summary] ${message}`);
  }

  static error(message) {
    console.error(`[YouTube Summary] ${message}`);
  }
}
