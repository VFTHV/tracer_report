import { TracerProcessor } from './TracerProcessor';
import { TimeToDepthProcessor } from './TimeToDepthProcessor';
import { LasParser } from './LasParser';
import { HeaderProcessor } from './HeaderProcessor';
import { AllPassData } from './TracerProcessor';
import { HeaderInfo } from './HeaderProcessor';

export class LasFileReader {
  // Tracer
  multiPassData: string[][][];
  passDataAndRemarks: AllPassData[];
  header: HeaderInfo;

  // TTD
  singlePassData: string[][];
  converted: {
    data: number[][];
    colHeader: string[];
    header: string;
  } = { data: [], colHeader: [], header: '' };

  constructor(
    public file: File,
    public totalDepth?: number // public fileName?: string
  ) {}

  async readTracer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(this.file);

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          this.multiPassData = LasParser.parseMultiplePasses(fileReader.result);

          this.passDataAndRemarks = TracerProcessor.getAllPassData(
            this.multiPassData,
            this.totalDepth
          );

          this.header = HeaderProcessor.headerInfo(this.multiPassData);
          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }

  async readTimeToDepth(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(this.file);

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          this.singlePassData = LasParser.parseOnePass(fileReader.result);
          const convertedData = TimeToDepthProcessor.timeToDepthData(
            this.singlePassData
          );

          const convertedColHeader = TimeToDepthProcessor.convertColHeader(
            this.singlePassData
          );

          const initalData = fileReader.result.toString();
          const convertedHeader = TimeToDepthProcessor.timeToDepthHeader(
            initalData,
            convertedData
          );
          this.converted = {
            data: convertedData,
            colHeader: convertedColHeader,
            header: convertedHeader,
          };
          console.log(this.converted);

          resolve();

          console.log('resolved');
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
