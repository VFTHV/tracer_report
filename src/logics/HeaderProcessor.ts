import { Standards } from './Standards';

export interface HeaderInfo {
  date: string;
  company: string;
  well: string;
  field: string;
  county?: string;
  parish?: string;
  state: string;
  district: string;
}

export class HeaderProcessor {
  static getHeader(data: string[][][]): string[] {
    const onePass = data[0];
    const lastLineIndex = onePass.findIndex(
      (line: string[]) => line[0] === '~A'
    );
    const headerArrays: string[][] = onePass.slice(0, lastLineIndex);
    const headerStrings = headerArrays.map((row: string[]): string => {
      return row.join(' ');
    });

    return headerStrings;
  }

  static getDetail = (header: string[], detailName: string): string => {
    let detail: string = '';
    header.forEach((item: string): void => {
      if (item.startsWith(detailName)) {
        detail = item
          .split(':')[0]
          .split('.')
          .map((x) => x.trim())
          .splice(1, 99)
          .join(' ');
      }
    });
    return detail;
  };

  static headerInfo(data: string[][][], standard?: string): HeaderInfo {
    const header = HeaderProcessor.getHeader(data);

    // const headerInfo: HeaderInfo = {}
    const company: string = HeaderProcessor.getDetail(header, 'COMP');
    const well: string = HeaderProcessor.getDetail(header, 'WELL');
    const field: string = HeaderProcessor.getDetail(header, 'FLD');
    const county: string = HeaderProcessor.getDetail(header, 'CNTY')
      ? HeaderProcessor.getDetail(header, 'CNTY')
      : '';
    const state: string = HeaderProcessor.getDetail(header, 'STAT');
    const district: string = HeaderProcessor.getDetail(header, 'LOC')
      ? HeaderProcessor.getDetail(header, 'LOC')
      : '';

    const [, month, day, , year] = HeaderProcessor.getDetail(header, 'DATE')
      .trim()
      .split(' ');

    let date: string = ``;
    if (month && day && year) {
      date = `${day}-${month}-${year}`;
    }
    let countyOrParish: string = 'county';
    if (standard) {
      countyOrParish = standard === Standards.Texas ? 'county' : 'parish';
    }

    const headerInfo = {
      date,
      company,
      well,
      field,
      state,
      district,
      [countyOrParish]: county,
    };

    return headerInfo;
  }
}
