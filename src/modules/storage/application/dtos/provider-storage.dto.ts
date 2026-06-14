import { ProviderStorage } from '../../domain/entities/provider-storage';

export class ProviderStorageDto {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
  ) {}
  public static fromEntity(
    provider_storage: ProviderStorage,
  ): ProviderStorageDto {
    return new ProviderStorageDto(
      provider_storage.getName().value(),
      provider_storage.getCode().value(),
      provider_storage.getDescription().value(),
      provider_storage.getActive().value(),
      provider_storage.getId()?.value(),
    );
  }
}
