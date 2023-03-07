export interface HeaderInfo {
  date: string;
  company: string;
  well: string;
  field: string;
  county?: string;
  state: string;
  location?: string;
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
    console.log(headerStrings);
    return headerStrings;
  }

  static getDetail = (header: string[], detailName: string): string => {
    let detail: string = '';
    header.forEach((item: string): void => {
      if (item.startsWith(detailName)) {
        detail = item.split(':')[0].split('.')[1].trim();
      }
    });
    return detail;
  };

  static headerInfo(data: string[][][]): HeaderInfo {
    const header = HeaderProcessor.getHeader(data);

    // const headerInfo: HeaderInfo = {}
    const company: string = HeaderProcessor.getDetail(header, 'COMP');
    const well: string = HeaderProcessor.getDetail(header, 'WELL');
    const field: string = HeaderProcessor.getDetail(header, 'FLD');
    const county: string = HeaderProcessor.getDetail(header, 'CNTY')
      ? HeaderProcessor.getDetail(header, 'CNTY')
      : '';
    const state: string = HeaderProcessor.getDetail(header, 'STAT');
    const location: string = HeaderProcessor.getDetail(header, 'LOC')
      ? HeaderProcessor.getDetail(header, 'LOC')
      : '';

    const [, month, day, , year] = HeaderProcessor.getDetail(header, 'DATE')
      .trim()
      .split(' ');

    let date: string = ``;
    if (month && day && year) {
      date = `${day}-${month}-${year}`;
    }

    const headerInfo = {
      date,
      company,
      well,
      field,
      county,
      state,
      location,
    };
    return headerInfo;
  }
}
