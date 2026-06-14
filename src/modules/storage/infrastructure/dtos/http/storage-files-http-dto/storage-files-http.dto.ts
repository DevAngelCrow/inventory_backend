import { StorageFileListDto } from '@/modules/storage/application/dtos/storage-file-list.dto';

export class StorageFilesHttpDto {
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

  public static fromDto(dto: StorageFileListDto): StorageFilesHttpDto {
    return new StorageFilesHttpDto(
      dto.id,
      dto.filename,
      dto.mime_type,
      dto.size,
      dto.path,
      dto.active,
      dto.id_provider,
      dto.id_user,
      dto.created_at,
    );
  }
}
