"""
Main application factory module.
Creates and configures the Flask application.
"""
import os
from flask import Flask
from flask_assets import Environment, Bundle
from loguru import logger

def create_app(config=None):
    """Create and configure the Flask application."""
    app = Flask(__name__, 
                static_folder='static',
                template_folder='templates')
    
    # Configure the app
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key_only_for_development'),
        SQLALCHEMY_DATABASE_URI=get_database_uri(config),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        TEMPLATES_AUTO_RELOAD=True,
    )
    
    # Setup Flask-Assets
    assets = Environment(app)
    assets.debug = app.debug
    
    # Define asset bundles
    css = Bundle(
        'css/main.css',
        'css/dashboard.css',
        filters='cssmin',
        output='gen/packed.css'
    )
    
    js = Bundle(
        'js/main.js',
        'js/charts.js',
        'js/analysis.js',
        filters='jsmin',
        output='gen/packed.js'
    )
    
    assets.register('css_all', css)
    assets.register('js_all', js)
    
    # Initialize database
    from app.models.base import db
    db.init_app(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Setup logging
    setup_logging(app, config)
    
    logger.info("Application initialized successfully")
    return app

def get_database_uri(config):
    """Construct database URI from configuration."""
    if not config or 'database' not in config:
        return 'sqlite:///data/financial_data.db'
    
    db_config = config['database']
    db_type = db_config.get('type', 'sqlite')
    
    if db_type == 'sqlite':
        db_path = db_config.get('sqlite', {}).get('path', 'data/financial_data.db')
        return f'sqlite:///{db_path}'
    elif db_type == 'postgresql':
        pg = db_config.get('postgresql', {})
        host = pg.get('host', 'localhost')
        port = pg.get('port', 5432)
        database = pg.get('database', 'financial_app')
        username = pg.get('username', 'postgres')
        password = pg.get('password', 'postgres')
        return f'postgresql://{username}:{password}@{host}:{port}/{database}'
    else:
        logger.warning(f"Unsupported database type: {db_type}. Using SQLite.")
        return 'sqlite:///data/financial_data.db'

def register_blueprints(app):
    """Register Flask blueprints."""
    from app.views import (
        main_bp, dashboard_bp, transactions_bp, 
        reports_bp, analysis_bp, settings_bp, api_bp
    )
    
    app.register_blueprint(main_bp)
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(transactions_bp, url_prefix='/transactions')
    app.register_blueprint(reports_bp, url_prefix='/reports')
    app.register_blueprint(analysis_bp, url_prefix='/analysis')
    app.register_blueprint(settings_bp, url_prefix='/settings')
    app.register_blueprint(api_bp, url_prefix='/api')

def register_error_handlers(app):
    """Register error handlers."""
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template('errors/500.html'), 500

def setup_logging(app, config):
    """Configure logging based on app configuration."""
    from flask import request, g
    import time
    
    log_level = config.get('logging', {}).get('level', 'INFO')
    log_file = config.get('logging', {}).get('file', 'logs/financial_app.log')
    
    # Ensure log directory exists
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    logger.remove()  # Remove default handler
    logger.add(log_file, 
               rotation="10 MB",
               retention="1 week",
               level=log_level,
               format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}")
    
    logger.add(sys.stderr, level=log_level)
    
    @app.before_request
    def before_request():
        g.start_time = time.time()
        
    @app.after_request
    def after_request(response):
        if request.path.startswith('/static'):
            return response
            
        execution_time = time.time() - g.start_time
        logger.debug(f"{request.method} {request.path} {response.status_code} - {execution_time:.2f}s")
        return response

# Import this at the end to avoid circular imports
import sys
from flask import render_template