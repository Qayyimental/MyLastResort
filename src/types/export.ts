export interface TableColumn {
  field: string;
  header: string;
  width?: number;
  format?: (value: any) => string;
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  dateFormat?: string;
  orientation?: 'portrait' | 'landscape';
}

export interface PDFTableOptions {
  headerBgColor?: string;
  rowAlternateColors?: [string, string];
  cellPadding?: number;
  fontSize?: number;
  headerFontSize?: number;
}
