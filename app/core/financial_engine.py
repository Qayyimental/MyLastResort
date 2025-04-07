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
inventory_turnover = cost_of_goods_sold / inventory if inventory else float('inf')
        
        # Prepare results
        ratios = {
            'as_of_date': as_of_date.strftime('%Y-%m-%d'),
            'liquidity': {
                'current_ratio': round(current_ratio, self.precision),
                'quick_ratio': round(quick_ratio, self.precision)
            },
            'profitability': {
                'profit_margin': round(profit_margin, self.precision),
                'return_on_assets': round(return_on_assets, self.precision),
                'return_on_equity': round(return_on_equity, self.precision)
            },
            'leverage': {
                'debt_ratio': round(debt_ratio, self.precision),
                'debt_to_equity': round(debt_to_equity, self.precision),
                'interest_coverage': round(interest_coverage, self.precision) if interest_coverage != float('inf') else float('inf')
            },
            'efficiency': {
                'asset_turnover': round(asset_turnover, self.precision),
                'inventory_turnover': round(inventory_turnover, self.precision) if inventory_turnover != float('inf') else float('inf')
            }
        }
        
        # Store ratios in the database
        self._save_financial_ratios(ratios, as_of_date)
        
        return ratios
    
    def perform_variance_analysis(self, statement_type, current_period_end, previous_period_end=None):
        """
        Perform variance analysis between two periods.
        
        Args:
            statement_type (str): Type of statement ('income_statement', 'balance_sheet', 'cash_flow')
            current_period_end (datetime): End date of current period
            previous_period_end (datetime, optional): End date of previous period
            
        Returns:
            dict: Variance analysis results
        """
        logger.info(f"Performing variance analysis for {statement_type}")
        
        if previous_period_end is None:
            # Default to previous year same period
            previous_period_end = datetime(
                current_period_end.year - 1,
                current_period_end.month,
                current_period_end.day
            )
        
        # Get statements based on type
        if statement_type == 'income_statement':
            current_start = self._get_start_of_month(current_period_end)
            previous_start = self._get_start_of_month(previous_period_end)
            
            current = self.generate_income_statement(current_start, current_period_end)
            previous = self.generate_income_statement(previous_start, previous_period_end)
            
            # Define the key metrics to compare
            metrics = {
                'Revenue': ('revenue', 'total'),
                'Expenses': ('expenses', 'total'),
                'Gross Profit': ('gross_profit', None),
                'Net Income': ('net_income', None)
            }
            
        elif statement_type == 'balance_sheet':
            current = self.generate_balance_sheet(current_period_end)
            previous = self.generate_balance_sheet(previous_period_end)
            
            # Define the key metrics to compare
            metrics = {
                'Total Assets': ('assets', 'total'),
                'Total Liabilities': ('liabilities', 'total'),
                'Total Equity': ('equity', 'total')
            }
            
        elif statement_type == 'cash_flow':
            current_start = self._get_start_of_month(current_period_end)
            previous_start = self._get_start_of_month(previous_period_end)
            
            current = self.generate_cash_flow_statement(current_start, current_period_end)
            previous = self.generate_cash_flow_statement(previous_start, previous_period_end)
            
            # Define the key metrics to compare
            metrics = {
                'Operating Activities': ('operating_activities', 'net_cash'),
                'Investing Activities': ('investing_activities', 'net_cash'),
                'Financing Activities': ('financing_activities', 'net_cash'),
                'Net Change in Cash': ('net_change_in_cash', None)
            }
        else:
            raise ValueError(f"Unsupported statement type: {statement_type}")
        
        # Calculate variances for each metric
        variances = []
        for label, (key1, key2) in metrics.items():
            current_value = current[key1] if key2 is None else current[key1][key2]
            previous_value = previous[key1] if key2 is None else previous[key1][key2]
            
            absolute_change = current_value - previous_value
            percentage_change = self._calculate_percentage_change(previous_value, current_value)
            
            variances.append({
                'metric': label,
                'current_value': current_value,
                'previous_value': previous_value,
                'absolute_change': absolute_change,
                'percentage_change': percentage_change
            })
        
        # Prepare result
        result = {
            'statement_type': statement_type,
            'current_period': {
                'end_date': current_period_end.strftime('%Y-%m-%d'),
                'start_date': current_start.strftime('%Y-%m-%d') if 'current_start' in locals() else None
            },
            'previous_period': {
                'end_date': previous_period_end.strftime('%Y-%m-%d'),
                'start_date': previous_start.strftime('%Y-%m-%d') if 'previous_start' in locals() else None
            },
            'variances': variances,
            'currency': self.currency
        }
        
        return result
    
    def _get_account_balances(self, account_type, start_date=None, end_date=None):
        """Get account balances for the specified type and period."""
        from app.models.accounting import Account, Transaction
        from app.models.base import db
        from sqlalchemy import func, and_
        
        query = db.session.query(
            Account.name,
            func.sum(Transaction.amount).label('balance')
        ).join(
            Transaction,
            Transaction.account_id == Account.id
        ).filter(
            Account.type == account_type
        )
        
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
            
        query = query.group_by(Account.name).order_by(Account.name)
        
        results = query.all()
        return [(name, float(balance)) for name, balance in results]
    
    def _get_cash_flow_items(self, activity_type, start_date, end_date):
        """Get cash flow items for the specified activity type and period."""
        from app.models.accounting import CashFlowItem, Transaction
        from app.models.base import db
        from sqlalchemy import func
        
        query = db.session.query(
            CashFlowItem.description,
            func.sum(Transaction.amount).label('amount')
        ).join(
            Transaction,
            Transaction.id == CashFlowItem.transaction_id
        ).filter(
            CashFlowItem.activity_type == activity_type,
            Transaction.date >= start_date,
            Transaction.date <= end_date
        ).group_by(
            CashFlowItem.description
        ).order_by(
            CashFlowItem.description
        )
        
        results = query.all()
        return [(desc, float(amount)) for desc, amount in results]
    
    def _get_cash_balance(self, as_of_date):
        """Get cash balance as of the specified date."""
        return self._sum_accounts(['Cash'], 'Asset', as_of_date)
    
    def _sum_accounts(self, account_names, account_type, end_date, start_date=None):
        """Sum the balances of specified accounts."""
        from app.models.accounting import Account, Transaction
        from app.models.base import db
        from sqlalchemy import func
        
        query = db.session.query(
            func.sum(Transaction.amount).label('balance')
        ).join(
            Account,
            Account.id == Transaction.account_id
        ).filter(
            Account.name.in_(account_names),
            Account.type == account_type,
            Transaction.date <= end_date
        )
        
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        
        result = query.scalar()
        return float(result) if result else 0.0
    
    def _calculate_percentage_change(self, old_value, new_value):
        """Calculate percentage change between two values."""
        if old_value == 0:
            return float('inf') if new_value > 0 else float('-inf') if new_value < 0 else 0
            
        change = ((new_value - old_value) / abs(old_value)) * 100
        return round(change, self.precision)
    
    def _get_previous_period(self, start_date, end_date):
        """Calculate the start date of the previous period with the same duration."""
        duration = end_date - start_date
        return start_date - duration
    
    def _get_start_of_month(self, date):
        """Get the first day of the month for the given date."""
        return datetime(date.year, date.month, 1)
    
    def _get_end_of_month(self, date):
        """Get the last day of the month for the given date."""
        if date.month == 12:
            next_month = datetime(date.year + 1, 1, 1)
        else:
            next_month = datetime(date.year, date.month + 1, 1)
        
        return next_month - timedelta(days=1)
    
    def _save_financial_statement(self, statement_type, data, start_date, end_date):
        """Save financial statement to the database."""
        from app.models.accounting import FinancialStatement
        from app.models.base import db
        
        # Check if statement already exists
        existing = FinancialStatement.query.filter_by(
            type=statement_type,
            start_date=start_date,
            end_date=end_date
        ).first()
        
        if existing:
            existing.data = data
            existing.updated_at = datetime.utcnow()
        else:
            statement = FinancialStatement(
                type=statement_type,
                start_date=start_date,
                end_date=end_date,
                data=data,
                standard=self.accounting_standard
            )
            db.session.add(statement)
        
        db.session.commit()
    
    def _save_financial_ratios(self, ratios, as_of_date):
        """Save financial ratios to the database."""
        from app.models.accounting import FinancialRatio
        from app.models.base import db
        
        # Check if ratios already exist
        existing = FinancialRatio.query.filter_by(
            as_of_date=as_of_date
        ).first()
        
        if existing:
            existing.data = ratios
            existing.updated_at = datetime.utcnow()
        else:
            ratio_record = FinancialRatio(
                as_of_date=as_of_date,
                data=ratios
            )
            db.session.add(ratio_record)
        
        db.session.commit()
