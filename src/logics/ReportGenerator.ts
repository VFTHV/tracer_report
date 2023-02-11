import ExcelJS from 'exceljs';
import { PassInfo } from './DataProcessor';
import { HeaderInfo } from './HeaderProcessor';

interface RemarksInfo {
  newSlug: boolean;
  remark: string;
  slugNo: number;
}

export class ReportGenerator {
  static report(
    passData: PassInfo[],
    headerData: HeaderInfo,
    filename: string
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    ReportGenerator.createHeader(worksheet, headerData);
    ReportGenerator.createTable(worksheet, passData);
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
      link.download = `${fileName}.xlsx`;
      link.click();
    });
  }

  static createTable(worksheet: ExcelJS.Worksheet, passData: PassInfo[]): void {
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
      ['', 'DEPTH', 'TIME', 'DEPTH', 'TIME', 'RATE', 'PSIG'],
      'i'
    );
    worksheet.mergeCells(`A${worksheet.rowCount}:A${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`H${worksheet.rowCount}:H${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`I${worksheet.rowCount}:I${worksheet.rowCount - 1}`);
    worksheet.mergeCells(`J${worksheet.rowCount}:J${worksheet.rowCount - 1}`);

    const remarks: RemarksInfo[] = ReportGenerator.createRemarks(passData);
    const yellowRows: number[] = [];

    passData.forEach((rowData, index, arr) => {
      if (remarks[index].newSlug) {
        worksheet.addRow(
          [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            `EJECTED SLUG ${remarks[index].slugNo}`,
          ],
          'i'
        );

        yellowRows.push(worksheet.rowCount);
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
          rowData.maxPeakDepth,
          remarks[index].remark,
        ],
        'i'
      );
    });
    // worksheet.getCell('A10').fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFFFF000' },
    // };
  }

  static createHeader(
    worksheet: ExcelJS.Worksheet,
    headerData: HeaderInfo
  ): void {
    const columnWidths = [5, 7, 7, 7, 7, 9.89, 9.89, 9.89, 9.89, 27.5];

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
        '',
        `${key.toUpperCase()}:`,
        '',
        '',
        (headerData as any)[key],
      ]);
      newRow.eachCell((cell) => (cell.font = { bold: true }));
    });

    worksheet.addRow(['', 'LOGGING ENGINEER:'], 'i');
    worksheet.addRow(['', 'WELL CONNECTION:'], 'i');

    worksheet.addRow([]);
  }

  static createRemarks(passData: PassInfo[]): RemarksInfo[] {
    // creating remarks
    // 1st and last items are pre-base and post-base
    // if item is TD and lasts less than 10 minutes -> stat check
    // if item is TD and lasts more than 15 minutes -> time drive
    // if item is not first, not last, has peak -->  Pass 1
    // if slug peak slug value decreases --> increase Pass number +1
    // if slug peak value increases --> add yellow slug line --> Pass1
    let remarks: RemarksInfo[] = [];
    let newSlug: boolean = false;
    let slugPassNo = 1;
    let slugNo = 1;
    let statCheckNo = 1;
    let timeDriveNo = 1;

    passData.forEach((rowData, index, arr) => {
      const timeToHours = (time: string): number => {
        const hrMinArr = time.split(':');
        const hrs = parseFloat(hrMinArr[0]);
        const mins = parseFloat(hrMinArr[1]);
        const totalMin = hrs * 60 + mins;
        return totalMin;
      };
      const passDuration =
        timeToHours(rowData.timeFinish) - timeToHours(rowData.timeStart);

      // creating remarks

      if (index === 0) {
        remarks.push({
          remark: 'PRE-SURVEY BASE LOG',
          newSlug,
          slugNo,
        });
      } else if (index === arr.length - 1) {
        remarks.push({
          remark: 'POST-SURVEY BASE LOG',
          newSlug,
          slugNo,
        });
      } else if (typeof rowData.logSpeed !== 'number') {
        if (passDuration < 15) {
          remarks.push({
            remark: `STAT CHECK #${statCheckNo}`,
            newSlug,
            slugNo,
          });
          statCheckNo++;
        } else {
          remarks.push({
            remark: `TIME DRIVE ${timeDriveNo}`,
            newSlug,
            slugNo,
          });
          timeDriveNo++;
        }
      } else if (index !== 0 && index !== arr.length - 1) {
        if (slugPassNo === 1) {
          newSlug = true;
        }
        remarks.push({
          remark: `PASS # ${slugPassNo}`,
          newSlug,
          slugNo,
        });
        slugPassNo++;
        newSlug = false;

        if (
          arr[index + 1].maxPeakValue > 2 * (rowData.maxPeakValue as number) &&
          arr[index + 1].maxPeakDepth < rowData.maxPeakDepth
        ) {
          slugPassNo = 1;
          slugNo++;
        }
      }
    });
    return remarks;
  }
}
