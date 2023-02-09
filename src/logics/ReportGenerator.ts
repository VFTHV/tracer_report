import ExcelJS from 'exceljs';
import { PassInfo } from './DataProcessor';
import { HeaderInfo } from './HeaderProcessor';

export class ReportGenerator {
  static report(passData: PassInfo[], headerData: HeaderInfo): void {
    const toXlsx = [headerData, ...passData];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const columnWidths = [4, 7, 7, 7, 7, 9.89, 9.89, 9.89, 9.89, 27.5];

    columnWidths.forEach((colWidth, i) => {
      worksheet.getColumn(i + 1).width = colWidth;
    });

    worksheet.addRow(['RADIOACTIVE TRACER SUMMARY SHEET']);
    worksheet.mergeCells('A1:J1');
    worksheet.addRow(['WELL INFORMATION']);
    worksheet.mergeCells('A2:I2');

    worksheet.addRow([, , 'DATE:', , , , headerData.date]);
    worksheet.addRow([, , 'COMPANY:', , , , headerData.company]);
    worksheet.addRow([, , 'WELL NAME:', , , , headerData.wellName]);
    worksheet.addRow([, , 'PLANT LOCATION:', , , , headerData.fieldName]);
    worksheet.addRow([, , 'COUNTY:', , , , headerData.countyName]);
    worksheet.addRow([, , 'STATE:', , , , headerData.state]);
    worksheet.addRow([
      ,
      ,
      'EQUIPMENT LOCATION:',
      ,
      ,
      ,
      headerData.location,
      ,
      ,
      ,
      'WELL CONNECTION',
    ]);
    worksheet.addRow([, , 'LOGGING ENGINEER:', , , , '']);

    worksheet.addRow([]);

    worksheet.addRow([
      'RUN',
      'START',
      ,
      'STOP',
      ,
      'INJECTION',
      ,
      'LOGGING',
      'SLUG',
      'REMARKS',
    ]);

    worksheet.mergeCells('B12:C12');
    worksheet.mergeCells('D12:E12');
    worksheet.mergeCells('F12:G12');

    worksheet.addRow([
      'No',
      'DEPTH',
      'TIME',
      'DEPTH',
      'TIME',
      'RATE',
      'PSIG',
      'SPEED',
      'PEAK',
    ]);

    passData.forEach((rowData, index) =>
      worksheet.addRow([
        index + 1,
        rowData.depthStart,
        rowData.timeStart,
        rowData.depthFinish,
        rowData.timeFinish,
        '',
        '',
        rowData.logSpeed,
        rowData.maxPeak,
        '',
      ])
    );

    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to Blob object
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create link element for downloading the blob object
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'filename.xlsx';
      link.click();
    });
  }
}
