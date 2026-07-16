interface FileUpload {
  originalname: string;
  size: number;
  mimetype: string;
}
export class StorageFilesUploadFlowCommand<T extends FileUpload> {
  constructor(
    public readonly storage_file_content: T,
    public readonly provider_storage_code: string,
    public readonly folder?: string,
  ) {}
}
