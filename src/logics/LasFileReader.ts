import { DataProcessor } from './DataProcessor';
import { HeaderProcessor } from './HeaderProcessor';
import { PassInfo } from './DataProcessor';

export class LasFileReader {
  data: string[][][] = [];
  passData: Array<PassInfo>;
  header: [];

  constructor(
    public file: File,
    public fileName: string,
    public totalDepth: number
  ) {}

  async read(): Promise<void> {
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
        console.log(this.passData);
      }
    };
  }
}
