export abstract class StorageFileReaderPort {
  abstract readFileAsBase64(filePath: string): Promise<string | null>;
  abstract resolveUrl(filePath: string): string | null;
}
