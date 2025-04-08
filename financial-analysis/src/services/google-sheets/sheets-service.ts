import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export class GoogleSheetsService {
  private auth: JWT;
  private sheets: any;

  constructor(credentials: any) {
    this.auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async createFinancialTemplate(title: string) {
    const resource = {
      properties: {
        title,
        sheets: [
          { properties: { title: 'Balance Sheet' } },
          { properties: { title: 'Income Statement' } },
          { properties: { title: 'Cash Flow' } },
          { properties: { title: 'Financial Ratios' } }
        ]
      }
    };

    return await this.sheets.spreadsheets.create({ resource });
  }

  async updateSheet(spreadsheetId: string, range: string, values: any[][]) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
  }
}
