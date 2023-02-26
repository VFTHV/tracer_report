import ExcelJS from 'exceljs';
import { AllPassData } from './DataProcessor';
import { HeaderInfo } from './HeaderProcessor';
import { Standards } from './Standards';
import { CellStyle } from './CellStyle';

export class ReportGenerator {
  static report(
    passData: AllPassData[],
    headerData: HeaderInfo,
    filename: string,
    standard: string
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1', {
      pageSetup: { fitToPage: true, fitToWidth: 1 },
    });

    ReportGenerator.createHeader(worksheet, headerData);
    ReportGenerator.createTable(worksheet, passData, standard);
    ReportGenerator.toXlsx(worksheet, workbook, filename);
  }

  static toXlsx(
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    fileName: string
  ): void {
    const rowCnt = worksheet.rowCount;
    worksheet.getRow(rowCnt + 10).addPageBreak();

    worksheet.pageSetup.printArea = `A1:J${rowCnt}`;

    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to Blob object
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create link element for downloading the blob object
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileName ? fileName : 'report'}.xlsx`;
      link.click();
    });
  }

  static createTable(
    worksheet: ExcelJS.Worksheet,
    passData: AllPassData[],
    standard: string
  ): void {
    // adding tableHead and data
    const tblHead1 = worksheet.addRow([
      'RUN No.',
      'START',
      '',
      'STOP',
      '',
      'INJECTION',
      '',
      'LOGGING SPEED',
      'SLUG PEAK',
      'REMARKS',
    ]);

    tblHead1.alignment = CellStyle.alignCenter as Partial<ExcelJS.Alignment>;

    tblHead1.eachCell((cell) => {
      cell.border = CellStyle.borderThin as Partial<ExcelJS.Borders>;
      cell.font = { bold: true };
    });

    worksheet.mergeCells(`B${worksheet.rowCount}:C${worksheet.rowCount}`);
    worksheet.mergeCells(`D${worksheet.rowCount}:E${worksheet.rowCount}`);
    worksheet.mergeCells(`F${worksheet.rowCount}:G${worksheet.rowCount}`);
    tblHead1.commit();

    const tblHead2 = worksheet.addRow(
      ['', 'DEPTH', 'TIME', 'DEPTH', 'TIME', 'RATE', 'PSIG'],
      'i'
    );

    worksheet.mergeCells(`A${worksheet.rowCount}:A${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`H${worksheet.rowCount}:H${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`I${worksheet.rowCount}:I${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`J${worksheet.rowCount}:J${worksheet.rowCount - 1}`);
    tblHead2.commit();
    passData.forEach((rowData, index) => {
      if (rowData.remark.newSlug) {
        const ejectSlugRow = worksheet.addRow([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          `EJECTED SLUG #${rowData.remark.slugNo}`,
        ]);
        ejectSlugRow.eachCell((cell) => {
          cell.fill = CellStyle.fillYellow as ExcelJS.Fill;
          cell.border = CellStyle.borderThin as Partial<ExcelJS.Borders>;
          cell.alignment = CellStyle.alignCenter as Partial<ExcelJS.Alignment>;
          cell.font = { bold: true };
        });

        ejectSlugRow.commit();
      }

      if (
        standard === Standards.Louisiana &&
        !rowData.remark.newSlug &&
        rowData.maxPeakDepth
      ) {
        const pumpedRow = worksheet.addRow([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'PUMPED',
        ]);
        pumpedRow.eachCell((cell) => {
          cell.fill = CellStyle.fillYellow as ExcelJS.Fill;
          cell.border = CellStyle.borderThin as Partial<ExcelJS.Borders>;
          cell.alignment = CellStyle.alignCenter as Partial<ExcelJS.Alignment>;
          cell.font = { bold: true };
        });
      }

      const dataRow = worksheet.addRow([
        index + 1,
        rowData.depthStart,
        rowData.timeStart,
        rowData.depthFinish,
        rowData.timeFinish,
        '',
        '',
        rowData.logSpeed,
        rowData.maxPeakDepth,
        rowData.remark.remark,
      ]);
      dataRow.eachCell((cell) => {
        cell.fill = CellStyle.fillWhite as ExcelJS.Fill;
        cell.border = CellStyle.borderThin as Partial<ExcelJS.Borders>;
        cell.alignment = CellStyle.alignCenter as Partial<ExcelJS.Alignment>;
        cell.font = { bold: false };
      });
    });
  }

  static createHeader(
    worksheet: ExcelJS.Worksheet,
    headerData: HeaderInfo
  ): void {
    const columnWidths = [5, 8, 8, 8, 8, 8, 8, 9, 10, 20];

    columnWidths.forEach((colWidth, i) => {
      worksheet.getColumn(i + 1).width = colWidth;
    });
    // adding first rows
    const firstRow = worksheet.addRow(['Radioactive Tracer Summary Sheet']);
    firstRow.alignment = {
      horizontal: 'center',
    };
    firstRow.font = { size: 24 };
    worksheet.mergeCells(`A${worksheet.rowCount}:J${worksheet.rowCount}`);
    firstRow.commit();

    const wellInfoRow = worksheet.addRow(['WELL INFORMATION']);
    wellInfoRow.alignment = { horizontal: 'center', vertical: 'middle' };
    wellInfoRow.font = { size: 14, bold: true };
    worksheet.mergeCells(`A${worksheet.rowCount}:I${worksheet.rowCount}`);
    wellInfoRow.commit();

    // adding header
    const headerKeys = Object.keys(headerData);

    headerKeys.forEach((key) => {
      const newRow = worksheet.addRow([
        '',
        `${key.toUpperCase()}:`,
        '',
        '',
        (headerData as any)[key],
      ]);
      worksheet.mergeCells(`B${worksheet.rowCount}:D${worksheet.rowCount}`);
      worksheet.mergeCells(`E${worksheet.rowCount}:G${worksheet.rowCount}`);
      newRow.eachCell((cell) => (cell.font = { bold: true }));
      newRow.commit();
    });

    worksheet.addRow(['', 'LOGGING ENGINEER:'], 'i').commit();
    worksheet.addRow(['', 'WELL CONNECTION:'], 'i').commit();
    worksheet.addRow([]).commit();
  }
}
