import { DataProcessor } from './DataProcessor';
import { LasParser } from './LasParser';
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
          this.data = LasParser.parse(fileReader.result);

          this.passDataAndRemarks = DataProcessor.getAllPassData(
            this.data,
            this.totalDepth
          );

          this.header = HeaderProcessor.headerInfo(this.data);
          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
