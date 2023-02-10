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
    // adding first rows
    const firstRow = worksheet.addRow(['Radioactive Tracer Summary Sheet']);
    firstRow.alignment = {
      horizontal: 'center',
    };
    firstRow.font = { size: 24 };
    worksheet.mergeCells(`A${worksheet.rowCount}:J${worksheet.rowCount}`);

    const wellInfoRow = worksheet.addRow(['WELL INFORMATION']);
    wellInfoRow.alignment = { horizontal: 'center', vertical: 'middle' };
    wellInfoRow.font = { size: 14, bold: true };
    worksheet.mergeCells(`A${worksheet.rowCount}:I${worksheet.rowCount}`);

    // adding header
    const headerKeys = Object.keys(headerData);

    headerKeys.forEach((key) => {
      const newRow = worksheet.addRow([
        ,
        ,
        `${key.toUpperCase()}:`,
        ,
        ,
        ,
        (headerData as any)[key],
      ]);
      newRow.eachCell((cell) => (cell.font = { bold: true }));
    });

    worksheet.addRow([, , 'LOGGING ENGINEER:'], 'i');
    worksheet.addRow([, , 'WELL CONNECTION:'], 'i');

    worksheet.addRow([]);

    // adding tableHead and data
    const tblHead1 = worksheet.addRow([
      'RUN No.',
      'START',
      ,
      'STOP',
      ,
      'INJECTION',
      ,
      'LOGGING SPEED',
      'SLUG PEAK',
      'REMARKS',
    ]);
    tblHead1.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    tblHead1.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { bold: true };
    });

    worksheet.mergeCells(`B${worksheet.rowCount}:C${worksheet.rowCount}`);
    worksheet.mergeCells(`D${worksheet.rowCount}:E${worksheet.rowCount}`);
    worksheet.mergeCells(`F${worksheet.rowCount}:G${worksheet.rowCount}`);

    worksheet.addRow(
      [, , 'DEPTH', 'TIME', 'DEPTH', 'TIME', 'RATE', 'PSIG'],
      'i'
    );
    worksheet.mergeCells(`A${worksheet.rowCount}:A${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`H${worksheet.rowCount}:H${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`I${worksheet.rowCount}:I${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`J${worksheet.rowCount}:J${worksheet.rowCount - 1}`);

    // creating remarks
    // 1st and last items are pre-base and post-base
    // if item is TD and lasts less than 10 minutes -> stat check
    // if item is TD and lasts more than 15 minutes -> time drive
    // it item is not first, not last, has peak -->  Pass 1
    // if slug peak slug value decreases --> increase Pass number +1
    // if slug peak value increases --> add yellow slug line --> Pass1

    const timeToHours = (time: string): number => {
      const hrMinArr = time.split(':');
      const hrs = parseFloat(hrMinArr[0]);
      const mins = parseFloat(hrMinArr[1]);
      const totalMin = hrs * 60 + mins;
      return totalMin;
    };

    passData.forEach((rowData, index, arr) => {
      let remark = '';
      let newSlug = false;

      const passDuration =
        timeToHours(rowData.timeFinish) - timeToHours(rowData.timeStart);
      console.log('Pass duration: ', passDuration);
      // creating remarks

      if (index === 0) {
        remark = 'PRE-SURVEY BASE LOG';
      } else if (index === arr.length - 1) {
        remark = 'POST-SURVEY BASE LOG';
      } else if (typeof rowData.logSpeed !== 'number') {
        if (passDuration < 15) {
          remark = 'STAT CHECK';
        } else {
          remark = 'TIME DRIVE';
        }
      }

      worksheet.addRow(
        [
          index + 1,
          rowData.depthStart,
          rowData.timeStart,
          rowData.depthFinish,
          rowData.timeFinish,
          '',
          '',
          rowData.logSpeed,
          index === 0 || index === arr.length - 1 ? '' : rowData.maxPeakDepth,
          remark,
        ],
        'i'
      );
    });

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
      link.download = 'filename.xlsx';
      link.click();
    });
  }
}
