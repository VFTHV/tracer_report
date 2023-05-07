import { DataProcessor } from './DataProcessor';

export interface AllPassData {
  [key: string]: any;
  runNo: number;
  depthStart: number;
  depthFinish: number;
  timeStart: string;
  timeFinish: string;
  logSpeed: number | string;
  maxPeakValue: string | number;
  maxPeakDepth: number | string;
  newSlug: boolean;
  remark: string;
  slugNo: number;
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
  dissipating?: boolean;
  slugPassNo?: number;
}

export class TracerProcessor extends DataProcessor {
  static combineRemarksAndData(
    data: string[][][],
    totalDepth?: number
  ): AllPassData[] {
    const sortedData = TracerProcessor.sortByTOD(data);
    const passData = TracerProcessor.extractPassData(sortedData, totalDepth);

    const remarks = TracerProcessor.createRemarks(passData);

    const combinedData = passData.map((pass, i): AllPassData => {
      if (remarks[i].dissipating)
        pass = { ...pass, maxPeakDepth: 'DISSIPATING' };

      return { ...pass, ...remarks[i] };
    });

    return combinedData;
  }

  static extractPassData(data: string[][][], totalDepth?: number): PassInfo[] {
    const nullValue = -999.25;

    let passesInfo = data.map((log: string[][], runIndex: number): PassInfo => {
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
        let lspdCurve = TracerProcessor.getCurve(log, 'LSPD', nullValue);
        // cut off first 10% of curve due to speed up from 0 fpm
        lspdCurve = lspdCurve.splice(Math.floor(lspdCurve.length * 0.1));
        const averageLSPD =
          lspdCurve.reduce((total, num) => total + parseFloat(num), 0) /
          lspdCurve.length;
        logSpeed = Math.abs(Math.floor(averageLSPD)).toString();

        if (runIndex > 0 && runIndex < data.length - 1) {
          // assigning maxPeak
          const depthCurve: string[] = TracerProcessor.getCurve(log, 'Depth');
          const det2Curve: number[] = TracerProcessor.getCurve(log, 'DET2').map(
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
        const adpthCurve = TracerProcessor.getCurve(log, 'ADPTH', nullValue);
        const averageADPTH =
          adpthCurve.reduce((total, num) => total + parseFloat(num), 0) /
          adpthCurve.length;
        depthStart = depthFinish = Math.abs(Math.round(averageADPTH));
      }

      // assigning timeStart and timeFinish
      const TODcurve: string[] = TracerProcessor.getCurve(
        log,
        'TOD',
        nullValue
      );

      const [startSec, finishSec] = [
        TODcurve[0],
        TODcurve[TODcurve.length - 1],
      ];

      const secondsToTime = (seconds: string): string => {
        const hours = Math.floor(+seconds / 3600);
        const minutes = Math.floor((+seconds % 3600) / 60);
        const formattedHrs = hours.toString().padStart(2, '0');
        const formattedMins = minutes.toString().padStart(2, '0');

        return `${formattedHrs}:${formattedMins}`;
      };

      if (startSec && finishSec) {
        timeStart = secondsToTime(startSec);
        timeFinish = secondsToTime(finishSec);
      } else {
        alert('One of LAS passes does not have TOD curve');
      }

      const runNo = runIndex + 1;

      const passInfo = {
        depthStart,
        timeStart,
        depthFinish,
        timeFinish,
        logSpeed,
        maxPeakDepth,
        maxPeakValue,
        runNo,
      };
      return passInfo;
    });
    return passesInfo;
  }

  static createRemarks(passData: PassInfo[]): RemarkInfo[] {
    // creating remarks
    // 1st and last items are pre-base and post-base
    // if item is TD and lasts less than 10 minutes -> stat check
    // if item is TD and lasts more than 15 minutes -> time drive
    // if item is not first, not last, has peak -->  Pass 1
    // if slug peak slug value decreases --> increase Pass number +1
    // if slug peak value increases --> add yellow slug line --> Pass1
    // finding last pass and adding 'dissipating' boolean to it

    let remarks: RemarkInfo[] = [];
    let newSlug: boolean = false;
    let slugPassNo = 1;
    let slugNo = 1;
    let statCheckNo = 1;
    let timeDriveNo = 1;

    let passesInSlugs: { passes: number; slugNumber: number }[] = [];

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

      let currentRemark: RemarkInfo = { remark: '', newSlug, slugNo };

      if (index === 0) {
        currentRemark.remark = 'PRE-BASE LOG';
        remarks.push(currentRemark);
      } else if (index === arr.length - 1) {
        currentRemark.remark = 'POST-BASE LOG';
        remarks.push(currentRemark);
      } else if (!Number(rowData.logSpeed)) {
        if (passDuration < 15) {
          currentRemark.remark = `STAT CHECK #${statCheckNo}`;
          remarks.push(currentRemark);
          statCheckNo++;
        } else {
          currentRemark.remark = `TIME DRIVE #${timeDriveNo}`;
          remarks.push(currentRemark);
          timeDriveNo++;
        }
      } else if (index !== 0 && index !== arr.length - 1) {
        if (slugPassNo === 1) {
          newSlug = true;
        }
        currentRemark = {
          ...currentRemark,
          remark: `PASS # ${slugPassNo}`,
          slugPassNo,
          newSlug,
        };
        remarks.push(currentRemark);
        // determining number of passes to find last pass as dissipating
        passesInSlugs[slugNo - 1] = {
          slugNumber: slugNo,
          ['passes']: slugPassNo,
        };
        slugPassNo++;
        newSlug = false;

        if (
          +arr[index + 1].maxPeakValue > 2 * +rowData.maxPeakValue &&
          arr[index + 1].maxPeakDepth < rowData.maxPeakDepth
        ) {
          slugPassNo = 1;
          slugNo++;
        }
      }
    });

    remarks = remarks.map((remarkData: RemarkInfo): RemarkInfo => {
      const { remark, newSlug, slugNo, slugPassNo } = remarkData;

      const isLastPass = passesInSlugs.some(
        ({ slugNumber, passes }) =>
          slugNumber === slugNo && passes === slugPassNo
      );

      const trimmedRemark: RemarkInfo = {
        remark,
        newSlug,
        slugNo,
      };

      if (!isLastPass) return trimmedRemark;
      return { ...trimmedRemark, dissipating: true };
    });

    return remarks;
  }
}
