export interface TableColumn {
    field: string;
    header: string;
    formatter?: (value: any) => string;
}

export interface TableOptions {
    sortable?: boolean;
    filterable?: boolean;
    pagination?: {
        enabled: boolean;
        pageSize: number;
    };
}

export class TableGenerator {
    static generateTable(data: any[], columns: TableColumn[], options: TableOptions = {}) {
        return {
            data: this.processData(data),
            columns: columns,
            options: {
                sortable: options.sortable ?? true,
                filterable: options.filterable ?? true,
                pagination: options.pagination ?? { enabled: true, pageSize: 10 }
            }
        };
    }

    static processData(data: any[]) {
        return data.map(row => {
            const processedRow = { ...row };
            // Add any data processing logic here
            return processedRow;
        });
    }

    static formatCell(value: any, formatter?: (value: any) => string): string {
        if (formatter) {
            return formatter(value);
        }
        return String(value);
    }
}