import { DataProcessor } from './DataProcessor';
import { HeaderProcessor } from './HeaderProcessor';
import { AllPassData } from './DataProcessor';
import { HeaderInfo } from './HeaderProcessor';

export class LasFileReader {
  data: string[][][];
  passDataAndRemarks: Array<AllPassData>;
  header: HeaderInfo;

  constructor(public file: File, public totalDepth: number) {}

  async read(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(this.file);

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          this.data = fileReader.result
            .toString()
            .split('~Version Information')
            .filter((string) => string.trim() !== '')
            .map((ratPass: string): string[][] => {
              const splittedPass = ratPass.split('\n');
              return splittedPass.map((row: string): string[] =>
                row.trim().split(/\s+/)
              );
            });

          // sort the fullData by TOD:

          this.passDataAndRemarks = DataProcessor.getAllPassData(
            this.data,
            this.totalDepth
          );
          console.log(this.passDataAndRemarks);

          this.header = HeaderProcessor.headerInfo(this.data);
          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
