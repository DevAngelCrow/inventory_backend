import { ProviderStorageActive } from '../value-objects/provider-storage-value-object/provider-storage-active';
import { ProviderStorageCode } from '../value-objects/provider-storage-value-object/provider-storage-code';
import { ProviderStorageDescription } from '../value-objects/provider-storage-value-object/provider-storage-description';
import { ProviderStorageId } from '../value-objects/provider-storage-value-object/provider-storage-id';
import { ProviderStorageName } from '../value-objects/provider-storage-value-object/provider-storage-name';

export class ProviderStorage {
  constructor(
    private readonly name: ProviderStorageName,
    private readonly code: ProviderStorageCode,
    private readonly description: ProviderStorageDescription,
    private readonly active: ProviderStorageActive,
    private readonly id?: ProviderStorageId,
  ) {}
  static create(data: {
    id?: string;
    name: string;
    code: string;
    description: string;
    active: boolean;
  }): ProviderStorage {
    return new ProviderStorage(
      new ProviderStorageName(data.name),
      new ProviderStorageCode(data.code),
      new ProviderStorageDescription(data.description),
      new ProviderStorageActive(data.active),
      data.id ? new ProviderStorageId(data.id) : undefined,
    );
  }
  getId(): ProviderStorageId | undefined {
    return this.id;
  }
  getName(): ProviderStorageName {
    return this.name;
  }
  getCode(): ProviderStorageCode {
    return this.code;
  }
  getDescription(): ProviderStorageDescription {
    return this.description;
  }
  getActive(): ProviderStorageActive {
    return this.active;
  }
}
