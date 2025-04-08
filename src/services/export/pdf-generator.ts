import PDFDocument from 'pdfkit';

interface PDFGeneratorOptions {
  margins?: { top: number; right: number; bottom: number; left: number };
  defaultFontSize?: number;
  tableOptions?: {
    headerBgColor?: string;
    rowAlternateColors?: [string, string];
    cellPadding?: number;
  };
}

export class PDFGenerator {
  private doc: PDFKit.PDFDocument;
  private options: PDFGeneratorOptions;

  constructor(options: PDFGeneratorOptions = {}) {
    this.options = {
      margins: { top: 50, right: 50, bottom: 50, left: 50 },
      defaultFontSize: 12,
      tableOptions: {
        headerBgColor: '#f0f0f0',
        rowAlternateColors: ['#ffffff', '#f9f9f9'],
        cellPadding: 8
      },
      ...options
    };

    this.doc = new PDFDocument({
      margins: this.options.margins,
      size: 'A4'
    });
    this.doc.fontSize(this.options.defaultFontSize);
  }

  addHeader(text: string) {
    if (!text?.trim()) {
      throw new Error('Header text cannot be empty');
    }

    this.doc
      .fontSize(18)
      .text(text, { align: 'center' })
      .moveDown(2);

    return this;
  }

  addTable(data: any[], columns: string[]) {
    if (!Array.isArray(data) || !data.length || !Array.isArray(columns) || !columns.length) {
      throw new Error('Invalid table data or columns');
    }

    const tableTop = this.doc.y;
    const rowHeight = 25;
    const { cellPadding = 8 } = this.options.tableOptions || {};
    const colWidth = (this.doc.page.width - this.options.margins!.left - this.options.margins!.right) / columns.length;

    // Draw headers with background
    this.doc.fillColor(this.options.tableOptions?.headerBgColor || '#f0f0f0');
    this.doc.rect(
      this.options.margins!.left,
      tableTop,
      this.doc.page.width - this.options.margins!.left - this.options.margins!.right,
      rowHeight
    ).fill();

    this.doc.fillColor('#000000');
    columns.forEach((col, i) => {
      this.doc.text(
        col,
        this.options.margins!.left + (i * colWidth) + cellPadding,
        tableTop + cellPadding,
        { width: colWidth - (cellPadding * 2) }
      );
    });

    // Draw rows
    let currentTop = tableTop + rowHeight;
    data.forEach((row, rowIndex) => {
      // Alternate row background
      if (this.options.tableOptions?.rowAlternateColors) {
        this.doc.fillColor(this.options.tableOptions.rowAlternateColors[rowIndex % 2]);
        this.doc.rect(
          this.options.margins!.left,
          currentTop,
          this.doc.page.width - this.options.margins!.left - this.options.margins!.right,
          rowHeight
        ).fill();
      }

      this.doc.fillColor('#000000');
      columns.forEach((col, i) => {
        this.doc.text(
          String(row[col] ?? ''),
          this.options.margins!.left + (i * colWidth) + cellPadding,
          currentTop + cellPadding,
          { width: colWidth - (cellPadding * 2) }
        );
      });

      currentTop += rowHeight;
    });

    this.doc.moveDown(2);
    return this;
  }

  async generate(): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', chunks.push.bind(chunks));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.end();
    });
  }
}
