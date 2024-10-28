# app/errors.py

from flask import jsonify
import logging

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad Request'}), 400

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not Found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal Server Error'}), 500

    # Handle custom exceptions
    @app.errorhandler(SafetyException)
    def handle_safety_exception(error):
        return jsonify({'error': str(error)}), 403

    @app.errorhandler(SummarizationException)
    def handle_summarization_exception(error):
        return jsonify({'error': str(error)}), 500

class SafetyException(Exception):
    """Exception raised when summarization is stopped due to safety concerns."""
    pass

class SummarizationException(Exception):
    """Exception raised when summarization fails."""
    pass
