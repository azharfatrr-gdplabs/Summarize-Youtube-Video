# app/utils/sanitize.py

import re

def sanitize_transcript(transcript):
    """
    Sanitize the transcript by removing or censoring explicit content.
    Customize the patterns as per your requirements.
    """
    # Define patterns for explicit content (customize as needed)
    explicit_patterns = [
        r'\bexplicit_word1\b',
        r'\bexplicit_word2\b',
        # Add more patterns as necessary
    ]
    
    # Combine patterns into a single regex
    pattern = re.compile('|'.join(map(re.escape, explicit_patterns)), re.IGNORECASE)
    
    # Replace explicit words with asterisks or [CENSORED]
    sanitized_transcript = pattern.sub('[CENSORED]', transcript)
    
    return sanitized_transcript
