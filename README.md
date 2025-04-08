# Automated Financial Program Created by Quidy, Cheetos & Zuz for Project Graduation bullshit. I'm so happy that I want to kms.

## Overview
This project is a comprehensive automated financial program designed to support various accounting standards and provide advanced financial analysis capabilities. It integrates AI features for forecasting and anomaly detection, ensuring robust data processing and visualization.

## Features
- **Accounting Features**
  - Support for IFRS and GAAP standards
  - Generation of financial statements:
    - Income Statement
    - Balance Sheet
    - Cash Flow Statement
  - Financial analysis capabilities including liquidity, profitability, debt ratios, and variance analysis.

- **AI & Prediction**
  - Financial forecasting using Scikit-learn
  - Browser-based analytics with TensorFlow.js
  - Error detection through anomaly detection algorithms

- **System Functions**
  - Transaction management
  - Data display and calculations
  - Export options for Excel and PDF
  - API integration for external data exchange

## System Requirements

### Windows
- Node.js 14 or higher
- Windows 8/10/11

### macOS
- Node.js 14 or higher
- macOS 10.15 or higher

### Linux
- Node.js 14 or higher
- Required packages for Fedora/RHEL:
  ```bash
  sudo dnf install cairo-devel pango-devel fontconfig-devel
  ```
- Required packages for Ubuntu/Debian:
  ```bash
  sudo apt-get install libcairo2-dev libpango1.0-dev libfontconfig1-dev
  ```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd financial-analysis
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   This will automatically run the setup script for your platform.

4. Create environment configuration:
   ```bash
   cp .env.example .env
   ```
   Edit the .env file with your configuration values.

## Usage
To run the application, use the following command:
```bash
npm start
```

## Testing
To run the tests, use:
```bash
npm test
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.