declare module "adm-zip" {
  class AdmZip {
    constructor(filePath?: string | Buffer);
    getEntries(): Array<{
      entryName: string;
      name: string;
      comment: string;
      isDirectory: boolean;
      header: any;
      getData(): Buffer;
      getCompressedData(): Buffer;
      setData(value: string | Buffer): void;
      getDataAsync(callback: (data: Buffer, err: string) => void): void;
      attr: number;
      extra: Buffer;
    }>;
    getEntry(name: string): any;
    addFile(
      entryName: string,
      content: Buffer,
      comment?: string,
      attr?: number
    ): void;
    addLocalFile(localPath: string, zipPath?: string, zipName?: string): void;
    addLocalFolder(
      localPath: string,
      zipPath?: string,
      filter?: (filename: string) => boolean
    ): void;
    extractAllTo(targetPath: string, overwrite?: boolean): void;
    extractEntryTo(
      entry: string | any,
      targetPath: string,
      maintainEntryPath?: boolean,
      overwrite?: boolean
    ): boolean;
    readAsText(fileName: string, encoding?: string): string;
    readFile(entry: string | any, pass?: string | Buffer): Buffer | null;
    deleteFile(entryName: string): void;
    toBuffer(): Buffer;
    writeZip(targetFileName?: string, callback?: (error: Error) => void): void;
  }
  export = AdmZip;
}

