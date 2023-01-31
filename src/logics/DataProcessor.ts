export interface PassInfo {
  runNo: number;
  depthStart: number;
  depthFinish: number;
  timeStart: string | null;
  timeFinish: string | null;
  logSpeed: number | string;
  maxPeak: number | string;
}

export class DataProcessor {
  static getCurve(data: string[][], crvName: string, nullVal?: number) {
    const crvHeadIndex: number = data.findIndex((arr: string[]) =>
      arr.includes('~A')
    );
    const crvHead: string[] = data[crvHeadIndex];
    const crvIndex: number = crvHead.lastIndexOf(crvName) - 1;
    // filter out curve column into it's array
    const curve: string[] = data
      .map((row: string[], i: number): string | undefined => {
        if (i > crvHeadIndex) {
          return row[crvIndex];
        }
      })
      .filter((value: string | undefined): value is string => Boolean(value));
    if (nullVal) {
      const strippedCurve = curve.filter(
        (value: string): boolean => parseFloat(value) !== nullVal
      );
      return strippedCurve;
    }
    return curve;
  }

  static sortByTOD(data: string[][][]): string[][][] {
    data.sort((ratPassA: string[][], ratPassB: string[][]): number => {
      const nullValue = -999.25;
      let minTodA: number = nullValue;

      let minTodB: number = nullValue;

      const todPassA = DataProcessor.getCurve(ratPassA, 'TOD', nullValue);
      minTodA = parseFloat(todPassA[0]);
      const todPassB = DataProcessor.getCurve(ratPassB, 'TOD', nullValue);
      minTodB = parseFloat(todPassB[0]);

      return minTodA - minTodB;
    });

    return data;
  }

  static extractPassData(
    data: string[][][],
    totalDepth?: number
  ): Array<PassInfo> {
    const nullValue = -999.25;

    return data.map((log: string[][], runIndex: number): PassInfo => {
      const isDepthDriven: boolean = log.some((subarr: string[]) =>
        subarr.includes('DEPT.FT')
      );
      const crvHeadIndex: number = log.findIndex((arr: string[]) =>
        arr.includes('~A')
      );
      const crvHead: string[] = log[crvHeadIndex];

      let depthStart: number = nullValue;
      let depthFinish: number = nullValue;
      let timeStart: string | null = null;
      let timeFinish: string | null = null;
      let logSpeed: number | string = 'TD';
      let maxPeak: number | string = '';

      if (isDepthDriven) {
        // assigning depthStart and depthStop from LAS header
        log.forEach((line: string[]): void => {
          if (line[0] === 'STRT.FT') {
            depthStart = parseInt(line[1].split(':')[0].split('.')[0]);
            if (totalDepth && depthStart >= totalDepth) {
              depthStart = totalDepth - 1;
            }
          } else if (line[0] === 'STOP.FT') {
            depthFinish = parseInt(line[1].split(':')[0].split('.')[0]);
          }
        });

        // assigning logSpeed curve
        let lspdCurve = DataProcessor.getCurve(log, 'LSPD', nullValue);
        // cut off first 10% of curve due to speed up from 0 fpm
        lspdCurve = lspdCurve.splice(Math.floor(lspdCurve.length * 0.1));
        const averageLSPD =
          lspdCurve.reduce((total, num) => total + parseFloat(num), 0) /
          lspdCurve.length;
        logSpeed = Math.abs(Math.floor(averageLSPD));

        // assigning maxPeak
        const depthCurve: string[] = DataProcessor.getCurve(log, 'Depth');
        const det2Curve: number[] = DataProcessor.getCurve(log, 'DET2').map(
          (item: string) => parseFloat(item)
        );
        const det2MaxValueIndex = det2Curve.reduce(
          (maxIndex, currentValue, currentIndex) => {
            return currentValue > det2Curve[maxIndex] ? currentIndex : maxIndex;
          },
          0
        );
        maxPeak = Math.round(parseFloat(depthCurve[det2MaxValueIndex]));
      } else {
        // assigning depthStart and depthStop from ADPTH
        const adpthCurve = DataProcessor.getCurve(log, 'ADPTH', nullValue);
        const averageADPTH =
          adpthCurve.reduce((total, num) => total + parseFloat(num), 0) /
          adpthCurve.length;
        depthStart = depthFinish = Math.abs(Math.round(averageADPTH));
      }

      // assigning timeStart and timeFinish
      const TODcurve: string[] = DataProcessor.getCurve(log, 'TOD', nullValue);

      const [startSec, finishSec] = [
        TODcurve[0],
        TODcurve[TODcurve.length - 1],
      ];

      const secondsToTime = (seconds: string): string => {
        const secondsNum = parseFloat(seconds);
        const hours = Math.floor(secondsNum / 3600);
        const minutes = Math.floor((secondsNum / 3600 - hours) * 60);
        const formattedHrs = hours.toString().padStart(2, '0');
        const formattedMins = minutes.toString().padStart(2, '0');

        return `${formattedHrs}:${formattedMins}`;
      };

      if (startSec && finishSec) {
        timeStart = secondsToTime(startSec);
        timeFinish = secondsToTime(finishSec);
      } else {
        alert('Please make sure all LAS files have TOD curve');
      }

      const runNo = runIndex + 1;

      const passInfo = {
        depthStart,
        depthFinish,
        timeStart,
        timeFinish,
        logSpeed,
        maxPeak,
        runNo,
      };
      return passInfo;
    });
  }
}
