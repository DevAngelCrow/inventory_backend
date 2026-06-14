import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProviderStorageRepository } from '@/modules/storage/domain/repositories/provider-storage.repository';
import { UpdateProviderStorageCommand } from './update-provider-storage.command';
import { ProviderStorage } from '@/modules/storage/domain/entities/provider-storage';
import { NotFoundException } from '@/shared/domain/exceptions/not-found.exception';
import { ProviderStorageId } from '@/modules/storage/domain/value-objects/provider-storage-value-object/provider-storage-id';
import { ProviderStorageQueriesRepository } from '../../../repositories/provider-storage-read.repository';

@CommandHandler(UpdateProviderStorageCommand)
export class UpdateProviderStorageHandler implements ICommandHandler<UpdateProviderStorageCommand> {
  constructor(
    private readonly repository: ProviderStorageRepository,
    private readonly queriesRepository: ProviderStorageQueriesRepository,
  ) {}

  async execute(command: UpdateProviderStorageCommand): Promise<void> {
    const id = new ProviderStorageId(command.provider_storage_dto.id!);
    const existingProviderStorage = await this.queriesRepository.getOneById(id);

    if (!existingProviderStorage) {
      throw new NotFoundException(
        'Provider storage not found',
        id.value().toString(),
      );
    }

    const providerStorage = ProviderStorage.create({
      ...command.provider_storage_dto,
    });
    await this.repository.update(providerStorage);
  }
}
