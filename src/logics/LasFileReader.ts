import { TracerProcessor } from './TracerProcessor';
import { TimeToDepthProcessor } from './TimeToDepthProcessor';
import { LasParser } from './LasParser';
import { HeaderProcessor } from './HeaderProcessor';
import { AllPassData } from './TracerProcessor';
import { HeaderInfo } from './HeaderProcessor';

export class LasFileReader {
  // Tracer
  passDataAndRemarks: AllPassData[];
  header: HeaderInfo;

  // TTD
  converted: {
    data: number[][];
    colHeader: string[];
    header: string;
  } = { data: [], colHeader: [], header: '' };

  constructor(
    public file: File,
    public totalDepth?: number,
    public standard?: string,
    public minSamples?: number
  ) {}

  async readTracer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(this.file);

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          const multiPassData = LasParser.parseMultiplePasses(
            fileReader.result
          );

          this.passDataAndRemarks = TracerProcessor.combineRemarksAndData(
            multiPassData,
            this.totalDepth
          );

          this.header = HeaderProcessor.headerInfo(
            multiPassData,
            this.standard
          );
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
          const singlePassData = LasParser.parseOnePass(fileReader.result);

          const { averages, skipped } = TimeToDepthProcessor.timeToDepthData(
            singlePassData,
            this.minSamples
          );

          const convertedColHeader =
            TimeToDepthProcessor.convertColHeader(singlePassData);

          const initalData = fileReader.result.toString();
          const convertedHeader = TimeToDepthProcessor.timeToDepthHeader(
            initalData,
            averages
          );
          this.converted = {
            data: averages,
            colHeader: convertedColHeader,
            header: convertedHeader,
          };
          alert(
            `Processed ${
              averages.length
            } stations. ${skipped} stations were skipped ${
              !!skipped
                ? `because they contained less than specified ${this.minSamples} Minimum Samples per Station`
                : ''
            } 
            `
          );
          resolve();
        } else {
          alert('File could not be read');
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
