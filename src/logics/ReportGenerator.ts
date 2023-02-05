import * as XLSX from 'xlsx';
import { PassInfo } from './DataProcessor';

export class ReportGenerator {
  static report(passData: PassInfo[]): void {
    const ws = XLSX.utils.json_to_sheet(passData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, 'spreadsheet.xlsx', { bookType: 'xlsx' });
  }
}
