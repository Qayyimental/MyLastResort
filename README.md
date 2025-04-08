# Automated Financial Program Created by Quidy, Cheetos & Zuz for Project Graduation bullshit. I'm so happy that I want to kms.

## Overview
This project is a comprehensive automated financial program designed to support various accounting standards and provide advanced financial analysis capabilities. It integrates AI features for forecasting and anomaly detection, ensuring robust data processing and visualization.

## Features

### Core Financial Features
- Support for multiple accounting standards (IFRS, GAAP)
- Double-entry bookkeeping system
- Real-time transaction processing
- Financial statement generation
  - Balance Sheet
  - Income Statement
  - Cash Flow Statement
  - Financial Ratios

### Analytics & AI
- Financial forecasting using TensorFlow and Scikit-learn
- Anomaly detection in financial data
- AI-powered financial text analysis with Mistral
- Automated ratio calculations
- Trend analysis and visualization

### Data Management
- Secure transaction storage
- Data validation and sanitization
- Automated reconciliation
- Version control for financial records

### Export & Reporting
- PDF report generation
- Excel export functionality
- Google Sheets integration
- Custom report templates

### Security Features
- Rate limiting
- XSS protection
- Session management
- Input validation
- Data encryption

### User Interface
- Modern React-based dashboard
- Interactive charts and graphs
- Real-time data updates
- Responsive design

## System Requirements

### Windows
- Node.js 14 or higher
- Windows 8/10/11
- 4GB RAM minimum
- 2GB free disk space

### macOS
- Node.js 14 or higher
- macOS 10.15 or higher
- 4GB RAM minimum
- 2GB free disk space

### Linux
- Node.js 14 or higher
- 4GB RAM minimum
- 2GB free disk space

Required packages for Ubuntu/Debian:
```bash
sudo apt-get install libcairo2-dev libpango1.0-dev libfontconfig1-dev
```

Required packages for Fedora/RHEL:
```bash
sudo dnf install cairo-devel pango-devel fontconfig-devel
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd MyLastResort
```

3. Install dependencies:
```bash
npm install
```

4. Create environment configuration:
```bash
cp financial-analysis/.env.example .env
```

5. Configure your environment variables in .env:
```
NODE_ENV=development
PORT=3000
MISTRAL_API_KEY=your-mistral-api-key
API_BASE_URL=https://api.example.com
DATABASE_URL=postgres://user:pass@localhost:5432/financial_db
SESSION_SECRET=your-session-secret-key
ENCRYPTION_KEY_V1=your-32-byte-encryption-key
```

## Usage

### Development
Start the development server:
```bash
npm run dev
```

### Production
Build and start the production server:
```bash
npm run build
npm start
```

### GUI Application
Launch the desktop application:
```bash
npm run start-gui
```

### Creating Executables
Generate platform-specific executables:
```bash
npm run make-exe
```

## API Documentation

See `/docs/api.md` for detailed API documentation.

## Testing

Run the test suite:
```bash
npm test
```

Run specific test categories:
```bash
npm run test:unit
npm run test:integration
```

## Development

### Project Structure
```
MyLastResort/
├── src/
│   ├── api/            # API endpoints
│   ├── components/     # React components
│   ├── services/       # Business logic
│   ├── models/         # Data models
│   ├── utils/          # Utilities
│   └── gui/            # Desktop app UI
├── scripts/            # Build and setup scripts
├── docs/              # Documentation
└── tests/             # Test files
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Authors
- Quidy
- Cheetos
- Zuz

## Support
For support, please open an issue in the GitHub repository or contact the development team.