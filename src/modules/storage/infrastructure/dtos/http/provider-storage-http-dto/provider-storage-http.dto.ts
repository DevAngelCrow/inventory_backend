import { ProviderStorage } from 'src/modules/storage/domain/entities/provider-storage';

export class ProviderStorageHttpDto {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly description: string,
    public readonly active: boolean,
    public readonly id?: string,
  ) {}
  public static fromEntity(
    providerStorage: ProviderStorage,
  ): ProviderStorageHttpDto {
    return new ProviderStorageHttpDto(
      providerStorage.getName().value(),
      providerStorage.getCode().value(),
      providerStorage.getDescription().value(),
      providerStorage.getActive().value(),
      providerStorage.getId() ? providerStorage.getId()?.value() : undefined,
    );
  }
}
