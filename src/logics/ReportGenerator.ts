import { Workbook, Worksheet, Alignment, Borders, Fill } from 'exceljs';
import { AllPassData } from './TracerProcessor';
import { HeaderInfo } from './HeaderProcessor';
import { Standards } from './Standards';
import { CellStyle } from './CellStyle';
import { saveAs } from 'file-saver';

export class ReportGenerator {
  static tracerReport(
    passData: AllPassData[],
    headerData: HeaderInfo,
    filename: string,
    standard: string,
    logo?: string
  ): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('RAT_Summary', {
      pageSetup: { fitToPage: true, fitToWidth: 1 },
    });

    ReportGenerator.createHeader(worksheet, headerData, standard);
    ReportGenerator.createTable(worksheet, passData, standard);
    if (logo) ReportGenerator.addLogo(worksheet, workbook, logo);
    ReportGenerator.toXlsx(worksheet, workbook, filename, headerData);
  }

  static addLogo(worksheet: Worksheet, workbook: Workbook, logo: string): void {
    const imageId = workbook.addImage({
      base64: logo,
      extension: 'jpeg',
    });
    worksheet.addImage(imageId, 'I3:J5');
  }

  static toXlsx(
    worksheet: Worksheet,
    workbook: Workbook,
    fileName: string,
    headerData: HeaderInfo
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
      link.download = fileName
        ? fileName
        : `RAT_Summary_${headerData.well}.xlsx`;
      link.click();
    });
  }

  static createTable(
    worksheet: Worksheet,
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

    tblHead1.alignment = CellStyle.alignCenter as Partial<Alignment>;

    tblHead1.eachCell((cell) => {
      cell.border = CellStyle.borderThin as Partial<Borders>;
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
      if (rowData.newSlug) {
        const ejectSlugRow = worksheet.addRow([
          '',
          'XXX',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          `EJECTED SLUG #${rowData.slugNo}`,
        ]);
        ejectSlugRow.eachCell((cell) => {
          cell.fill = CellStyle.fillYellow as Fill;
          cell.border = CellStyle.borderThin as Partial<Borders>;
          cell.alignment = CellStyle.alignCenter as Partial<Alignment>;
          cell.font = { bold: true };
        });

        ejectSlugRow.commit();
      }

      if (
        standard === Standards.Louisiana &&
        !rowData.newSlug &&
        rowData.maxPeakDepth
      ) {
        const pumpedRow = worksheet.addRow([
          '',
          'X BBL',
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
          cell.border = CellStyle.borderThin as Partial<Borders>;
          cell.alignment = CellStyle.alignCenter as Partial<Alignment>;
          cell.font = { bold: true, color: { argb: 'FF0000' } };
        });
        pumpedRow.commit();
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
        rowData.remark,
      ]);
      dataRow.eachCell((cell) => {
        cell.fill = CellStyle.fillWhite as Fill;
        cell.border = CellStyle.borderThin as Partial<Borders>;
        cell.alignment = CellStyle.alignCenter as Partial<Alignment>;
        cell.font = { bold: false };
      });
      dataRow.commit();
    });
  }

  static createHeader(
    worksheet: Worksheet,
    headerData: HeaderInfo,
    standard: string
  ): void {
    const columnWidths = [5, 8, 8, 8, 8, 8, 7, 9, 12, 16];

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

    headerKeys.forEach((key): void => {
      const newRow = worksheet.addRow([
        ,
        ,
        `${key.toUpperCase()}:`,
        ,
        ,
        (headerData as any)[key],
      ]);

      newRow.eachCell((cell) => (cell.font = { bold: true }));
      newRow.commit();
    });

    worksheet.addRow([, , 'LOGGING ENGINEER:'], 'i').commit();
    worksheet.addRow([, , 'WELL CONNECTION:'], 'i').commit();
    worksheet.addRow([]).commit();
  }

  static timeToDepthReport(
    data: number[][],
    columnHeader: string[],
    lasHeader: string,
    fileName: string | undefined
  ): void {
    // convert averages to string with 4 decimals
    let averagesToString = data.map((row) =>
      row.map((item) => item.toFixed(4))
    );

    // aligning columns
    let maxChars = averagesToString.flat().reduce(function (a, b) {
      return a.length > b.length ? a : b;
    }).length;

    averagesToString = averagesToString.map((row) =>
      row.map((item) => item.padStart(maxChars + 3, ' '))
    );

    // add column headers
    columnHeader = columnHeader.map((item, i) => {
      if (item === '~A') return item;
      if (i === 1) return item.padStart(maxChars + 1, ' ');
      return item.padStart(maxChars + 3, ' ');
    });
    averagesToString.unshift(columnHeader);

    const stringData = averagesToString.map((row) => row.join('')).join('\n');
    const final = lasHeader + stringData;

    saveAs(
      new Blob([final], { type: 'text/plain;charset=utf-8' }),
      `${fileName ? fileName : 'report'}.LAS`
    );
  }
}
