import { ProviderStorageDto } from '../../../dtos/provider-storage.dto';

export class CreateProviderStorageCommand {
  constructor(public readonly provider_storage_dto: ProviderStorageDto) {}
}
