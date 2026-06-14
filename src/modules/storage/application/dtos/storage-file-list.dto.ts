export class StorageFileListDto {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly mime_type: string,
    public readonly size: number,
    public readonly path: string,
    public readonly active: boolean,
    public readonly id_provider: string,
    public readonly id_user: string | null,
    public readonly created_at: Date | null,
  ) {}
}
