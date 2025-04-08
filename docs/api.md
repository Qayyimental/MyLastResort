# Financial Analysis API Documentation

## Authentication
All API requests require a valid API key passed in the header:
```
Authorization: Bearer <your-api-key>
```

## Endpoints

### Financial Statements

#### GET /api/financial/income-statement
Returns the income statement for a specified period.

#### GET /api/financial/balance-sheet
Returns the current balance sheet.

#### GET /api/financial/cash-flow
Returns the cash flow statement.

### Analytics

#### GET /api/analytics/ratios
Returns key financial ratios.

#### POST /api/analytics/forecast
Generates financial forecasts based on historical data.

## Error Codes
- `INVALID_AMOUNT`: Transaction amount is invalid
- `API_ERROR`: External API request failed
- `RATE_LIMIT`: Rate limit exceeded
- `UNKNOWN_ERROR`: Unexpected error occurred
