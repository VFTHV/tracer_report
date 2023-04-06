import { DataProcessor } from './DataProcessor';

export interface PlotData {
  [x: string]: number;
}

export class LogVisualization extends DataProcessor {
  static toRechartsFormat(
    data: string[][],
    crvName: string,
    depthCrvName: string
  ): PlotData[] {
    const curveArr = LogVisualization.getCurve(data, crvName);
    const depthArr = LogVisualization.getCurve(data, depthCrvName);

    const rechartsData = curveArr.map((dataPoint, i) => {
      return { [depthCrvName]: +depthArr[i], [crvName]: +dataPoint };
    });

    return rechartsData;
  }
}
