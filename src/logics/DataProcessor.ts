export interface AllPassData {
  runNo: number;
  depthStart: number;
  depthFinish: number;
  timeStart: string;
  timeFinish: string;
  logSpeed: number | string;
  maxPeakValue: string | number;
  maxPeakDepth: number | string;
  remark: RemarkInfo;
}
export interface PassInfo {
  runNo: number;
  depthStart: number;
  depthFinish: number;
  timeStart: string;
  timeFinish: string;
  logSpeed: number | string;
  maxPeakValue: string | number;
  maxPeakDepth: number | string;
}

export interface RemarkInfo {
  newSlug: boolean;
  remark: string;
  slugNo: number;
}

export class DataProcessor {
  static getAllPassData(
    data: string[][][],
    totalDepth?: number
  ): AllPassData[] {
    const sortedData = DataProcessor.sortByTOD(data);
    const passData = DataProcessor.extractPassData(sortedData, totalDepth);

    const remarks = DataProcessor.createRemarks(passData);

    const combinedData = passData.map((pass, i): AllPassData => {
      return { ...pass, ['remark']: remarks[i] };
    });
    return combinedData;
  }

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

  static extractPassData(data: string[][][], totalDepth?: number): PassInfo[] {
    const nullValue = -999.25;

    return data.map((log: string[][], runIndex: number): PassInfo => {
      const isDepthDriven: boolean = log.some((subarr: string[]) =>
        subarr.includes('DEPT.FT')
      );

      let depthStart: number = nullValue;
      let depthFinish: number = nullValue;
      let timeStart: string = '';
      let timeFinish: string = '';
      let logSpeed: number | string = 'TD';
      let maxPeakDepth: number | string = '';
      let maxPeakValue: number | string = '';

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

        if (runIndex > 0 && runIndex < data.length - 1) {
          // assigning maxPeak
          const depthCurve: string[] = DataProcessor.getCurve(log, 'Depth');
          const det2Curve: number[] = DataProcessor.getCurve(log, 'DET2').map(
            (item: string) => parseFloat(item)
          );
          const det2MaxValueIndex = det2Curve.reduce(
            (maxIndex, currentValue, currentIndex) => {
              return currentValue > det2Curve[maxIndex]
                ? currentIndex
                : maxIndex;
            },
            0
          );

          maxPeakDepth = Math.round(parseFloat(depthCurve[det2MaxValueIndex]));
          maxPeakValue = Math.round(det2Curve[det2MaxValueIndex]);
        }
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
        maxPeakDepth,
        maxPeakValue,
        runNo,
      };
      return passInfo;
    });
  }

  static createRemarks(passData: PassInfo[]): RemarkInfo[] {
    // creating remarks
    // 1st and last items are pre-base and post-base
    // if item is TD and lasts less than 10 minutes -> stat check
    // if item is TD and lasts more than 15 minutes -> time drive
    // if item is not first, not last, has peak -->  Pass 1
    // if slug peak slug value decreases --> increase Pass number +1
    // if slug peak value increases --> add yellow slug line --> Pass1
    let remarks: RemarkInfo[] = [];
    let newSlug: boolean = false;
    let slugPassNo = 1;
    let slugNo = 1;
    let statCheckNo = 1;
    let timeDriveNo = 1;

    passData.forEach((rowData, index, arr) => {
      const timeToHours = (time: string): number => {
        const hrMinArr = time.split(':');
        const hrs = parseFloat(hrMinArr[0]);
        const mins = parseFloat(hrMinArr[1]);
        const totalMin = hrs * 60 + mins;
        return totalMin;
      };
      const passDuration =
        timeToHours(rowData.timeFinish) - timeToHours(rowData.timeStart);

      // creating remarks

      if (index === 0) {
        remarks.push({
          remark: 'PRE-SURVEY BASE LOG',
          newSlug,
          slugNo,
        });
      } else if (index === arr.length - 1) {
        remarks.push({
          remark: 'POST-SURVEY BASE LOG',
          newSlug,
          slugNo,
        });
      } else if (typeof rowData.logSpeed !== 'number') {
        if (passDuration < 15) {
          remarks.push({
            remark: `STAT CHECK #${statCheckNo}`,
            newSlug,
            slugNo,
          });
          statCheckNo++;
        } else {
          remarks.push({
            remark: `TIME DRIVE ${timeDriveNo}`,
            newSlug,
            slugNo,
          });
          timeDriveNo++;
        }
      } else if (index !== 0 && index !== arr.length - 1) {
        if (slugPassNo === 1) {
          newSlug = true;
        }
        remarks.push({
          remark: `PASS # ${slugPassNo}`,
          newSlug,
          slugNo,
        });
        slugPassNo++;
        newSlug = false;

        if (
          arr[index + 1].maxPeakValue > 2 * (rowData.maxPeakValue as number) &&
          arr[index + 1].maxPeakDepth < rowData.maxPeakDepth
        ) {
          slugPassNo = 1;
          slugNo++;
        }
      }
    });
    return remarks;
  }
}
