export class DataProcessor {
  static sortByTOD(data: string[][][]): string[][][] {
    data.sort((passA: string[][], passB: string[][]): number => {
      const nullValue = -999.25;
      let minTodA: number = nullValue;
      let minTodB: number = nullValue;

      const todPassA = DataProcessor.getCurve(passA, 'TOD', nullValue);
      minTodA = parseFloat(todPassA[0]);
      const todPassB = DataProcessor.getCurve(passB, 'TOD', nullValue);
      minTodB = parseFloat(todPassB[0]);

      return minTodA - minTodB;
    });

    return data;
  }

  static getCurve(
    data: string[][],
    crvName: string,
    nullVal?: number
  ): string[] {
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
}
