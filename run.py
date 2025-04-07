#!/usr/bin/env python3
"""
Main entry point for the Automated Financial Program.
Handles startup, configuration loading, and server initialization.
"""
import os
import sys
import subprocess
import webbrowser
from pathlib import Path
from time import sleep

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

from app.utils.config import load_config
from app.core.ollama_integration import check_ollama_availability
from loguru import logger

def verify_environment():
    """Verify that all required components are available."""
    logger.info("Verifying environment...")
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 11):
        logger.error("Python 3.11 or higher is required.")
        return False
    
    # Check if Ollama is installed and running
    if not check_ollama_availability():
        logger.error("Ollama is not available. Please install and start Ollama first.")
        logger.info("Installation instructions: https://ollama.com/")
        return False
    
    # Check if the Mistral model is available
    try:
        result = subprocess.run(
            ["ollama", "list"], 
            capture_output=True, 
            text=True, 
            check=True
        )
        if "mistral" not in result.stdout:
            logger.warning("Mistral model not found. Pulling model...")
            subprocess.run(["ollama", "pull", "mistral"], check=True)
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to check or pull Mistral model: {e}")
        return False
    except FileNotFoundError:
        logger.error("Ollama command not found. Please install Ollama first.")
        return False
    
    return True

def setup_database():
    """Set up the database schema."""
    logger.info("Setting up database...")
    try:
        from app.models.base import db_engine, create_tables
        create_tables()
        logger.info("Database setup complete.")
        return True
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        return False

def main():
    """Main entry point for the application."""
    logger.info("Starting Automated Financial Program...")
    
    # Verify environment before proceeding
    if not verify_environment():
        logger.error("Environment verification failed. Please fix the issues and try again.")
        sys.exit(1)
    
    # Load configuration
    config = load_config()
    if not config:
        logger.error("Failed to load configuration. Exiting.")
        sys.exit(1)
    
    # Set up database
    if not setup_database():
        logger.error("Database setup failed. Exiting.")
        sys.exit(1)
    
    # Create data directories if they don't exist
    data_dir = project_root / "data" / "user_data"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Start the web application
    from app import create_app
    app = create_app(config)
    
    host = config.get('server', {}).get('host', '127.0.0.1')
    port = config.get('server', {}).get('port', 5000)
    
    # Open browser after a short delay
    def open_browser():
        sleep(1.5)  # Give the server a moment to start
        webbrowser.open(f"http://{host}:{port}")
    
    from threading import Thread
    browser_thread = Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    logger.info(f"Starting server at http://{host}:{port}")
    app.run(host=host, port=port, debug=config.get('development_mode', False))

if __name__ == "__main__":
    main()