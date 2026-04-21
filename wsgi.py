"""
WSGI entry point for production deployment.
This file is used by Gunicorn to load and run the Flask application.
"""
from backend import app

if __name__ == "__main__":
    app.run()
