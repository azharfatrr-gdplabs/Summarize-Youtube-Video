# YouTube Summary Extension - Backend

## Table of Contents

- [YouTube Summary Extension - Backend](#youtube-summary-extension---backend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Run the Application](#run-the-application)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
  - [Usage](#usage)
  - [Development](#development)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

The **YouTube Summary Extension - Backend** is a Python-based service that provides summarization and transcription functionalities to support the YouTube Summary Extension. It processes video transcripts and provides concise summaries that are displayed within the Firefox extension.

## Features

- **Summarization Service**: Generates concise summaries of video transcripts.
- **Transcription Service**: Processes and sanitizes video transcripts for summarization.
- **Error Handling**: Custom error handling to manage service responses effectively.

## Project Structure

```
Backend/
├── .vercel/                       # Vercel configuration files for deployment
├── app/
│   ├── routes/
│   │   ├── __init__.py
│   │   └── summarize.py           # Route for handling summarization requests
│   ├── services/
│   │   ├── __init__.py
│   │   ├── summarization_service.py  # Logic for summarizing content
│   │   └── transcript_service.py     # Logic for processing transcripts
│   └── utils/
│       ├── prompt_engineering.py     # Prompt templates and utilities
│       ├── sanitize.py               # Sanitization functions for input/output
│       ├── config.py                 # Configuration settings
│       └── errors.py                 # Custom error definitions
├── logs/                           # Log files
├── venv/                           # Virtual environment
├── .env                            # Environment variables
├── requirements.txt                # Python dependencies
├── run.py                          # Main entry point for running the service
└── vercel.json                     # Vercel deployment configuration
```

## Installation

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Clone the Repository

```bash
git clone https://github.com/yourusername/youtube-summary-backend.git
cd youtube-summary-backend
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

To start the backend service:

```bash
python run.py
```

## Configuration

### Environment Variables

Set up a `.env` file with the following variables:

```bash
GEMINI_API_KEY=<Gemini-API-Key>
CORS_ALLOWED_ORIGINS=*
```

## Usage

This backend service can be used with the YouTube Summary Extension to process video transcripts and provide summaries.

## Development

For development, ensure the virtual environment is activated, and use a suitable IDE like VSCode for managing dependencies and code structure.

## Troubleshooting

### Common Issues

- **Errors in the Console**: Check logs in the `logs/` directory for detailed error messages.
- **API Fetch Failures**: Ensure the `.env` file is configured correctly with valid API keys.

## Contributing

We welcome contributions! Please create an issue or pull request for any suggestions or changes.

## License

This project is licensed under the MIT License.
