# app/routes/summarize.py

from flask import Blueprint, request, jsonify
from ..services.transcript_service import fetch_transcript
from ..services.summarization_service import summarize_text
from ..utils.sanitize import sanitize_transcript

summarize_bp = Blueprint('summarize', __name__)

@summarize_bp.route('', methods=['POST'])
def summarize():
    data = request.get_json()
    video_id = data.get('video_id', '').strip()

    if not video_id:
        return jsonify({'error': 'No video_id provided.'}), 400

    try:
        # Fetch transcript
        transcript = fetch_transcript(video_id)
        sanitized_transcript = sanitize_transcript(transcript)
    except Exception as e:
        # The exceptions are handled globally
        raise e

    try:
        # Summarize transcript
        summary = summarize_text(sanitized_transcript)
        return jsonify({'summary': summary}), 200
    except SafetyException as e:
        return jsonify({'error': str(e)}), 403
    except SummarizationException as e:
        return jsonify({'error': str(e)}), 500
