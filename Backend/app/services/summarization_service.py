# app/services/summarization_service.py

import requests
import logging
import os
from flask import current_app
from ..errors import SafetyException, SummarizationException
from ..utils.prompt_engineering import generate_summary_prompt

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def summarize_text(transcript, summary_length="complete"):
    """
    Summarizes the given transcript using the Gemini API with prompt engineering.

    Parameters:
        transcript (str): The YouTube video transcript to summarize.
        summary_length (str): Desired summary length ('concise', 'detailed', 'bullet').

    Returns:
        str: The summarized text.
    """
    gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={current_app.config["GEMINI_API_KEY"]}'

    # Generate the prompt using the utility function
    prompt = generate_summary_prompt(transcript, summary_length)

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(gemini_url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        logging.getLogger(__name__).debug(f"Gemini API Response: {data}")

        # Check if 'candidates' exists in the response
        if "candidates" not in data or not data["candidates"]:
            logging.getLogger(__name__).warning(
                "Summarization was stopped due to safety concerns."
            )
            raise SafetyException("Summarization was stopped due to safety concerns.")

        # Extract summary from the first candidate
        first_candidate = data["candidates"][0]
        if "content" in first_candidate and "parts" in first_candidate["content"]:
            summary = first_candidate["content"]["parts"][0]["text"].strip()
            logging.getLogger(__name__).info(f"Generated Summary: {summary[:100]}...")
            return summary
        else:
            finish_reason = first_candidate.get("finishReason", "UNKNOWN")
            if finish_reason == "SAFETY":
                logging.getLogger(__name__).warning(
                    "Summarization was stopped due to safety concerns."
                )
                raise SafetyException(
                    "Summarization was stopped due to safety concerns."
                )
            else:
                logging.getLogger(__name__).warning(
                    "Summarization was stopped for an unknown reason."
                )
                raise SummarizationException(
                    "Summarization was stopped for an unknown reason."
                )

    except requests.exceptions.RequestException as e:
        logging.getLogger(__name__).exception(f"Gemini API request failed: {e}")
        raise SummarizationException("Failed to summarize transcript.") from e
    except (KeyError, IndexError) as e:
        logging.getLogger(__name__).exception(f"Error parsing Gemini API response: {e}")
        raise SummarizationException(
            "Invalid response from summarization service."
        ) from e
