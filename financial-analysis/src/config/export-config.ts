export const exportConfig = {
  pdf: {
    defaultMargins: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    },
    defaultFontSize: 12,
    tableOptions: {
      headerBgColor: '#f0f0f0',
      rowAlternateColors: ['#ffffff', '#f9f9f9'],
      cellPadding: 8
    },
    fonts: {
      default: 'Helvetica',
      header: 'Helvetica-Bold'
    }
  },
  excel: {
    defaultSheetName: 'Sheet1',
    defaultDateFormat: 'yyyy-mm-dd',
    numberFormat: '#,##0.00',
    columnWidth: 15
  }
};
