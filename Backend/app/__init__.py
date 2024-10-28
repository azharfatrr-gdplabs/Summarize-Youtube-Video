# app/__init__.py

from flask import Flask
from flask_cors import CORS
from .config import Config
from .routes.summarize import summarize_bp
from .errors import register_error_handlers
import logging


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Debug: Print CORS_ALLOWED_ORIGINS
    print(f"CORS_ALLOWED_ORIGINS: {app.config['CORS_ALLOWED_ORIGINS']}")

    # Initialize Extensions
    CORS(app, resources={r"/*": {"origins": app.config["CORS_ALLOWED_ORIGINS"]}})

    # Register Blueprints
    app.register_blueprint(summarize_bp, url_prefix="/summarize")

    # Register Error Handlers
    register_error_handlers(app)

    # Setup Logging
    setup_logging(app)

    return app


def setup_logging(app):
    # Remove any default handlers
    for handler in app.logger.handlers:
        app.logger.removeHandler(handler)

    # Set logging level
    app.logger.setLevel(logging.INFO)

    # Create a StreamHandler to log to stdout
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)

    # Set the logging format
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
    )
    stream_handler.setFormatter(formatter)

    # Add the StreamHandler to Flask's logger
    app.logger.addHandler(stream_handler)

    app.logger.info("Logging setup complete. App is starting...")
