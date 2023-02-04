import { DataProcessor } from './DataProcessor';
import { HeaderProcessor } from './HeaderProcessor';
import { PassInfo } from './DataProcessor';
import { HeaderInfo } from './HeaderProcessor';

export class LasFileReader {
  data: string[][][];
  passData: Array<PassInfo>;
  header: HeaderInfo;

  constructor(
    public file: File,
    public fileName: string,
    public totalDepth: number
  ) {}

  async read(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(this.file);

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          this.data = fileReader.result
            .toString()
            .split('~Version Information')
            .filter((string) => string.trim() != '')
            .map((ratPass: string): string[][] => {
              const splittedPass = ratPass.split('\n');
              return splittedPass.map((row: string): string[] =>
                row.trim().split(/\s+/)
              );
            });

          // sort the fullData by TOD:
          this.data = DataProcessor.sortByTOD(this.data);
          this.passData = DataProcessor.extractPassData(
            this.data,
            this.totalDepth
          );
          console.log(1);
          this.header = HeaderProcessor.headerInfo(this.data);
          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
