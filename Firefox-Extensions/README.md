# YouTube Summary Extension

![Extension Icon](./icons/icon-128.png)

## Table of Contents

- [YouTube Summary Extension](#youtube-summary-extension)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Demo](#demo)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Build the Project](#build-the-project)
    - [Load the Extension into Firefox](#load-the-extension-into-firefox)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
  - [Usage](#usage)
  - [Development](#development)
    - [Project Structure](#project-structure)
    - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)
  - [Troubleshooting](#troubleshooting)
    - [Extension Not Appearing on YouTube](#extension-not-appearing-on-youtube)
    - [Errors in the Console](#errors-in-the-console)
    - [Styling Issues](#styling-issues)
    - [API Fetch Failures](#api-fetch-failures)
    - [Shadow DOM Traversal Issues](#shadow-dom-traversal-issues)

## Overview

The **YouTube Summary** Firefox extension enhances your YouTube viewing experience by adding a concise summary below the video description. Utilizing powerful tools like **Marked** for Markdown parsing and **DOMPurify** for sanitizing HTML, this extension ensures that summaries are both informative and secure.

## Features

- **Automatic Summarization**: Generates a summary of YouTube video descriptions.
- **Markdown Support**: Converts Markdown-formatted summaries to HTML.
- **Sanitized Content**: Ensures all HTML content is sanitized to prevent XSS attacks.
- **Toggle Functionality**: Allows users to expand or collapse the summary for a better viewing experience.
- **Shadow DOM Traversal**: Effectively interacts with YouTube's dynamic and shadow DOM elements.

## Demo

![Summary Box](screenshots/summary-box.gif)

## Installation

### Prerequisites

- **Node.js & NPM**: Ensure you have [Node.js](https://nodejs.org/) installed, which includes NPM.

### Clone the Repository

```bash
git clone https://github.com/your-username/youtube-description-summary.git
cd youtube-description-summary
```

### Install Dependencies

Install the necessary dependencies using NPM:

```bash
npm install
```

### Build the Project

Use Webpack to transpile and bundle the modules:

- **Development Build** (includes source maps for easier debugging):

  ```bash
  npm run build:dev
  ```

- **Production Build** (optimized for performance):

  ```bash
  npm run build:prod
  ```

This command generates the `dist/content.bundle.js` file, which includes all necessary libraries.

### Load the Extension into Firefox

1. **Open Firefox** and navigate to `about:debugging#/runtime/this-firefox`.

2. **Click on "Load Temporary Add-on…"**

3. **Select the `manifest.json` File**

   Navigate to your project directory and select the `manifest.json` file.

4. **Verify Installation**

   - The extension should now appear under **"Temporary Extensions"**.
   - Navigate to a YouTube video page to see the summary box in action.

## Configuration

### Environment Variables

The API endpoint used to fetch summaries is configurable via environment variables. This allows you to switch between different environments (e.g., development, production) without altering the source code.

1. **Create Environment Files**

   - **`.env.development`**

     ```env
     API_ENDPOINT=http://localhost:5000/summarize
     ```

   - **`.env.production`**

     ```env
     API_ENDPOINT=https://api.yourdomain.com/summarize
     ```

   **Note:** Ensure that `.env` files are **not** committed to version control by adding them to your `.gitignore`.

2. **Build with the Desired Environment**

   - **Development Build:**

     ```bash
     npm run build:dev
     ```

     Uses the API endpoint defined in `.env.development`.

   - **Production Build:**

     ```bash
     npm run build:prod
     ```

     Uses the API endpoint defined in `.env.production`.

## Usage

1. **Navigate to a YouTube Video**: Open any YouTube video page.

2. **View the Summary**: Scroll to the summary box located below the video description.

3. **Toggle the Summary**: Click on the summary box or press `Enter`/`Space` to expand or collapse the full summary.

## Development

### Project Structure

```
youtube-description-summary/
├── src/
│   ├── modules/
│   │   ├── APIUtils.js
│   │   ├── DOMUtils.js
│   │   ├── Logger.js
│   │   ├── SummaryManager.js
│   │   ├── UIUtils.js
│   │   └── URLChangeHandler.js
│   ├── content.js
├── dist/
│   └── content.bundle.js
├── styles/
│   └── styles.css
├── icons/
│   ├── icon-48.png
│   └── icon-96.png
├── screenshots/
│   ├── summary-box.png
│   ├── load_temporary_addon.png
│   └── select_manifest.png
├── .babelrc
├── .gitignore
├── README.md
├── package.json
├── webpack.config.js
├── .env.development
└── .env.production
```

### Scripts

- **`npm run build:dev`**: Transpiles and bundles the source code using Webpack and Babel for development (includes source maps).
- **`npm run build:prod`**: Transpiles and bundles the source code using Webpack and Babel for production (optimized).
- **`npm run watch`**: Watches for file changes and rebuilds automatically in development mode.


## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

   Describe your changes and submit the pull request for review.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Marked](https://github.com/markedjs/marked) - A Markdown parser and compiler.
- [DOMPurify](https://github.com/cure53/DOMPurify) - A DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML, and SVG.
- [Webpack](https://webpack.js.org/) - A static module bundler for modern JavaScript applications.
- [Babel](https://babeljs.io/) - A JavaScript compiler that allows you to use next generation JavaScript, today.
- [Mozilla WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) - The platform for developing Firefox extensions.

## Troubleshooting

### Extension Not Appearing on YouTube

- **Check Content Script Matching Patterns**: Ensure that the `matches` field in `manifest.json` correctly targets YouTube watch pages:

  ```json
  "matches": ["*://*.youtube.com/watch*"]
  ```

- **Verify DOM Selectors**: YouTube frequently updates its DOM structure. Use Firefox’s **Inspector** tool to verify element IDs and classes.

### Errors in the Console

- **Fetch Errors**:
  - Ensure your backend API (`http://localhost:5000/summarize` or your configured endpoint) is running and accessible.
  - Check CORS policies on your API server to allow requests from YouTube.
  - Update the API URL to HTTPS if deploying the API publicly.

- **Module Import Issues**:
  - Verify that all dependencies are correctly installed and imported.
  - Check Webpack bundling for any missing modules or errors.

### Styling Issues

- **CSS Not Applied**:
  - Ensure `styles/styles.css` is correctly referenced in `manifest.json`.
  
    ```json
    "css": ["styles/styles.css"]
    ```
  
  - Verify that CSS selectors match the elements you're styling.

- **Conflicts with YouTube’s Styles**:
  - Use more specific selectors or `!important` judiciously to enforce your styles.

### API Fetch Failures

- **API Server Down**: Confirm that your API server is operational.
- **CORS Issues**: Ensure that your API server permits cross-origin requests from YouTube.
- **Incorrect API Endpoint**: Verify the API URL in your `APIUtils.js` and environment files.

### Shadow DOM Traversal Issues

- **Updated YouTube DOM**: YouTube may have changed its Shadow DOM structure. Update your selectors accordingly.
- **Recursive Traversal Failures**: Ensure that your `DOMUtils.traverseShadows` method correctly navigates the current Shadow DOM structure.
