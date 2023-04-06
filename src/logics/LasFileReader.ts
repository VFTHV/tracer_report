import { TracerProcessor } from './TracerProcessor';
import { TimeToDepthProcessor } from './TimeToDepthProcessor';
import { LasParser } from './LasParser';
import { HeaderProcessor } from './HeaderProcessor';
import { AllPassData } from './TracerProcessor';
import { HeaderInfo } from './HeaderProcessor';
import { LogVisualization, PlotData } from './LogVisualization';

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

  // Spike
  toPlot: PlotData[];

  constructor(public file: File, public totalDepth?: number) {}

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

          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }

  async readSpike(curve: string, depthCurve: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsText(this.file);

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          const parsed = LasParser.parseOnePass(fileReader.result);
          this.toPlot = LogVisualization.toRechartsFormat(
            parsed,
            curve,
            depthCurve
          );

          resolve();
        } else {
          reject(new Error('File could not be read'));
        }
      };
    });
  }
}
