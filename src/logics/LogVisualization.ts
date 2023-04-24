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
    if (!curveArr.length) {
      alert('Could not find curve ' + crvName);
      return [];
    } else if (!depthArr.length) {
      alert('Could not find curve ' + depthCrvName);
      return [];
    }

    const rechartsData = curveArr.map((dataPoint, i) => {
      if (+depthArr[i] === -999.25 || +dataPoint === -999.25) return;
      return { [depthCrvName]: +depthArr[i], [crvName]: +dataPoint };
    });

    return rechartsData as PlotData[];
  }
}
