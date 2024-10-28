# app/services/transcript_service.py

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, NoTranscriptAvailable
import logging

def fetch_transcript(video_id, languages=['en', 'id', 'en-GB']):
    """
    Fetches the transcript for a given YouTube video ID.
    """
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
        transcript = ' '.join([entry['text'] for entry in transcript_list])
        logging.getLogger(__name__).info(f"Fetched Transcript for {video_id}: {transcript[:100]}...")
        return transcript
    except TranscriptsDisabled:
        logging.getLogger(__name__).error(f"Transcripts are disabled for video_id: {video_id}.")
        raise
    except NoTranscriptFound:
        logging.getLogger(__name__).error(f"No transcript found for video_id: {video_id}.")
        raise
    except NoTranscriptAvailable:
        logging.getLogger(__name__).error(f"No transcript available in the specified language for video_id: {video_id}.")
        raise
    except Exception as e:
        logging.getLogger(__name__).exception(f"Unexpected error fetching transcript for video_id {video_id}: {e}")
        raise
