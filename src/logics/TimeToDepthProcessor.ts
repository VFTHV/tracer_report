export class TimeToDepthProcessor {
  static convertColHeader(data: string[][]): string[] {
    const columnHeader = data.filter((row) => row.includes('~A')).flat();
    const depthIndex = columnHeader.findIndex((h) => h === 'ADPTH') - 1;
    // replacing first column with ADPTH curve

    if (depthIndex < 0) {
      alert('Please make sure LAS file has ADPTH curve');
    }

    columnHeader[1] = 'Depth';

    return columnHeader;
  }
  static timeToDepthData(
    data: string[][],
    minSamples?: number
  ): { averages: number[][]; skipped: number } {
    const columnHeader = data.filter((row) => row.includes('~A')).flat();
    const depthIndex = columnHeader.findIndex((h) => h === 'ADPTH') - 1;
    const lspdIndex = columnHeader.findIndex((h) => h === 'LSPD') - 1;

    // extracting las data
    const columnHeaderIndex = data.findIndex((line) => line.includes('~A'));

    let numbersData = data
      .filter((_, i) => i > columnHeaderIndex)
      .map((row) => row.map((item) => parseFloat(item.toString())));

    if (depthIndex < 0) {
      alert('ADPTH curve not found');
    }

    columnHeader[1] = 'Depth';

    // trim data from non-zero speed, leaving only stations
    // make this optional

    numbersData = numbersData
      .map((row: number[]): number[] => {
        row[0] = row[depthIndex];
        return row;
      })
      .filter((row: number[]): boolean => {
        return row[lspdIndex] === 0;
      });
    console.log({ inputData: numbersData });

    // make average values on same depth
    let sameDepth: number[][] = [];
    let averages: number[][] = [];
    let skipped: number = 0;

    numbersData.forEach((row: number[], index: number): void => {
      if (
        (sameDepth.length === 0 ||
          Math.floor(row[0]) ===
            Math.floor(sameDepth[sameDepth.length - 1][0])) &&
        index + 1 !== data.length
      ) {
        // push same depth items into sameDepth
        sameDepth.push(row);
      } else {
        // create average for one depth
        const averAtSameDepth: number[] = sameDepth[0].map((_, i) => {
          // cut 10% from each side of sameDepth array
          const cutEdgesSameDepth = sameDepth.slice(
            Math.floor(sameDepth.length * 0.1),
            sameDepth.length - Math.floor(sameDepth.length * 0.1)
          );
          const avNum: number =
            cutEdgesSameDepth.reduce((acc, arr) => acc + arr[i], 0) /
            cutEdgesSameDepth.length;
          return Number(avNum.toFixed(4));
        });
        if (sameDepth.length > (minSamples || 0)) {
          averages.push(averAtSameDepth);
        } else {
          skipped++;
        }

        sameDepth = [];
        sameDepth.push(row);
      }
    });
    console.log({ outputData: averages });

    averages = averages.sort((rowA, rowB) => rowA[0] - rowB[0]);
    return { averages, skipped };
  }

  static timeToDepthHeader(
    initialData: string,
    convertedData: number[][]
  ): string {
    const end = initialData.toString().lastIndexOf('~A');
    const lasHeader = initialData.toString().substring(0, end);

    const editedHeader = lasHeader
      .replace(/TIME\.SEC/g, 'DEPT.FT')
      .replace(/SEC/g, 'FT')
      .replace('Elapsed Time', 'Depth')
      .replace(
        /STRT\.FT\s+(-\d+(\.\d+)?):/,
        `STRT.FT           ${convertedData[0][0].toString()}:`
      )
      .replace(
        /STOP\.FT\s+(\d+(\.\d+)?):/,
        `STOP.FT           ${convertedData[
          convertedData.length - 1
        ][0].toString()}:`
      );

    return editedHeader;
  }
}
