export class LasParser {
  static parse(dataString: string | ArrayBuffer): string[][][] {
    const data = dataString
      .toString()
      .split('~Version Information')
      .filter((string) => string.trim() !== '')
      .map((ratPass: string): string[][] => {
        const splittedPass = ratPass.split('\n');
        return splittedPass.map((row: string): string[] =>
          row.trim().split(/\s+/)
        );
      });
    return data;
  }
}
