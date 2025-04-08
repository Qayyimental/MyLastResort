import { Transaction } from '../../models/transaction';

export async function exportToPDF(data: any[], title: string): Promise<Blob> {
    // This is a simplified version. In production, use a proper PDF library
    const content = {
        title: title,
        date: new Date().toISOString(),
        data: data,
        metadata: {
            generated: new Date(),
            format: 'PDF'
        }
    };

    // Convert to PDF format (mock implementation)
    const pdfBlob = new Blob([JSON.stringify(content)], { type: 'application/pdf' });
    return pdfBlob;
}