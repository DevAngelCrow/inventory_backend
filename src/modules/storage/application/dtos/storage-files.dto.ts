import { StorageFiles } from '../../domain/entities/storage-files';

export class StorageFilesDto<T> {
  constructor(
    public readonly filename: string,
    public readonly id_provider: string,
    public readonly size: number,
    public readonly mime_type: string,
    public readonly active: boolean,
    public readonly content_file: T,
    public readonly path: string,
    public readonly id_user?: string,
    public readonly id?: string,
  ) {}
  public static fromEntity<T>(
    provider_storage: StorageFiles<T>,
  ): StorageFilesDto<T> {
    return new StorageFilesDto(
      provider_storage.getFilename().value(),
      provider_storage.getIdProvider().value(),
      provider_storage.getSize().value(),
      provider_storage.getMimeType().value(),
      provider_storage.getActive().value(),
      provider_storage.getContentFile().value(),
      provider_storage.getPath().value(),
      provider_storage.getIdUser()?.value(),
      provider_storage.getId()?.value(),
    );
  }
}
