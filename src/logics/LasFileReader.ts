import { TracerProcessor } from './TracerProcessor';
import { TimeToDepthProcessor } from './TimeToDepthProcessor';
import { LasParser } from './LasParser';
import { HeaderProcessor } from './HeaderProcessor';
import { AllPassData } from './TracerProcessor';
import { HeaderInfo } from './HeaderProcessor';
import { ReportGenerator } from './ReportGenerator';

export class LasFileReader {
  multiPassData: string[][][];
  passDataAndRemarks: AllPassData[];
  header: HeaderInfo;

  singlePassData: string[][];

  constructor(
    public file: File,
    public totalDepth?: number,
    public fileName?: string
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

          const depthConvertedData = TimeToDepthProcessor.timeToDepthData(
            this.singlePassData
          );
          const initalData = fileReader.result.toString();
          const depthConvertedHeader = TimeToDepthProcessor.timeToDepthHeader(
            initalData,
            depthConvertedData
          );

          const convertedColHeader = TimeToDepthProcessor.convertColHeader(
            this.singlePassData
          );

          ReportGenerator.timeToDepthReport(
            depthConvertedData,
            convertedColHeader,
            depthConvertedHeader,
            this.fileName
          );

          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
